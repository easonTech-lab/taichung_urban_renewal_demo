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

    <Modal v-model="showUnsavedChangesModal" size="md" :static="false" :show-close-button="false" close-action="emit" backdrop-class="bg-gray-600/80">
      <template #header>
        <div class="flex w-full items-center justify-end px-4 pt-4">
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
            aria-label="關閉"
            @click="showUnsavedChangesModal = false"
          >
            <Icon name="close" :size="20" aria-hidden="true" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xl font-medium leading-none text-white">!</div>
          <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">有尚未儲存的修改，離開前是否先儲存</p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
          <ButtonCTA variant="white" size="xs" class="h-8 w-[120px] border-gray-200 px-3 py-2 text-sm font-medium leading-[1.5] text-gray-800" @click="handleExitWithoutSaving">
            退出編輯
          </ButtonCTA>
          <ButtonCTA variant="primary" size="xs" class="h-8 w-[120px] px-3 py-2 text-sm font-medium leading-[1.5]" :disabled="isPublishDisabled" @click="handleSaveFromUnsavedModal">
            儲存修改
          </ButtonCTA>
        </div>
      </template>
    </Modal>
    <Modal v-model="showUploadWarningModal" size="md" backdrop-class="bg-gray-600/80" :show-close-button="true" close-action="emit">
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">!</div>
          <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">{{ uploadWarningMessage }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center px-6 pb-6 pt-0">
          <ButtonCTA variant="primary" size="xs" class="h-8 min-w-[120px]" @click="showUploadWarningModal = false">確認</ButtonCTA>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import Modal from "@/components/atoms/Modal.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import RichTextEditor from "@/components/atoms/RichTextEditor.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import type { PublicMessageFormData } from "@/types/backend/homepageMaintenance/publicMessageManagement.d";

const router = useRouter();
const route = useRoute();

const isEditMode = computed(() => route.query.edit === "true");
const showUnsavedChangesModal = ref(false);

const formData = ref<PublicMessageFormData>({
  title: "",
  category: "",
  content: "",
  files: [],
});

const categoryOptions = [
  { label: "最新消息", value: "latest-news" },
  { label: "新聞快訊", value: "news-flash" },
  { label: "會議公告", value: "meeting-announcement" },
];

const getPlainTextLength = (html: string): number => {
  if (!html) return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.length || 0;
};

const isPublishDisabled = computed(() => {
  if (!formData.value.title.trim()) return true;
  if (!formData.value.category) return true;
  if (getPlainTextLength(formData.value.content) === 0) return true;
  return formData.value.files.length === 0;
});

const getFilesSignature = (files: File[]): string => {
  const arr = [...files].sort((a, b) => a.name.localeCompare(b.name)).map((f) => `${f.name}|${f.size}`);
  return JSON.stringify(arr);
};

const buildFormSnapshot = (): string =>
  JSON.stringify({
    title: formData.value.title.trim(),
    category: formData.value.category,
    content: formData.value.content,
    filesSignature: getFilesSignature(formData.value.files),
  });

const { hasUnsavedChanges, captureInitial } = useFormUnsavedCheck(buildFormSnapshot, isEditMode);

const navigateToPublicMessageList = () => {
  router.push("/public-message-management");
};

const handleSidebarItemSelect = (itemName: string) => {
  // Handle sidebar item selection
};

const handleGoBack = () => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true;
    return;
  }
  router.back();
};

const handleCancelEdit = () => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true;
    return;
  }
  navigateToPublicMessageList();
};

const handleExitWithoutSaving = () => {
  showUnsavedChangesModal.value = false;
  navigateToPublicMessageList();
};

const handleSaveFromUnsavedModal = () => {
  showUnsavedChangesModal.value = false;
  handlePublish();
};

const showUploadWarningModal = ref(false);
const uploadWarningMessage = ref("");

const handleFileError = (payload: { type: "size" | "format"; maxSize?: number }) => {
  if (payload.type === "size") {
    uploadWarningMessage.value = `檔案大小需限 ${payload.maxSize ?? 10}MB，請重新確認`;
  } else {
    uploadWarningMessage.value = "檔案格式不符，請重新確認";
  }
  showUploadWarningModal.value = true;
};

const handleSaveDraft = () => {
  // TODO: Implement save draft functionality
  console.log("暫存", formData.value);
  navigateToPublicMessageList();
};

const handlePublish = () => {
  // TODO: Implement publish functionality
  console.log("發布", formData.value);
  router.push({
    path: "/public-message-management",
    query: {
      toast: "success",
      msg: isEditMode.value ? "儲存成功" : "新增成功",
    },
  });
};

const categoryValueMap: Record<string, string> = {
  最新消息: "latest-news",
  新聞快訊: "news-flash",
  會議公告: "meeting-announcement",
};

onMounted(() => {
  if (!isEditMode.value) return;
  if (route.query.title) {
    formData.value.title = (route.query.title as string) ?? "";
  }
  if (route.query.category) {
    const label = route.query.category as string;
    formData.value.category = categoryValueMap[label] ?? label;
  }
  if (route.query.content) {
    formData.value.content = (route.query.content as string) ?? "";
  }
  captureInitial();
});
</script>
