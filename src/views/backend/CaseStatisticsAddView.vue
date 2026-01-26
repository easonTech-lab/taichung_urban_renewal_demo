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
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前ㄧ頁</h1>
        </div>
      </div>

      <!-- Form Card -->
      <div class="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-sm">
        <!-- Section Title -->
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">新增年度</h2>
        </div>

        <!-- Form Fields -->
        <div class="flex flex-col gap-4">
          <!-- Case Category and Reporting Year Row -->
          <div class="flex gap-4">
            <!-- Case Category -->
            <div class="flex w-[364px] flex-col gap-2">
              <div class="flex items-center gap-2">
                <label class="text-base font-medium text-gray-900">案件類別</label>
                <span class="text-red-500">*</span>
              </div>
              <InputDropdown :button-text="selectedCategory" placeholder="請選擇案件類別" :items="categoryOptions"
                variant="outline" @item-click="handleCategoryChange" />
            </div>

            <!-- Reporting Year -->
            <div class="flex w-[364px] flex-col gap-2">
              <div class="flex items-center gap-2">
                <label class="text-base font-medium text-gray-900">填報年度</label>
                <span class="text-red-500">*</span>
              </div>
              <div class="w-full">
                <Input v-model="reportingYear" placeholder="請輸入填報年度" type="text" size="lg" />
              </div>
            </div>
          </div>

          <!-- Annual Count -->
          <div class="flex w-[364px] flex-col gap-2">
            <div class="flex items-center gap-2">
              <label class="text-base font-medium text-gray-900">年件數</label>
              <span class="text-red-500">*</span>
            </div>
            <div class="w-full">
              <Input v-model="annualCount" placeholder="請輸入年度件數" type="text" size="lg" />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-center gap-4">
        <ButtonCTA variant="outline" size="xl" @click="handleCancel">
          取消
        </ButtonCTA>
        <ButtonCTA variant="primary" size="xl" @click="handleSave">
          儲存
        </ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import Input from "@/components/atoms/Input.vue";
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const router = useRouter();

// Form State
const selectedCategory = ref<string>("");
const reportingYear = ref<string>("");
const annualCount = ref<string>("");

// Category Options
const categoryOptions: InputDropdownItem[] = [
  { label: "都更案件" },
  { label: "危老案件" },
];

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleGoBack = () => {
  router.back();
};

const handleCategoryChange = (item: InputDropdownItem) => {
  selectedCategory.value = item.label;
};

const handleCancel = () => {
  router.back();
};

const handleSave = () => {
  // TODO: Implement save logic
  console.log("Saving:", {
    category: selectedCategory.value,
    reportingYear: reportingYear.value,
    annualCount: annualCount.value,
  });
  // After saving, navigate back
  router.push("/case-statistics");
};
</script>
