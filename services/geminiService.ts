import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SolutionOption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
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

export const analyzeDocument = async (
  file: File, 
  solution: SolutionOption
): Promise<AnalysisResult> => {
  
  const base64Data = await fileToGenerativePart(file);

  const prompt = `
    You are a Senior Legal Solutions Architect. 
    Analyze the attached PDF legal document specifically in the context of our company's solution: "${solution.name}".
    
    Solution Description: "${solution.description}"

    Your task is to determine how well this solution fits the needs or requirements found in the document.
    
    1. **Feasibility**: Give a score (0-100) on how effectively our solution can handle the legal requirements or clauses found in this doc.
    2. **Stakes**: Identify the major legal or business stakes (risks, obligations, opportunities) present in the document.
    3. **Scope**: clearly list what parts of the document are "In Scope" (covered by our solution's capabilities) and "Out of Scope" (requires manual intervention or other tools).

    Return ONLY valid JSON matching the specified schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for complex legal reasoning
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feasibilityScore: { type: Type.NUMBER, description: "0 to 100 integer score" },
            feasibilityReasoning: { type: Type.STRING, description: "A concise summary explaining the score" },
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
            inScope: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of points covered by the solution"
            },
            outOfScope: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of points NOT covered by the solution"
            }
          },
          required: ["feasibilityScore", "feasibilityReasoning", "stakes", "inScope", "outOfScope"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};