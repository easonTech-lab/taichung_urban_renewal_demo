<template>
  <div class="flex h-[213px] flex-col gap-1">
    <p class="text-[15px] font-medium text-primary-500">
      {{ category }}
    </p>
    <div class="flex h-[168px] flex-1 items-start overflow-hidden px-0 py-3">
      <p class="line-clamp-4 overflow-ellipsis text-xl font-medium text-gray-800">
        {{ title }}
      </p>
    </div>
    <p class="truncate text-[13px] font-normal text-gray-400">
      {{ date }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  category: string;
  title: string;
  date: string;
}>();
</script>
