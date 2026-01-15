<template>
  <div class="flex h-[694px] flex-col items-center justify-center gap-4">
    <div class="relative h-[220px] w-[220px] shrink-0">
      <img :src="imageSrc" :alt="altText" class="h-full w-full object-contain" />
    </div>
    <p class="text-sm font-semibold leading-normal text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    imageSrc?: string;
    message?: string;
    altText?: string;
  }>(),
  {
    imageSrc: "/empty.png",
    message: "查無條件相符的關鍵字",
    altText: "查無搜尋結果",
  }
);
</script>
