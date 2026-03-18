<template>
  <div class="flex flex-col gap-6" :class="containerClass">
    <!-- Vertical Layout (default) -->
    <template v-if="labelPosition === 'vertical' || !labelPosition">
      <label v-if="showLabel && label" :for="switchId" class="relative inline-block text-base font-medium" :class="labelTextClass">
        {{ label }}
        <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
      </label>
      <label :class="['inline-flex shrink-0 cursor-pointer items-center', disabled && 'cursor-not-allowed opacity-50']">
        <input :id="switchId" type="checkbox" :checked="modelValue" :disabled="disabled" class="peer sr-only" @change="handleChange" v-bind="$attrs" />
        <!-- Switch with Text -->
        <div
          :class="[
            'relative h-6 w-[60px] min-w-[60px] shrink-0 rounded-full transition-colors duration-200',
            'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200',
            modelValue ? 'bg-green-400' : 'bg-gray-400',
            disabled && 'cursor-not-allowed opacity-50',
          ]"
        >
          <!-- Toggle Circle -->
          <div :class="['absolute top-[4px] size-4 rounded-full bg-white transition-all duration-200', modelValue ? 'left-[40px]' : 'left-[4px]']"></div>
          <!-- Text Label -->
          <span
            v-if="showText"
            :class="[
              'absolute top-[3px] whitespace-nowrap text-center text-xs font-normal text-white transition-all duration-200',
              modelValue ? 'left-[21px] -translate-x-1/2' : 'left-[39px] -translate-x-1/2',
            ]"
          >
            {{ modelValue ? onText : offText }}
          </span>
        </div>
      </label>
    </template>

    <!-- Horizontal Layout -->
    <template v-else-if="labelPosition === 'horizontal'">
      <div class="flex items-center gap-6">
        <label v-if="showLabel && label" :for="switchId" class="relative inline-block whitespace-nowrap text-base font-medium" :class="labelTextClass">
          {{ label }}
          <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
        </label>
        <label :class="['inline-flex shrink-0 cursor-pointer items-center', disabled && 'cursor-not-allowed opacity-50']">
          <input :id="switchId" type="checkbox" :checked="modelValue" :disabled="disabled" class="peer sr-only" @change="handleChange" v-bind="$attrs" />
          <!-- Switch with Text -->
          <div
            :class="[
              'relative h-6 w-[60px] min-w-[60px] shrink-0 rounded-full transition-colors duration-200',
              'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200',
              modelValue ? 'bg-green-400' : 'bg-gray-400',
              disabled && 'cursor-not-allowed opacity-50',
            ]"
          >
            <!-- Toggle Circle -->
            <div :class="['absolute top-[4px] size-4 rounded-full bg-white transition-all duration-200', modelValue ? 'left-[40px]' : 'left-[4px]']"></div>
            <!-- Text Label -->
            <span
              v-if="showText"
              :class="[
                'absolute top-[3px] whitespace-nowrap text-center text-xs font-normal text-white transition-all duration-200',
                modelValue ? 'left-[21px] -translate-x-1/2' : 'left-[39px] -translate-x-1/2',
              ]"
            >
              {{ modelValue ? onText : offText }}
            </span>
          </div>
        </label>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    label?: string; // 外部標籤
    showLabel?: boolean; // 是否顯示 label
    required?: boolean; // 是否必填（顯示 *）
    labelPosition?: "horizontal" | "vertical"; // label 位置：水平或垂直
    onText?: string; // 開啟狀態的文字（顯示在開關內部）
    offText?: string; // 關閉狀態的文字（顯示在開關內部）
    showText?: boolean; // 是否在開關內部顯示文字
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    containerClass?: string; // 容器自訂 class
  }>(),
  {
    modelValue: false,
    showLabel: true,
    required: false,
    labelPosition: "vertical",
    disabled: false,
    size: "md",
    showText: false,
    onText: "開啟",
    offText: "關閉",
    containerClass: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [value: boolean];
}>();

const switchId = computed(() => `switch-${Math.random().toString(36).substring(2, 11)}`);

const labelTextClass = computed(() => {
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
