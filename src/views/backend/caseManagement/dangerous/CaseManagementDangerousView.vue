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
                <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ hasAnyCases ? (isAdmin ? "案件列表" : "危老重建案件") : "危老重建案件" }}</h2>
              </div>
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
            <div class="w-40">
              <Dropdown :button-text="selectedStage" placeholder="全部案件階段" :items="stageOptions" @item-click="handleStageChange" />
            </div>
            <div class="w-40">
              <Dropdown :button-text="selectedStatus" placeholder="全部案件狀態" :items="statusOptions" @item-click="handleStatusChange" />
            </div>
          </div>
        </div>
        <div class="rounded-lg border border-gray-300 bg-white">
          <Empty v-if="!hasAnyCases" type="case-management" message="尚無危老重建案件" @button-click="handleEmptyStateAddCase" />
          <Empty v-else-if="filteredCases.length === 0" type="search" :show-button="false" class="py-12" />
          <Table
            v-else
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
import { useRoute, useRouter } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Toast from "@/components/atoms/Toast.vue";
import Badge from "@/components/atoms/Badge.vue";
import Empty from "@/components/atoms/Empty.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import ButtonDropdown, { type ButtonDropdownItem } from "@/components/atoms/ButtonDropdown.vue";
import type { CaseItem } from "@/types/backend/caseManagement/dangerous/caseManagementDangerous.d";
import { apiGetDangerousCasesList } from "@/api/backend/caseManagement/dangerousCasesService";
import type { DangerousCaseApiItem } from "@/types/api/backend/caseManagement/dangerousCasesService";
const route = useRoute();
const router = useRouter();
const showDeleteToast = ref(false);
const toastMessage = ref("刪除成功");
const selectedStage = ref<string>("");
const selectedStatus = ref<string>("");
const selectedAddCaseIndex = ref<number | undefined>(undefined);
const totalCases = ref<number>(1000); // 管理員顯示的總案件數
const stageOptions: DropdownItem[] = [{ label: "全部案件階段" }, { label: "專案小組" }, { label: "其他階段" }];
const statusOptions: DropdownItem[] = [{ label: "全部案件狀態" }, { label: "進行中" }, { label: "已中斷" }, { label: "已完成" }];
const addCaseOptions: ButtonDropdownItem[] = [
  { label: "申請審議(一般案件)", value: "general-case" },
  { label: "第一次變更", value: "first-amendment" },
  { label: "第二次變更", value: "second-amendment" },
  { label: "申請審議(簡化案件)", value: "simplified-case" },
];
const allCases = ref<CaseItem[]>([]);
const tableColumns: TableColumn[] = [
  { key: "caseNumber", label: "案件編號", width: "16%", cellClass: "text-base text-gray-900" },
  { key: "caseName", label: "案件名稱", width: "40%", cellClass: "text-base text-gray-900" },
  { key: "caseCategory", label: "案件類別", width: "12%", cellClass: "text-base text-gray-500" },
  { key: "caseStage", label: "案件階段", width: "18%", cellClass: "text-base text-gray-500" },
  { key: "caseStatus", label: "案件狀態", width: "14%" },
];
const isAdmin = computed(() => route.name === "case-management-dangerous-admin" || route.path.includes("-admin"));
const hasAnyCases = computed(() => allCases.value.length > 0);
const filteredCases = computed(() => {
  let cases = [...allCases.value];
  if (selectedStage.value && selectedStage.value !== "全部案件階段") {
    cases = cases.filter((item) => item.caseStage === selectedStage.value);
  }
  if (selectedStatus.value && selectedStatus.value !== "全部案件狀態") {
    cases = cases.filter((item) => item.caseStatus === selectedStatus.value);
  }
  return cases;
});
const paginationState = reactive(useTablePagination({
  rows: filteredCases,
  pageSize: 10,
  total: computed(() => (isAdmin.value ? totalCases.value : filteredCases.value.length)),
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
const handleStageChange = (item: DropdownItem) => {
  selectedStage.value = item.label;
  paginationState.resetPage();
};
const handleStatusChange = (item: DropdownItem) => {
  selectedStatus.value = item.label;
  paginationState.resetPage();
};
const handleAddCaseOption = (item: ButtonDropdownItem, index: number) => {
  selectedAddCaseIndex.value = index;
  router.push({
    name: "case-management-dangerous-add",
    query: {
      addType: item.value,
    },
  });
};

const normalizeDangerousCase = (item: DangerousCaseApiItem): CaseItem => ({
  caseNumber: String(item.id),
  caseName: item.caseName,
  caseCategory: "危老重建",
  caseStage: item.stage ?? "",
  caseStatus: item.status ?? "",
});

const loadDangerousCases = async () => {
  const response = await apiGetDangerousCasesList(0, 100);
  const items = response.data?.content ?? [];
  allCases.value = items.map(normalizeDangerousCase);
  totalCases.value = response.data?.totalElements ?? items.length;
};

onMounted(async () => {
  await loadDangerousCases();
});
const handleEmptyStateAddCase = () => {
  router.push({
    name: "case-management-dangerous-add",
    query: {
      addType: "general-case",
    },
  });
};
const handleRowClick = () => {
  router.push({
    path: "/case-detail",
    query: {
      from: route.path,
      caseType: "dangerous",
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
