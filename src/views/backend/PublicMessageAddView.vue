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
          <ButtonCTA variant="none" icon-only left-icon="arrowleft" @click="handleGoBack" aria-label="返回上一頁" />
          <h2 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h2>
        </div>
      </div>
      <!-- Form Card -->
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <!-- Section Title -->
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h1 class="text-2xl font-medium leading-6 text-gray-900">新增公開消息</h1>
        </div>
        <!-- Form Fields -->
        <div class="flex flex-col gap-6">
          <!-- Title Input -->
          <Input v-model="formData.title" label="標題(限50字)" placeholder="填寫標題" size="lg" :maxlength="50" required />
          <!-- Category Selection -->
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
          <!-- Content Editor -->
          <RichTextEditor v-model="formData.content" label="內容(限200字)" placeholder="文字輸入" required :maxlength="200" />
          <!-- File Upload -->
          <FileUpload v-model="formData.files" label="檔案上傳" :max-size="10" multiple required @file-error="handleFileError" />
        </div>
      </div>
      <!-- Action Buttons -->
      <div class="flex items-center justify-center gap-4">
        <ButtonCTA variant="outline" size="l" @click="handleSaveDraft">暫存</ButtonCTA>
        <ButtonCTA variant="gray" size="l" @click="handlePublish">發布</ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import RichTextEditor from "@/components/atoms/RichTextEditor.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
interface FormData {
  title: string;
  category: string;
  content: string;
  files: File[];
}

const router = useRouter();

const formData = ref<FormData>({
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
  router.push("/public-message-management");
};

const handlePublish = () => {
  // TODO: Implement publish functionality
  console.log("發布", formData.value);
  router.push("/public-message-management");
};
</script>
