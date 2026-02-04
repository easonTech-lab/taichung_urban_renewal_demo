export interface FaqItem {
  index: number;
  question: string;
  category: string;
  publishDate: string;
  status: boolean;
  tabStatus: "all" | "published" | "draft" | "unpublished";
}

export interface FaqFormData {
  title: string;
  category: string;
  answer: string;
}
