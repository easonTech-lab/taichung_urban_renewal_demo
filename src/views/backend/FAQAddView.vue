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
          <button type="button" class="flex h-6 w-6 items-center justify-center" @click="handleGoBack"
            aria-label="返回上一頁">
            <Icon name="arrowLeftOutline" class="h-6 w-6 text-gray-900" />
          </button>
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前ㄧ頁</h1>
        </div>
      </div>

      <!-- Form Card -->
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <!-- Section Title -->
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">新增問題內容</h2>
        </div>

        <!-- Form Fields -->
        <div class="flex flex-col gap-6">
          <!-- Title Input -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <label class="text-base font-medium text-gray-900">標題(限50字)</label>
              <span class="text-red-500">*</span>
            </div>
            <Input v-model="formData.title" placeholder="我家的建築是幾年的？該走危老還都更？" size="lg" :maxlength="50" />
          </div>

          <!-- Category Selection -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <label class="text-base font-medium text-gray-900">類別</label>
              <span class="text-red-500">*</span>
            </div>
            <div class="flex flex-wrap items-center gap-5">
              <Radio v-for="category in categoryOptions" :key="category.value" :model-value="formData.category"
                :value="category.value" :label="category.label" name="category"
                container-class="flex items-center gap-2" label-class="text-sm font-medium text-gray-900"
                @update:model-value="(value) => (formData.category = value as string)" />
            </div>
            <div class="flex items-start">
              <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddCategory">
                新增類別
              </ButtonCTA>
            </div>
          </div>

          <!-- Answer Editor -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <label class="text-base font-medium text-gray-900">回答(限200字)</label>
              <span class="text-red-500">*</span>
            </div>
            <RichTextEditor v-model="formData.answer" placeholder="請輸入回答內容..." />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-4 justify-center">
        <ButtonCTA variant="outline" size="l" @click="handleSaveDraft">暫存</ButtonCTA>
        <ButtonCTA variant="primary" size="l" @click="handlePublish">發布</ButtonCTA>
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
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Icon from "@/components/atoms/Icon.vue";

const router = useRouter();

interface FormData {
  title: string;
  category: string;
  answer: string;
}

const formData = ref<FormData>({
  title: "",
  category: "",
  answer: "",
});

const categoryOptions = [
  { label: "我適合哪種重建方式？", value: "reconstruction-type" },
  { label: "要怎麼申請？需要準備什麼？", value: "application-process" },
  { label: "有什麼補助或政府協助？", value: "subsidy-assistance" },
];

const handleSidebarItemSelect = (itemName: string) => {
  // Handle sidebar item selection
};

const handleGoBack = () => {
  router.back();
};

const handleAddCategory = () => {
  // TODO: Implement add category functionality
  const newCategory = window.prompt("請輸入新類別名稱：");
  if (newCategory) {
    // Add new category to options
    categoryOptions.push({
      label: newCategory,
      value: `custom-${Date.now()}`,
    });
  }
};

const handleSaveDraft = () => {
  // TODO: Implement save draft functionality
  console.log("暫存", formData.value);
  // Navigate back to FAQ management page
  router.push("/faq-management");
};

const handlePublish = () => {
  // TODO: Implement publish functionality
  console.log("發布", formData.value);
  // Navigate back to FAQ management page
  router.push("/faq-management");
};

// Get plain text length from HTML
const getPlainTextLength = (html: string): number => {
  if (!html) return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.length || 0;
};
</script>
