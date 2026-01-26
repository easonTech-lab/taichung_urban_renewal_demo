<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center gap-4">
          <ButtonCTA variant="none" icon-only left-icon="arrowLeftOutline" @click="handleGoBack" aria-label="返回上一頁" />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h1>
        </div>
      </div>

      <!-- Form Card -->
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <!-- Section Title -->
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">新增下載內容</h2>
        </div>

        <!-- Form Fields -->
        <div class="flex flex-col gap-6">
          <!-- Title Input -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <label class="text-base font-medium text-gray-900">標題(限50字)</label>
              <span class="text-red-500">*</span>
            </div>
            <Input v-model="formData.title" placeholder="填寫標題" size="lg" :maxlength="50" />
          </div>

          <!-- Category Selection -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <label class="text-base font-medium text-gray-900">案件類別</label>
              <span class="text-red-500">*</span>
            </div>
            <div class="flex flex-wrap items-center gap-5">
              <Radio v-for="category in categoryOptions" :key="category.value" :model-value="formData.category"
                :value="category.value" :label="category.label" name="category"
                container-class="flex items-center gap-2" label-class="text-sm font-medium text-gray-900"
                @update:model-value="(value) => (formData.category = value as string)" />
            </div>
          </div>

          <!-- Text Editor -->
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium text-gray-900">文字(限200字)</label>
            <RichTextEditor v-model="formData.text" placeholder="文字輸入" />
          </div>

          <!-- File Upload -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <label class="text-base font-medium text-gray-900">檔案上傳</label>
              <span class="text-red-500">*</span>
            </div>
            <FileUpload :max-size="10" @file-selected="handleFileSelected" @file-error="handleFileError" />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-4 justify-center">
        <ButtonCTA variant="outline" size="l" @click="handleSaveDraft">暫存</ButtonCTA>
        <ButtonCTA variant="gray" size="l" @click="handlePublish">發布</ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import RichTextEditor from "@/components/atoms/RichTextEditor.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const router = useRouter();

interface FormData {
  title: string;
  category: string;
  text: string;
  file: File | null;
}

const formData = ref<FormData>({
  title: "",
  category: "",
  text: "",
  file: null,
});

const categoryOptions = [
  { label: "都市更新類", value: "urban-renewal" },
  { label: "危老類", value: "dangerous-old" },
  { label: "老舊街區", value: "old-district" },
  { label: "整建維護", value: "renovation-maintenance" },
];

const handleSidebarItemSelect = (itemName: string) => {
  // Handle sidebar item selection
};

const handleGoBack = () => {
  router.back();
};

const handleFileSelected = (files: File[]) => {
  if (files.length > 0) {
    formData.value.file = files[0];
  }
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
  console.log("發布", formData.value);
  router.push("/downloads-management");
};
</script>
