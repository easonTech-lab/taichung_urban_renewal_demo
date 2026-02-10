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
          <div class="flex gap-3">
            <ButtonCTA variant="outline" size="sm" left-icon="manage" @click="handleManageList"> 管理名單 </ButtonCTA>
            <ButtonCTA variant="outline" size="sm" right-icon="download" @click="handleExportList"> 匯出名單 </ButtonCTA>
          </div>
        </div>
        <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
        <div v-if="allOfficers.length === 0" class="flex flex-col items-center justify-center py-20">
          <Empty type="case" message="尚未導入審查幹事名單" button-text="添加幹事" :show-button="true" @button-click="handleAddOfficer" />
        </div>
        <div v-else class="flex flex-col gap-0">
          <Table :columns="tableColumns" :rows="paginatedOfficers" :pagination="pagination" @page-change="handlePageChange">
            <template #cell-index="{ row }">
              <div class="flex h-20 items-center justify-center p-4">
                <p class="text-base font-normal leading-[1.5] text-gray-500">{{ row.index }}</p>
              </div>
            </template>
            <template #cell-nameGender="{ row }">
              <div class="flex h-20 flex-col items-start justify-center gap-1 px-4 py-4">
                <p class="text-nowrap text-base font-normal leading-[1.5] text-gray-800">{{ row.name || "未選擇" }}</p>
                <p v-if="row.gender" class="text-base font-normal leading-[1.5] text-gray-500">{{ row.gender }}</p>
              </div>
            </template>
            <template #cell-title="{ row }">
              <div class="flex h-20 items-center p-4">
                <p class="text-base font-normal leading-[1.5] text-gray-500">{{ row.title || "-" }}</p>
              </div>
            </template>
            <template #cell-education="{ row }">
              <div class="flex h-20 items-center p-4">
                <p class="whitespace-pre-wrap text-base font-normal leading-[1.5] text-gray-500">{{ row.education || "-" }}</p>
              </div>
            </template>
            <template #cell-action="{ row }">
              <div class="flex h-20 items-center gap-4 px-4 py-4">
                <Icon name="profileCard" :size="24" class="shrink-0" />
                <ButtonCTA
                  variant="textPlain"
                  size="base"
                  class="text-nowrap p-0"
                  :class="row.name && row.name !== '未選擇' ? 'text-primary-600' : 'text-primary-300'"
                  @click.stop="handleRemoveOfficerFromTable(row)"
                >
                  移除
                </ButtonCTA>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <Drawer v-model="isDrawerOpen" title="幹事管理名單" width="xl" @close="handleDrawerClose">
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
          <ButtonCTA variant="primary" size="xl" class="w-[124px]" @click="handleSave"> 儲存 </ButtonCTA>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Tabs, { type TabItem } from "@/components/atoms/Tabs.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import type { OfficerData, OfficerItem } from "@/types/backend/systemManagement/officerList/officerListManagement.d";

// Tabs
const tabItems: TabItem[] = [{ label: "115" }, { label: "114" }, { label: "113" }, { label: "添加年度" }];

const activeTab = ref(0);

// Drawer state
const isDrawerOpen = ref(false);

// Table Columns
const tableColumns: TableColumn[] = [
  { key: "index", label: "項次" },
  { key: "nameGender", label: "委員姓名" },
  { key: "title", label: "現職" },
  { key: "education", label: "學經歷" },
  { key: "action", label: "動作" },
];

// Mock Officer Data
const allOfficers = ref<OfficerData[]>([
  { index: 1, name: "張源明", gender: "男", title: "內政部地政司代理司長", education: "日本東京大學地震研究所 博士\n銘傳大學都市規劃與防災學 碩士" },
  {
    index: 2,
    name: "林珮君",
    gender: "男",
    title: "專家委員",
    education: "元智大學化學工程學系\n美國奧克拉荷馬州州立大學環境工程碩士、總統府副秘書長、行政院秘書長、臺中縣副縣長、臺北市政府環境保護局局長",
  },
  {
    index: 3,
    name: "郭依佳",
    gender: "男",
    title: "專家委員",
    education: "元智大學化學工程學系\n美國奧克拉荷馬州州立大學環境工程碩士、總統府副秘書長、行政院秘書長、臺中縣副縣長、臺北市政府環境保護局局長",
  },
  {
    index: 4,
    name: "朱秀秋",
    gender: "男",
    title: "專家委員",
    education: "元智大學化學工程學系\n美國奧克拉荷馬州州立大學環境工程碩士、總統府副秘書長、行政院秘書長、臺中縣副縣長、臺北市政府環境保護局局長",
  },
  { index: 5, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: "美國北卡羅萊納州立大學景觀規劃博士" },
  { index: 6, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: "美國北卡羅萊納州立大學景觀規劃博士" },
  { index: 7, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: "美國北卡羅萊納州立大學景觀規劃博士" },
  { index: 8, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: "美國北卡羅萊納州立大學景觀規劃博士" },
  { index: 9, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: "美國北卡羅萊納州立大學景觀規劃博士" },
  { index: 10, name: "朱秀秋", gender: "男", title: "中山大學公共事務管理研究所教授兼管理學院副院長", education: "美國北卡羅萊納州立大學景觀規劃博士" },
  { index: 11, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 12, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 13, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 14, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 15, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 16, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 17, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 18, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 19, name: "未選擇", gender: "男", title: "-", education: "-" },
  { index: 20, name: "未選擇", gender: "男", title: "-", education: "-" },
]);

const { paginatedRows: paginatedOfficers, pagination, handlePageChange } = useTablePagination({
  rows: allOfficers,
  pageSize: 10,
  total: 1000,
});

// Officer List (20 items default)
const officerList = ref<OfficerItem[]>(
  Array.from({ length: 20 }, () => ({
    selectedOfficer: "",
  }))
);

// Available officers (mock data - should come from internal staff accounts)
const allAvailableOfficers: InputDropdownItem[] = [{ label: "陳傑瑞" }, { label: "張森" }, { label: "吳偉翔" }, { label: "林美華" }, { label: "王小明" }, { label: "李大同" }];

// Computed: Filter out already selected officers
const availableOfficers = computed(() => {
  const selectedOfficers = officerList.value.map((o) => o.selectedOfficer).filter((o) => o !== "");
  return allAvailableOfficers.filter((officer) => !selectedOfficers.includes(officer.label));
});

// Get available officers for a specific index (excluding the current selection)
const getAvailableOfficersForIndex = (index: number) => {
  const selectedOfficers = officerList.value.map((o, i) => (i !== index ? o.selectedOfficer : "")).filter((o) => o !== "");
  return allAvailableOfficers.filter((officer) => !selectedOfficers.includes(officer.label));
};

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleTabClick = (index: number) => {
  activeTab.value = index;
};

const handleManageList = () => {
  isDrawerOpen.value = true;
};

const handleExportList = () => {
  console.log("Export list");
  // TODO: Implement export list logic
};

const handleAddOfficer = () => {
  isDrawerOpen.value = true;
};

const handleDrawerClose = () => {
  isDrawerOpen.value = false;
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
  isDrawerOpen.value = false;
  // TODO: Reset form if needed
};

const handleSave = () => {
  console.log("Save officer list:", officerList.value);
  // TODO: Implement save logic
  isDrawerOpen.value = false;
};

const handleRemoveOfficerFromTable = (row: Record<string, any>) => {
  const officer = row as OfficerData;
  console.log("Remove officer from table:", officer);
  // TODO: Implement remove logic
};
</script>
