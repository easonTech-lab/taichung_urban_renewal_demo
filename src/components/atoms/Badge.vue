<template>
  <span
    class="inline-flex items-center justify-center rounded-md px-3 py-0.5 text-sm font-medium leading-normal text-center"
    :class="badgeClasses"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BadgeVariant = "primary" | "success" | "danger" | "warning" | "info" | "gray";

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant;
    text?: string;
  }>(),
  {
    variant: "primary",
  }
);

const badgeClasses = computed(() => {
  const variants: Record<BadgeVariant, string> = {
    primary: "bg-primary-100 text-primary-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return variants[props.variant];
});
</script>
