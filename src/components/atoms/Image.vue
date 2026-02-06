<template>
  <img
    :src="src"
    :alt="alt"
    :class="imageClass"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchPriority"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    class?: string;
    loading?: "eager" | "lazy";
    decoding?: "async" | "sync" | "auto";
    fetchPriority?: "high" | "low" | "auto";
  }>(),
  {
    alt: "",
    class: "",
    loading: "lazy",
    decoding: "async",
    fetchPriority: "auto",
  }
);

const imageClass = computed(() => {
  return props.class ? props.class : "h-auto max-w-full";
});
</script>
