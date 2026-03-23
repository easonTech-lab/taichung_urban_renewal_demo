<template>
  <a
    :href="href"
    class="flex h-[95px] flex-1 items-center rounded-lg bg-white px-8 py-10 shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    :aria-label="`前往${title}服務`"
  >
    <div class="flex flex-1 items-center justify-between">
      <div class="flex items-center gap-5">
        <div class="flex size-[65px] shrink-0 items-center justify-center">
          <Icon :name="iconName" :size="65" class="h-full w-full" :aria-label="`${title}圖標`" />
        </div>
        <p class="text-2xl font-bold text-[#494949]">{{ title }}</p>
      </div>
      <div class="relative size-12 shrink-0">
        <div class="absolute left-0 top-0 size-12 rounded-full bg-blue-200"></div>
        <div class="absolute left-3 top-3 size-6 overflow-hidden">
          <Icon name="webLink" :size="24" color="#1C64F2" class="h-full w-full" aria-hidden="true" />
        </div>
      </div>
    </div>
  </a>
</template>
<script setup lang="ts">
import Icon from "@/components/atoms/Icon.vue";
defineProps<{
  title: string;
  iconName: string;
  href: string;
}>();
</script>
