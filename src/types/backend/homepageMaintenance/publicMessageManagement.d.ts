export interface PublicMessageItem {
  title: string;
  category: string;
  publishDate: string;
  status: boolean;
  tabStatus: "all" | "published" | "draft" | "unpublished";
}

export interface PublicMessageFormData {
  title: string;
  category: string;
  content: string;
  files: File[];
}
