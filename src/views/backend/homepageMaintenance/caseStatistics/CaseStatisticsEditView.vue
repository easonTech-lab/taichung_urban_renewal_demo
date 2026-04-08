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
        <ButtonCTA :variant="canSave ? 'primary' : 'gray'" size="xl" :disabled="!canSave" @click="handleSave"> 儲存 </ButtonCTA>
      </div>
    </div>
  </div>
  <AlertModal v-model="showDuplicateModal" message="該年度的案件類別已存在，請重新確認內容" />
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import AlertModal from "@/components/molecules/AlertModal.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import { apiGetCaseStatisticById, apiGetCaseStatisticsList, apiPostCaseStatistic, apiPutCaseStatistic } from "@/api/backend/homepageMaintenance/caseStatisticsService";
import { getCaseStatisticsEditBreadcrumbItems } from "@/utils/breadcrumbs";
import type { CaseStatisticApiItem } from "@/types/api/backend/homepageMaintenance/caseStatisticsService";
import type { CaseStatisticsFormData } from "@/types/backend/homepageMaintenance/caseStatistics.d";
const route = useRoute();
const router = useRouter();
const annualCount = ref<CaseStatisticsFormData["annualCount"]>("");
const yearValue = ref<CaseStatisticsFormData["year"]>("");
const selectedCategory = ref<CaseStatisticsFormData["category"]>("");
const showDuplicateModal = ref(false);
const editingStatistics = ref<{ annualCount: number; caseCategory: string; year: string } | null>(null);
const statisticsId = computed(() => (typeof route.params.id === "string" ? route.params.id : ""));
const categoryOptions: InputDropdownItem[] = [
  { label: "都更案件", value: "都更案件" },
  { label: "危老案件", value: "危老案件" },
];
const breadcrumbItems = getCaseStatisticsEditBreadcrumbItems();
const isEditMode = computed(() => route.name === "case-statistics-edit");
const formTitle = computed(() => (isEditMode.value ? "編輯案件件數" : "新增年度"));
const isSaveDisabled = computed(() => {
  return !selectedCategory.value || !yearValue.value.trim() || !annualCount.value.trim();
});
const canSave = computed(() => !isSaveDisabled.value && statisticsFormUnsavedCheck.hasUnsavedChanges.value);
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
const buildFormSnapshot = () =>
  JSON.stringify({
    category: selectedCategory.value.trim(),
    year: yearValue.value.trim(),
    annualCount: annualCount.value.trim(),
  });
const handleGoBack = () => {
  router.back();
};
const selectedType = computed(() => (selectedCategory.value === "都更案件" ? "URBAN_RENEWAL" : "DANGEROUS_OLD"));
const handleSave = async () => {
  const listResponse = await apiGetCaseStatisticsList();
  const hasDuplicate = listResponse.data.data.some((item) => {
    if (String(item.year ?? "") !== yearValue.value.trim()) return false;
    if (item.type !== selectedType.value) return false;
    if (isEditMode.value && String(item.id) === statisticsId.value) return false;
    return true;
  });

  if (hasDuplicate) {
    showDuplicateModal.value = true;
    return;
  }

  if (statisticsId.value) {
    await apiPutCaseStatistic({
      id: statisticsId.value,
      year: Number(yearValue.value),
      type: selectedType.value,
      caseCount: Number(annualCount.value),
    });
  } else {
    await apiPostCaseStatistic({
      year: Number(yearValue.value),
      type: selectedType.value,
      caseCount: Number(annualCount.value),
    });
  }
  router.push({
    path: "/case-statistics",
    query: {
      toast: "success",
      msg: isEditMode.value ? "儲存成功" : "新增成功",
    },
  });
  statisticsFormUnsavedCheck.captureInitial();
};
const handleCategoryChange = (item: InputDropdownItem) => {
  selectedCategory.value = item.label;
};
const statisticsFormUnsavedCheck = useFormUnsavedCheck(buildFormSnapshot);

const normalizeCaseStatistic = (item: CaseStatisticApiItem) => ({
  id: String(item.id),
  year: String(item.year ?? ""),
  caseCategory: item.type === "URBAN_RENEWAL" ? "都更案件" : "危老案件",
  annualCount: item.caseCount ?? 0,
});

onMounted(async () => {
  if (isEditMode.value) {
    const response = await apiGetCaseStatisticById(statisticsId.value);
    const item = response.data.data.find((statisticItem: { id: string | number }) => String(statisticItem.id) === statisticsId.value);
    editingStatistics.value = item ? normalizeCaseStatistic(item) : null;
    if (!editingStatistics.value) {
      router.replace("/case-statistics");
      return;
    }
    annualCount.value = editingStatistics.value.annualCount.toString();
    selectedCategory.value = editingStatistics.value.caseCategory;
    yearValue.value = editingStatistics.value.year;
  } else {
    selectedCategory.value = "";
    yearValue.value = "";
    annualCount.value = "";
  }
  statisticsFormUnsavedCheck.captureInitial();
});
</script>
