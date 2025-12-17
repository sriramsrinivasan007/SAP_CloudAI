export interface SolutionOption {
  id: string;
  name: string;
  description: string;
}

export interface AnalysisResult {
  feasibilityScore: number;
  feasibilityReasoning: string;
  stakes: Array<{
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }>;
  inScope: string[];
  outOfScope: string[];
}

export enum AppState {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR
}

export const SOLUTIONS: SolutionOption[] = [
  {
    id: 'contract-lifecycle',
    name: 'ContractGuardian AI (CLM)',
    description: 'Automated contract extraction, renewal tracking, risk analysis, and obligation management.'
  },
  {
    id: 'privacy-compliance',
    name: 'PrivacyShield Pro (Data Privacy)',
    description: 'GDPR/CCPA compliance, PII detection, data processing agreement (DPA) validation, and consent mapping.'
  },
  {
    id: 'hr-legal',
    name: 'WorkForce Legal (HR & Employment)',
    description: 'Employment contract review, non-compete enforcement, employee handbook compliance, and labor law alignment.'
  },
  {
    id: 'vendor-procurement',
    name: 'ProcureFlow (Vendor Management)',
    description: 'Supplier agreement standardization, SLA monitoring, procurement policy enforcement, and vendor risk assessment.'
  }
];