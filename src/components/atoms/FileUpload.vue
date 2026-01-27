<template>
  <div class="inline-flex flex-col items-start gap-2" :class="[containerClass || 'w-full']">
    <!-- Label -->
    <label v-if="showLabel && label" class="block text-base font-medium text-gray-900">
      {{ label }}
      <span v-if="required" class="ml-1 text-xs leading-none text-red-500">*</span>
    </label>
    <div class="flex w-full flex-col gap-2">
      <!-- Upload Area -->
      <div
        class="flex h-[228px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50"
        :class="[isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-200']"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <Icon name="uploadOutline" :size="24" class="h-6 w-6 text-gray-500" />
          <div class="flex flex-col items-center">
            <p class="text-sm font-semibold text-gray-500">點擊新增或拖曳檔案到此區塊</p>
            <p class="text-xs font-medium text-gray-500">檔案大小勿超過{{ maxSize }}MB</p>
          </div>
          <!-- Upload Button -->
          <ButtonCTA variant="primary" size="sm" left-icon="searchFile" @click="triggerFileInput"> 從電腦新增 </ButtonCTA>
        </div>
      </div>
      <!-- Hidden File Input -->
      <input :id="inputId" ref="fileInputRef" type="file" :accept="accept" :multiple="multiple" class="hidden" @change="handleFileChange" />

      <!-- File List -->
      <div v-if="files.length > 0" class="flex flex-col gap-4">
        <div v-for="(file, index) in files" :key="index" class="flex items-center gap-2 rounded-lg">
          <Icon name="clip" :size="24" class="h-6 w-6 shrink-0 text-gray-900" />
          <p class="flex-1 whitespace-pre-wrap break-words text-sm font-normal leading-[1.5] text-primary-900">
            {{ file.name }}
          </p>
          <button type="button" @click="handleRemoveFile(index)" class="shrink-0 leading-none" aria-label="刪除檔案">
            <Icon name="deleteCircle" :size="24" class="h-6 w-6 text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: File[];
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    label?: string;
    showLabel?: boolean;
    required?: boolean;
    labelPosition?: "horizontal" | "vertical";
    containerClass?: string;
  }>(),
  {
    modelValue: () => [],
    accept: "*",
    multiple: false,
    maxSize: 30,
    showLabel: false,
    required: false,
    labelPosition: "vertical",
    containerClass: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [files: File[]];
  "file-selected": [files: File[]];
  "file-error": [error: string];
  "file-removed": [index: number];
}>();

const files = computed({
  get: () => props.modelValue || [],
  set: (value) => emit("update:modelValue", value),
});

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const inputId = computed(() => `file-upload-${Math.random().toString(36).substring(2, 11)}`);

const maxSizeText = computed(() => {
  return `${props.maxSize}MB`;
});

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const validateFile = (file: File): boolean => {
  const maxSizeBytes = props.maxSize * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSizeBytes) {
    emit("file-error", `檔案大小超過限制（最大 ${props.maxSize}MB）`);
    return false;
  }
  return true;
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (selectedFiles && selectedFiles.length > 0) {
    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter(validateFile);
    if (validFiles.length > 0) {
      if (props.multiple) {
        files.value = [...files.value, ...validFiles];
      } else {
        files.value = validFiles;
      }
      emit("file-selected", validFiles);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    const fileArray = Array.from(droppedFiles);
    const validFiles = fileArray.filter(validateFile);
    if (validFiles.length > 0) {
      if (props.multiple) {
        files.value = [...files.value, ...validFiles];
      } else {
        files.value = validFiles;
      }
      emit("file-selected", validFiles);
    }
  }
};

const handleRemoveFile = (index: number) => {
  const newFiles = files.value.filter((_, i) => i !== index);
  files.value = newFiles;
  emit("file-removed", index);
};
</script>
