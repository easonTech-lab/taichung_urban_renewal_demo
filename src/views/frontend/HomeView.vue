<template>
  <div class="min-h-screen bg-[#7EB68F] text-slate-900">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow"
    >
      跳到主要內容
    </a>
    <main id="main-content">
      <HeroSection />
      <StatsSection />
      <!-- 大圓弧下襬 -->
      <div class="curve-bottom">
        <svg class="w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q600,300 1200,0 L1200,400 L0,400 Z" fill="#f9fafb" />
        </svg>
      </div>
      <FAQSection />
      <DownloadSection />
      <NewsSection />
      <MeetingSection />
      <ServiceSection />
      <section aria-label="台中城市景觀" class="bg-slate-900">
        <div class="w-full">
          <img src="/taichung.png" alt="台中城市景觀" class="h-56 w-full object-cover" />
        </div>
      </section>
    </main>
    <FooterSection />
  </div>
</template>
<script setup lang="ts">
import FooterSection from "@/components/sections/global/FooterSection.vue";
import FAQSection from "@/components/sections/frontend/home/FAQSection.vue";
import NewsSection from "@/components/sections/frontend/home/NewsSection.vue";
import HeroSection from "@/components/sections/frontend/home/HeroSection.vue";
import StatsSection from "@/components/sections/frontend/home/StatsSection.vue";
import MeetingSection from "@/components/sections/frontend/home/MeetingSection.vue";
import ServiceSection from "@/components/sections/frontend/home/ServiceSection.vue";
import DownloadSection from "@/components/sections/frontend/home/DownloadSection.vue";
</script>
<style scoped>
.curve-bottom svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
