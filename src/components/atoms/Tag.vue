<template>
  <span class="inline-flex items-center justify-center whitespace-nowrap rounded border px-2 py-1 text-center text-sm font-medium leading-[1.5]" :class="tagClasses">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

type TagVariant = "category" | "docx" | "pdf" | "odt" | "xls";

const props = withDefaults(
  defineProps<{
    variant?: TagVariant;
    text?: string;
  }>(),
  {
    variant: "category",
    text: "",
  }
);

const tagClasses = computed(() => {
  const variants: Record<TagVariant, string> = {
    category: "border-primary-500 text-primary-500",
    docx: "border-primary-500 text-primary-500",
    pdf: "border-red-700 text-red-700",
    odt: "border-gray-500 text-gray-500",
    xls: "border-green-500 text-green-500",
  };

  return variants[props.variant];
});
</script>
