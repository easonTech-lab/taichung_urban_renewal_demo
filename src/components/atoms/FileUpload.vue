<template>
  <div class="inline-flex flex-col items-start gap-2" :class="[containerClass || 'w-full']">
    <!-- Label -->
    <label v-if="showLabel && label" class="block text-base font-medium text-gray-900">
      {{ label }}
      <span v-if="required" class="ml-1 text-xs leading-none text-red-500">*</span>
    </label>
    <div class="relative flex w-full flex-col gap-2">
      <!-- Upload Area -->
      <div
        class="flex h-[228px] w-full max-w-[364px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50"
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
          <!-- 原生按鈕同步觸發 input.click()，相容性最佳 -->
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-700 bg-transparent px-3 py-2 text-xs font-medium leading-[1.5] text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            @click="onSelectFileClick"
          >
            <Icon name="searchFile" :size="20" class="h-5 w-5 shrink-0" />
            <span>從電腦新增</span>
          </button>
        </div>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="absolute h-0 w-0 p-0 opacity-0"
        tabindex="-1"
        aria-hidden="true"
        @change="handleFileChange"
      />

      <!-- File List -->
      <div v-if="files.length > 0" class="flex flex-col gap-4">
        <div v-for="(file, index) in files" :key="index" class="flex min-w-0 items-center gap-2 rounded-lg">
          <Icon name="clip" :size="24" class="h-6 w-6 shrink-0 text-gray-900" />
          <p class="min-w-0 flex-1 truncate text-sm font-normal leading-[1.5] text-primary-900" :title="file.name">
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
    showLabel: true,
    required: false,
    labelPosition: "vertical",
    containerClass: "",
  }
);

export type FileUploadErrorType = "size" | "format";

export type FileUploadErrorPayload = {
  type: FileUploadErrorType;
  maxSize?: number;
};

const emit = defineEmits<{
  "update:modelValue": [files: File[]];
  "file-selected": [files: File[]];
  "file-error": [payload: FileUploadErrorPayload];
  "file-removed": [index: number];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const maxSizeBytes = computed(() => props.maxSize * 1024 * 1024);
const files = computed({
  get: () => props.modelValue || [],
  set: (value) => emit("update:modelValue", value),
});

const isAcceptValid = (file: File): boolean => {
  if (!props.accept || props.accept === "*") return true;
  const acceptList = props.accept.split(",").map((s) => s.trim().toLowerCase());
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return acceptList.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule || name.endsWith(rule);
  });
}

/** 必須在使用者點擊的同一同步執行緒裡呼叫 input.click()，否則部分瀏覽器不會開選檔視窗 */
const onSelectFileClick = () => {
  fileInputRef.value?.click();
}

const validateFile = (
  file: File): { valid: true } | { valid: false; payload: FileUploadErrorPayload } => {
  if (!isAcceptValid(file)) {
    return { valid: false, payload: { type: "format" } };
  }
  if (file.size > maxSizeBytes.value) {
    return { valid: false, payload: { type: "size", maxSize: props.maxSize } };
  }
  return { valid: true };
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (!selectedFiles || selectedFiles.length === 0) return;

  const fileArray = Array.from(selectedFiles);
  // 先清空 input，盡快釋放大檔案參考，避免卡住
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }

  const validFiles: File[] = [];
  const errorsToEmit: FileUploadErrorPayload[] = [];

  for (const file of fileArray) {
    const result = validateFile(file);
    if (result.valid) {
      validFiles.push(file);
    } else {
      errorsToEmit.push((result as { valid: false; payload: FileUploadErrorPayload }).payload);
    }
  }

  // 先檢查、先擋：有違規就立刻顯示警告，不加入任何檔案
  if (errorsToEmit.length > 0) {
    errorsToEmit.forEach((payload) => emit("file-error", payload));
    return;
  }

  if (validFiles.length > 0) {
    if (props.multiple) {
      files.value = [...files.value, ...validFiles];
    } else {
      files.value = validFiles;
    }
    emit("file-selected", validFiles);
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const droppedFiles = event.dataTransfer?.files;
  if (!droppedFiles || droppedFiles.length === 0) return;

  const fileArray = Array.from(droppedFiles);
  const validFiles: File[] = [];
  const errorsToEmit: FileUploadErrorPayload[] = [];

  for (const file of fileArray) {
    const result = validateFile(file);
    if (result.valid) {
      validFiles.push(file);
    } else {
      errorsToEmit.push((result as { valid: false; payload: FileUploadErrorPayload }).payload);
    }
  }

  // 先檢查、先擋：有違規就立刻顯示警告，不加入任何檔案
  if (errorsToEmit.length > 0) {
    errorsToEmit.forEach((payload) => emit("file-error", payload));
    return;
  }
  if (validFiles.length > 0) {
    if (props.multiple) {
      files.value = [...files.value, ...validFiles];
    } else {
      files.value = validFiles;
    }
    emit("file-selected", validFiles);
  }
}

const handleRemoveFile = (index: number) => {
  const newFiles = files.value.filter((_, i) => i !== index);
  files.value = newFiles;
  emit("file-removed", index);
}
</script>
