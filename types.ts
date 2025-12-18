export interface EffortEstimation {
  employees: number;
  durationMonths: number;
  description: string;
}

export interface OutOfScopeDetail {
  point: string;
  remediation: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface PriorityFocusPoint {
  title: string;
  description: string;
  urgency: 'Critical' | 'High' | 'Standard';
}

export interface EligibilityCriteria {
  totalCost?: string;
  preBidAmount?: string;
  requiredTeamSize?: string;
  financialRequirements?: string;
}

export interface AnalysisResult {
  companyName: string;
  identifiedSolutions: string[];
  bidEndDate?: string;
  eligibility?: EligibilityCriteria;
  feasibilityScore: number;
  alignmentScore: number;
  feasibilityReasoning: string;
  stakes: Array<{
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }>;
  priorityFocusPoints: PriorityFocusPoint[];
  inScope: string[];
  outOfScope: OutOfScopeDetail[];
  effortEstimation: EffortEstimation;
  marketContext?: string;
  groundingSources?: GroundingSource[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppState {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR
}

export interface SolutionOption {
  id: string;
  name: string;
  description: string;
}

export const SOLUTIONS: SolutionOption[] = [
  { 
    id: 'cloud-infra', 
    name: 'Enterprise Cloud Infrastructure', 
    description: 'Scalable cloud hosting, VPC management, and automated scaling solutions.' 
  },
  { 
    id: 'cybersec', 
    name: 'Advanced Cybersecurity Suite', 
    description: 'Endpoint protection, SOC-as-a-service, and zero-trust architecture implementation.' 
  },
  { 
    id: 'data-ai', 
    name: 'AI & Data Intelligence', 
    description: 'Machine learning pipelines, predictive analytics, and enterprise LLM integration.' 
  },
  { 
    id: 'it-managed', 
    name: 'Managed IT Operations', 
    description: '24/7 technical support, infrastructure maintenance, and compliance monitoring.' 
  }
];
