<template>
  <!-- Figma: SnackBar style (height ~64px, dark bg, left icon + message, right actions + close) -->
  <div :id="id" role="status" class="flex h-16 w-full max-w-full items-center justify-between rounded-lg border border-gray-600 bg-gray-700 px-4 shadow-sm">
    <div class="flex items-center gap-4">
      <slot name="icon">
        <!-- default exclamation icon (keeps existing look but sized to figma) -->
        <svg class="h-6 w-6 text-gray-50" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </slot>

      <div class="text-sm text-gray-50">
        <slot>{{ message }}</slot>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <!-- action buttons: secondary (outline) and primary (filled) -->
      <div v-if="showActions" class="flex items-center gap-3">
        <button type="button" class="h-8 rounded-lg border border-primary-700 px-3 text-xs font-medium text-primary-700" @click="$emit('secondary')">
          {{ secondaryLabel }}
        </button>

        <button type="button" class="h-8 rounded-lg bg-primary-700 px-3 text-xs font-medium text-white" @click="$emit('primary')">
          {{ primaryLabel }}
        </button>
      </div>

      <!-- optional small tertiary text (復原) -->
      <button v-if="showRestore" type="button" class="text-xs font-medium text-primary-50 hover:underline" @click="$emit('restore')">
        {{ restoreLabel }}
      </button>

      <!-- close icon -->
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
</template>

<script setup lang="ts">
import { computed } from "vue";

withDefaults(
  defineProps<{
    id?: string;
    message?: string;
    showClose?: boolean;
    closeLabel?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    restoreLabel?: string;
    showActions?: boolean;
    showRestore?: boolean;
  }>(),
  {
    id: "toast-default",
    message: "Set yourself free.",
    showClose: true,
    closeLabel: "Close",
    primaryLabel: "暫存",
    secondaryLabel: "退出編輯",
    restoreLabel: "復原",
    showActions: true,
    showRestore: false,
  }
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "primary"): void;
  (e: "secondary"): void;
  (e: "restore"): void;
}>();

const handleClose = () => emit("close");
</script>
