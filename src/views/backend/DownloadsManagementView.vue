<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">下載專區維護</h1>
      </div>
      <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">下載專區列表</h2>
          </div>
          <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddDownload"> 新增資料下載 </ButtonCTA>
        </div>
        <div class="flex flex-col gap-4">
          <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
        </div>
        <div class="w-[160px]">
          <Dropdown :button-text="selectedCategory || '全部案件類別'" :items="categoryOptions" variant="outline" @item-click="handleCategoryChange" />
        </div>
        <div class="rounded-lg border border-gray-300 bg-white">
          <Table :columns="tableColumns" :rows="paginatedDownloads" :pagination="pagination" @page-change="handlePageChange">
            <template #cell-index="{ rowIndex }">
              <p class="text-base text-gray-500">{{ (currentPage - 1) * pageSize + rowIndex + 1 }}</p>
            </template>
            <template #cell-status="{ row }">
              <Switch :model-value="row.status" :show-text="true" on-text="上架" off-text="下架" @update:model-value="(value) => handleStatusChange(row, value)" />
            </template>
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

    <Modal
      v-model="showDeleteModal"
      size="md"
      :static="false"
      :show-close-button="false"
      close-action="emit"
      backdrop-class="bg-gray-600/80"
    >
      <template #header>
        <div class="flex w-full items-center justify-end px-4 pt-4">
          <button type="button" class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500" @click="handleCloseDeleteModal" aria-label="關閉">
            <Icon name="close" :size="20" aria-hidden="true" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">!</div>
          <div class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">
            <p class="mb-0">確認刪除此項目</p>
            <p>內容將完全刪除無法復原</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
          <ButtonCTA
            variant="white"
            size="xs"
            class="h-8 w-[120px] border-gray-200 px-3 py-2 text-xs font-medium leading-[1.5] text-gray-800 hover:bg-gray-50"
            @click="handleCloseDeleteModal"
          >
            取消
          </ButtonCTA>
          <ButtonCTA
            variant="red"
            size="xs"
            class="h-8 w-[120px] bg-red-700 px-3 py-2 text-sm font-medium leading-[1.5] text-white hover:bg-red-800"
            @click="handleConfirmDelete"
          >
            刪除
          </ButtonCTA>
        </div>
      </template>
    </Modal>

    <div class="fixed bottom-6 z-[90]" :style="deleteToastStyle">
      <Toast
        v-model="showDeleteToast"
        message="已刪除"
        :show-actions="false"
        :show-close="false"
        :auto-close="true"
        :duration="3000"
      >
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Tabs from "@/components/atoms/Tabs.vue";
import Switch from "@/components/atoms/Switch.vue";
import Dropdown from "@/components/atoms/Dropdown.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Modal from "@/components/atoms/Modal.vue";
import Toast from "@/components/atoms/Toast.vue";
import Icon from "@/components/atoms/Icon.vue";



interface DownloadItem {
  fileName: string;
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
const showDeleteModal = ref(false);
const deleteTarget = ref<DownloadItem | null>(null);
const showDeleteToast = ref(false);
const deleteToastStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};

// Category Options
const categoryOptions = [
  { label: "全部案件類別", value: "" },
  { label: "都市更新類", value: "都市更新類" },
  { label: "危老類", value: "危老類" },
  { label: "老舊街區", value: "老舊街區" },
  { label: "整建維護", value: "整建維護" },
];

const handleCategoryChange = (item: { label: string; value?: string }) => {
  selectedCategory.value = item.value || "";
  resetPage();
};

// Mock Data (使用 ref 使其響應式)
const allDownloads = ref<DownloadItem[]>([
  {
    fileName: "都市更新申請書範本（含事業計畫書、概要書）",
    category: "都市更新類",
    publishDate: "114/11/09",
    status: true,
    tabStatus: "published",
  },
  {
    fileName: "結構安全性初評申請表",
    category: "危老類",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "老街區認定與補助條件說明文件",
    category: "老舊街區",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "整建維護補助申請表",
    category: "整建維護",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "同意書格式範例（住戶簽署用）",
    category: "都市更新類",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "全體同意書格式（危老專用）",
    category: "危老類",
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
    key: "fileName",
    label: "問題",
  },
  {
    key: "category",
    label: "案件類別",
    headerClass: "w-[200px]",
    cellClass: "w-[200px]",
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

// Filtered Downloads
const filteredDownloads = computed(() => {
  let downloads = [...allDownloads.value];

  // Filter by category
  if (selectedCategory.value) {
    downloads = downloads.filter((item) => item.category === selectedCategory.value);
  }

  // Filter by tab
  if (activeTab.value === 1) {
    // 已上架
    downloads = downloads.filter((item) => item.status === true);
  } else if (activeTab.value === 2) {
    // 暫存中
    downloads = downloads.filter((item) => item.tabStatus === "draft");
  } else if (activeTab.value === 3) {
    // 已下架
    downloads = downloads.filter((item) => item.status === false && item.tabStatus === "unpublished");
  }

  return downloads;
});

const { currentPage, paginatedRows: paginatedDownloads, pagination, handlePageChange, resetPage } = useTablePagination({
  rows: filteredDownloads,
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

const handleAddDownload = () => {
  router.push("/downloads-management/add");
};

const handleStatusChange = (row: Record<string, any>, value: boolean) => {
  const item = row as DownloadItem;
  item.status = value;
  console.log("Status changed for:", item, "New status:", value);
  // TODO: Implement status change logic
};

const handlePreview = (row: Record<string, any>) => {
  const item = row as DownloadItem;
  console.log("Preview clicked for:", item);
  // TODO: Implement preview logic
};

const handleDelete = (row: Record<string, any>) => {
  const item = row as DownloadItem;
  deleteTarget.value = item;
  showDeleteModal.value = true;
};

const handleCloseDeleteModal = () => {
  showDeleteModal.value = false;
  deleteTarget.value = null;
};

const handleConfirmDelete = () => {
  if (deleteTarget.value) {
    allDownloads.value = allDownloads.value.filter((item) => item.fileName !== deleteTarget.value?.fileName);
  }
  handleCloseDeleteModal();
  showDeleteToast.value = true;
};
</script>
