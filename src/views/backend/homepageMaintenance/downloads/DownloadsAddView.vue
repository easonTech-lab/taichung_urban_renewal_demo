<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center gap-4">
          <button type="button" class="flex h-6 w-6 items-center justify-center" @click="handleGoBack" aria-label="返回上一頁">
            <Icon name="arrowLeftOutline" class="h-6 w-6 text-gray-900" />
          </button>
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h1>
        </div>
      </div>
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ isEditMode ? "編輯下載內容" : "新增下載內容" }}</h2>
        </div>
        <div class="flex flex-col gap-6">
          <Input v-model="formData.title" label="標題(限50字)" placeholder="填寫標題" size="lg" :maxlength="50" required show-label />
          <RadioGroup label="案件類別" required show-label>
            <template #radios>
              <Radio
                v-for="category in categoryOptions"
                :key="category.value"
                :model-value="formData.category"
                :value="category.value"
                :label="category.label"
                name="category"
                container-class="flex items-center gap-2"
                label-class="text-sm font-medium text-gray-900"
                @update:model-value="(value) => (formData.category = value as string)"
              />
            </template>
          </RadioGroup>
          <RichTextEditor v-model="formData.text" label="內容(限200字)" placeholder="文字輸入" :maxlength="200" required show-label />
          <FileUpload v-model="formData.files" label="檔案上傳" :max-size="10" multiple required show-label @file-error="handleFileError" />
        </div>
      </div>
      <div class="flex items-center justify-center gap-4">
        <ButtonCTA variant="outline" size="l" @click="handleCancelOrDraft">{{ isEditMode ? "取消" : "暫存" }}</ButtonCTA>
        <ButtonCTA variant="primary" size="l" :disabled="isPublishDisabled" @click="handlePublish">發布</ButtonCTA>
      </div>
    </div>

    <UnsavedChangesModal
      :model-value="unsavedDialog.showUnsavedChangesModal.value"
      @update:modelValue="(value) => (unsavedDialog.showUnsavedChangesModal.value = value)"
      :confirm-label="isEditMode ? '儲存修改' : '暫存'"
      :confirm-disabled="isPublishDisabled"
      @exit="handleExitWithoutSaving"
      @confirm="handleSaveFromUnsavedModal"
    />
    <AlertModal v-model="showUploadWarningModal" :message="uploadWarningMessage" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useUnsavedChangesDialog } from "@/composables/useUnsavedChangesDialog";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import Icon from "@/components/atoms/Icon.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import RichTextEditor from "@/components/atoms/RichTextEditor.vue";
import AlertModal from "@/components/molecules/AlertModal.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import { apiGetDownloadById, apiPostDownload, apiPutDownload } from "@/api/backend/homepageMaintenance/downloadsService";
import type { DownloadApiItem } from "@/types/api/backend/homepageMaintenance/downloadsService";
import type { DownloadFormData } from "@/types/backend/homepageMaintenance/downloadsManagement.d";

const router = useRouter();
const route = useRoute();
const unsavedDialog = useUnsavedChangesDialog();

const formData = ref<DownloadFormData>({
  title: "",
  category: "",
  text: "",
  files: [],
});

const showUploadWarningModal = ref(false);
const uploadWarningMessage = ref("");
const editingDownload = ref<{ fileName?: string; category?: string; text?: string } | null>(null);

const categoryOptions = [
  { label: "都市更新類", value: "urban-renewal" },
  { label: "危老類", value: "dangerous-old" },
  { label: "老舊街區", value: "old-district" },
  { label: "整建維護", value: "renovation-maintenance" },
];

const categoryValueMap: Record<string, string> = {
  都市更新類: "urban-renewal",
  危老類: "dangerous-old",
  老舊街區: "old-district",
  整建維護: "renovation-maintenance",
};

const downloadId = computed(() => (typeof route.params.id === "string" ? route.params.id : ""));
const isEditMode = computed(() => Boolean(downloadId.value));

const isPublishDisabled = computed(() => {
  if (!formData.value.title.trim()) return true;
  if (!formData.value.category) return true;
  return formData.value.files.length === 0;
});

const downloadsFormUnsavedCheck = useFormUnsavedCheck(() => buildFormSnapshot());

const handleSaveDraft = async () => {
  if (downloadId.value) {
    await apiPutDownload({ ...formData.value, status: "draft", id: downloadId.value });
  } else {
    await apiPostDownload({ ...formData.value, status: "draft" });
  }
  router.push({
    path: "/downloads-management",
    query: {
      toast: "success",
      msg: "暫存成功",
    },
  });
};

const handlePublish = async () => {
  const isEdit = isEditMode.value;
  if (downloadId.value) {
    await apiPutDownload({ ...formData.value, status: "published", id: downloadId.value });
  } else {
    await apiPostDownload({ ...formData.value, status: "published" });
  }
  router.push({
    path: "/downloads-management",
    query: {
      toast: "success",
      msg: isEdit ? "儲存成功" : "新增成功",
    },
  });
};

const normalizeDownloadItem = (item: DownloadApiItem) => ({
  id: String(item.id),
  fileName: item.fileName ?? "",
  category: item.categoryLabel ?? item.category ?? "",
  text: "",
});

onMounted(async () => {
  if (isEditMode.value) {
    const response = await apiGetDownloadById(downloadId.value);
    const item = response.data.data.content.find((downloadItem: { id: string | number }) => String(downloadItem.id) === downloadId.value);
    editingDownload.value = item ? normalizeDownloadItem(item) : null;
    if (!editingDownload.value) {
      router.replace("/downloads-management");
      return;
    }
    formData.value.title = editingDownload.value.fileName;
    formData.value.category = categoryValueMap[editingDownload.value.category] || editingDownload.value.category;
    formData.value.text = editingDownload.value.text ?? "";
  }
  downloadsFormUnsavedCheck.captureInitial();
});

const getFilesSignature = (files: File[]): string => {
  const arr = [...files].sort((a, b) => a.name.localeCompare(b.name)).map((f) => `${f.name}|${f.size}`);
  return JSON.stringify(arr);
}

const buildFormSnapshot = (): string => {
  return JSON.stringify({
    title: formData.value.title.trim(),
    category: formData.value.category,
    text: formData.value.text,
    filesSignature: getFilesSignature(formData.value.files),
  });
}

const navigateToDownloadsList = () => {
  router.push("/downloads-management");
};

const handleSidebarItemSelect = () => {
  // Handle sidebar item selection
};

const handleGoBack = () => {
  unsavedDialog.requestUnsavedConfirmation(downloadsFormUnsavedCheck.hasUnsavedChanges.value, () => router.back());
};

const handleCancelOrDraft = () => {
  if (isEditMode.value) {
    handleCancelEdit();
  } else {
    handleSaveDraft();
  }
};

const handleCancelEdit = () => {
  unsavedDialog.requestUnsavedConfirmation(downloadsFormUnsavedCheck.hasUnsavedChanges.value, navigateToDownloadsList);
};

const handleExitWithoutSaving = () => {
  unsavedDialog.runPendingAction();
};

const handleSaveFromUnsavedModal = async () => {
  unsavedDialog.closeUnsavedChangesModal();
  if (isEditMode.value) {
    await handlePublish();
  } else {
    await handleSaveDraft();
  }
};

const handleFileError = (payload: { type: "size" | "format"; maxSize?: number }) => {
  if (payload.type === "size") {
    uploadWarningMessage.value = `檔案大小需限 ${payload.maxSize ?? 10}MB，請重新確認`;
  } else {
    uploadWarningMessage.value = "檔案格式不符，請重新確認";
  }
  showUploadWarningModal.value = true;
};
</script>
