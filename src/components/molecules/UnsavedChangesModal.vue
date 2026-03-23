<template>
  <Modal
    :model-value="modelValue"
    size="md"
    :static="false"
    :show-close-button="false"
    close-action="emit"
    backdrop-class="bg-gray-600/80"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <template #header>
      <div class="flex w-full items-center justify-end px-4 pt-4">
        <button
          type="button"
          class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
          aria-label="關閉"
          @click="emit('update:modelValue', false)"
        >
          <Icon name="close" :size="20" aria-hidden="true" />
        </button>
      </div>
    </template>
    <template #body>
      <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
        <div class="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gray-400 text-[28px] font-medium leading-none text-white">!</div>
        <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">
          {{ message }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
        <ButtonCTA
          variant="white"
          size="xs"
          class="h-8 w-[120px] border-gray-200 px-3 py-2 text-sm font-medium leading-[1.5] text-gray-800"
          @click="emit('exit')"
        >
          {{ exitLabel }}
        </ButtonCTA>
        <ButtonCTA
          :variant="confirmVariant"
          size="xs"
          class="h-8 w-[120px] px-3 py-2 text-sm font-medium leading-[1.5]"
          :disabled="confirmDisabled"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </ButtonCTA>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import Modal from "@/components/atoms/Modal.vue";
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
withDefaults(
  defineProps<{
    modelValue: boolean;
    message?: string;
    exitLabel?: string;
    confirmLabel?: string;
    confirmDisabled?: boolean;
    confirmVariant?: "primary" | "red";
  }>(),
  {
    message: "有尚未儲存的修改，離開前是否先儲存",
    exitLabel: "退出編輯",
    confirmLabel: "儲存修改",
    confirmDisabled: false,
    confirmVariant: "primary",
  }
);
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  exit: [];
  confirm: [];
}>();
</script>
