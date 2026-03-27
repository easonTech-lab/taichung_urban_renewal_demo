export interface CaseStatisticsItem {
  id: string;
  index: number;
  year: string;
  caseCategory: string;
  annualCount: number;
  cumulativeCount: number;
  growthRate: "成長" | "降低" | "持平";
}

export interface CaseStatisticsFormData {
  category: string;
  year: string;
  annualCount: string;
}
