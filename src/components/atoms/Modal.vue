<template>
  <!-- Modal backdrop and container -->
  <Teleport to="body">
    <div
      v-if="modelValue"
      :id="modalId"
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 md:inset-0 h-[calc(100%-1rem)] max-h-full"
      @click.self="handleBackdropClick"
    >
      <div class="relative w-full max-h-full" :class="sizeClasses">
        <!-- Modal content -->
        <div class="relative rounded-lg border border-gray-200 bg-white shadow-sm">
          <!-- Modal header -->
          <div v-if="$slots.header || title || showCloseButton" class="flex items-center justify-between">
            <!-- 如果提供了 header slot，完全使用 slot 內容 -->
            <template v-if="$slots.header">
              <slot name="header" />
            </template>
            <!-- 否則使用默認的標題和關閉按鈕 -->
            <template v-else>
              <h3 v-if="title" class="text-lg font-medium text-gray-900">
                {{ title }}
              </h3>
              <button
                v-if="showCloseButton"
                type="button"
                class="ms-auto inline-flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                :aria-label="closeButtonAriaLabel"
                @click="handleClose"
              >
                <Icon name="close" :size="20" class="text-current" aria-hidden="true" />
                <span class="sr-only">{{ closeButtonAriaLabel }}</span>
              </button>
            </template>
          </div>

          <!-- Modal body -->
          <div v-if="$slots.default || $slots.body" class="space-y-4 py-4 md:space-y-6 md:py-6">
            <!-- 優先使用 body slot，如果沒有則使用默認 slot -->
            <slot name="body">
              <slot />
            </slot>
          </div>

          <!-- Modal footer -->
          <div v-if="$slots.footer" class="w-full">
            <slot name="footer" />
          </div>
        </div>
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
    title?: string; // Modal 標題
    showCloseButton?: boolean; // 是否顯示關閉按鈕
    closeButtonAriaLabel?: string; // 關閉按鈕的 aria-label
    static?: boolean; // 是否為靜態 Modal（點擊 backdrop 不關閉）
    size?: "sm" | "md" | "lg" | "xl" | "2xl"; // Modal 大小
  }>(),
  {
    modelValue: false,
    showCloseButton: true,
    closeButtonAriaLabel: "關閉",
    static: false,
    size: "lg",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
  open: [];
}>();

const modalId = computed(() => `modal-${Math.random().toString(36).substring(2, 11)}`);

// Modal 大小類別
const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-[416px]",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
  };
  return sizes[props.size] || sizes.lg;
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
      // 打開時禁用 body 滾動
      document.body.style.overflow = "hidden";
      emit("open");
    } else {
      // 關閉時恢復 body 滾動
      document.body.style.overflow = "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  // 確保組件卸載時恢復 body 滾動
  document.body.style.overflow = "";
});
</script>
