<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">公開消息維護</h1>
      </div>
      <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">公開消息列表</h2>
          </div>
          <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddMessage"> 新增公開消息 </ButtonCTA>
        </div>
        <div class="flex flex-col gap-4">
          <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
        </div>
        <div class="w-[160px]">
          <Dropdown :button-text="selectedCategory || '全部類別'" :items="categoryOptions" variant="outline" @item-click="handleCategoryChange" />
        </div>
        <div class="rounded-lg border border-gray-300 bg-white">
          <Table :columns="tableColumns" :rows="paginatedMessages" :pagination="pagination" @page-change="handlePageChange">
            <!-- Index -->
            <template #cell-index="{ rowIndex }">
              <p class="text-base text-gray-500">{{ (currentPage - 1) * pageSize + rowIndex + 1 }}</p>
            </template>
            <!-- Status -->
            <template #cell-status="{ row }">
              <Switch :model-value="row.status" :show-text="true" on-text="上架" off-text="下架" @update:model-value="(value) => handleStatusChange(row, value)" />
            </template>
            <!-- Action -->
            <template #cell-action="{ row }">
              <div class="flex items-center">
                <ButtonCTA variant="textPlain" size="sm" @click.stop="handlePreview(row)">預覽</ButtonCTA>
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="刪除" />
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Tabs from "@/components/atoms/Tabs.vue";
import Switch from "@/components/atoms/Switch.vue";
import Dropdown from "@/components/atoms/Dropdown.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import { useTablePagination } from "@/composables/useTablePagination";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";

interface PublicMessageItem {
  title: string;
  category: string;
  publishDate: string;
  status: boolean; // true = 上架, false = 下架
  tabStatus: "all" | "published" | "draft" | "unpublished";
}

// Tabs
const tabItems = [{ label: "全部" }, { label: "已上架" }, { label: "暫存中" }, { label: "已下架" }];
const activeTab = ref<number>(0);

// State
const pageSize = ref<number>(10);
const selectedCategory = ref<string>("");

// Category Options
const categoryOptions = [
  { label: "全部類別", value: "" },
  { label: "最新消息", value: "最新消息" },
  { label: "會議公告", value: "會議公告" },
  { label: "新聞快訊", value: "新聞快訊" },
];

const handleCategoryChange = (item: { label: string; value?: string }) => {
  selectedCategory.value = item.value || "";
  resetPage();
};

// Mock Data (使用 ref 使其響應式)
const allMessages = ref<PublicMessageItem[]>([
  {
    title: "本處辦理「114年度老屋新用計畫2.0」潭子區老屋第2次進駐者徵選，入選結果公告。",
    category: "最新消息",
    publishDate: "114/11/09",
    status: true,
    tabStatus: "published",
  },
  {
    title: "本處辦理「114年度老屋新用計畫2.0」南區老屋第2次進駐者徵選，入選結果公告。",
    category: "最新消息",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    title: "西屯區都更幹事會第二次召開",
    category: "最新消息",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    title: "協合里都更審查會議時間公告",
    category: "會議公告",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    title: "大雅區都更幹事會第一次召開",
    category: "會議公告",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    title: "民眾表達推動任務研議",
    category: "新聞快訊",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
]);

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    headerClass: "w-[60px]",
    cellClass: "w-[60px]",
  },
  {
    key: "title",
    label: "公開消息",
  },
  {
    key: "category",
    label: "類別",
    headerClass: "w-[173px]",
    cellClass: "w-[173px]",
  },
  {
    key: "publishDate",
    label: "發布日期",
    headerClass: "w-[140px]",
    cellClass: "w-[140px]",
    sortable: true,
  },
  {
    key: "status",
    label: "狀態",
  },
  {
    key: "action",
    label: "動作",
    headerClass: "w-[96px]",
    cellClass: "w-[96px]",
  },
];

// Filtered Messages
const filteredMessages = computed(() => {
  let messages = [...allMessages.value];

  // Filter by category
  if (selectedCategory.value) {
    messages = messages.filter((item) => item.category === selectedCategory.value);
  }

  // Filter by tab
  if (activeTab.value === 1) {
    // 已上架
    messages = messages.filter((item) => item.status === true);
  } else if (activeTab.value === 2) {
    // 暫存中
    messages = messages.filter((item) => item.tabStatus === "draft");
  } else if (activeTab.value === 3) {
    // 已下架
    messages = messages.filter((item) => item.status === false && item.tabStatus === "unpublished");
  }

  return messages;
});

const { currentPage, paginatedRows: paginatedMessages, pagination, handlePageChange, resetPage } = useTablePagination({
  rows: filteredMessages,
  pageSize,
  slice: false,
});

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleTabClick = (index: number, item: any, event?: Event) => {
  activeTab.value = index;
  resetPage();
};

const router = useRouter();

const handleAddMessage = () => {
  router.push("/public-message-management/add");
};

const handleStatusChange = (row: Record<string, any>, value: boolean) => {
  const item = row as PublicMessageItem;
  item.status = value;
  console.log("Status changed for:", item, "New status:", value);
  // TODO: Implement status change logic
};

const handlePreview = (row: Record<string, any>) => {
  const item = row as PublicMessageItem;
  console.log("Preview clicked for:", item);
  // TODO: Implement preview logic
};

const handleDelete = (row: Record<string, any>) => {
  const item = row as PublicMessageItem;
  console.log("Delete clicked for:", item);
  // TODO: Implement delete logic
};
</script>
