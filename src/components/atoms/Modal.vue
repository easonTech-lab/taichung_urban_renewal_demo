<template>
  <!-- Modal backdrop and container -->
  <Teleport to="body">
    <div
      v-if="modelValue"
      :id="modalId"
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-0 z-[100] flex min-h-screen w-screen items-center justify-center overflow-y-auto overflow-x-hidden p-4"
      :class="backdropClass"
      @click.self="handleBackdropClick"
    >
      <div class="relative max-h-full w-full" :class="sizeClasses">
        <!-- Modal content -->
        <div class="relative rounded-lg border border-gray-200 bg-white shadow-sm">
          <div v-if="showCloseButton" class="flex w-full items-center justify-end px-4 pb-0 pt-4">
            <ButtonCTA variant="none" icon-only left-icon="close" :aria-label="closeButtonAriaLabel" @click="handleCloseClick" />
          </div>
          <!-- Modal header -->
          <div v-if="$slots.header || title" class="flex items-center justify-between px-4">
            <!-- 如果提供了 header slot，完全使用 slot 內容 -->
            <template v-if="$slots.header">
              <slot name="header" />
            </template>
            <!-- 否則使用默認的標題 -->
            <template v-else>
              <h3 v-if="title" class="text-lg font-medium text-gray-900">
                {{ title }}
              </h3>
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
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean; // v-model 支持
    title?: string; // Modal 標題
    showCloseButton?: boolean; // 是否顯示關閉按鈕
    closeButtonAriaLabel?: string; // 關閉按鈕的 aria-label
    closeAction?: "close" | "emit"; // 關閉按鈕行為
    static?: boolean; // 是否為靜態 Modal（點擊 backdrop 不關閉）
    size?: "sm" | "md" | "lg" | "xl" | "2xl"; // Modal 大小
    backdropClass?: string; // 背景樣式
  }>(),
  {
    modelValue: false,
    showCloseButton: true,
    closeButtonAriaLabel: "關閉",
    closeAction: "close",
    static: false,
    size: "lg",
    backdropClass: "bg-black/50",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
  open: [];
  "close-click": [];
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

const handleCloseClick = () => {
  emit("close-click");
  if (props.closeAction === "emit") {
    emit("close");
    return;
  }
  handleClose();
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
