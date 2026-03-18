export interface PublicMessageItem {
  title: string;
  category: string;
  publishDate: string;
  status: boolean;
  tabStatus: "all" | "published" | "draft" | "unpublished";
  isExpanded?: boolean;
}

export interface PublicMessageFormData {
  title: string;
  category: string;
  content: string;
  files: File[];
}
