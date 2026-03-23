<template>
  <div class="min-h-screen bg-[#F0F5FF]">
    <div class="relative flex min-h-screen flex-col px-4 pt-[40px] sm:px-[60px]">
      <router-link
        to="/login"
        class="flex items-center gap-2 text-base font-normal leading-normal text-primary-700 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        aria-label="返回登入頁面"
      >
        <Icon name="arrowleft" :size="16" class="shrink-0" aria-hidden="true" />
        <span>返回登入</span>
      </router-link>
      <div class="mt-[120px] flex w-full max-w-[428px] flex-col items-start gap-10 self-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-medium leading-6 text-gray-900">忘記密碼</h1>
          <p class="text-base font-normal leading-[1.5] text-gray-500">發送設定連結至以下信箱</p>
        </div>
        <Input
          v-model="formData.email"
          label="電子信箱"
          type="email"
          placeholder="請輸入電子信箱"
          required
          size="lg"
          :error="!!errors.email"
          :error-message="errors.email"
          @clear-error="errors.email = ''"
        />
        <ButtonCTA :disabled="!isFormValid" variant="primary" type="button" class="h-[40px] w-full" @click="handleSubmit">發送</ButtonCTA>
      </div>
    </div>
    <Modal v-model="showSuccessModal" :static="true" size="md" close-action="emit" @close-click="handleReturnToLogin">
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="relative flex size-[42px] shrink-0 items-center justify-center">
            <Icon name="check" :size="42" class="text-gray-400" aria-hidden="true" />
          </div>
          <div class="flex w-full flex-col items-center">
            <div class="whitespace-pre-wrap text-center text-base font-normal leading-normal text-gray-600">
              <p class="mb-0">密碼設定連結已發送至信箱</p>
              <p>請至信箱確認後重新登入</p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
          <ButtonCTA variant="primary" type="button" class="h-[34px] w-[120px] text-base" @click="handleReturnToLogin"> 回登入頁</ButtonCTA>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Modal from "@/components/atoms/Modal.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
const router = useRouter();
const formData = ref({
  email: "",
});
const errors = ref({
  email: "",
});
const showSuccessModal = ref(false);
const isFormValid = computed(() => {
  return formData.value.email.trim() !== "" && isValidEmail(formData.value.email);
});
// 簡單的電子信箱驗證
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const handleSubmit = () => {
  // 清除之前的錯誤
  errors.value.email = "";
  if (!formData.value.email.trim()) {
    errors.value.email = "請輸入電子信箱";
    return;
  }
  if (!isValidEmail(formData.value.email)) {
    errors.value.email = "請輸入有效的電子信箱";
    return;
  }
  if (isFormValid.value) {
    console.log("發送重設密碼連結至:", formData.value.email);
    // TODO: 實作發送重設密碼連結的邏輯
    // 顯示成功 Modal
    showSuccessModal.value = true;
  }
};
const handleReturnToLogin = () => {
  showSuccessModal.value = false;
  router.push("/login");
};
</script>
