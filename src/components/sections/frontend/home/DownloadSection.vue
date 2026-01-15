<template>
  <section id="downloads" class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-primary-900">下載專區</h2>
        <a
          href="/downloads"
          class="flex items-center gap-1 text-sm font-normal text-gray-800 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="查看更多下載內容"
        >
          <span>更多消息</span>
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414L13.172 12Z" />
          </svg>
        </a>
      </div>

      <!-- Download Content -->
      <div class="flex flex-col items-start gap-6 md:flex-row">
        <!-- Left Image -->
        <div class="min-h-[196px] w-full max-w-[260px] shrink-0 overflow-hidden rounded-card">
          <img src="/download.png" alt="下載專區插圖" class="h-full w-full object-cover" />
        </div>

        <!-- Right Items -->
        <div class="grid w-full flex-1 grid-cols-1 gap-6 md:grid-cols-3">
          <DownloadItem
            category="都市更新類"
            title="本處辦理「114年度老屋新用計畫2.0」潭子區老屋第2次進駐者徵選，入選結果公告"
            date="2025/07/03"
          />
          <DownloadItem category="危老類" title="114年度臺北市補助老屋增設電梯申請專區" date="2025/07/03" />
          <DownloadItem
            category="老舊街區"
            title="修訂「『擬(修)訂台中市西屯區永福路附近地區細部計畫案』所定原屬工業區變更特定專用區部分因實施都市更新應提供適當公益設施通案審議原則」"
            date="2025/07/03"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DownloadItem from "@/components/molecules/DownloadItem.vue";
</script>
