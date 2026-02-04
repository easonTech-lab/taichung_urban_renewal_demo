export interface CaseItem {
  caseNumber: string;
  caseName: string;
  caseCategory: string;
  caseStage: string;
  caseStatus: "進行中" | "已中斷" | "已完成";
}
