import type { CaseStatisticsItem } from "@/types/backend/homepageMaintenance/caseStatistics.d";

export const caseStatisticsMockData: CaseStatisticsItem[] = [
  { id: "case-statistics-1", index: 1, year: "114", caseCategory: "都更案件", annualCount: 103, cumulativeCount: 455, growthRate: "降低" },
  { id: "case-statistics-2", index: 2, year: "114", caseCategory: "危老案件", annualCount: 55, cumulativeCount: 103, growthRate: "降低" },
  { id: "case-statistics-3", index: 3, year: "113", caseCategory: "都更案件", annualCount: 98, cumulativeCount: 322, growthRate: "成長" },
  { id: "case-statistics-4", index: 4, year: "113", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 55, growthRate: "成長" },
  { id: "case-statistics-5", index: 5, year: "112", caseCategory: "都更案件", annualCount: 75, cumulativeCount: 178, growthRate: "降低" },
  { id: "case-statistics-6", index: 6, year: "112", caseCategory: "都更案件", annualCount: 75, cumulativeCount: 178, growthRate: "持平" },
  { id: "case-statistics-7", index: 7, year: "112", caseCategory: "都更案件", annualCount: 75, cumulativeCount: 178, growthRate: "持平" },
  { id: "case-statistics-8", index: 8, year: "112", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 22, growthRate: "成長" },
  { id: "case-statistics-9", index: 9, year: "112", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 22, growthRate: "持平" },
  { id: "case-statistics-10", index: 10, year: "112", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 22, growthRate: "持平" },
];
