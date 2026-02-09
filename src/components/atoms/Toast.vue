<template>
  <transition name="toast-slide" appear>
    <!-- SnackBar style -->
    <div v-if="modelValue" :id="id" role="status" class="flex h-16 w-full max-w-full items-center justify-between rounded-lg border border-gray-600 bg-gray-700 px-4 shadow-sm">
      <div class="flex items-center gap-4">
        <slot name="icon">
          <svg class="h-6 w-6 text-gray-50" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </slot>

        <p class="text-base font-normal text-gray-50">
          <slot>{{ message }}</slot>
        </p>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="showActions" class="flex items-center gap-4">
          <button type="button" class="h-8 rounded-lg border border-primary-700 px-3 text-xs font-medium text-primary-700" @click="$emit('secondary')">
            {{ secondaryLabel }}
          </button>
          <button type="button" class="h-8 rounded-lg bg-primary-700 px-3 text-xs font-medium text-white" @click="$emit('primary')">
            {{ primaryLabel }}
          </button>
        </div>

        <button v-if="showRestore" type="button" class="text-xs font-medium text-primary-50 hover:underline" @click="$emit('restore')">
          {{ restoreLabel }}
        </button>

        <button
          v-if="showClose"
          type="button"
          class="ml-2 flex h-8 w-8 items-center justify-center rounded bg-transparent text-gray-50 hover:bg-gray-600/40 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-1"
          :aria-label="closeLabel"
          @click="handleClose"
        >
          <span class="sr-only">{{ closeLabel }}</span>
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: boolean;
    message?: string;
    showClose?: boolean;
    closeLabel?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    restoreLabel?: string;
    showActions?: boolean;
    showRestore?: boolean;
    autoClose?: boolean;
    duration?: number;
  }>(),
  {
    id: "toast-default",
    modelValue: true,
    message: "",
    showClose: true,
    closeLabel: "Close",
    primaryLabel: "暫存",
    secondaryLabel: "退出編輯",
    restoreLabel: "復原",
    showActions: false,
    showRestore: false,
    autoClose: false,
    duration: 2000,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
  (e: "primary"): void;
  (e: "secondary"): void;
  (e: "restore"): void;
}>();

const handleClose = () => {
  emit("update:modelValue", false);
  emit("close");
};

let closeTimer: number | null = null;

const clearTimer = () => {
  if (closeTimer !== null) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const startTimer = () => {
  clearTimer();
  if (!props.autoClose) return;
  const durationMs = props.duration ?? 3000;
  if (durationMs <= 0) return;
  closeTimer = window.setTimeout(() => {
    emit("update:modelValue", false);
    emit("close");
  }, durationMs);
};

onMounted(startTimer);

watch(
  () => [props.autoClose, props.duration],
  () => {
    startTimer();
  }
);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      startTimer();
    } else {
      clearTimer();
    }
  }
);

onUnmounted(() => {
  clearTimer();
});
</script>

<style scoped>
:global(.toast-slide-enter-active),
:global(.toast-slide-leave-active) {
  transition: transform 200ms ease, opacity 200ms ease;
}

:global(.toast-slide-enter-from),
:global(.toast-slide-leave-to) {
  transform: translateY(16px);
  opacity: 0;
}

:global(.toast-slide-enter-to),
:global(.toast-slide-leave-from) {
  transform: translateY(0);
  opacity: 1;
}
</style>
