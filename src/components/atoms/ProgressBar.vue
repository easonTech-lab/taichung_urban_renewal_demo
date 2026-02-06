<template>
  <div class="w-full rounded-full bg-neutral-quaternary" :class="trackClass" role="progressbar" :aria-valuenow="clampedValue" aria-valuemin="0" aria-valuemax="100">
    <div class="h-full rounded-full bg-primary-600 transition-[width] duration-300 ease-out" :style="{ width: `${clampedValue}%` }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: number;
    heightClass?: string;
  }>(),
  {
    heightClass: "h-2",
  }
);

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)));
const trackClass = computed(() => props.heightClass);
</script>
