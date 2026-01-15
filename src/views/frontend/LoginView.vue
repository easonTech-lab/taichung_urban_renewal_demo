<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F0F5FF]">
    <div class="flex max-w-[428px] flex-col items-center gap-10 bg-[#F0F5FF] px-0 py-[120px]">
      <h1 class="text-center text-2xl font-medium leading-6 text-gray-900">管理者登入</h1>
      <form class="flex w-full flex-col items-end gap-4 rounded-lg bg-white p-8 shadow-sm" @submit.prevent="handleLogin" aria-label="管理者登入表單">
        <Input
          v-model="formData.username"
          label="帳號"
          type="text"
          placeholder="請輸入帳號"
          required
          :error="!!errors.username"
          :error-message="errors.username"
          @clear-error="errors.username = ''"
        />
        <Input
          v-model="formData.password"
          label="密碼"
          type="password"
          placeholder="請輸入密碼"
          required
          :error="!!errors.password"
          :error-message="errors.password"
          @clear-error="errors.password = ''"
        />
        <div class="flex w-full flex-wrap items-end gap-4">
          <div class="min-w-[200px] flex-1">
            <Input
              v-model="formData.captcha"
              label="驗證碼"
              type="text"
              placeholder="請輸入驗證碼"
              required
              :error="!!errors.captcha"
              :error-message="errors.captcha"
              @clear-error="errors.captcha = ''"
            />
          </div>
          <div class="flex h-[49px] w-[125px] items-center justify-center rounded bg-gray-200">
            <img
              :src="captchaImageUrl"
              alt="驗證碼圖片，請輸入圖片中顯示的文字或數字"
              class="h-full w-full rounded object-cover"
              aria-label="驗證碼圖片"
            />
          </div>
        </div>
      </form>
      <div class="flex w-[240px] flex-col items-center gap-6">
        <ButtonCTA :disabled="!isFormValid" variant="primary" type="button" class="w-full" @click="handleLogin">登入</ButtonCTA>
        <a
          href="#"
          class="w-full text-center text-base font-medium leading-normal text-primary-700 hover:underline"
          @click.prevent="handleForgotPassword"
        >
          忘記密碼
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Input from "@/components/atoms/Input.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const router = useRouter();
const captchaImageUrl = ref("https://via.placeholder.com/125x49?text=驗證碼");

// 假帳密資料
const mockUsers = [
  { username: "adm", password: "adm" },
  { username: "user", password: "user" },
];

const formData = ref({
  username: "",
  password: "",
  captcha: "",
});

const errors = ref({
  username: "",
  password: "",
  captcha: "",
});

const isFormValid = computed(() => {
  return formData.value.username.trim() !== "" && formData.value.password.trim() !== "" && formData.value.captcha.trim() !== "";
});

// 清除錯誤訊息
const clearErrors = () => {
  errors.value = {
    username: "",
    password: "",
    captcha: "",
  };
};

// 設置錯誤訊息
const setError = (field: "username" | "password" | "captcha", message: string) => {
  errors.value[field] = message;
};

const handleLogin = () => {
  // 清除之前的錯誤
  clearErrors();

  if (!isFormValid.value) {
    // 表單驗證失敗
    if (!formData.value.username.trim()) {
      errors.value.username = "請輸入帳號";
    }
    if (!formData.value.password.trim()) {
      errors.value.password = "請輸入密碼";
    }
    if (!formData.value.captcha.trim()) {
      errors.value.captcha = "請輸入驗證碼";
    }
    return;
  }

  // 驗證帳密
  const user = mockUsers.find((u) => u.username === formData.value.username && u.password === formData.value.password);
          if (user) {
            // 登入成功
            localStorage.setItem("userInfo", JSON.stringify({ username: user.username }));
            // 觸發自定義事件，通知 Navbar 更新
            window.dispatchEvent(new Event("login-status-changed"));
            // user 帳號跳轉到案件管理頁面，adm 帳號跳轉到 dashboard
            if (user.username === "user") {
              router.push("/case-management");
            } else {
              router.push("/dashboard");
            }
          } else {
    // 登入失敗 - 顯示錯誤訊息
    console.error("登入失敗：帳號或密碼錯誤");
    setError("username", "帳號或密碼錯誤");
    setError("password", "帳號或密碼錯誤");
  }
};

const handleForgotPassword = () => {
  console.log("忘記密碼");
  router.push("/forgot-password");
};
</script>
