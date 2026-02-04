<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center gap-4">
          <ButtonCTA variant="none" icon-only left-icon="arrowLeftOutline" @click="handleGoBack" aria-label="返回上一頁" />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h1>
        </div>
      </div>
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ isEditMode ? "編輯下載內容" : "新增下載內容" }}</h2>
        </div>
        <div class="flex flex-col gap-6">
          <Input v-model="formData.title" label="標題(限50字)" placeholder="填寫標題" size="lg" :maxlength="50" required />
          <RadioGroup label="案件類別" required>
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
          <RichTextEditor v-model="formData.text" label="文字(限200字)" placeholder="文字輸入" :maxlength="200" />
          <FileUpload v-model="formData.files" label="檔案上傳" :max-size="10" multiple required @file-error="handleFileError" />
        </div>
      </div>
      <div class="flex items-center justify-center gap-4">
        <ButtonCTA variant="outline" size="l" @click="handleSaveDraft">{{ isEditMode ? "取消" : "暫存" }}</ButtonCTA>
        <ButtonCTA variant="primary" size="l" :disabled="isPublishDisabled" @click="handlePublish">發布</ButtonCTA>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import RichTextEditor from "@/components/atoms/RichTextEditor.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import type { DownloadFormData } from "@/types/backend/homepageMaintenance/downloadsManagement.d";

const router = useRouter();
const route = useRoute();

const isEditMode = computed(() => route.query.edit === "true");

const formData = ref<DownloadFormData>({
  title: "",
  category: "",
  text: "",
  files: [],
});

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

const isPublishDisabled = computed(() => {
  if (!formData.value.title.trim()) return true;
  if (!formData.value.category) return true;
  return formData.value.files.length === 0;
});

const handleSidebarItemSelect = (itemName: string) => {
  // Handle sidebar item selection
};

const handleGoBack = () => {
  router.back();
};

const handleFileError = (error: string) => {
  console.error("File upload error:", error);
  // TODO: Show error message to user
};

const handleSaveDraft = () => {
  // TODO: Implement save draft functionality
  console.log("暫存", formData.value);
  router.push("/downloads-management");
};

const handlePublish = () => {
  // TODO: Implement publish functionality
  const isEdit = isEditMode.value;
  console.log(isEdit ? "儲存" : "發布", formData.value);
  router.push({
    path: "/downloads-management",
    query: {
      toast: "success",
      msg: isEdit ? "儲存成功" : "新增成功",
    },
  });
};

onMounted(() => {
  if (!isEditMode.value) return;
  if (route.query.title) {
    formData.value.title = route.query.title as string;
  }
  if (route.query.category) {
    const categoryLabel = route.query.category as string;
    formData.value.category = categoryValueMap[categoryLabel] || categoryLabel;
  }
});
</script>
