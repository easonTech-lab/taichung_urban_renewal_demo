<template>
  <div class="flex min-h-screen flex-col bg-indigo-50">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <SidebarSection @item-select="handleSidebarItemSelect" />

      <!-- Main Content -->
      <div class="flex flex-1 flex-col gap-10 p-10">
        <!-- Breadcrumb and Title -->
        <div class="flex flex-col gap-6">
          <Breadcrumb />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">
            {{ isAdmin ? "危老重建案件管理" : "危老重建案件" }}
          </h1>
        </div>

        <!-- Case List Card -->
        <div class="rounded-lg bg-white px-6 py-6 shadow-sm">
          <!-- Header Section -->
          <div class="mb-6 flex flex-col gap-6">
            <!-- Title and Add Button -->
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <div class="h-7 w-1 rounded bg-primary-600"></div>
                  <h2 class="text-2xl font-medium leading-6 text-gray-900">
                    {{ isAdmin ? "案件列表" : "危老重建案件" }}
                  </h2>
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

            <!-- Filters -->
            <div class="flex items-center gap-4">
              <div class="w-40">
                <Dropdown :button-text="selectedStage || '全部案件階段'" :items="stageOptions" variant="outline" @item-click="handleStageChange" />
              </div>
              <div class="w-40">
                <Dropdown :button-text="selectedStatus || '全部案件狀態'" :items="statusOptions" variant="outline" @item-click="handleStatusChange" />
              </div>
            </div>
          </div>
          <!-- Table or Empty State -->
          <div class="rounded-lg border border-gray-300 bg-white">
            <Empty v-if="filteredCases.length === 0" type="case-management" @button-click="handleEmptyStateAddCase" />
            <Table v-else :columns="tableColumns" :rows="paginatedCases" :pagination="pagination" @page-change="handlePageChange">
              <!-- Case Number -->
              <template #cell-caseNumber="{ row }">
                <p class="text-base text-gray-900">{{ row.caseNumber }}</p>
              </template>
              <!-- Case Name -->
              <template #cell-caseName="{ row }">
                <p class="text-base text-gray-900">{{ row.caseName }}</p>
              </template>
              <!-- Case Category -->
              <template #cell-caseCategory="{ row }">
                <p class="text-base text-gray-500">{{ row.caseCategory }}</p>
              </template>
              <!-- Case Stage -->
              <template #cell-caseStage="{ row }">
                <p class="text-base text-gray-500">{{ row.caseStage }}</p>
              </template>
              <!-- Case Status -->
              <template #cell-caseStatus="{ row }">
                <Badge :variant="getStatusVariant(row.caseStatus)" :text="row.caseStatus" />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import ButtonDropdown, { type ButtonDropdownItem } from "@/components/atoms/ButtonDropdown.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import Badge from "@/components/atoms/Badge.vue";
import Empty from "@/components/atoms/Empty.vue";

const route = useRoute();

// 判斷是否為管理員模式（根據路由名稱）
const isAdmin = computed(() => route.name === "case-management-dangerous-admin" || route.path.includes("-admin"));

interface CaseItem {
  caseNumber: string;
  caseName: string;
  caseCategory: string;
  caseStage: string;
  caseStatus: "進行中" | "已中斷" | "已完成";
}

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
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
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
    cellClass: "w-[196px]",
  },
  {
    key: "caseName",
    label: "案件名稱",
    headerClass: "w-[375px]",
    cellClass: "w-[375px]",
  },
  {
    key: "caseCategory",
    label: "案件類別",
    headerClass: "w-[140px]",
    cellClass: "w-[140px]",
  },
  {
    key: "caseStage",
    label: "案件階段",
    headerClass: "w-[160px]",
    cellClass: "w-[160px]",
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

// Paginated Cases
const paginatedCases = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredCases.value.slice(start, end);
});

// Pagination
const pagination = computed<TablePagination>(() => ({
  currentPage: currentPage.value,
  total: isAdmin.value ? totalCases.value : filteredCases.value.length, // 管理員使用總數，用戶使用過濾後的數量
  pageSize: pageSize.value,
}));

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
  currentPage.value = 1;
};

const handleStatusChange = (item: DropdownItem) => {
  selectedStatus.value = item.label;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
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
