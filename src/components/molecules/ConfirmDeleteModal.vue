<template>
  <Modal v-model="isOpen" size="md" :static="false" :show-close-button="false" close-action="emit" backdrop-class="bg-gray-600/80">
    <template #header>
      <div class="flex w-full items-center justify-end px-4 pt-4">
        <button type="button" class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500" @click="handleCancel" aria-label="關閉">
          <Icon name="close" :size="20" aria-hidden="true" />
        </button>
      </div>
    </template>
    <template #body>
      <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">!</div>
        <div class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">
          <p :class="description ? 'mb-0' : ''">{{ message }}</p>
          <p v-if="description">{{ description }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
        <ButtonCTA
          variant="white"
          size="xs"
          class="h-8 w-[120px] border-gray-200 px-3 py-2 text-xs font-medium leading-[1.5] text-gray-800 hover:bg-gray-50"
          @click="handleCancel"
        >
          {{ cancelLabel }}
        </ButtonCTA>
        <ButtonCTA
          variant="red"
          size="xs"
          class="h-8 w-[120px] bg-red-700 px-3 py-2 text-sm font-medium leading-[1.5] text-white hover:bg-red-800"
          @click="handleConfirm"
        >
          {{ confirmLabel }}
        </ButtonCTA>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import Modal from "@/components/atoms/Modal.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    message: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    confirmLabel: "刪除",
    cancelLabel: "取消",
    description: "",
  }
);
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  cancel: [];
}>();
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});
const handleCancel = () => {
  emit("update:modelValue", false);
  emit("cancel");
}
const handleConfirm = () => {
  emit("confirm");
}
</script>
