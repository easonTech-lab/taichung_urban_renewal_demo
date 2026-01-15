<template>
  <section id="public" class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-primary-900">公開消息</h2>
        <a
          href="/news"
          class="flex items-center gap-1 text-sm font-normal text-gray-800 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="查看更多公開消息"
        >
          <span>更多消息</span>
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414L13.172 12Z" />
          </svg>
        </a>
      </div>

      <!-- News Content -->
      <div class="flex flex-col items-start gap-6 md:flex-row">
        <!-- Left Image -->
        <div class="min-h-[196px] w-full max-w-[260px] shrink-0 overflow-hidden rounded-card">
          <img src="/news.png" alt="公開消息插圖" class="h-full w-full object-cover" />
        </div>

        <!-- Right Items -->
        <div class="grid w-full flex-1 grid-cols-1 gap-6 md:grid-cols-3">
          <NewsItem
            v-for="(news, index) in newsData"
            :key="index"
            :category="news.category"
            :title="news.title"
            :excerpt="news.excerpt"
            :date="news.date"
            :has-border="news.hasBorder"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import NewsItem from "@/components/molecules/NewsItem.vue";

interface NewsItemData {
  category: string;
  title: string;
  excerpt?: string;
  date: string;
  hasBorder?: boolean;
}

const newsData: NewsItemData[] = [
  {
    category: "最新消息",
    title: "本處辦理「114年度老屋新用計畫2.0」潭子區老屋第2次進駐者徵選，入選結果公告。",
    excerpt: "本處老屋新用評選委員會於114年6月25日召開「114年度老屋新用計畫2.0」潭子區老屋第2次進駐者徵選審查會議，會議結果如下：",
    date: "2025/07/03",
    hasBorder: true,
  },
  {
    category: "新聞快訊",
    title: "臺中市率先完成全市老屋大規模重建計劃領先全台",
    excerpt: "臺中市率先完成全市老屋大規模重建計劃領先全台臺中市率先完成全市老屋大規模重建計劃領先全台",
    date: "2025/05/26",
  },
  {
    category: "活動訊息",
    title: "東區分館「台中都市更新大小事」講座",
    excerpt: "東區分館「台中都市更新大小事」講座東區分館「台中都市更新大小事」講座",
    date: "2025/05/26",
  },
];
</script>
