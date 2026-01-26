<template>
  <div class="flex flex-col gap-10">
    <p class="leading-none text-nowrap text-left text-2xl font-bold text-[#494949]">
      {{ title }}
    </p>
    <div class="flex flex-col items-center gap-5 px-3.5">
      <p class="text-nowrap text-center text-xl font-normal text-gray-500">已累計件數</p>
      <strong class="text-6xl text-[#494949]">
        {{ count }}
      </strong>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  count: number;
}>();
</script>
