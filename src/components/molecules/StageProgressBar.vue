<template>
  <div class="rounded-t-lg bg-white">
    <div class="flex flex-wrap items-center gap-4 px-8 py-4">
      <template v-for="(step, index) in steps" :key="step">
        <div class="flex items-center gap-4">
          <p :class="index === activeIndex ? activeTextClass : inactiveTextClass">
            {{ index + 1 }}. {{ step }}
          </p>
          <span v-if="index < steps.length - 1" class="text-2xl font-medium text-primary-600">｜</span>
        </div>
      </template>
    </div>
    <ProgressBar :value="progressValue" height-class="h-1" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProgressBar from "@/components/atoms/ProgressBar.vue";
const props = withDefaults(
  defineProps<{
    steps: string[];
    activeIndex?: number;
    progress?: number;
  }>(),
  {
    activeIndex: 0,
    progress: undefined,
  }
);
const activeTextClass = "text-2xl font-medium text-primary-600";
const inactiveTextClass = "text-2xl font-medium text-neutral-300";
const progressValue = computed(() => {
  if (typeof props.progress === "number") {
    return Math.min(100, Math.max(0, props.progress));
  }
  if (!props.steps.length) return 0;
  return Math.round(((props.activeIndex + 1) / props.steps.length) * 100);
});
</script>
