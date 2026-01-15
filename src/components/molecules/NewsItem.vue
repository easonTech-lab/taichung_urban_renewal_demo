<template>
  <div class="flex flex-col gap-1">
    <p class="text-[15px] font-medium text-primary-500">
      {{ category }}
    </p>
    <div v-if="hasBorder" class="flex h-[82px] items-start overflow-hidden border-b border-gray-300 px-0 py-3">
      <p class="line-clamp-2 overflow-ellipsis text-xl font-medium text-gray-800">
        {{ title }}
      </p>
    </div>
    <div v-else class="flex items-start overflow-hidden px-0 py-3">
      <p class="line-clamp-2 overflow-ellipsis text-xl font-medium text-gray-800">
        {{ title }}
      </p>
    </div>
    <p v-if="excerpt" class="line-clamp-4 overflow-ellipsis text-[15px] font-normal text-gray-500">
      {{ excerpt }}
    </p>
    <p class="mt-auto truncate text-[13px] font-normal text-gray-400">
      {{ date }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  category: string;
  title: string;
  excerpt?: string;
  date: string;
  hasBorder?: boolean;
}>();
</script>
