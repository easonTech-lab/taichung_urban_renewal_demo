<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[80] bg-gray-600 transition-opacity"
      :class="modelValue ? 'opacity-80' : 'opacity-0'"
      @click="handleBackdropClick"
    ></div>

    <!-- Drawer -->
    <div
      :id="drawerId"
      class="fixed top-0 right-0 z-[81] h-screen flex flex-col bg-white transition-transform duration-300 ease-in-out"
      :class="[widthClasses, modelValue ? 'translate-x-0' : 'translate-x-full']"
      tabindex="-1"
      :aria-labelledby="drawerId + '-label'"
    >
      <!-- Header -->
      <div v-if="$slots.header || title || showCloseButton" class="border-b border-gray-300 flex items-center justify-between px-6 py-4">
        <template v-if="$slots.header">
          <slot name="header" />
        </template>
        <template v-else>
          <h2 v-if="title" :id="drawerId + '-label'" class="text-xl font-normal leading-[1.5] text-gray-800">
            {{ title }}
          </h2>
          <button
            v-if="showCloseButton"
            type="button"
            class="text-gray-500 bg-transparent hover:text-gray-700 rounded-lg w-4 h-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
            :aria-label="closeButtonAriaLabel"
            @click="handleClose"
          >
            <Icon :name="closeIcon" :size="16" class="text-current" aria-hidden="true" />
            <span class="sr-only">{{ closeButtonAriaLabel }}</span>
          </button>
        </template>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-6 py-6">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="border-t border-[#d9d9d9] bg-white flex items-end justify-end px-6 py-3">
        <slot name="footer" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from "vue";
import Icon from "@/components/atoms/Icon.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean; // v-model 支持
    title?: string; // Drawer 標題
    logo?: string; // Logo 圖片路徑
    logoAlt?: string; // Logo alt 文字
    showCloseButton?: boolean; // 是否顯示關閉按鈕
    closeButtonAriaLabel?: string; // 關閉按鈕的 aria-label
    closeIcon?: string; // 關閉按鈕的圖標名稱
    static?: boolean; // 是否為靜態 Drawer（點擊 backdrop 不關閉）
    width?: "sm" | "md" | "lg" | "xl"; // Drawer 寬度
  }>(),
  {
    modelValue: false,
    showCloseButton: true,
    closeButtonAriaLabel: "關閉選單",
    closeIcon: "close",
    static: false,
    logoAlt: "Logo",
    width: "md",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
  open: [];
}>();

const drawerId = computed(() => `drawer-${Math.random().toString(36).substring(2, 11)}`);

// Drawer 寬度類別
const widthClasses = computed(() => {
  const widths: Record<string, string> = {
    sm: "w-64", // 256px
    md: "w-80", // 320px
    lg: "w-96", // 384px
    xl: "w-[460px]", // 460px
  };
  return widths[props.width] || widths.md;
});

// 處理關閉
const handleClose = () => {
  emit("update:modelValue", false);
  emit("close");
};

// 處理 backdrop 點擊
const handleBackdropClick = () => {
  if (!props.static) {
    handleClose();
  }
};

// 處理 ESC 鍵
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.modelValue && !props.static) {
    handleClose();
  }
};

// 監聽 modelValue 變化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      emit("open");
      // 防止 body 滾動
      document.body.style.overflow = "hidden";
    } else {
      // 恢復 body 滾動
      document.body.style.overflow = "";
    }
  },
  { immediate: true }
);

// 監聽 ESC 鍵
onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  // 確保清理 body overflow
  document.body.style.overflow = "";
});
</script>
