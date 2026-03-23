<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center gap-4">
          <ButtonCTA variant="none" icon-only left-icon="arrowLeftOutline" @click="handleGoBack" />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">{{ isEditMode ? "編輯承辦帳號" : "新增承辦帳號" }}</h1>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ isEditMode ? "編輯承辦帳號" : "新增承辦帳號" }}</h2>
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <Input v-model="formData.name" label="承辦姓名" placeholder="請輸入承辦姓名" size="lg" required container-class="w-[364px]" />
            <Input
              v-model="formData.email"
              label="公務信箱"
              :placeholder="isEditMode ? '' : '請輸入公務信箱'"
              size="lg"
              required
              :disabled="isEditMode"
              container-class="w-[364px]"
            />
            <InputDropdown
              label="科室"
              :button-text="formData.department"
              placeholder="選擇科室別"
              :items="departmentOptions"
              required
              container-class="w-[364px]"
              @item-click="handleDepartmentSelect"
            />
            <InputDropdown
              label="組別"
              :button-text="formData.group"
              placeholder="請選擇組別"
              :items="groupOptions"
              required
              container-class="w-[364px]"
              @item-click="handleGroupSelect"
            />
            <div class="flex flex-col gap-2">
              <div class="flex items-start gap-2">
                <label class="text-base font-medium text-gray-900">權限管理</label>
                <span class="pt-1 text-xs leading-none text-red-500">*</span>
              </div>
              <div class="flex w-[922px] flex-col gap-6 rounded-lg border border-gray-300 p-6">
                <div class="flex flex-col gap-4">
                  <div class="flex items-center justify-between">
                    <Checkbox
                      v-model="selectAllPermissions"
                      :indeterminate="isIndeterminate"
                      label="開通所有權限"
                      label-class="text-sm font-medium"
                      @update:model-value="handleSelectAllPermissions"
                    />
                  </div>
                  <div class="h-px bg-gray-300"></div>
                </div>
                <div class="flex flex-col gap-4">
                  <div v-for="permissionGroup in permissionGroups" :key="permissionGroup.key" class="flex flex-col gap-4">
                    <p class="text-base font-medium text-gray-800">{{ permissionGroup.title }}</p>
                    <div class="flex flex-col gap-4">
                      <Checkbox
                        v-for="(func, index) in permissionGroup.functions"
                        :key="`${permissionGroup.key}-${index}`"
                        :model-value="(formData.permissions as any)[permissionGroup.key][func.key]"
                        @update:model-value="
                          (value: boolean) => {
                            (formData.permissions as any)[permissionGroup.key][func.key] = value;
                          }
                        "
                        :label="func.label"
                        label-class="text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Input v-model="formData.supervisorEmail" label="授權主管信箱" placeholder="請輸入授權主管信箱" size="lg" required container-class="w-[364px]" />
            <div class="h-px w-[958px] bg-gray-300"></div>
            <Switch v-model="formData.status" label="帳號狀態" show-text on-text="啟用" off-text="停權" required label-position="horizontal" />
          </div>
        </div>
        <div class="flex justify-center gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel">
            取消
          </ButtonCTA>
          <ButtonCTA
            :variant="canSubmit ? 'primary' : 'gray'"
            size="xl"
            class="w-[124px]"
            :disabled="!canSubmit"
            @click="handleSave"
          >
            {{ isEditMode ? "儲存" : "建立" }}
          </ButtonCTA>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Input from "@/components/atoms/Input.vue";
import Switch from "@/components/atoms/Switch.vue";
import Checkbox from "@/components/atoms/Checkbox.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import InputDropdown from "@/components/atoms/InputDropdown.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
const route = useRoute();
const router = useRouter();
const isIndeterminate = ref(false);
const selectAllPermissions = ref(false);
const formData = ref({
  name: "",
  email: "",
  department: "",
  group: "",
  permissions: {
    caseManagement: {
      function1: false,
      function2: false,
      function3: false,
    },
    homepageMaintenance: {
      function1: false,
      function2: false,
      function3: false,
    },
    myAccount: {
      function1: false,
      function2: false,
      function3: false,
    },
  },
  supervisorEmail: "",
  status: true,
  statusText: "請輸入承辦信箱",
});
const departmentOptions = [{ label: "都市修復工程科" }, { label: "住宅發展工程處" }, { label: "都市更新工程科" }, { label: "都計測量工程科" }];
const groupOptions = [
  { label: "審議委員" },
  { label: "業務承辦人員" },
  { label: "系統管理人員" },
  { label: "府內人員" },
  { label: "府外人員" },
  { label: "局內人員" },
  { label: "申請者" },
];
const permissionGroups = [
  {
    key: "caseManagement",
    title: "案件管理功能",
    functions: [
      { key: "function1", label: "功能" },
      { key: "function2", label: "功能" },
      { key: "function3", label: "功能" },
    ],
  },
  {
    key: "homepageMaintenance",
    title: "首頁維護功能",
    functions: [
      { key: "function1", label: "功能" },
      { key: "function2", label: "功能" },
      { key: "function3", label: "功能" },
    ],
  },
  {
    key: "myAccount",
    title: "我的帳號功能",
    functions: [
      { key: "function1", label: "功能" },
      { key: "function2", label: "功能" },
      { key: "function3", label: "功能" },
    ],
  },
];
// Mock 數據（實際應該從 API 或 store 獲取）
const mockHandlerAccountsData = [
  {
    name: "陳傑瑞",
    email: "tt05@taichung.gov.tw",
    department: "都市修復工程科",
    group: "業務承辦人員",
    permissions: [
      { category: "案件管理功能", functions: ["功能", "功能"] },
      { category: "首頁維護功能", functions: ["功能", "功能", "功能"] },
      { category: "我的帳號功能", functions: ["功能", "功能"] },
    ],
    status: true,
    supervisorEmail: "abc123@taichung.gov.tw",
  },
  {
    name: "張森",
    email: "abc123@taichung.gov.tw",
    department: "住宅發展工程處",
    group: "系統管理人員",
    permissions: [
      { category: "案件管理功能", functions: ["功能", "功能"] },
      { category: "首頁維護功能", functions: ["功能", "功能", "功能"] },
      { category: "我的帳號功能", functions: ["功能", "功能"] },
    ],
    status: true,
    supervisorEmail: "abc123@taichung.gov.tw",
  },
  {
    name: "吳偉翔",
    email: "321xyz@taichung.gov.tw",
    department: "都市修復工程科",
    group: "府內人員",
    permissions: [
      { category: "案件管理功能", functions: ["功能", "功能", "功能"] },
      { category: "首頁維護功能", functions: [] },
      { category: "我的帳號功能", functions: [] },
    ],
    status: true,
    supervisorEmail: "abc123@taichung.gov.tw",
  },
  {
    name: "林美華",
    email: "may@taichung.gov.tw",
    department: "都計測量工程科",
    group: "府外人員",
    permissions: [
      { category: "案件管理功能", functions: ["功能", "功能"] },
      { category: "首頁維護功能", functions: ["功能"] },
      { category: "我的帳號功能", functions: ["功能", "功能"] },
    ],
    status: false,
    supervisorEmail: "abc123@taichung.gov.tw",
  },
];
// 轉換為編輯頁面需要的格式
const mockHandlerAccounts: Record<string, any> = {};
mockHandlerAccountsData.forEach((account) => {
  mockHandlerAccounts[account.email] = {
    name: account.name,
    email: account.email,
    department: account.department,
    group: account.group,
    permissions: convertPermissionsFormat(account.permissions),
    supervisorEmail: account.supervisorEmail,
    status: account.status,
    statusText: "請輸入承辦信箱",
  };
});
const isEditMode = computed(() => route.query.mode === "edit");
const formUnsavedCheck = useFormUnsavedCheck(() => buildFormSnapshot());
const hasAnyPermissionSelected = computed(() =>
  permissionGroups.some((group) => group.functions.some((func) => (formData.value.permissions as any)[group.key][func.key]))
);
const hasRequiredFields = computed(
  () =>
    formData.value.name.trim() !== "" &&
    formData.value.email.trim() !== "" &&
    formData.value.department.trim() !== "" &&
    formData.value.group.trim() !== "" &&
    formData.value.supervisorEmail.trim() !== "" &&
    hasAnyPermissionSelected.value
);
const canSubmit = computed(() => formUnsavedCheck.hasUnsavedChanges.value && hasRequiredFields.value);
// Watch for select all checkbox
watch(selectAllPermissions, (newValue) => {
  handleSelectAllPermissions(newValue);
});
// Watch individual permissions to update select all
watch(
  () => {
    const allPermissions: boolean[] = [];
    permissionGroups.forEach((group) => {
      group.functions.forEach((func) => {
        allPermissions.push((formData.value.permissions as any)[group.key][func.key]);
      });
    });
    return allPermissions;
  },
  (permissions) => {
    const allSelected = permissions.every((p) => p === true);
    const noneSelected = permissions.every((p) => p === false);
    const someSelected = permissions.some((p) => p === true) && !allSelected;

    if (allSelected) {
      selectAllPermissions.value = true;
      isIndeterminate.value = false;
    } else if (noneSelected) {
      selectAllPermissions.value = false;
      isIndeterminate.value = false;
    } else if (someSelected) {
      selectAllPermissions.value = false;
      isIndeterminate.value = true;
    }
  },
  { deep: true }
);
// 監聽路由變化，當進入編輯模式時載入數據
watch(
  () => [isEditMode.value, route.query.email],
  () => {
    loadEditData();
  },
  { immediate: true }
);
const buildFormSnapshot = () =>
  JSON.stringify({
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    department: formData.value.department.trim(),
    group: formData.value.group.trim(),
    permissions: formData.value.permissions,
    supervisorEmail: formData.value.supervisorEmail.trim(),
    status: formData.value.status,
  });
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
}
const handleGoBack = () => {
  router.back();
}
const handleDepartmentSelect = (item: any) => {
  formData.value.department = item.label;
}
const handleGroupSelect = (item: any) => {
  formData.value.group = item.label;
};
const handleSelectAllPermissions = (value: boolean) => {
  permissionGroups.forEach((group) => {
    group.functions.forEach((func) => {
      (formData.value.permissions as any)[group.key][func.key] = value;
    });
  });
};
const handleCancel = () => {
  router.back();
};
// Mock data for editing (實際應該從 API 或 store 獲取)
// 注意：這裡的數據結構需要與管理頁面的數據結構匹配
// 將管理頁面的數據格式轉換為編輯頁面需要的格式
const convertPermissionsFormat = (permissions: Array<{ category: string; functions: string[] }>) => {
  const result: any = {
    caseManagement: { function1: false, function2: false, function3: false },
    homepageMaintenance: { function1: false, function2: false, function3: false },
    myAccount: { function1: false, function2: false, function3: false },
  };

  permissions.forEach((perm) => {
    const keyMap: Record<string, string> = {
      案件管理功能: "caseManagement",
      首頁維護功能: "homepageMaintenance",
      我的帳號功能: "myAccount",
    };
    const key = keyMap[perm.category];
    if (key) {
      perm.functions.forEach((_, index) => {
        const funcKey = `function${index + 1}` as "function1" | "function2" | "function3";
        if (result[key] && result[key][funcKey] !== undefined) {
          result[key][funcKey] = true;
        }
      });
    }
  });

  return result;
};
// 載入編輯數據
const loadEditData = () => {
  if (!isEditMode.value || !route.query.email) {
    // 如果不是編輯模式，重置表單
    if (!isEditMode.value) {
      formData.value = {
        name: "",
        email: "",
        department: "",
        group: "",
        permissions: {
          caseManagement: {
            function1: false,
            function2: false,
            function3: false,
          },
          homepageMaintenance: {
            function1: false,
            function2: false,
            function3: false,
          },
          myAccount: {
            function1: false,
            function2: false,
            function3: false,
          },
        },
        supervisorEmail: "",
        status: true,
        statusText: "請輸入承辦信箱",
      };
      selectAllPermissions.value = false;
      isIndeterminate.value = false;
      formUnsavedCheck.captureInitial();
    }
    return;
  }

  // 從 mock 數據中查找（實際應該從 API 獲取）
  const email = route.query.email as string;
  const account = mockHandlerAccounts[email];

  if (account) {
    formData.value = {
      name: account.name,
      email: account.email,
      department: account.department,
      group: account.group,
      permissions: JSON.parse(JSON.stringify(account.permissions)), // 深拷貝
      supervisorEmail: account.supervisorEmail,
      status: account.status,
      statusText: account.statusText || "請輸入承辦信箱",
    };

    // 更新 selectAllPermissions 和半選狀態
    const allPermissions: boolean[] = [];
    permissionGroups.forEach((group) => {
      group.functions.forEach((func) => {
        allPermissions.push((account.permissions as any)[group.key]?.[func.key] || false);
      });
    });
    const allSelected = allPermissions.every((p) => p === true);
    const someSelected = allPermissions.some((p) => p === true) && !allSelected;
    selectAllPermissions.value = allSelected;
    isIndeterminate.value = someSelected;
    formUnsavedCheck.captureInitial();
  } else {
    console.warn(`Account not found for email: ${email}`);
  }
};
const handleCreate = () => {
  console.log("Create account:", formData.value);
  // TODO: Implement create logic
  router.push({
    path: "/internal-staff-account-management",
    query: {
      toast: "success",
      message: "新增成功",
    },
  });
};
const handleSave = () => {
  if (isEditMode.value) {
    console.log("Update account:", formData.value);
    // TODO: Implement update logic
  } else {
    handleCreate();
    formUnsavedCheck.captureInitial();
    return;
  }
  formUnsavedCheck.captureInitial();
  router.push("/internal-staff-account-management");
};
// 初始化
onMounted(() => {
  loadEditData();
});
</script>
