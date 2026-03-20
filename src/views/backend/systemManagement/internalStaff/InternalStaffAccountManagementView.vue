<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">內部人員帳號管理</h1>
      </div>
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">管理員和權限</h2>
          </div>
          <p class="text-xl text-gray-500">管理者可以在系統中查看內容或執行的操作。</p>
          <div class="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-6">
            <div class="flex flex-col gap-4">
              <p class="text-base font-medium text-gray-800">最高管理權限帳號</p>
              <div class="flex flex-col gap-1">
                <p class="text-base text-gray-600">張森</p>
                <p class="text-base text-gray-600">abc123@taichung.gov.tw</p>
              </div>
            </div>
            <ButtonCTA variant="primary" size="sm" @click="handleChangeAccount">更換帳號</ButtonCTA>
          </div>
        </div>
        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-4">
              <p class="text-base font-medium text-gray-800">承辦帳號</p>
              <p v-if="hasAnyHandlers" class="text-base text-gray-600">已邀請 {{ handlerAccounts.length }} 位</p>
            </div>
            <ButtonCTA v-if="hasAnyHandlers" variant="primary" size="sm" @click="handleAddHandler">新增承辦</ButtonCTA>
          </div>
          <div v-if="hasAnyHandlers" class="rounded-lg border border-gray-300 bg-white">
            <Table
              :columns="tableColumns"
              :rows="paginationState.paginatedRows"
              :pagination="paginationState.pagination"
              row-key="email"
              @page-change="paginationState.handlePageChange"
            >
              <template #cell-index="{ rowIndex }">
                <p class="text-base text-gray-500">{{ (paginationState.currentPage - 1) * pageSize + rowIndex + 1 }}</p>
              </template>
              <template #cell-permissions="{ row }">
                <div class="text-base text-gray-600">
                  <div v-for="(permission, index) in row.permissions" :key="index" class="mb-2 last:mb-0">
                    <p class="mb-1 font-medium">{{ permission.category }}</p>
                    <ul class="ms-6 list-disc">
                      <li v-for="(func, funcIndex) in permission.functions" :key="funcIndex" class="text-sm">
                        {{ func }}
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
              <template #cell-status="{ row }">
                <div @click.stop @mousedown.prevent>
                  <Switch :model-value="row.status" :show-text="true" on-text="啟用" off-text="停權" @update:model-value="(value) => handleStatusChange(row, value)" />
                </div>
              </template>
              <template #cell-action="{ row }">
                <div class="flex items-center gap-2">
                  <ButtonCTA variant="text" size="sm" icon-only left-icon="pencil" @click.stop="handleEdit(row)" aria-label="編輯承辦帳號" />
                  <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="移除承辦帳號" />
                </div>
              </template>
            </Table>
          </div>
          <div v-else class="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white py-8">
            <Empty class="!h-auto !gap-6 py-6" type="case" message="" button-text="新增承辦" :show-button="true" @button-click="handleAddHandler" />
          </div>
        </div>
      </div>
    </div>
    <Drawer v-model="showChangeAccountDrawer" title="更換最高權限" width="xl" close-icon="close">
      <div class="flex flex-col gap-6">
        <!-- Current Account -->
        <div class="flex flex-col gap-4">
          <p class="text-base font-medium text-gray-800">目前帳號</p>
          <div class="flex flex-col gap-1">
            <p class="text-base text-gray-600">{{ currentAdminAccount.name }}</p>
            <p class="text-base text-gray-600">{{ currentAdminAccount.email }}</p>
          </div>
        </div>
        <div class="border-t border-gray-300"></div>
        <div class="flex flex-col gap-4 pt-6">
          <p class="text-base font-medium text-gray-900">更換最高權限帳號</p>
          <div v-if="hasAvailableAccounts" class="flex flex-col gap-6">
            <Radio
              v-for="account in availableAccounts"
              :key="account.email"
              :value="account.email"
              :name="'admin-account'"
              :model-value="selectedAccountEmail"
              container-class="flex gap-2 items-start"
              input-class="mt-0.5"
              @update:model-value="selectedAccountEmail = String($event)"
            >
              <div class="flex flex-col gap-2">
                <p class="text-base font-medium text-gray-900">{{ account.name }}</p>
                <p class="text-sm text-gray-500">{{ account.email }}</p>
              </div>
            </Radio>
          </div>
          <div v-else class="flex items-center justify-center rounded-lg border border-gray-300 bg-white py-8">
            <Empty class="!h-auto !gap-6 py-6" type="case" message="尚無可更換帳號" :show-button="false" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex w-full justify-end gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancelChangeAccount">取消</ButtonCTA>
          <ButtonCTA
            :variant="canSaveAdminAccount ? 'primary' : 'gray'"
            size="xl"
            class="w-[124px]"
            :disabled="!canSaveAdminAccount"
            @click="handleSaveChangeAccount"
          >
            儲存
          </ButtonCTA>
        </div>
      </template>
    </Drawer>

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      message="確認移除承辦帳號"
      :description="deleteTarget ? `確定要移除「${deleteTarget.name}」的承辦帳號嗎？` : '內容將完全刪除無法復原'"
      confirm-label="確認"
      @confirm="handleConfirmDelete"
      @cancel="handleCloseDeleteModal"
    />

    <Modal v-model="showCannotDeleteAdminModal" size="md" :static="false" :show-close-button="false" close-action="emit" backdrop-class="bg-gray-600/80">
      <template #header>
        <div class="flex w-full items-center justify-end px-4 pt-4">
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
            aria-label="關閉"
            @click="showCannotDeleteAdminModal = false"
          >
            <Icon name="close" :size="20" aria-hidden="true" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gray-400 text-[28px] font-medium leading-none text-white">!</div>
          <div class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">
            <p>無法移除最高權限帳號人員</p>
            <p>請先更換最高權限，再進行移除</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center px-6 pb-6 pt-0">
          <ButtonCTA variant="primary" size="xs" class="h-[37px] w-[120px] px-3 py-2 text-sm font-medium leading-[1.5]" @click="showCannotDeleteAdminModal = false">
            確認
          </ButtonCTA>
        </div>
      </template>
    </Modal>

    <div v-if="showToast" class="fixed bottom-6 left-1/2 z-[90] w-[min(1420px,calc(100vw-2rem))] -translate-x-1/2">
      <Toast v-model="showToast" :message="toastMessage" :show-actions="false" :show-close="true" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import Modal from "@/components/atoms/Modal.vue";
import Radio from "@/components/atoms/Radio.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import Switch from "@/components/atoms/Switch.vue";
import Toast from "@/components/atoms/Toast.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import type { HandlerAccount } from "@/types/backend/systemManagement/internalStaff/internalStaffAccountManagement.d";

// State
const router = useRouter();
const route = useRoute();
const pageSize = ref<number>(10);
const showDeleteModal = ref<boolean>(false);
const showCannotDeleteAdminModal = ref<boolean>(false);
const showToast = ref<boolean>(false);
const toastMessage = ref("儲存成功");
const deleteTarget = ref<HandlerAccount | null>(null);
const showChangeAccountDrawer = ref<boolean>(false);
const selectedAccountEmail = ref<string>("");

// Current Admin Account
const currentAdminAccount = ref<{
  name: string;
  email: string;
}>({
  name: "張森",
  email: "abc123@taichung.gov.tw",
});

// Available Accounts for Selection
const availableAccounts = ref<Array<{ name: string; email: string }>>([
  {
    name: "陳傑瑞",
    email: "tt05@taichung.gov.tw",
  },
  {
    name: "林美華",
    email: "123@taichung.gov.tw",
  },
  {
    name: "吳偉翔",
    email: "321xyz@taichung.gov.tw",
  },
]);
const hasAvailableAccounts = computed(() => availableAccounts.value.length > 0);
const buildAdminAccountSnapshot = () => JSON.stringify({ email: selectedAccountEmail.value.trim() });
const { hasUnsavedChanges: hasAdminAccountChanges, captureInitial: captureAdminAccountInitial } = useFormUnsavedCheck(buildAdminAccountSnapshot);
const canSaveAdminAccount = computed(() => hasAvailableAccounts.value && hasAdminAccountChanges.value);

// Mock Data
const handlerAccounts = ref<HandlerAccount[]>([
  {
    name: "陳傑瑞",
    email: "tt05@taichung.gov.tw",
    department: "都市修復工程科",
    group: "業務承辦人員",
    permissions: [
      {
        category: "案件管理功能",
        functions: ["功能", "功能"],
      },
      {
        category: "首頁維護功能",
        functions: ["功能", "功能", "功能"],
      },
      {
        category: "我的帳號功能",
        functions: ["功能", "功能"],
      },
    ],
    status: true,
  },
  {
    name: "張森",
    email: "abc123@taichung.gov.tw",
    department: "住宅發展工程處",
    group: "系統管理人員",
    permissions: [
      {
        category: "案件管理功能",
        functions: ["功能", "功能"],
      },
      {
        category: "首頁維護功能",
        functions: ["功能", "功能", "功能"],
      },
      {
        category: "我的帳號功能",
        functions: ["功能", "功能"],
      },
    ],
    status: true,
  },
  {
    name: "吳偉翔",
    email: "321xyz@taichung.gov.tw",
    department: "都市更新工程科",
    group: "府內人員",
    permissions: [
      {
        category: "案件管理功能",
        functions: ["功能", "功能"],
      },
      {
        category: "首頁維護功能",
        functions: ["功能", "功能", "功能"],
      },
    ],
    status: false,
  },
  {
    name: "林美華",
    email: "may@taichung.gov.tw",
    department: "都計測量工程科",
    group: "府外人員",
    permissions: [
      {
        category: "案件管理功能",
        functions: ["功能", "功能"],
      },
      {
        category: "首頁維護功能",
        functions: ["功能", "功能", "功能"],
      },
    ],
    status: false,
  },
]);
const hasAnyHandlers = computed(() => handlerAccounts.value.length > 0);

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    width: "6%",
  },
  {
    key: "name",
    label: "承辦姓名",
    width: "12%",
  },
  {
    key: "email",
    label: "公務信箱",
    width: "18%",
  },
  {
    key: "department",
    label: "科室",
    width: "16%",
  },
  {
    key: "group",
    label: "組別",
    width: "12%",
  },
  {
    key: "permissions",
    label: "角色權限",
    width: "16%",
  },
  {
    key: "status",
    label: "狀態",
    width: "10%",
  },
  {
    key: "action",
    label: "動作",
    width: "10%",
  },
];

const paginationState = reactive(useTablePagination({
  rows: handlerAccounts,
  pageSize,
  slice: false,
}));

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleChangeAccount = () => {
  selectedAccountEmail.value = currentAdminAccount.value.email;
  captureAdminAccountInitial();
  showChangeAccountDrawer.value = true;
};

const handleCancelChangeAccount = () => {
  showChangeAccountDrawer.value = false;
  selectedAccountEmail.value = "";
};

const handleSaveChangeAccount = () => {
  const selectedAccount = availableAccounts.value.find((account) => account.email === selectedAccountEmail.value);
  if (selectedAccount) {
    currentAdminAccount.value = {
      name: selectedAccount.name,
      email: selectedAccount.email,
    };
    // TODO: 調用 API 更新最高權限帳號
    console.log("Changed admin account to:", selectedAccount);
  }
  captureAdminAccountInitial();
  showChangeAccountDrawer.value = false;
  selectedAccountEmail.value = "";
  toastMessage.value = "儲存成功";
  showToast.value = true;
};

const handleAddHandler = () => {
  router.push("/internal-staff-account-management/add");
};

const handleStatusChange = (row: Record<string, any>, value: boolean) => {
  const item = row as HandlerAccount;
  item.status = value;
  console.log("Status changed for:", item, "New status:", value);
  // TODO: Implement status change logic
};

const handleEdit = (row: Record<string, any>) => {
  const item = row as HandlerAccount;
  // 導航到編輯頁面，使用 query 參數傳遞數據
  router.push({
    path: "/internal-staff-account-management/add",
    query: {
      mode: "edit",
      email: item.email,
    },
  });
};

const handleDelete = (row: Record<string, any>) => {
  const item = row as HandlerAccount;
  if (item.email === currentAdminAccount.value.email) {
    showCannotDeleteAdminModal.value = true;
    return;
  }
  deleteTarget.value = item;
  showDeleteModal.value = true;
};

const handleCloseDeleteModal = () => {
  showDeleteModal.value = false;
  deleteTarget.value = null;
};

const handleConfirmDelete = () => {
  if (deleteTarget.value) {
    const index = handlerAccounts.value.findIndex((account) => account.email === deleteTarget.value?.email);
    if (index !== -1) {
      handlerAccounts.value.splice(index, 1);
      toastMessage.value = "已刪除";
      showToast.value = true;
    }
    // TODO: 調用 API 刪除資料
    console.log("Removed handler account:", deleteTarget.value);
  }
  handleCloseDeleteModal();
};

const handleRouteToast = () => {
  if (route.query.toast !== "success") return;

  const message = typeof route.query.message === "string" && route.query.message.trim() ? route.query.message : "新增成功";
  toastMessage.value = message;
  showToast.value = true;

  const nextQuery = { ...route.query };
  delete nextQuery.toast;
  delete nextQuery.message;
  router.replace({
    path: route.path,
    query: nextQuery,
  });
};

onMounted(() => {
  handleRouteToast();
});
</script>
