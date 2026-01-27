<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">內部人員帳號管理</h1>
      </div>

      <!-- Main Content Card -->
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <!-- Administrator Section -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">管理員和權限</h2>
          </div>
          <p class="text-xl text-gray-500">管理者可以在系統中查看內容或執行的操作。</p>

          <!-- Highest Admin Account Card -->
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

        <!-- Handler Accounts Section -->
        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-4">
              <p class="text-base font-medium text-gray-800">承辦帳號</p>
              <p class="text-base text-gray-600">已邀請 {{ handlerAccounts.length }} 位</p>
            </div>
            <ButtonCTA variant="primary" size="sm" @click="handleAddHandler">新增承辦</ButtonCTA>
          </div>

          <!-- Table -->
          <div class="rounded-lg border border-gray-300 bg-white">
            <Table :columns="tableColumns" :rows="paginatedHandlers" :pagination="pagination" @page-change="handlePageChange">
              <!-- Index -->
              <template #cell-index="{ rowIndex }">
                <p class="text-base text-gray-500">{{ (currentPage - 1) * pageSize + rowIndex + 1 }}</p>
              </template>
              <!-- Permissions -->
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

              <!-- Status -->
              <template #cell-status="{ row }">
                <Switch :model-value="row.status" :show-text="true" on-text="啟用" off-text="停權" @update:model-value="(value) => handleStatusChange(row, value)" />
              </template>

              <!-- Action -->
              <template #cell-action="{ row }">
                <div class="flex items-center">
                  <ButtonCTA variant="text" size="sm" icon-only left-icon="pencil" @click.stop="handleEdit(row)" aria-label="編輯承辦帳號" />
                  <ButtonCTA variant="textPlain" size="sm" @click.stop="handleRemove(row)" aria-label="移除承辦帳號"> 移除 </ButtonCTA>
                </div>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Account Drawer -->
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

        <!-- Divider -->
        <div class="border-t border-gray-300"></div>

        <!-- Change Account Section -->
        <div class="flex flex-col gap-4 pt-6">
          <p class="text-base font-medium text-gray-900">更換最高權限帳號</p>
          <div class="flex flex-col gap-6">
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
        </div>
      </div>

      <template #footer>
        <div class="flex w-full justify-end gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancelChangeAccount">取消</ButtonCTA>
          <ButtonCTA variant="gray" size="xl" class="w-[124px]" @click="handleSaveChangeAccount">儲存</ButtonCTA>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import Switch from "@/components/atoms/Switch.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import Radio from "@/components/atoms/Radio.vue";

interface Permission {
  category: string;
  functions: string[];
}

interface HandlerAccount {
  name: string;
  email: string;
  department: string;
  group: string;
  permissions: Permission[];
  status: boolean; // true = 啟用, false = 停權
}

// State
const currentPage = ref<number>(1);
const router = useRouter();
const pageSize = ref<number>(10);
const showEditModal = ref<boolean>(false);
const editingHandler = ref<HandlerAccount | null>(null);
const showChangeAccountDrawer = ref<boolean>(false);
const selectedAccountEmail = ref<string>("");
const editForm = ref<{
  name: string;
  email: string;
  department: string;
  group: string;
  status: boolean;
}>({
  name: "",
  email: "",
  department: "",
  group: "",
  status: true,
});

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

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    headerClass: "w-[52px]",
    cellClass: "w-[52px]",
  },
  {
    key: "name",
    label: "承辦姓名",
    headerClass: "w-[101px]",
    cellClass: "w-[101px]",
  },
  {
    key: "email",
    label: "公務信箱",
    headerClass: "w-[152px]",
    cellClass: "w-[152px]",
  },
  {
    key: "department",
    label: "科室",
    headerClass: "w-[150px]",
    cellClass: "w-[150px]",
  },
  {
    key: "group",
    label: "組別",
    headerClass: "w-[128px]",
    cellClass: "w-[128px]",
  },
  {
    key: "permissions",
    label: "角色權限",
  },
  {
    key: "status",
    label: "狀態",
  },
  {
    key: "action",
    label: "動作",
  },
];

// 注意：分頁現在由 Table 組件內部處理，所以這裡直接傳遞所有數據
const paginatedHandlers = computed(() => {
  return handlerAccounts.value;
});

// Pagination
const pagination = computed<TablePagination>(() => ({
  currentPage: currentPage.value,
  total: handlerAccounts.value.length,
  pageSize: pageSize.value,
}));

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleChangeAccount = () => {
  selectedAccountEmail.value = currentAdminAccount.value.email;
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
  showChangeAccountDrawer.value = false;
  selectedAccountEmail.value = "";
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

const handleSaveEdit = () => {
  if (!editingHandler.value) return;

  // 更新資料
  const index = handlerAccounts.value.findIndex((account) => account.email === editingHandler.value?.email);
  if (index !== -1) {
    handlerAccounts.value[index] = {
      ...handlerAccounts.value[index],
      name: editForm.value.name,
      email: editForm.value.email,
      department: editForm.value.department,
      group: editForm.value.group,
      status: editForm.value.status,
    };
  }

  // 關閉 Modal
  showEditModal.value = false;
  editingHandler.value = null;

  // TODO: 調用 API 保存資料
  console.log("Saved handler account:", editForm.value);
};

const handleRemove = (row: Record<string, any>) => {
  const item = row as HandlerAccount;
  if (confirm(`確定要移除「${item.name}」的承辦帳號嗎？`)) {
    const index = handlerAccounts.value.findIndex((account) => account.email === item.email);
    if (index !== -1) {
      handlerAccounts.value.splice(index, 1);
    }
    // TODO: 調用 API 刪除資料
    console.log("Removed handler account:", item);
  }
};
</script>
