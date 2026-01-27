<template>
  <div class="inline-flex flex-col items-start gap-2" :class="[containerClass || 'w-full']">
    <!-- Label -->
    <label v-if="showLabel && label" class="relative block inline-block text-base font-medium text-gray-900">
      {{ label }}
      <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
    </label>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-5">
        <slot name="radios" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    showLabel?: boolean;
    required?: boolean;
    containerClass?: string;
  }>(),
  {
    showLabel: true,
    required: false,
    containerClass: "",
  }
);
</script>
