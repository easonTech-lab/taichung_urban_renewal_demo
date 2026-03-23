<template>
  <div class="flex items-center" :class="containerClass">
    <input
      ref="checkboxRef"
      :id="inputId"
      type="checkbox"
      :checked="checked || (modelValue !== undefined && modelValue === true)"
      :disabled="disabled"
      :required="required"
      class="h-4 w-4 appearance-none rounded-sm border-[0.5px] border-gray-300 bg-gray-50 text-primary-600 transition-colors checked:border-primary-600 checked:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
      :class="[inputClass, indeterminate && 'border-primary-700 bg-primary-700']"
      @change="handleChange"
      v-bind="$attrs"
    />
    <label v-if="label && !$slots.default" :for="inputId" class="ml-2 select-none text-sm font-medium text-gray-900" :class="labelClass">
      {{ label }}
    </label>
    <div v-if="$slots.default" class="ml-2" :class="labelClass">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, onMounted, ref } from "vue";
const props = withDefaults(
  defineProps<{
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    modelValue?: boolean;
    indeterminate?: boolean; // 半選狀態
    containerClass?: string;
    inputClass?: string;
    labelClass?: string;
  }>(),
  {
    disabled: false,
    required: false,
    checked: false,
    indeterminate: false,
    containerClass: "",
    inputClass: "",
    labelClass: "",
  }
);
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [event: Event];
}>();
const checkboxRef = ref<HTMLInputElement | null>(null);
const inputId = computed(() => `checkbox-${Math.random().toString(36).substring(2, 11)}`);
// 設置 indeterminate 狀態
watch(
  () => props.indeterminate,
  (indeterminate) => {
    if (checkboxRef.value) {
      checkboxRef.value.indeterminate = indeterminate;
    }
  },
  { immediate: true }
);
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
  emit("change", event);
};
onMounted(() => {
  if (checkboxRef.value && props.indeterminate) {
    checkboxRef.value.indeterminate = true;
  }
});
</script>
