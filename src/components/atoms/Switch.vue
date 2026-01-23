<template>
  <label :class="['inline-flex items-center cursor-pointer', disabled && 'cursor-not-allowed opacity-50']">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="sr-only peer"
      @change="handleChange"
      v-bind="$attrs"
    />
    <!-- Switch with Text -->
    <div
      :class="[
        'relative h-6 w-[60px] rounded-full transition-colors duration-200',
        'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200',
        modelValue ? 'bg-green-400' : 'bg-gray-400',
        disabled && 'opacity-50 cursor-not-allowed',
      ]"
    >
      <!-- Toggle Circle -->
      <div
        :class="[
          'absolute top-[4px] size-4 bg-white rounded-full transition-all duration-200',
          modelValue ? 'left-[40px]' : 'left-[4px]',
        ]"
      ></div>
      <!-- Text Label -->
      <span
        v-if="showText"
        :class="[
          'absolute top-[3px] text-xs font-normal text-white text-center whitespace-nowrap transition-all duration-200',
          modelValue ? 'left-[21px] -translate-x-1/2' : 'left-[39px] -translate-x-1/2',
        ]"
      >
        {{ modelValue ? onText : offText }}
      </span>
    </div>
    <!-- External Label (if provided) -->
    <span v-if="label && !showText" :class="['select-none ms-3 text-sm font-medium', labelClass]">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    label?: string; // 外部標籤（當 showText 為 false 時顯示）
    onText?: string; // 開啟狀態的文字（顯示在開關內部）
    offText?: string; // 關閉狀態的文字（顯示在開關內部）
    showText?: boolean; // 是否在開關內部顯示文字
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    modelValue: false,
    disabled: false,
    size: "md",
    showText: false,
    onText: "開啟",
    offText: "關閉",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [value: boolean];
}>();

const labelClass = computed(() => {
  if (props.disabled) {
    return "text-gray-400";
  }
  return "text-gray-900";
});

const handleChange = (event: Event) => {
  if (props.disabled) return;
  const target = event.target as HTMLInputElement;
  const newValue = target.checked;
  emit("update:modelValue", newValue);
  emit("change", newValue);
};
</script>
