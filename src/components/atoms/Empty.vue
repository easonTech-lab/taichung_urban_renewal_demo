<template>
  <div :class="containerClass">
    <div class="relative h-[220px] w-[220px] shrink-0">
      <img :src="imageSrc" :alt="altText" class="h-full w-full object-contain" />
    </div>
    <p class="text-center text-sm font-semibold leading-[1.5] text-gray-500">{{ message }}</p>
    <ButtonCTA v-if="shouldShowButton" variant="outline" size="sm" left-icon="plus" type="button" @click="handleButtonClick">
      {{ buttonText }}
    </ButtonCTA>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

export type EmptyType = "search" | "case" | "case-management";

const props = withDefaults(
  defineProps<{
    type?: EmptyType;
    imageSrc?: string;
    message?: string;
    altText?: string;
    showButton?: boolean;
    buttonText?: string;
  }>(),
  {
    type: "search",
    imageSrc: undefined,
    message: undefined,
    altText: undefined,
    showButton: undefined,
    buttonText: undefined,
  }
);

const emit = defineEmits<{
  "button-click": [];
}>();

const baseUrl = import.meta.env.BASE_URL || "/";

const resolveAssetPath = (path: string) => {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) {
    return path;
  }
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
};

// 根據 type 自動決定是否顯示按鈕
const shouldShowButton = computed(() => {
  if (props.showButton !== undefined) {
    return props.showButton;
  }
  return props.type === "case-management";
});

// 根據 type 自動生成圖片路徑和預設訊息
const imageSrc = computed(() => {
  if (props.imageSrc) {
    return resolveAssetPath(props.imageSrc);
  }
  if (props.type === "case-management") {
    return resolveAssetPath("/empty-case.png");
  }
  return resolveAssetPath(`/empty-${props.type}.png`);
});

const message = computed(() => {
  if (props.message) {
    return props.message;
  }
  if (props.type === "search") {
    return "查無條件相符的關鍵字";
  }
  if (props.type === "case-management") {
    return "尚無案件";
  }
  return "查無相關案件";
});

const altText = computed(() => {
  if (props.altText) {
    return props.altText;
  }
  if (props.type === "search") {
    return "查無搜尋結果";
  }
  if (props.type === "case-management") {
    return "尚無案件";
  }
  return "查無案件";
});

const buttonText = computed(() => {
  if (props.buttonText) {
    return props.buttonText;
  }
  return "新增案件";
});

// 根據 type 決定容器樣式
const containerClass = computed(() => {
  if (props.type === "case-management") {
    return "flex flex-col items-center justify-center gap-4 px-4 py-16";
  }
  if (props.type === "search") {
    return "flex flex-col items-center justify-center gap-4";
  }
  return "flex h-[694px] flex-col items-center justify-center gap-4";
});

const handleButtonClick = () => {
  emit("button-click");
};
</script>
