<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">幹事名單管理</h1>
      </div>
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">幹事列表</h2>
            </div>
            <p class="pl-4 text-xl font-normal leading-5 text-gray-400">在此管理幹事名單及資訊</p>
          </div>
          <div v-if="hasAnyOfficers" class="flex gap-3">
            <ButtonCTA variant="outline" size="sm" left-icon="manage" @click="handleManageList"> 管理名單 </ButtonCTA>
            <ButtonCTA variant="outline" size="sm" right-icon="download" @click="handleExportList"> 匯出名單 </ButtonCTA>
          </div>
        </div>
        <Tabs v-if="hasAnyOfficers" :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
        <div v-if="allOfficers.length === 0" class="flex flex-col items-center justify-center py-8">
          <Empty
            class="!h-auto !gap-6 py-6"
            type="case"
            message=""
            button-text="添加幹事"
            :show-button="true"
            @button-click="handleAddOfficer"
          />
        </div>
        <div v-else class="flex flex-col gap-0">
          <Table
            :columns="tableColumns"
            :rows="paginationState.paginatedRows"
            :pagination="paginationState.pagination"
            min-width="984px"
            @page-change="paginationState.handlePageChange"
          >
            <template #cell-index="{ row }">
              <div class="flex h-20 items-center justify-start px-4 py-4">
                <p class="text-sm font-normal leading-6 text-gray-500">{{ row.index }}</p>
              </div>
            </template>
            <template #cell-nameGender="{ row }">
              <div class="flex h-20 min-w-0 flex-col items-start justify-center gap-0.5">
                <p
                  class="min-w-0 truncate text-sm font-normal leading-6"
                  :class="row.isPlaceholder ? 'text-gray-500' : 'text-gray-800'"
                >
                  {{ row.name || "未選擇" }}
                </p>
                <p v-if="row.gender" class="min-w-0 truncate text-sm font-normal leading-6 text-gray-500">{{ row.gender }}</p>
              </div>
            </template>
            <template #cell-title="{ row }">
              <div class="flex h-20 min-w-0 items-center">
                <p class="line-clamp-2 min-w-0 text-sm font-normal leading-6 text-gray-500">{{ row.title || "-" }}</p>
              </div>
            </template>
            <template #cell-education="{ row }">
              <div class="flex min-w-0 px-4 py-4">
                <ul v-if="row.education?.length" class="min-w-0 list-disc space-y-0 pl-4 text-sm font-normal leading-5 text-gray-500">
                  <li v-for="(item, index) in row.education" :key="`${row.index}-education-${index}`" class="min-w-0 break-words">
                    {{ item }}
                  </li>
                </ul>
                <p v-else class="text-sm font-normal leading-6 text-gray-500">-</p>
              </div>
            </template>
            <template #cell-action="{ row }">
              <div class="flex h-20 items-center justify-center gap-4 px-4 py-4" @click.stop @mousedown.stop>
                <button type="button" class="flex shrink-0 items-center justify-center p-0" aria-label="查看委員資料" @click="handleOfficerProfileCard(row as OfficerData & { email?: string; phone?: string; address?: string })">
                  <Icon
                    name="profileCard"
                    :size="24"
                    :color="row.isPlaceholder ? '#A4CAFE' : '#1C64F2'"
                    :fill="row.isPlaceholder ? '#A4CAFE' : '#1C64F2'"
                    aria-hidden="true"
                  />
                </button>
                <button type="button" class="flex shrink-0 items-center justify-center p-0" aria-label="移除幹事" @click="handleDeleteOfficer(row)">
                  <Icon
                    name="trashCan"
                    :size="24"
                    :color="row.isPlaceholder ? '#A4CAFE' : '#1C64F2'"
                    :fill="row.isPlaceholder ? '#A4CAFE' : '#1C64F2'"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <Drawer v-model="isAddYearDrawerOpen" title="添加年度" width="xl" @close="handleAddYearDrawerClose">
      <template #default>
        <div class="flex flex-col">
          <div
            v-for="(_year, index) in yearList"
            :key="index"
            class="flex flex-1 items-center justify-between gap-2 border-b border-gray-300 py-5"
          >
            <div class="flex min-w-0 flex-1 items-center gap-2">
              <Icon name="barsOutline" :size="24" class="shrink-0 text-gray-500" aria-hidden="true" />
              <Input
                :model-value="yearList[index]"
                :show-label="false"
                size="lg"
                placeholder="請輸入年度"
                container-class="min-w-0 flex-1"
                :error="yearErrorMap.has(index)"
                :error-message="getYearErrorMessage(index)"
                @update:model-value="(value) => handleYearInput(index, value)"
              />
            </div>
            <ButtonCTA variant="textPlain" size="base" class="shrink-0 p-0 text-primary-600" @click="handleRemoveYear(index)">
              移除
            </ButtonCTA>
          </div>
          <div class="flex items-center justify-start border-b border-gray-300 py-5">
            <ButtonCTA variant="outline" size="xl" class="w-full" left-icon="plus" @click="handleAddYear">
              新增年度
            </ButtonCTA>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleAddYearCancel"> 取消 </ButtonCTA>
          <ButtonCTA
            :variant="canSaveYears ? 'primary' : 'gray'"
            size="xl"
            class="w-[124px]"
            :disabled="!canSaveYears"
            @click="handleAddYearSave"
          >
            儲存
          </ButtonCTA>
        </div>
      </template>
    </Drawer>
    <Drawer v-model="isDrawerOpen" title="幹事管理名單" width="xl" close-action="emit" @close="handleDrawerClose">
      <template #default>
        <div class="flex flex-col gap-0">
          <div v-for="(officer, index) in officerList" :key="index" class="flex items-center justify-between border-b border-gray-300 py-5">
            <div class="flex flex-1 items-center gap-2">
              <div class="flex w-5 items-center justify-center">
                <span class="text-base font-normal leading-[1.25] text-gray-500">{{ index + 1 }}</span>
              </div>
              <InputDropdown
                :button-text="officer.selectedOfficer || ''"
                placeholder="選擇"
                :items="getAvailableOfficersForIndex(index)"
                required
                :show-label="false"
                @item-click="(item) => handleOfficerSelect(index, item)"
              />
            </div>
            <div class="flex items-center px-3 py-4">
              <ButtonCTA variant="textPlain" size="base" class="p-0" @click="handleRemoveOfficer(index)"> 移除 </ButtonCTA>
            </div>
          </div>
          <div class="flex items-center justify-start border-b border-gray-300 py-5">
            <ButtonCTA variant="outline" size="xl" class="w-full" left-icon="plus" @click="handleAddNewOfficer"> 新增幹事 </ButtonCTA>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel"> 取消 </ButtonCTA>
          <ButtonCTA
            :variant="officerListUnsavedCheck.hasUnsavedChanges.value ? 'primary' : 'gray'"
            size="xl"
            class="w-[124px]"
            :disabled="!officerListUnsavedCheck.hasUnsavedChanges.value"
            @click="handleSave"
          >
            儲存
          </ButtonCTA>
        </div>
      </template>
    </Drawer>
    <UnsavedChangesModal
      :model-value="unsavedDialog.showUnsavedChangesModal.value"
      @update:modelValue="(value) => (unsavedDialog.showUnsavedChangesModal.value = value)"
      @exit="handleExitWithoutSaving"
      @confirm="handleSaveFromUnsavedModal"
    />
    <ConfirmDeleteModal
      v-model="showDeleteModal"
      message="確認移除幹事"
      :description="deleteTarget ? `確定要移除「${deleteTarget.name}」嗎？` : '內容將完全刪除無法復原'"
      confirm-label="確認"
      @confirm="handleConfirmDeleteOfficer"
      @cancel="handleCloseDeleteModal"
    />
    <div v-if="showToast" class="fixed bottom-6 left-1/2 z-[90] w-[min(1420px,calc(100vw-2rem))] -translate-x-1/2">
      <Toast v-model="showToast" :message="toastMessage" :show-actions="false" :show-close="false" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useTablePagination } from "@/composables/useTablePagination";
import { useUnsavedChangesDialog } from "@/composables/useUnsavedChangesDialog";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import Toast from "@/components/atoms/Toast.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Tabs, { type TabItem } from "@/components/atoms/Tabs.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Input from "@/components/atoms/Input.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import type { OfficerData, OfficerItem } from "@/types/backend/systemManagement/officerList/officerListManagement.d";
// Tabs（年度 + 添加年度，儲存後會更新）
const router = useRouter();
const activeTab = ref(0);
const showToast = ref(false);
const officerListUnsavedCheck = useFormUnsavedCheck(() => buildOfficerListSnapshot());
// Drawer state
const isDrawerOpen = ref(false);
/** 添加年度側拉選單的年度列表（從現有 tab 帶入） */
const yearList = ref<string[]>([]);
const toastMessage = ref("儲存成功");
const initialYearSnapshot = ref("");
// Delete modal state
const showDeleteModal = ref(false);
const isAddYearDrawerOpen = ref(false);
const deleteTarget = ref<OfficerData | null>(null);
const tabItems = ref<TabItem[]>([{ label: "115" }, { label: "114" }, { label: "113" }, { label: "添加年度" }]);
/** 年度欄位驗證錯誤（儲存時觸發，輸入時重置） */
const yearErrorMap = ref<Map<number, "format" | "duplicate">>(new Map());
const OFFICER_EDIT_STORAGE_KEY = "officer-edit-data";
// Mock Officer Data
const allOfficers = ref<OfficerData[]>([
  {
    index: 1,
    name: "張源明",
    gender: "男",
    title: "內政部地政司代理司長",
    education: ["日本東京大學地震研究所 博士", "銘傳大學都市規劃與防災學 碩士"],
    email: "tmcg01mb@gmail.com",
    phone: "0922289911",
    address: "臺中市西屯區文心路二段588號",
  } as OfficerData & { email?: string; phone?: string; address?: string },
  {
    index: 2,
    name: "林珮君",
    gender: "男",
    title: "專家委員",
    education: ["元智大學化學工程學系", "美國奧克拉荷馬州州立大學環境工程碩士", "總統府副秘書長", "行政院秘書長", "臺中縣副縣長", "臺北市政府環境保護局局長"],
  },
  {
    index: 3,
    name: "郭依佳",
    gender: "男",
    title: "專家委員",
    education: ["元智大學化學工程學系", "美國奧克拉荷馬州州立大學環境工程碩士", "總統府副秘書長", "行政院秘書長", "臺中縣副縣長", "臺北市政府環境保護局局長"],
  },
  {
    index: 4,
    name: "朱秀秋",
    gender: "男",
    title: "專家委員",
    education: ["元智大學化學工程學系", "美國奧克拉荷馬州州立大學環境工程碩士", "總統府副秘書長", "行政院秘書長", "臺中縣副縣長", "臺北市政府環境保護局局長"],
  },
  { index: 5, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: ["美國北卡羅萊納州立大學景觀規劃博士"] },
  { index: 6, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: ["美國北卡羅萊納州立大學景觀規劃博士"] },
  { index: 7, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: ["美國北卡羅萊納州立大學景觀規劃博士"] },
  { index: 8, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: ["美國北卡羅萊納州立大學景觀規劃博士"] },
  { index: 9, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: ["美國北卡羅萊納州立大學景觀規劃博士"] },
  { index: 10, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: ["美國北卡羅萊納州立大學景觀規劃博士"] },
]);
const TOTAL_OFFICER_SLOTS = 20;
const officerTableRows = ref(
  Array.from({ length: TOTAL_OFFICER_SLOTS }, (_, index) => {
    const officer = allOfficers.value[index];
    if (officer) return { ...officer, isPlaceholder: false };
    return {
      index: index + 1,
      name: "未選擇",
      gender: "",
      title: "-",
      education: [],
      isPlaceholder: true,
    };
  })
);
// Officer List (20 items default)
const officerList = ref<OfficerItem[]>(
  Array.from({ length: 20 }, () => ({
    selectedOfficer: "",
  }))
);
const paginationState = reactive(useTablePagination({
  rows: officerTableRows,
  pageSize: 10,
  total: computed(() => officerTableRows.value.length),
  slice: false,
}));
// Available officers (mock data - should come from internal staff accounts)
const allAvailableOfficers: InputDropdownItem[] = [{ label: "陳傑瑞" }, { label: "張森" }, { label: "吳偉翔" }, { label: "林美華" }, { label: "王小明" }, { label: "李大同" }];
// Get available officers for a specific index (excluding the current selection)
// Table Columns
const tableColumns: TableColumn[] = [
  { key: "index", label: "項次", width: "6%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "p-0 align-middle" },
  { key: "nameGender", label: "委員姓名", width: "12%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "px-4 py-4 align-middle" },
  { key: "title", label: "現職", width: "20%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "px-4 py-4 align-middle" },
  { key: "education", label: "學經歷", width: "52%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "p-0 align-middle" },
  { key: "action", label: "動作", width: "10%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "p-0 align-middle" },
];
const unsavedDialog = useUnsavedChangesDialog();
const hasAnyOfficers = computed(() => allOfficers.value.length > 0);
const hasYearErrors = computed(() => yearErrorMap.value.size > 0);
const hasYearChanges = computed(() => buildYearSnapshot() !== initialYearSnapshot.value);
const canSaveYears = computed(() => hasYearChanges.value && !hasYearErrors.value);
const getYearErrorMessage = (index: number) => {
  const type = yearErrorMap.value.get(index);
  if (type === "format") return "限輸入阿拉伯數字";
  if (type === "duplicate") return "輸入年度重複";
  return undefined;
};
const normalizeYearList = (list: string[]) => list.map((year) => year.trim()).filter(Boolean);
const buildYearSnapshot = () => JSON.stringify(normalizeYearList(yearList.value));
const openAddYearDrawer = () => {
  yearList.value = tabItems.value.slice(0, -1).map((t) => t.label);
  syncYearErrors();
  initialYearSnapshot.value = buildYearSnapshot();
  isAddYearDrawerOpen.value = true;
};
const getAvailableOfficersForIndex = (index: number) => {
  const selectedOfficers = officerList.value
    .map((o, i) => (i !== index ? o.selectedOfficer : ""))
    .filter((o) => o !== "" && o !== "未選擇");
  return allAvailableOfficers.filter((officer) => !selectedOfficers.includes(officer.label));
};
const normalizeOfficerList = (list: OfficerItem[]) => {
  return list
    .map((item) => ({
      selectedOfficer: item.selectedOfficer.trim(),
    }))
    .filter((item) => item.selectedOfficer !== "" && item.selectedOfficer !== "未選擇");
};
const buildOfficerListSnapshot = () => JSON.stringify(normalizeOfficerList(officerList.value));
// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
const handleTabClick = (index: number) => {
  if (index === tabItems.value.length - 1) {
    // 點擊「添加年度」開啟側拉選單
    openAddYearDrawer();
    return;
  }
  activeTab.value = index;
};
const populateOfficerListFromTable = () => {
  officerList.value = Array.from({ length: TOTAL_OFFICER_SLOTS }, (_, index) => ({
    selectedOfficer: allOfficers.value[index]?.name ?? "未選擇",
  }));
  officerListUnsavedCheck.captureInitial();
};
const handleManageList = () => {
  populateOfficerListFromTable();
  isDrawerOpen.value = true;
};
const handleExportList = () => {
  console.log("Export list");
  // TODO: Implement export list logic
};
const handleAddOfficer = () => {
  populateOfficerListFromTable();
  isDrawerOpen.value = true;
};
const handleDrawerClose = () => {
  unsavedDialog.requestUnsavedConfirmation(officerListUnsavedCheck.hasUnsavedChanges.value, () => {
    isDrawerOpen.value = false;
  });
};
const handleOfficerSelect = (index: number, item: InputDropdownItem) => {
  officerList.value[index].selectedOfficer = item.label;
};
const handleRemoveOfficer = (index: number) => {
  officerList.value.splice(index, 1);
};
const handleAddNewOfficer = () => {
  // Add a new empty officer slot
  officerList.value.push({
    selectedOfficer: "",
  });
};
const handleCancel = () => {
  unsavedDialog.requestUnsavedConfirmation(officerListUnsavedCheck.hasUnsavedChanges.value, () => {
    isDrawerOpen.value = false;
  });
};
const handleSave = () => {
  console.log("Save officer list:", officerList.value);
  // TODO: Implement save logic
  officerListUnsavedCheck.captureInitial();
  isDrawerOpen.value = false;
  toastMessage.value = "儲存成功";
  showToast.value = true;
};
const handleExitWithoutSaving = () => {
  unsavedDialog.runPendingAction();
};
const handleSaveFromUnsavedModal = () => {
  unsavedDialog.closeUnsavedChangesModal();
  handleSave();
};
const handleDeleteOfficer = (row: Record<string, any>) => {
  if (row.isPlaceholder) return;
  deleteTarget.value = row as OfficerData;
  showDeleteModal.value = true;
};
const handleCloseDeleteModal = () => {
  showDeleteModal.value = false;
  deleteTarget.value = null;
};
const handleConfirmDeleteOfficer = () => {
  if (deleteTarget.value) {
    const index = allOfficers.value.findIndex((o) => o.index === deleteTarget.value?.index);
    if (index !== -1) {
      allOfficers.value.splice(index, 1);
    }
    // TODO: 調用 API 刪除資料
    console.log("Removed officer:", deleteTarget.value);
  }
  handleCloseDeleteModal();
};
const handleOfficerProfileCard = (row: OfficerData & { email?: string; phone?: string; address?: string }) => {
  if ((row as OfficerData & { isPlaceholder?: boolean }).isPlaceholder) return;
  // TODO: 後續串接後端後，改為帶 officer id 進編輯頁並由編輯頁重新取資料。
  // 目前因尚未有後端 API，暫以 sessionStorage 傳遞 mock 編輯資料。
  const officer = {
    name: row.name || "",
    gender: row.gender || "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    title: row.title || "",
    education: row.education ?? [],
  };
  sessionStorage.setItem(OFFICER_EDIT_STORAGE_KEY, JSON.stringify(officer));
  router.push("/officer-list-management/edit");
};
// 添加年度 Drawer
const handleAddYear = () => {
  yearList.value.push("");
  syncYearErrors();
};
const handleRemoveYear = (index: number) => {
  yearList.value.splice(index, 1);
  syncYearErrors();
};
const handleAddYearDrawerClose = () => {
  yearErrorMap.value = new Map();
  isAddYearDrawerOpen.value = false;
};
const handleAddYearCancel = () => {
  isAddYearDrawerOpen.value = false;
};
/** 驗證年度：限輸入阿拉伯數字 */
const validateYear = (value: string) => /^\d+$/.test(value.trim());
const syncYearErrors = () => {
  const errorMap = new Map<number, "format" | "duplicate">();
  yearList.value.forEach((year, index) => {
    const trimmed = year.trim();
    if (!trimmed) return;
    if (!validateYear(trimmed)) {
      errorMap.set(index, "format");
    }
  });
  const valueToIndices = new Map<string, number[]>();
  yearList.value.forEach((year, index) => {
    if (errorMap.has(index)) return;
    const trimmed = year.trim();
    if (!trimmed) return;
    const indices = valueToIndices.get(trimmed) ?? [];
    indices.push(index);
    valueToIndices.set(trimmed, indices);
  });
  valueToIndices.forEach((indices) => {
    if (indices.length > 1) {
      indices.forEach((index) => errorMap.set(index, "duplicate"));
    }
  });
  yearErrorMap.value = errorMap;
};
const handleYearInput = (index: number, value: string) => {
  yearList.value[index] = value;
  syncYearErrors();
};
const handleAddYearSave = () => {
  syncYearErrors();
  if (yearErrorMap.value.size > 0) {
    return;
  }
  const validYears = yearList.value.map((y) => y.trim()).filter(Boolean);
  tabItems.value = [...validYears.map((y) => ({ label: y })), { label: "添加年度" }];
  activeTab.value = 0;
  yearErrorMap.value = new Map();
  initialYearSnapshot.value = buildYearSnapshot();
  isAddYearDrawerOpen.value = false;
};
</script>
