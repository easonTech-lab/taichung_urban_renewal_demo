<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">
          {{ isAdmin ? "危老重建案件管理" : "危老重建案件" }}
        </h1>
      </div>
      <div class="rounded-lg bg-white px-6 py-6 shadow-sm">
        <div class="mb-6 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3">
                <div class="h-7 w-1 rounded bg-primary-600"></div>
                <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ isAdmin ? "案件列表" : "危老重建案件" }}</h2>
              </div>
            </div>
            <ButtonDropdown
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
          <div class="flex items-center gap-4">
            <div class="w-40">
              <Dropdown :button-text="selectedStage" placeholder="全部案件階段" :items="stageOptions" @item-click="handleStageChange" />
            </div>
            <div class="w-40">
              <Dropdown :button-text="selectedStatus" placeholder="全部案件狀態" :items="statusOptions" @item-click="handleStatusChange" />
            </div>
          </div>
        </div>
        <div class="rounded-lg border border-gray-300 bg-white">
          <Empty v-if="filteredCases.length === 0" type="case-management" @button-click="handleEmptyStateAddCase" />
          <Table v-else :columns="tableColumns" :rows="paginatedCases" :pagination="pagination" @page-change="handlePageChange">
            <template #cell-caseStatus="{ row }">
              <Badge :variant="getStatusVariant(row.caseStatus)" :text="row.caseStatus" />
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Badge from "@/components/atoms/Badge.vue";
import Empty from "@/components/atoms/Empty.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import ButtonDropdown, { type ButtonDropdownItem } from "@/components/atoms/ButtonDropdown.vue";
import type { CaseItem } from "@/types/backend/caseManagement/dangerous/caseManagementDangerous.d";

const route = useRoute();

// 判斷是否為管理員模式（根據路由名稱）
const isAdmin = computed(() => route.name === "case-management-dangerous-admin" || route.path.includes("-admin"));

// Filter Options
const stageOptions: DropdownItem[] = [{ label: "全部案件階段" }, { label: "專案小組" }, { label: "其他階段" }];

const statusOptions: DropdownItem[] = [{ label: "全部案件狀態" }, { label: "進行中" }, { label: "已中斷" }, { label: "已完成" }];

// Add Case Options - 危老重建案件專用
const addCaseOptions: ButtonDropdownItem[] = [
  { label: "申請審議(一般案件)", value: "general-case" },
  { label: "第一次變更", value: "first-amendment" },
  { label: "第二次變更", value: "second-amendment" },
  { label: "申請審議(簡化案件)", value: "simplified-case" },
];

// State
const selectedStage = ref<string>("");
const selectedStatus = ref<string>("");
const selectedAddCaseIndex = ref<number | undefined>(undefined);
const totalCases = ref<number>(1000); // 管理員顯示的總案件數

// Mock Data - 危老重建案件
const allCases: CaseItem[] = [
  {
    caseNumber: "111-1-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
  {
    caseNumber: "111-2-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
  {
    caseNumber: "111-3-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "已中斷",
  },
  {
    caseNumber: "111-4-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "已完成",
  },
  {
    caseNumber: "111-5-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
  {
    caseNumber: "111-6-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
  {
    caseNumber: "111-7-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
  {
    caseNumber: "111-8-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
  {
    caseNumber: "111-9-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
  {
    caseNumber: "111-10-1",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    caseCategory: "危老重建",
    caseStage: "專案小組",
    caseStatus: "進行中",
  },
];

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "caseNumber",
    label: "案件編號",
    headerClass: "w-[196px]",
    cellClass: "w-[196px] text-base text-gray-900",
  },
  {
    key: "caseName",
    label: "案件名稱",
    headerClass: "w-[375px]",
    cellClass: "w-[375px] text-base text-gray-900",
  },
  {
    key: "caseCategory",
    label: "案件類別",
    headerClass: "w-[140px]",
    cellClass: "w-[140px] text-base text-gray-500",
  },
  {
    key: "caseStage",
    label: "案件階段",
    headerClass: "w-[160px]",
    cellClass: "w-[160px] text-base text-gray-500",
  },
  {
    key: "caseStatus",
    label: "案件狀態",
  },
];

// Filtered Cases
const filteredCases = computed(() => {
  let cases = [...allCases];

  if (selectedStage.value && selectedStage.value !== "全部案件階段") {
    cases = cases.filter((item) => item.caseStage === selectedStage.value);
  }

  if (selectedStatus.value && selectedStatus.value !== "全部案件狀態") {
    cases = cases.filter((item) => item.caseStatus === selectedStatus.value);
  }

  return cases;
});

const { paginatedRows: paginatedCases, pagination, handlePageChange, resetPage } = useTablePagination({
  rows: filteredCases,
  pageSize: 10,
  total: computed(() => (isAdmin.value ? totalCases.value : filteredCases.value.length)),
});

// Status Variant Mapping
const getStatusVariant = (status: string): "primary" | "success" | "danger" => {
  const mapping: Record<string, "primary" | "success" | "danger"> = {
    進行中: "primary",
    已完成: "success",
    已中斷: "danger",
  };
  return mapping[status] || "primary";
};

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleStageChange = (item: DropdownItem) => {
  selectedStage.value = item.label;
  resetPage();
};

const handleStatusChange = (item: DropdownItem) => {
  selectedStatus.value = item.label;
  resetPage();
};

const handleAddCaseOption = (item: ButtonDropdownItem, index: number) => {
  selectedAddCaseIndex.value = index;
  console.log("Add case option selected:", item.value, item.label);
  // TODO: Implement add case logic based on selected option
};

const handleEmptyStateAddCase = () => {
  // Open the dropdown when clicking the empty state button
  // This will be handled by the ButtonDropdown component itself
  console.log("Empty state add case clicked");
};
</script>
