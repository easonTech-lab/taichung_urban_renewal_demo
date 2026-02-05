<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex w-full max-w-[1112px] flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:mr-auto sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <div class="flex items-center gap-4">
          <button type="button" class="flex items-center justify-center p-0 text-gray-900" @click="handleGoBack" aria-label="返回上一頁">
            <Icon name="arrowLeftOutline" :size="24" aria-hidden="true" />
          </button>
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h1>
        </div>
      </div>
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ formTitle }}</h2>
        </div>
        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap gap-4">
            <InputDropdown
              label="案件類別"
              :button-text="selectedCategory"
              placeholder="請選擇案件類別"
              :items="categoryOptions"
              variant="outline"
              container-class="w-full max-w-[364px]"
              @item-click="handleCategoryChange"
            />
            <Input v-model="yearValue" label="填報年度" placeholder="請輸入年度" type="text" size="lg" container-class="w-full max-w-[364px]" />
          </div>
          <Input v-model="annualCount" label="年件數" placeholder="請輸入年度件數" type="text" size="lg" container-class="w-full max-w-[364px]" />
        </div>
      </div>
      <div class="flex items-center justify-center gap-4">
        <ButtonCTA variant="outline" size="xl" @click="handleGoBack"> 取消 </ButtonCTA>
        <ButtonCTA variant="primary" size="xl" :disabled="isSaveDisabled" @click="handleSave"> 儲存 </ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import type { CaseStatisticsFormData } from "@/types/backend/homepageMaintenance/caseStatistics.d";

const router = useRouter();
const route = useRoute();

const isEditMode = computed(() => route.name === "case-statistics-edit");
const formTitle = computed(() => (isEditMode.value ? "編輯案件件數" : "新增年度"));

const breadcrumbItems = [
  { label: "首頁", to: "/" },
  { label: "首頁維護", to: "/case-statistics" },
  { label: "案件統計維護" },
];

// Form State
const annualCount = ref<CaseStatisticsFormData["annualCount"]>("");
const yearValue = ref<CaseStatisticsFormData["year"]>("");
const selectedCategory = ref<CaseStatisticsFormData["category"]>("");
const categoryOptions: InputDropdownItem[] = [
  { label: "都更案件", value: "都更案件" },
  { label: "危老案件", value: "危老案件" },
];

const isSaveDisabled = computed(() => {
  return !selectedCategory.value || !yearValue.value.trim() || !annualCount.value.trim();
});

// Case Data (從路由參數或查詢參數獲取)
const caseData = ref({
  caseCategory: "都更案件",
  year: "114",
  annualCount: "103",
});

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleGoBack = () => {
  router.back();
};

const handleSave = () => {
  // TODO: Implement save logic
  console.log("Saving:", {
    category: selectedCategory.value,
    reportingYear: yearValue.value,
    annualCount: annualCount.value,
  });
  // After saving, navigate back
  router.push("/case-statistics");
};

const handleCategoryChange = (item: InputDropdownItem) => {
  selectedCategory.value = item.label;
};

// 初始化數據
onMounted(() => {
  if (isEditMode.value) {
    // 從路由查詢參數獲取數據（如果有的話）
    if (route.query.category) {
      caseData.value.caseCategory = route.query.category as string;
    }
    if (route.query.year) {
      caseData.value.year = route.query.year as string;
    }
    if (route.query.annualCount) {
      caseData.value.annualCount = route.query.annualCount as string;
      annualCount.value = route.query.annualCount as string;
    } else {
      annualCount.value = caseData.value.annualCount;
    }
    selectedCategory.value = caseData.value.caseCategory;
    yearValue.value = caseData.value.year;
  } else {
    selectedCategory.value = "";
    yearValue.value = "";
    annualCount.value = "";
  }
});
</script>
