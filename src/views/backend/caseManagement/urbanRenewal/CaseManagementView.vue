<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">{{ isAdmin ? "都市更新案件管理" : "都市更新案件" }}</h1>
      </div>
      <div class="rounded-lg bg-white px-6 py-6 shadow-sm">
        <div class="mb-6 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3">
                <div class="h-7 w-1 rounded bg-primary-600"></div>
                <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ hasAnyCases ? (isAdmin ? "案件列表" : "都市更新案件列表") : "都市更新案件" }}</h2>
              </div>
              <p v-if="isAdmin && hasAnyCases" class="pl-4 text-xl font-normal leading-5 text-gray-400">都市更新案件列表</p>
            </div>
            <ButtonDropdown
              v-if="hasAnyCases"
              button-text="新增案件"
              :items="addCaseOptions"
              button-variant="outline"
              button-size="sm"
              left-icon="plus"
              :selected-index="selectedAddCaseIndex"
              menu-width="w-[412px]"
              :showRightIcon="false"
              align="right"
              @item-click="handleAddCaseOption"
            />
          </div>
          <div v-if="hasAnyCases" class="flex items-center gap-4">
            <div class="w-[160px]">
              <CheckboxDropdown
                v-model="selectedStages"
                :button-text="selectedStageText"
                placeholder="全部案件階段"
                :items="stageOptions"
                :show-select-all="true"
                @change="handleStageChange"
              />
            </div>
            <div class="w-[160px]">
              <Dropdown :button-text="selectedStatus" placeholder="全部案件狀態" :items="statusOptions" @item-click="handleStatusChange" />
            </div>
          </div>
        </div>
        <div class="rounded-lg bg-white">
          <Empty v-if="!hasAnyCases" type="case-management" message="尚無都市更新案件" @button-click="handleEmptyStateAddCase" />
          <Empty v-else-if="filteredCases.length === 0" type="search" :show-button="false" class="py-12" />
          <Table
            v-else
            borderless
            :columns="tableColumns"
            :rows="paginationState.paginatedRows"
            :pagination="paginationState.pagination"
            :row-clickable="true"
            @page-change="paginationState.handlePageChange"
            @row-click="handleRowClick"
          >
            <template #cell-caseName="{ row }">
              <div class="min-w-0 whitespace-normal break-words leading-6">
                {{ row.caseName }}
              </div>
            </template>
            <template #cell-caseStatus="{ row }">
              <Badge :variant="getStatusVariant(row.caseStatus)" :text="row.caseStatus" />
            </template>
          </Table>
        </div>
      </div>
    </div>
    <div class="fixed bottom-6 left-1/2 z-[90] w-[min(900px,calc(100vw-2rem))] -translate-x-1/2">
      <Toast v-model="showDeleteToast" :message="toastMessage" :show-actions="false" :show-close="false" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Badge from "@/components/atoms/Badge.vue";
import Toast from "@/components/atoms/Toast.vue";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import ButtonDropdown, { type ButtonDropdownItem } from "@/components/atoms/ButtonDropdown.vue";
import CheckboxDropdown, { type CheckboxDropdownItem } from "@/components/atoms/CheckboxDropdown.vue";
import type { CaseItem } from "@/types/backend/caseManagement/urbanRenewal/caseManagement.d";
import { apiGetUrbanCasesList } from "@/api/backend/caseManagement/urbanCasesService";
import type { UrbanCaseApiItem } from "@/types/api/backend/caseManagement/urbanCasesService";
const router = useRouter();
const route = useRoute();
const pageSize = ref<number>(10);
const showDeleteToast = ref(false);
const toastMessage = ref("刪除成功");
const selectedStages = ref<(string | number)[]>([]);
const selectedStatus = ref<string>("");
const selectedAddCaseIndex = ref<number | undefined>(undefined);
const stageOptions: CheckboxDropdownItem[] = [
  { label: "案件申請", value: "案件申請" },
  { label: "公辦公聽會", value: "公辦公聽會" },
  { label: "都更幹事會", value: "都更幹事會" },
  { label: "專案小組", value: "專案小組" },
  { label: "都更大會", value: "都更大會" },
  { label: "最終核定", value: "最終核定" },
];
selectedStages.value = stageOptions.map((opt) => opt.value);
const statusOptions: DropdownItem[] = [{ label: "全部案件狀態" }, { label: "進行中" }, { label: "已中斷" }, { label: "已完成" }];
const addCaseOptions: ButtonDropdownItem[] = [
  { label: "申請審議(事業計畫)", value: "business-plan" },
  { label: "申請審議(權利變換)", value: "rights-exchange" },
  { label: "申請審議(整建維護)", value: "renovation-maintenance" },
  { label: "申請審議(事權併送)", value: "concurrent-submission" },
  { label: "變更案", value: "amendment" },
];
const allCases = ref<CaseItem[]>([]);
const tableColumns: TableColumn[] = [
  { key: "caseNumber", label: "案件編號", width: "16%" },
  { key: "caseName", label: "案件名稱", width: "40%" },
  { key: "caseCategory", label: "案件類別", width: "12%" },
  { key: "caseStage", label: "案件階段", width: "18%" },
  { key: "caseStatus", label: "案件狀態", width: "14%" },
];
const isAdmin = computed(() => route.name === "case-management-admin");
const hasAnyCases = computed(() => allCases.value.length > 0);
const filteredCases = computed(() => {
  if (selectedStages.value.length === 0) {
    return [];
  }
  return allCases.value.filter((item) => {
    const stageMatch = selectedStages.value.includes(item.caseStage);
    const statusMatch =
      selectedStatus.value === "" ||
      selectedStatus.value === "全部案件狀態" ||
      item.caseStatus === selectedStatus.value;
    return stageMatch && statusMatch;
  });
});
const selectedStageText = computed(() => {
  // 全不選
  if (selectedStages.value.length === 0) {
    return "未選案件階段";
  }
  // 全選
  if (selectedStages.value.length === stageOptions.length) {
    return "全部案件階段";
  }
  // 單選
  if (selectedStages.value.length === 1) {
    const selected = stageOptions.find((opt) => opt.value === selectedStages.value[0]);
    return selected?.label || "未選案件階段";
  }
  // 多選
  return `已選 ${selectedStages.value.length} 項`;
});
const paginationState = reactive(useTablePagination({
  rows: filteredCases,
  pageSize,
  slice: false,
}));
const getStatusVariant = (status: string): "primary" | "success" | "danger" => {
  const mapping: Record<string, "primary" | "success" | "danger"> = {
    進行中: "primary",
    已完成: "success",
    已中斷: "danger",
  };
  return mapping[status] || "primary";
}
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
}
const handleStageChange = (values: (string | number)[]) => {
  // 檢查傳入的值是否都在 stageOptions 中
  // 注意：CheckboxDropdown 組件在處理 "select-all" 時，會直接發送所有項目的值或空陣列，
  // 永遠不會發送 "select-all" 這個值，所以不需要過濾
  const validValues = values.filter((value) => {
    const isValid = stageOptions.some((opt) => opt.value === value);
    return isValid;
  });

  // 如果使用者清除所有勾選，設為空陣列（全不選）
  selectedStages.value = validValues;
  paginationState.resetPage();
}
const handleStatusChange = (item: DropdownItem) => {
  selectedStatus.value = item.label;
  paginationState.resetPage();
};
const handleAddCaseOption = (item: ButtonDropdownItem, index: number) => {
  selectedAddCaseIndex.value = index;
  router.push({
    path: "/case-management/add/business-plan",
    query: {
      caseType: "urban",
      addType: item.value,
    },
  });
};
const handleEmptyStateAddCase = () => {
  router.push({
    path: "/case-management/add/business-plan",
    query: {
      caseType: "urban",
      addType: "business-plan",
    },
  });
};

const normalizeUrbanCase = (item: UrbanCaseApiItem): CaseItem => ({
  caseNumber: String(item.id),
  caseName: item.caseName,
  caseCategory: "都市更新",
  caseStage: item.stage ?? "",
  caseStatus: item.status ?? "",
});

const loadUrbanCases = async () => {
  const response = await apiGetUrbanCasesList(0, 100);
  const items = response.data?.content ?? [];
  allCases.value = items.map(normalizeUrbanCase);
};

onMounted(async () => {
  await loadUrbanCases();
});
const handleRowClick = () => {
  // Navigate to case detail page with source route information
  router.push({
    path: "/case-detail",
    query: {
      from: route.path, // 傳遞來源路由路徑
    },
  });
};
const clearToastQuery = () => {
  const { toast, ...rest } = route.query as Record<string, any>;
  router.replace({ query: rest });
};
watch(
  () => route.query.toast,
  (toast) => {
    if (toast === "case-deleted") {
      toastMessage.value = "刪除成功";
      showDeleteToast.value = true;
      clearToastQuery();
    }
    if (toast === "draft-success") {
      toastMessage.value = "暫存成功";
      showDeleteToast.value = true;
      clearToastQuery();
    }
  },
  { immediate: true }
);
</script>
