<template>
  <div class="flex w-full flex-col overflow-hidden rounded-bl-lg rounded-br-lg shadow-sm">
    <!-- Header -->
    <div class="flex h-[54px] w-full items-center justify-center rounded-tl-card rounded-tr-card bg-[#3f83f8] px-0 py-3">
      <h3 class="text-center text-xl font-bold leading-normal text-white">
        {{ title }}
      </h3>
    </div>

    <!-- Questions -->
    <div
      v-for="(question, index) in questions"
      :key="index"
      class="flex h-[98px] w-full items-center justify-center bg-white px-0"
      :class="{
        'pb-4 pt-6': index === 0,
        'py-4': index > 0 && index < questions.length - 1,
        'rounded-bl-card rounded-br-card pb-6 pt-4': index === questions.length - 1,
      }"
    >
      <p class="text-center text-xl font-medium leading-normal text-gray-600">
        {{ question }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  questions: string[];
}>();
</script>
