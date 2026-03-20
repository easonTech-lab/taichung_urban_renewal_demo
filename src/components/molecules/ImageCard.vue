<template>
  <div class="flex w-[315px] flex-col gap-2 rounded-lg border border-gray-300 bg-white p-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold leading-[1.3] text-blue-700">
          {{ index }}
        </div>
      </div>
      <button type="button" class="text-gray-600 hover:text-gray-900" @click="handleDelete">
        <Icon name="trashCan" :size="24" />
      </button>
    </div>
    <div class="relative w-full overflow-hidden rounded-lg bg-gray-200" :style="{ aspectRatio }">
      <Image :src="src" :alt="alt" class="h-full w-full rounded-lg object-cover" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/atoms/Icon.vue";
import Image from "@/components/atoms/Image.vue";

const props = withDefaults(
  defineProps<{
    index: number | string;
    src: string;
    alt?: string;
    aspectRatio?: string;
  }>(),
  {
    alt: "",
    aspectRatio: "301 / 180",
  }
);

const emit = defineEmits<{
  delete: [];
}>();

const handleDelete = () => {
  emit("delete");
}
</script>
