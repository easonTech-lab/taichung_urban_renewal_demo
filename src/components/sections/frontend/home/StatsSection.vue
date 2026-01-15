<template>
  <div class="relative w-full overflow-hidden bg-[#7EB68F]">
    <section class="relative z-10 mx-auto max-w-6xl overflow-visible bg-[#7EB68F] px-4 pb-32 sm:px-6 lg:px-8">
      <div class="rounded-card bg-white p-6 shadow-card">
        <div class="relative grid gap-20 md:grid-cols-2">
          <!-- 都更案件 -->
          <div class="flex items-center justify-between gap-4">
            <StatCard title="都更案件" :count="128" />
            <div class="flex h-auto min-h-[170px] w-auto min-w-[170px] items-center justify-center rounded-lg">
              <img src="/urban%20renewal.png" alt="都更案件圖示" class="object-contain" />
            </div>
          </div>
          <!-- 分隔線 -->
          <div
            class="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 transform bg-gray-300 md:block"
          ></div>
          <!-- 危老案件 -->
          <div class="flex items-center justify-between gap-4">
            <StatCard title="危老案件" :count="103" />
            <div class="flex h-auto min-h-[170px] w-auto min-w-[170px] items-center justify-center rounded-lg">
              <img src="/dangerous%20building.png" alt="危老案件圖示" class="object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- 電子領標專區 -->
      <div class="mt-6 flex items-center justify-between rounded-card bg-white px-6 py-4 shadow-card">
        <div>
          <h2 class="mb-5 text-2xl font-semibold text-gray-900">電子領標專區</h2>
          <p class="mt-1 text-xl text-gray-500">前往查看 最新招標公告、招標結果查詢</p>
        </div>
        <a
          href="/e-services"
          class="inline-flex items-center justify-center rounded-full bg-[#C3DDFD] p-2 text-white shadow-sm hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="前往電子領標專區"
        >
          <Icon name="arrowRight" :size="24" color="#1C64F2" class="h-6 w-6" :aria-label="`前往電子領標專區圖標`" />
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import StatCard from "@/components/molecules/StatCard.vue";
import Icon from "@/components/atoms/Icon.vue";
</script>
