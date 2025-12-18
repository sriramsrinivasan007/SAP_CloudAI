import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ChatMessage, GroundingSource } from "../types";

/**
 * Lazy initialization of the Gemini API client to prevent top-level ReferenceErrors 
 * and ensure it uses the most current environment variables.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a professional logo for LegalLens.AI.
 */
export const generateLogo = async (): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A professional, minimalist logo for a legal tech company named LegalLens.AI. The logo should incorporate elements of a stylized magnifying glass lens, digital circuit patterns, and a subtle scale of justice. Modern, high-tech aesthetic, white and indigo blue colors, vector style, flat design.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Logo generation failed", e);
  }
  return null;
};

/**
 * Uses gemini-3-flash-preview with Search Grounding.
 * Added try-catch with fallback to ensure the main analysis isn't blocked by search issues.
 */
export const fetchMarketContext = async (companyName: string): Promise<{ text: string, sources: GroundingSource[] }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very short, highly informative bulleted summary (max 3-4 bullets) of ${companyName}'s current market position, core enterprise offerings, and one major recent contract. Be extremely concise.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '',
      }))
      .filter((s: any) => s.uri) || [];

    return {
      text: response.text || `Market overview for ${companyName}.`,
      sources: sources.slice(0, 5),
    };
  } catch (e) {
    console.warn("Market context search failed or restricted, using fallback context.", e);
    return {
      text: `Directly analyzing ${companyName}'s solutions against the provided document.`,
      sources: []
    };
  }
};

/**
 * Uses gemini-2.5-flash-lite-latest for fast, low-latency follow-up questions.
 */
export const quickAssistant = async (history: ChatMessage[], query: string): Promise<string> => {
  const ai = getAI();
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: query }] });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: contents as any,
    config: {
      systemInstruction: "You are a fast legal and tender assistant. Provide concise, helpful answers about the analysis results.",
    }
  });

  return response.text || "I'm sorry, I couldn't process that.";
};

/**
 * Uses gemini-3-pro-preview for deep document analysis.
 */
export const analyzeDocument = async (
  file: File, 
  companyName: string,
  marketContext: string
): Promise<AnalysisResult> => {
  const ai = getAI();
  const base64Data = await fileToGenerativePart(file);

  const prompt = `
    You are a world-class Strategy Consultant and Pre-Sales Architect.
    
    COMPANY CONTEXT:
    ${marketContext}

    TASK:
    1. Research/Identify: Confirm the primary products/services of "${companyName}".
    2. Analyze: Compare these solutions against the attached Legal/Tender document.
    3. Deadline Extraction: Locate the "Bid Close Date", "Submission Deadline", or "Closing Date". 
       - If it refers to another document (e.g., "As per GeM Bid Document"), return that exact phrase.
       - If not found or mentioned, return EXACTLY the string "empty".
    4. Eligibility Extraction: Search the document for EMD/Pre-bid amounts and Financial requirements.
    5. Priority Roadmap: Generate 3-5 "Priority Focus Points" for "${companyName}".
    6. Evaluate Feasibility (0-100%), Alignment (0-100%), Stakes, Effort, and Gaps.

    RETURN ONLY VALID JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'application/pdf', data: base64Data } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          identifiedSolutions: { type: Type.ARRAY, items: { type: Type.STRING } },
          bidEndDate: { type: Type.STRING, description: "Extracted deadline. Use 'empty' if not found." },
          eligibility: {
            type: Type.OBJECT,
            properties: {
              preBidAmount: { type: Type.STRING },
              financialRequirements: { type: Type.STRING }
            }
          },
          feasibilityScore: { type: Type.NUMBER },
          alignmentScore: { type: Type.NUMBER },
          feasibilityReasoning: { type: Type.STRING },
          stakes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["title", "description", "severity"]
            }
          },
          priorityFocusPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                urgency: { type: Type.STRING, enum: ["Critical", "High", "Standard"] }
              },
              required: ["title", "description", "urgency"]
            }
          },
          inScope: { type: Type.ARRAY, items: { type: Type.STRING } },
          outOfScope: {
            type: Type.ARRAY,
            items: { 
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                remediation: { type: Type.STRING }
              },
              required: ["point", "remediation"]
            }
          },
          effortEstimation: {
            type: Type.OBJECT,
            properties: {
              employees: { type: Type.NUMBER },
              durationMonths: { type: Type.NUMBER },
              description: { type: Type.STRING }
            },
            required: ["employees", "durationMonths", "description"]
          }
        },
        required: ["companyName", "identifiedSolutions", "feasibilityScore", "alignmentScore", "feasibilityReasoning", "stakes", "priorityFocusPoints", "inScope", "outOfScope", "effortEstimation"]
      }
    }
  });

  if (!response.text) throw new Error("The model returned an empty response. The document might be too complex or blocked by safety filters.");
  return JSON.parse(response.text) as AnalysisResult;
};