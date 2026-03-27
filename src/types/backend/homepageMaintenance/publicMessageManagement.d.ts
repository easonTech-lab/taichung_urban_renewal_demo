export interface PublicMessageItem {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  status: boolean;
  tabStatus: "all" | "published" | "draft" | "unpublished";
  isExpanded?: boolean;
  content?: string;
}

export interface PublicMessageFormData {
  title: string;
  category: string;
  content: string;
  files: File[];
}
