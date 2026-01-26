<template>
  <div class="inline-flex flex-col items-start gap-2" :class="[containerClass || 'w-full']">
    <!-- Label -->
    <label v-if="showLabel && label" class="block text-base font-medium text-gray-900 relative inline-block">
      {{ label }}
      <span v-if="required" class="text-red-500 text-xs leading-none absolute -top-1 -right-2">*</span>
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
