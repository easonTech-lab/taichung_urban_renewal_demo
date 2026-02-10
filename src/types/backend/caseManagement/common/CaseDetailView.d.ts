import type { StepperStep } from "@/components/atoms/Stepper.vue";

export interface ProgressStage {
  name: string;
  status: "completed" | "current" | "pending";
  statusText: string;
  reviewDate: string;
  reviewTime: string;
  hasDetails: boolean;
  hasSubStages: boolean;
  isExpanded: boolean;
  subStages?: StepperStep[];
}

export type DrawerMode = "officerList" | "editInfo";

export interface ComplaintRow {
  title: string;
  uploadedAt: string;
}

export interface ComplaintSection {
  title: string;
  rows: ComplaintRow[];
}

export interface ProjectFile {
  fileName: string;
  uploadTime: string;
  caseStage: string;
  fileCategory: string;
  uploaderType: "全部" | "申請人" | "幹事" | "承辦";
  fileSize: string;
}

export interface OfficerItem {
  selectedOfficer: string;
}

export interface OfficerTableRow {
  name: string;
  gender: string;
  title: string;
  background: string;
}
