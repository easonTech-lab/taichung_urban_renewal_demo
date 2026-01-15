<template>
  <section id="faq" class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-primary-900">常見問題</h2>
        <router-link
          to="/faq"
          class="flex items-center gap-1 text-sm font-normal text-gray-800 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="查看更多常見問題"
        >
          <span>更多內容</span>
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414L13.172 12Z" />
          </svg>
        </router-link>
      </div>

      <!-- FAQ Columns -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <FAQColumn v-for="(faq, index) in faqData" :key="index" :title="faq.title" :questions="faq.questions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FAQColumn from "@/components/molecules/FAQColumn.vue";

interface FAQItem {
  title: string;
  questions: string[];
}

const faqData: FAQItem[] = [
  {
    title: "我適合哪種重建或改善方式？",
    questions: ["都更、危老、整建維護差在哪？", "哪些房子可以申請政府補助？", "我的社區算老舊街區嗎？"],
  },
  {
    title: "怎麼申請？需要準備什麼？",
    questions: ["需要準備什麼資料、文件？", "從申請到蓋好，大概要多久？", "我可以找誰來幫忙處理流程？"],
  },
  {
    title: "有什麼補助或政府資源？",
    questions: ["危老可以拿到多少容積獎勵？", "整建維護最多補助多少錢？", "政府能幫忙找建商或建築師嗎？"],
  },
];
</script>
