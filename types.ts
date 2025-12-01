export interface SACFormData {
  // I. Volume
  channelPreference: string;
  channelFuture: string;
  splitInvestorsVsEducation: number;
  top5Problems: string[]; // Changed from string to string array
  timeSimple: string;
  timeComplex: string;
  peakPeriods: string;
  
  // II. Quality
  frustrationPoint: string;
  strategicBlockers: string;
  missingHistory: string;
  interruptionFrequency: string;
  repetitionPercentage: number;
  
  // III. Tech
  recordingMethod: string;
  documentationUsage: string;
  desiredMetric: string;
}

export interface AnalysisResult {
  summary: string;
  bottlenecks: string[];
  automationOpportunities: string[];
  strategicPlan: string;
}