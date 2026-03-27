export interface FaqItem {
  id: string;
  index: number;
  question: string;
  category: string;
  publishDate: string;
  status: boolean;
  tabStatus: "all" | "published" | "draft" | "unpublished";
  isExpanded?: boolean;
  answer?: string;
}

export interface FaqFormData {
  title: string;
  category: string;
  answer: string;
}
