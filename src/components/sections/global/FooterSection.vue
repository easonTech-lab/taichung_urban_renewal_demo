<template>
  <footer class="bg-blue-50 py-[40px]">
    <div class="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-8 px-4 md:items-end md:justify-between md:gap-0 md:px-[60px]">
      <!-- 左側：Logo、聯絡資訊和政策連結 -->
      <div class="flex w-full flex-col items-center gap-4 md:w-auto md:items-start">
        <!-- Logo -->
        <div class="h-9 w-36">
          <img src="/logo.png" alt="臺中市都市發展局" class="h-full w-full object-cover" />
        </div>
        <!-- 聯絡資訊 -->
        <div class="flex flex-col gap-6 font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-800">
          <div>
            <p class="mb-0">地址</p>
            <p>407662臺中市西屯區文心路二段588號</p>
          </div>
          <div>
            <p class="mb-0">電話</p>
            <p>04-2228911</p>
          </div>
          <div>
            <p class="mb-0">辦公時間</p>
            <p>8:30-12:00 , 13:30-17:00</p>
          </div>
        </div>
        <!-- 政策連結 -->
        <div class="flex items-center justify-center gap-2 md:justify-start">
          <RouterLink
            to="/privacy"
            class="font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="查看資訊安全政策"
          >
            資訊安全政策
          </RouterLink>
          <span class="h-3 w-0 border-l border-gray-300" aria-hidden="true"></span>
          <RouterLink
            to="/security"
            class="font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="查看隱私權政策"
          >
            隱私權政策
          </RouterLink>
          <span class="h-3 w-0 border-l border-gray-300" aria-hidden="true"></span>
          <RouterLink
            to="/open-data"
            class="font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="查看政府網站資料開放宣告"
          >
            政府網站資料開放宣告
          </RouterLink>
        </div>
      </div>
      <!-- 右側：標章、統計資訊和版權 -->
      <div class="flex w-full flex-col items-center gap-4 md:w-[288px] md:items-end">
        <!-- 標章 -->
        <div class="flex items-center gap-4">
          <div class="h-8 w-[90px]">
            <img src="/accessibility.png" alt="無障礙標章2.0" class="h-full w-full object-cover" />
          </div>
          <div class="h-8 w-[30px]">
            <img src="/gov.png" alt="政府網站標章" class="h-full w-full object-cover" />
          </div>
        </div>

        <!-- 瀏覽人次和更新日期 -->
        <div class="flex flex-col items-center gap-2 font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-800 md:items-end">
          <p>瀏覽人次:2769422</p>
          <p>更新日期:114年6月27日</p>
        </div>

        <!-- 系統建議 -->
        <div class="text-center font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-500 md:text-right">
          <p class="mb-0">最佳瀏覽環境</p>
          <p>IE(第9版以上)或Chrome FireFox、Edge</p>
        </div>

        <!-- 版權資訊 -->
        <div class="w-full md:w-[261px]">
          <p class="text-center font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-500 md:text-right">
            ©2025 UDBT All Rights Reserved.
          </p>
          <p class="text-center font-sans text-sm font-normal leading-[1.5] tracking-[1.4px] text-gray-500 md:text-right">
            版本號：{{ appVersionLabel }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { appVersionLabel } from "@/config/appInfo";
</script>
