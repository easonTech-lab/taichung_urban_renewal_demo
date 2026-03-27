import type { FaqItem } from "@/types/backend/homepageMaintenance/faqManagement.d";

export const faqMockData: FaqItem[] = [
  { id: "faq-1", index: 1, question: "都更、危老、整建維護差在哪？", category: "", publishDate: "", status: false, tabStatus: "draft", isExpanded: true, answer: "" },
  { id: "faq-2", index: 2, question: "都更、危老、整建維護差在哪？", category: "我適合哪種重建方式？", publishDate: "114/11/09", status: true, tabStatus: "published", answer: "" },
  { id: "faq-3", index: 3, question: "房子幾歲了才算老？該選哪一種方式？", category: "我適合哪種重建方式？", publishDate: "114/10/30", status: false, tabStatus: "unpublished", answer: "" },
  { id: "faq-4", index: 4, question: "需要準備什麼資料、文件？", category: "要怎麼申請？需要準備什麼？", publishDate: "114/10/30", status: false, tabStatus: "unpublished", answer: "" },
  { id: "faq-5", index: 5, question: "同意比例要多少才可以啟動？", category: "要怎麼申請？需要準備什麼？", publishDate: "114/10/12", status: false, tabStatus: "unpublished", answer: "" },
  { id: "faq-6", index: 6, question: "危老可以拿到多少容積獎勵？", category: "有什麼補助或政府協助？", publishDate: "114/10/12", status: false, tabStatus: "unpublished", answer: "" },
  { id: "faq-7", index: 7, question: "有沒有免費顧問或推動師可協助？", category: "有什麼補助或政府協助？", publishDate: "114/10/12", status: false, tabStatus: "unpublished", answer: "" },
];
