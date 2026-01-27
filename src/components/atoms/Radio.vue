<template>
  <div class="flex items-center" :class="containerClass">
    <input
      :id="inputId"
      :type="type"
      :value="value"
      :name="name"
      :checked="checked || (modelValue !== undefined && modelValue === value)"
      :disabled="disabled"
      :required="required"
      class="h-4 w-4 appearance-none rounded-lg border-[0.5px] border-gray-500 bg-gray-50 text-primary-600 transition-colors checked:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
      :class="inputClass"
      @change="handleChange"
      v-bind="$attrs"
    />
    <label v-if="label && !$slots.default" :for="inputId" class="select-none text-sm font-medium text-gray-900" :class="labelClass">
      {{ label }}
    </label>
    <div v-if="$slots.default" :class="labelClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    value?: string | number;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    type?: "radio";
    modelValue?: string | number;
    containerClass?: string;
    inputClass?: string;
    labelClass?: string;
  }>(),
  {
    type: "radio",
    disabled: false,
    required: false,
    checked: false,
    containerClass: "",
    inputClass: "",
    labelClass: "ms-2",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  change: [event: Event];
}>();

const inputId = computed(() => `radio-${Math.random().toString(36).substring(2, 11)}`);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (props.value !== undefined) {
    emit("update:modelValue", props.value);
  }
  emit("change", event);
};
</script>
