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
          <ButtonCTA v-if="isDataLoaded && hasAnyMessages" variant="outline" size="sm" left-icon="plus" @click="handleAddMessage"> 新增公開消息 </ButtonCTA>
        </div>
        <div v-if="isDataLoaded && hasAnyMessages" class="w-[160px]">
          <Dropdown :button-text="selectedCategory" placeholder="全部類別" :items="categoryOptions" @item-click="handleCategoryChange" />
        </div>
        <div v-if="isDataLoaded && hasAnyMessages" class="rounded-lg border border-gray-300 bg-white">
          <Table
            v-if="filteredMessages.length > 0"
            :columns="tableColumns"
            :rows="paginationState.paginatedRows"
            :pagination="paginationState.pagination"
            row-key="title"
            :row-clickable="true"
            @row-click="handleRowClick"
            @page-change="paginationState.handlePageChange"
          >
            <!-- Index -->
            <template #cell-index="{ rowIndex }">
              <p class="text-base text-gray-500">{{ (paginationState.currentPage - 1) * pageSize + rowIndex + 1 }}</p>
            </template>
            <!-- Status -->
            <template #cell-status="{ row }">
              <div @click.stop @mousedown.prevent>
                <Badge v-if="row.tabStatus === 'draft'" variant="gray" text="暫存中" />
                <Switch v-else :model-value="row.status" :show-text="true" on-text="上架" off-text="下架" @update:model-value="(value) => handleStatusChange(row, value)" />
              </div>
            </template>
            <!-- Action -->
            <template #cell-action="{ row }">
              <div class="flex items-center gap-4">
                <ButtonCTA variant="text" size="sm" icon-only left-icon="editOutline" @click.stop="handleEdit(row)" aria-label="編輯" />
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="刪除" />
              </div>
            </template>
          </Table>
          <Empty v-else type="search" :show-button="false" class="py-12" />
        </div>
        <div v-else-if="isDataLoaded" class="rounded-lg border border-gray-300 bg-white">
          <Empty type="case-management" message="尚未新增公開消息" button-text="新增公開消息" @button-click="handleAddMessage" />
        </div>
      </div>
    </div>
    <ConfirmDeleteModal
      v-model="showDeleteModal"
      message="確認刪除此項目"
      description="內容將完全刪除無法復原"
      @confirm="handleConfirmDelete"
      @cancel="handleCloseDeleteModal"
    />
    <div class="fixed bottom-6 z-[90]" :style="toastStyle">
      <Toast v-model="showToast" :message="toastMessage" :show-actions="false" :show-close="false" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import Toast from "@/components/atoms/Toast.vue";
import Switch from "@/components/atoms/Switch.vue";
import Dropdown from "@/components/atoms/Dropdown.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Empty from "@/components/atoms/Empty.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import { fetchPublicMessageList } from "@/services/backend/homepageMaintenance/publicMessageService";
import type { PublicMessageItem } from "@/types/backend/homepageMaintenance/publicMessageManagement.d";

const router = useRouter();
const route = useRoute();

const pageSize = ref<number>(10);
const isDataLoaded = ref(false);
const selectedCategory = ref<string>("");
const showDeleteModal = ref(false);
const deleteTarget = ref<PublicMessageItem | null>(null);
const showToast = ref(false);
const toastMessage = ref("新增成功");

const toastStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};

const categoryOptions = [
  { label: "全部類別", value: "" },
  { label: "最新消息", value: "最新消息" },
  { label: "會議公告", value: "會議公告" },
  { label: "新聞快訊", value: "新聞快訊" },
];

const allMessages = ref<PublicMessageItem[]>([]);

const normalizeNewsStatus = (newsStatus: string) => {
  if (newsStatus === "DRAFT") return { status: false, tabStatus: "draft" as const };
  if (newsStatus === "PUBLISHED") return { status: true, tabStatus: "published" as const };
  return { status: false, tabStatus: "unpublished" as const };
};

const normalizePublicMessageItem = (item: Record<string, any>): PublicMessageItem => {
  const normalizedStatus = normalizeNewsStatus(String(item.newsStatus ?? ""));
  return {
    id: String(item.id),
    title: item.title ?? "",
    category: item.categoryLabel ?? item.category ?? "",
    publishDate: item.publishDate ?? "",
    content: item.content ?? item.summary ?? "",
    ...normalizedStatus,
  };
};

const hasAnyMessages = computed(() => allMessages.value.length > 0);

const tableColumns: TableColumn[] = [
  { key: "index", label: "項次", width: "5%" },
  { key: "title", label: "公開消息", width: "42%" },
  { key: "category", label: "類別", width: "11%" },
  { key: "publishDate", label: "發布日期", width: "12%", sortable: true },
  { key: "status", label: "狀態", width: "10%" },
  { key: "action", label: "動作", width: "20%" },
];

const filteredMessages = computed(() => {
  let messages = [...allMessages.value];

  // Filter by category
  if (selectedCategory.value) {
    messages = messages.filter((item) => item.category === selectedCategory.value);
  }

  return messages;
});

const paginationState = reactive(useTablePagination({
  rows: filteredMessages,
  pageSize,
  slice: false,
}));

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
}

const handleCategoryChange = (item: { label: string; value?: string }) => {
  selectedCategory.value = item.value || "";
  paginationState.resetPage();
}

const handleAddMessage = () => {
  router.push("/public-message-management/add");
}

const handleRowClick = (row: Record<string, any>) => {
  handleEdit(row);
}

const handleEdit = (row: Record<string, any>) => {
  const item = row as PublicMessageItem;
  router.push(`/public-message-management/edit/${item.id}`);
}

const handleStatusChange = (row: Record<string, any>, value: boolean) => {
  const item = row as PublicMessageItem;
  item.status = value;
  console.log("Status changed for:", item, "New status:", value);
  // 切換後該列可能被過濾掉，主動移除 focus 避免跳到下一列
  requestAnimationFrame(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement?.blur) activeElement.blur();
  });
  // TODO: Implement status change logic
}

const handleDelete = (row: Record<string, any>) => {
  const item = row as PublicMessageItem;
  console.log("Delete clicked for:", item);
  deleteTarget.value = item;
  showDeleteModal.value = true;
};

const handleCloseDeleteModal = () => {
  showDeleteModal.value = false;
  deleteTarget.value = null;
};

const handleConfirmDelete = () => {
  if (deleteTarget.value) {
    allMessages.value = allMessages.value.filter((item) => item.title !== deleteTarget.value?.title);
  }
  handleCloseDeleteModal();
  toastMessage.value = "刪除成功";
  showToast.value = true;
};

const loadPublicMessages = async () => {
  const response = await fetchPublicMessageList();
  allMessages.value = response.data.data.content.map(normalizePublicMessageItem);
  isDataLoaded.value = true;
};

const maybeShowReturnToast = () => {
  const toastType = route.query.toast as string | undefined;
  if (toastType !== "success") return;
  const msg = (route.query.msg as string | undefined) || "新增成功";
  toastMessage.value = msg;
  showToast.value = true;
  router.replace({ path: route.path, query: { ...route.query, toast: undefined, msg: undefined } });
};

onMounted(async () => {
  await loadPublicMessages();
  maybeShowReturnToast();
});

watch(
  () => route.query.toast,
  () => {
    maybeShowReturnToast();
  }
);
</script>
