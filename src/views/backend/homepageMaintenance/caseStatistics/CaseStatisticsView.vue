<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">案件統計維護</h1>
      </div>
      <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">歷年案件統計</h2>
          </div>
          <ButtonCTA v-if="isDataLoaded && hasAnyStatistics" variant="outline" size="sm" left-icon="plus" @click="handleAddYear"> 新增年度 </ButtonCTA>
        </div>
        <div v-if="isDataLoaded && hasAnyStatistics" class="flex flex-col gap-6">
          <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
          <div class="relative z-10 flex flex-wrap items-center gap-3 pb-2">
            <div class="flex items-center gap-2">
              <Dropdown class="w-[168px]" :button-text="selectedStartYear" placeholder="選擇年度區間" :items="startYearOptions" @item-click="handleStartYearChange" />
              <span class="text-xl font-normal leading-5 text-gray-500">-</span>
              <Dropdown class="w-[168px]" :button-text="selectedEndYear" placeholder="選擇年度區間" :items="endYearOptions" @item-click="handleEndYearChange" />
            </div>
            <div class="flex items-center gap-3">
              <ButtonCTA variant="primary" class="h-10 !min-w-0 px-5 py-2.5" @click="handleSearch">搜尋</ButtonCTA>
              <button
                v-if="showResetButton"
                type="button"
                class="text-sm font-medium leading-6 text-primary-700 hover:text-primary-800"
                @click="handleResetFilters"
              >
                重設
              </button>
            </div>
          </div>
        </div>
        <div v-if="isDataLoaded && hasAnyStatistics" class="overflow-x-auto">
          <div class="min-w-[460px] rounded-lg border border-gray-300 bg-white">
          <Table
            v-if="filteredStatistics.length > 0"
            :columns="tableColumns"
            :rows="paginationState.paginatedRows"
            :pagination="paginationState.pagination"
            @page-change="paginationState.handlePageChange"
          >
            <template #cell-growthRate="{ row }">
              <Badge :variant="getGrowthRateVariant(row.growthRate)" :text="row.growthRate" />
            </template>
            <template #cell-action="{ row }">
              <div class="flex items-center gap-2">
                <ButtonCTA variant="text" size="sm" icon-only left-icon="editOutline" @click.stop="handleEdit(row)" aria-label="編輯" />
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="刪除" />
              </div>
            </template>
          </Table>
          <Empty v-else type="search" :show-button="false" class="py-12" />
          </div>
        </div>
        <div v-else-if="isDataLoaded" class="rounded-lg border border-gray-300 bg-white">
          <Empty type="case-management" message="尚未新增統計" button-text="新增統計" @button-click="handleAddYear" />
        </div>
      </div>
    </div>
    <ConfirmDeleteModal v-model="showDeleteModal" message="確認刪除此項目" description="內容將完全刪除無法復原" @confirm="handleConfirmDelete" @cancel="handleCloseDeleteModal" />
    <div class="fixed bottom-6 z-[90]" :style="deleteToastStyle">
      <Toast v-model="showDeleteToast" :message="toastMessage" :show-actions="false" :show-close="false" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Tabs from "@/components/atoms/Tabs.vue";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import Toast from "@/components/atoms/Toast.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Empty from "@/components/atoms/Empty.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import { fetchCaseStatisticsList } from "@/services/backend/homepageMaintenance/caseStatisticsService";
import type { CaseStatisticsItem } from "@/types/backend/homepageMaintenance/caseStatistics.d";
const route = useRoute();
const router = useRouter();
const activeTab = ref<number>(0);
const isDataLoaded = ref(false);
const selectedStartYear = ref<string>("");
const selectedEndYear = ref<string>("");
const appliedStartYear = ref<string>("");
const appliedEndYear = ref<string>("");
const pageSize = ref<number>(10);
const showDeleteModal = ref(false);
const pendingDeleteItem = ref<CaseStatisticsItem | null>(null);
const showDeleteToast = ref(false);
const toastMessage = ref("刪除成功");
const currentRocYear = new Date().getFullYear() - 1911;
const deleteToastStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};
const tabItems = [
  { label: "全部", value: "all" },
  { label: "都更案件", value: "urban-renewal" },
  { label: "危老案件", value: "dangerous-building" },
];
const yearOptions: DropdownItem[] = Array.from({ length: 20 }, (_, i) => {
  const year = currentRocYear - 19 + i;
  return { label: year.toString(), value: year.toString() };
});
// Mock Data
const allStatistics = ref<CaseStatisticsItem[]>([]);

const normalizeCaseStatistic = (item: Record<string, any>): CaseStatisticsItem => ({
  id: String(item.id),
  index: item.index ?? 0,
  year: String(item.year ?? ""),
  caseCategory: item.caseCategory ?? item.typeLabel ?? "",
  annualCount: item.annualCount ?? item.caseCount ?? 0,
  cumulativeCount: item.cumulativeCount ?? item.accumulatedCount ?? 0,
  growthRate: item.growthRate ?? item.growthStatus?.description ?? "持平",
});
// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    width: "6%",
  },
  {
    key: "year",
    label: "年度",
    width: "10%",
    sortable: true,
  },
  {
    key: "caseCategory",
    label: "案件類別",
    width: "20%",
  },
  {
    key: "annualCount",
    label: "年件數",
    width: "16%",
  },
  {
    key: "cumulativeCount",
    label: "歷年已累計件數",
    width: "16%",
  },
  {
    key: "growthRate",
    label: "年成長率",
    width: "16%",
  },
  {
    key: "action",
    label: "動作",
    width: "16%",
  },
];
const filteredStatistics = computed(() => {
  let stats = [...allStatistics.value];
  // Filter by tab
  if (activeTab.value === 1) {
    // 都更案件
    stats = stats.filter((item) => item.caseCategory === "都更案件");
  } else if (activeTab.value === 2) {
    // 危老案件
    stats = stats.filter((item) => item.caseCategory === "危老案件");
  }
  // Filter by year range
  if (appliedStartYear.value) {
    stats = stats.filter((item) => parseInt(item.year) >= parseInt(appliedStartYear.value));
  }
  if (appliedEndYear.value) {
    stats = stats.filter((item) => parseInt(item.year) <= parseInt(appliedEndYear.value));
  }
  return stats;
});
const paginationState = reactive(useTablePagination({
  rows: filteredStatistics,
  pageSize,
}));
const hasAnyStatistics = computed(() => allStatistics.value.length > 0);
const startYearOptions = computed(() => {
  if (!selectedEndYear.value) return yearOptions;
  const endYear = parseInt(selectedEndYear.value, 10);
  return yearOptions.filter((item) => parseInt(item.value, 10) <= endYear);
});
const endYearOptions = computed(() => {
  if (!selectedStartYear.value) return yearOptions;
  const startYear = parseInt(selectedStartYear.value, 10);
  return yearOptions.filter((item) => parseInt(item.value, 10) >= startYear);
});
const showResetButton = computed(() => {
  return Boolean(selectedStartYear.value || selectedEndYear.value);
});
watch(
  () => route.query.toast,
  () => {
    maybeShowReturnToast();
  }
);
// Growth Rate Variant Mapping
const getGrowthRateVariant = (rate: string): "primary" | "success" | "danger" => {
  const mapping: Record<string, "primary" | "success" | "danger"> = {
    成長: "success",
    降低: "danger",
    持平: "primary",
  };
  return mapping[rate] || "primary";
};
// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
const handleTabClick = (index: number) => {
  activeTab.value = index;
  paginationState.resetPage();
};
const handleStartYearChange = (item: DropdownItem) => {
  selectedStartYear.value = item.label;
  if (selectedEndYear.value && parseInt(selectedStartYear.value, 10) > parseInt(selectedEndYear.value, 10)) {
    selectedEndYear.value = selectedStartYear.value;
  }
};
const handleEndYearChange = (item: DropdownItem) => {
  selectedEndYear.value = item.label;
  if (selectedStartYear.value && parseInt(selectedStartYear.value, 10) > parseInt(selectedEndYear.value, 10)) {
    selectedStartYear.value = selectedEndYear.value;
  }
};
const handleSearch = () => {
  appliedStartYear.value = selectedStartYear.value;
  appliedEndYear.value = selectedEndYear.value;
  paginationState.resetPage();
};
const handleResetFilters = () => {
  selectedStartYear.value = "";
  selectedEndYear.value = "";
  appliedStartYear.value = "";
  appliedEndYear.value = "";
  paginationState.resetPage();
};
const loadCaseStatistics = async () => {
  const response = await fetchCaseStatisticsList();
  allStatistics.value = response.data.data.map(normalizeCaseStatistic);
  isDataLoaded.value = true;
};
const handleAddYear = () => {
  router.push("/case-statistics/add");
};
const handleEdit = (row: Record<string, any>) => {
  const item = row as CaseStatisticsItem;
  router.push(`/case-statistics/edit/${item.id}`);
};
const handleDelete = (row: Record<string, any>) => {
  const item = row as CaseStatisticsItem;
  pendingDeleteItem.value = item;
  showDeleteModal.value = true;
};
const handleCloseDeleteModal = () => {
  showDeleteModal.value = false;
  pendingDeleteItem.value = null;
};
const handleConfirmDelete = () => {
  if (!pendingDeleteItem.value) return;
  // TODO: Implement delete logic
  console.log("Deleting:", pendingDeleteItem.value);
  handleCloseDeleteModal();
  toastMessage.value = "刪除成功";
  showDeleteToast.value = true;
};
const maybeShowReturnToast = () => {
  const toastType = route.query.toast as string | undefined;
  if (toastType !== "success") return;
  const msg = (route.query.msg as string | undefined) || "新增成功";
  toastMessage.value = msg;
  showDeleteToast.value = true;
  router.replace({
    path: route.path,
    query: { ...route.query, toast: undefined, msg: undefined },
  });
};
onMounted(async () => {
  await loadCaseStatistics();
  maybeShowReturnToast();
});
</script>
