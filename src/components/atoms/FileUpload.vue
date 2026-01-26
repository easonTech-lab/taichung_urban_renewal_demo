<template>
  <div class="flex w-full items-center justify-center">
    <div class="flex h-[228px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50"
      :class="[
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-200',
      ]" @drop.prevent="handleDrop" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false">
      <div class="flex flex-col items-center justify-center gap-4">
        <Icon name="uploadOutline" :size="40" class="h-10 w-10 text-gray-400" />
        <div class="flex flex-col items-center gap-0">
          <p class="text-sm font-semibold text-gray-500">點擊新增或拖曳檔案到此區塊</p>
          <p class="text-xs font-medium text-gray-500">檔案大小勿超過{{ maxSize }}MB</p>
        </div>
        <!-- Upload Button -->
        <ButtonCTA variant="primary" size="sm" left-icon="searchFile" @click="triggerFileInput">
          從電腦新增
        </ButtonCTA>
      </div>
    </div>
    <!-- Hidden File Input -->
    <input :id="inputId" ref="fileInputRef" type="file" :accept="accept" :multiple="multiple" class="hidden"
      @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const props = withDefaults(
  defineProps<{
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
  }>(),
  {
    accept: "*",
    multiple: false,
    maxSize: 30,
  }
);

const emit = defineEmits<{
  "file-selected": [files: File[]];
  "file-error": [error: string];
}>();

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
  const files = target.files;
  if (files && files.length > 0) {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    if (validFiles.length > 0) {
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
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    if (validFiles.length > 0) {
      emit("file-selected", validFiles);
    }
  }
};
</script>
