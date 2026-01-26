<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Back Button -->
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <div class="flex items-center gap-4">
          <ButtonCTA variant="none" icon-only left-icon="arrowLeftOutline" @click="handleGoBack" aria-label="返回上一頁" />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h1>
        </div>
      </div>

      <!-- Form Card -->
      <div class="flex flex-col gap-10">
        <!-- Form Section -->
        <div class="rounded-lg bg-white p-8 shadow-sm">
          <!-- Section Title -->
          <div class="mb-10 flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">變更密碼</h2>
          </div>

          <!-- Form Fields -->
          <div class="flex flex-col gap-4">
            <!-- 舊密碼 -->
            <div class="w-full max-w-[364px]">
              <Input v-model="formData.oldPassword" label="舊密碼" type="password" size="lg" placeholder="請輸入舊密碼"
                :error="errors.oldPassword" :error-message="errorMessages.oldPassword"
                @clear-error="errors.oldPassword = false" />
            </div>

            <!-- 新密碼 -->
            <div class="w-full max-w-[364px]">
              <Input v-model="formData.newPassword" label="新密碼" type="password" size="lg" placeholder="請輸入新密碼"
                :error="errors.newPassword" :error-message="errorMessages.newPassword"
                @clear-error="errors.newPassword = false" />
              <p class="mt-2 text-base leading-[1.25] text-gray-500">密碼至少需要9字元，包含大小寫字母、數字、特殊符號</p>
            </div>

            <!-- 再次確認密碼 -->
            <div class="w-full max-w-[364px]">
              <Input v-model="formData.confirmPassword" label="再次確認密碼" type="password" size="lg" placeholder="請再次輸入新密碼"
                :error="errors.confirmPassword" :error-message="errorMessages.confirmPassword"
                @clear-error="errors.confirmPassword = false" />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel"> 取消 </ButtonCTA>
          <ButtonCTA variant="primary" size="xl" class="w-[124px]" :disabled="isSaveDisabled" @click="handleSave"> 儲存變更
          </ButtonCTA>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Modal v-model="showSuccessModal" :static="true" size="md">
      <template #header>
        <div class="flex w-full items-center justify-end px-4 pb-0 pt-4">
          <ButtonCTA variant="none" icon-only left-icon="close" size="xs"
            class="h-5 w-5 rounded-lg bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-900"
            aria-label="關閉" @click="handleCloseSuccessModal">
            <span class="sr-only">關閉</span>
          </ButtonCTA>
        </div>
      </template>

      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <!-- Success Icon -->
          <div class="relative flex size-[42px] shrink-0 items-center justify-center">
            <Icon name="check" :size="42" class="text-gray-400" aria-hidden="true" />
          </div>
          <!-- Success Message -->
          <div class="flex w-full flex-col items-center">
            <p class="text-center text-base font-normal leading-normal text-gray-600">密碼重設成功，請使用新密碼登入</p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-center gap-4 px-6 pb-6 pt-0">
          <ButtonCTA variant="primary" class="h-[34px] w-[120px] px-5 py-3 text-base" @click="handleGoToLogin"> 回登入頁
          </ButtonCTA>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb, { type BreadcrumbItem } from "@/components/atoms/Breadcrumb.vue";
import Input from "@/components/atoms/Input.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Icon from "@/components/atoms/Icon.vue";
import Modal from "@/components/atoms/Modal.vue";

const router = useRouter();

// Check if user is admin
const isAdmin = computed(() => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      return user.role === "admin";
    } catch {
      return false;
    }
  }
  return false;
});

// Breadcrumb items based on role
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  if (isAdmin.value) {
    return [
      { label: "首頁", to: "/" },
      { label: "我的帳號" },
      { label: "人員帳號管理", to: "/profile" },
    ];
  }
  return [
    { label: "首頁", to: "/" },
    { label: "我的帳號" },
    { label: "編輯個人資料", to: "/profile" },
  ];
});

// Form Data
const formData = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Error States
const errors = ref({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false,
});

const errorMessages = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Success Modal State
const showSuccessModal = ref(false);

// 判斷按鈕是否應該被禁用
const isSaveDisabled = computed(() => {
  // 如果正在提交，禁用按鈕

  // 如果任何必填欄位為空，禁用按鈕
  if (!formData.value.oldPassword || !formData.value.newPassword || !formData.value.confirmPassword) {
    return true;
  }

  // 如果有任何錯誤，禁用按鈕
  if (errors.value.oldPassword || errors.value.newPassword || errors.value.confirmPassword) {
    return true;
  }

  return false;
});

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleGoBack = () => {
  router.back();
};

const handleCancel = () => {
  router.back();
};

const validateForm = (): boolean => {
  let isValid = true;

  // 重置錯誤
  errors.value = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  };
  errorMessages.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // 驗證舊密碼
  if (!formData.value.oldPassword) {
    errors.value.oldPassword = true;
    errorMessages.value.oldPassword = "請輸入舊密碼";
    isValid = false;
  }

  // 驗證新密碼
  if (!formData.value.newPassword) {
    errors.value.newPassword = true;
    errorMessages.value.newPassword = "請輸入新密碼";
    isValid = false;
  } else {
    // 驗證密碼格式：至少9字元，包含大小寫字母、數字、特殊符號
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
    if (!passwordRegex.test(formData.value.newPassword)) {
      errors.value.newPassword = true;
      errorMessages.value.newPassword = "密碼至少需要9字元，包含大小寫字母、數字、特殊符號";
      isValid = false;
    }
  }

  // 驗證確認密碼
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = true;
    errorMessages.value.confirmPassword = "請再次輸入新密碼";
    isValid = false;
  } else if (formData.value.newPassword !== formData.value.confirmPassword) {
    errors.value.confirmPassword = true;
    errorMessages.value.confirmPassword = "兩次輸入密碼不同，請再確認您輸入的密碼";
    isValid = false;
  }

  return isValid;
};

const handleSave = async () => {
  if (!validateForm()) {
    return;
  }

  // 防止重複提交

  // TODO: 實現儲存功能
  try {
    // 這裡可以調用 API 儲存資料
    // const response = await changePasswordAPI({
    //   oldPassword: formData.value.oldPassword,
    //   newPassword: formData.value.newPassword,
    // });

    // 模擬 API 調用 - 如果舊密碼錯誤
    // 實際使用時，應該根據 API 返回的錯誤來設置
    // if (response.error === 'INVALID_OLD_PASSWORD') {
    //   errors.value.oldPassword = true;
    //   errorMessages.value.oldPassword = "密碼錯誤，請重新輸入";
    //   isSubmitting.value = false;
    //   return;
    // }

    console.log("Change password", formData.value);
    // 成功後顯示成功 Modal
    showSuccessModal.value = true;
  } catch (error: any) {
    // 處理 API 錯誤
    if (error.message === "INVALID_OLD_PASSWORD" || error.code === "INVALID_OLD_PASSWORD") {
      errors.value.oldPassword = true;
      errorMessages.value.oldPassword = "密碼錯誤，請重新輸入";
    }
  }
};

const handleCloseSuccessModal = () => {
  showSuccessModal.value = false;
};

const handleGoToLogin = () => {
  showSuccessModal.value = false;
  // 清除登入資料
  localStorage.removeItem("userInfo");
  // 觸發自定義事件，通知其他組件登入狀態已改變
  window.dispatchEvent(new Event("login-status-changed"));
  router.push("/login");
};
</script>
