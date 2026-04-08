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
          <h2 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h2>
        </div>
      </div>
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h1 class="text-2xl font-medium leading-6 text-gray-900">{{ isEditMode ? "編輯公開消息" : "新增公開消息" }}</h1>
        </div>
        <div class="flex flex-col gap-6">
          <Input v-model="formData.title" label="標題(限50字)" placeholder="填寫標題" size="lg" :maxlength="50" required />
          <RadioGroup label="類別" required>
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
          <RichTextEditor v-model="formData.content" label="內容(限200字)" placeholder="文字輸入" required :maxlength="200" />
          <FileUpload v-model="formData.files" label="檔案上傳" :max-size="10" multiple required @file-error="handleFileError" />
        </div>
      </div>
      <div class="flex items-center justify-center gap-4">
        <template v-if="isEditMode">
          <ButtonCTA variant="outline" size="l" @click="handleCancelEdit">取消</ButtonCTA>
          <ButtonCTA variant="primary" size="l" :disabled="isPublishDisabled" @click="handlePublish">儲存</ButtonCTA>
        </template>
        <template v-else>
          <ButtonCTA variant="outline" size="l" @click="handleSaveDraft">暫存</ButtonCTA>
          <ButtonCTA variant="primary" size="l" :disabled="isPublishDisabled" @click="handlePublish">發布</ButtonCTA>
        </template>
      </div>
    </div>

    <UnsavedChangesModal
      :model-value="unsavedDialog.showUnsavedChangesModal.value"
      @update:modelValue="(value) => (unsavedDialog.showUnsavedChangesModal.value = value)"
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
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import RichTextEditor from "@/components/atoms/RichTextEditor.vue";
import AlertModal from "@/components/molecules/AlertModal.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import { apiGetPublicMessageById, apiPostPublicMessage, apiPutPublicMessage } from "@/api/backend/homepageMaintenance/publicMessageService";
import type { PublicMessageApiItem } from "@/types/api/backend/homepageMaintenance/publicMessageService";
import type { PublicMessageFormData } from "@/types/backend/homepageMaintenance/publicMessageManagement.d";

const router = useRouter();
const route = useRoute();
const unsavedDialog = useUnsavedChangesDialog();

const formData = ref<PublicMessageFormData>({
  title: "",
  category: "",
  content: "",
  files: [],
});

const showUploadWarningModal = ref(false);
const uploadWarningMessage = ref("");
const editingMessage = ref<{ title?: string; category?: string; content?: string } | null>(null);

const categoryOptions = [
  { label: "最新消息", value: "LATEST_NEWS" },
  { label: "新聞快訊", value: "ACTIVITY" },
  { label: "會議公告", value: "MEETING_NOTICE" },
];

const messageId = computed(() => (typeof route.params.id === "string" ? route.params.id : ""));
const isEditMode = computed(() => Boolean(messageId.value));

const isPublishDisabled = computed(() => {
  if (!formData.value.title.trim()) return true;
  if (!formData.value.category) return true;
  if (getPlainTextLength(formData.value.content) === 0) return true;
  return formData.value.files.length === 0;
});

const publicMessageFormUnsavedCheck = useFormUnsavedCheck(() => buildFormSnapshot(), isEditMode);

const buildPayload = (status: "DRAFT" | "PUBLISHED") => ({
  title: formData.value.title,
  content: formData.value.content,
  newsCategory: formData.value.category,
  isTop: 0,
  newsStatus: status,
  internalRemark: "",
});

const handleSaveDraft = async () => {
  if (messageId.value) {
    await apiPutPublicMessage({ ...buildPayload("DRAFT"), id: messageId.value });
  } else {
    await apiPostPublicMessage(buildPayload("DRAFT"));
  }
  router.push({
    path: "/public-message-management",
    query: {
      toast: "success",
      msg: "暫存成功",
    },
  });
};

const handlePublish = async () => {
  if (messageId.value) {
    await apiPutPublicMessage({ ...buildPayload("PUBLISHED"), id: messageId.value });
  } else {
    await apiPostPublicMessage(buildPayload("PUBLISHED"));
  }
  router.push({
    path: "/public-message-management",
    query: {
      toast: "success",
      msg: isEditMode.value ? "儲存成功" : "新增成功",
    },
  });
};

const categoryValueMap: Record<string, string> = {
  最新消息: "LATEST_NEWS",
  新聞快訊: "ACTIVITY",
  會議公告: "MEETING_NOTICE",
};

const normalizePublicMessageItem = (item: PublicMessageApiItem) => ({
  id: String(item.id),
  title: item.title ?? "",
  category: item.categoryLabel ?? item.newsCategory ?? "",
  content: item.content ?? item.summary ?? "",
});

onMounted(async () => {
  if (isEditMode.value) {
    const response = await apiGetPublicMessageById(messageId.value);
    editingMessage.value = response.data.data ? normalizePublicMessageItem(response.data.data) : null;
    if (!editingMessage.value) {
      router.replace("/public-message-management");
      return;
    }
    formData.value.title = editingMessage.value.title ?? "";
    formData.value.category = categoryValueMap[editingMessage.value.category ?? ""] ?? editingMessage.value.category ?? "";
    formData.value.content = editingMessage.value.content ?? "";
  }
  publicMessageFormUnsavedCheck.captureInitial();
});

const getPlainTextLength = (html: string): number => {
  if (!html) return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.length || 0;
}

const getFilesSignature = (files: File[]): string => {
  const arr = [...files].sort((a, b) => a.name.localeCompare(b.name)).map((f) => `${f.name}|${f.size}`);
  return JSON.stringify(arr);
}

const buildFormSnapshot = (): string => {
  return JSON.stringify({
    title: formData.value.title.trim(),
    category: formData.value.category,
    content: formData.value.content,
    filesSignature: getFilesSignature(formData.value.files),
  });
}

const navigateToPublicMessageList = () => {
  router.push("/public-message-management");
};

const handleSidebarItemSelect = () => {
  // Handle sidebar item selection
};

const handleGoBack = () => {
  unsavedDialog.requestUnsavedConfirmation(publicMessageFormUnsavedCheck.hasUnsavedChanges.value, () => router.back());
};

const handleCancelEdit = () => {
  unsavedDialog.requestUnsavedConfirmation(publicMessageFormUnsavedCheck.hasUnsavedChanges.value, navigateToPublicMessageList);
};

const handleExitWithoutSaving = () => {
  unsavedDialog.runPendingAction();
};

const handleSaveFromUnsavedModal = async () => {
  unsavedDialog.closeUnsavedChangesModal();
  await handlePublish();
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
