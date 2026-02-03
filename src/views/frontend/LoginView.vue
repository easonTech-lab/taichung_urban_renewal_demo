<template>
  <div class="min-h-screen bg-[#F0F5FF]">
    <div class="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-[120px]">
      <div class="w-full max-w-[428px] rounded-lg border border-gray-200 bg-white p-8">
        <h1 class="text-2xl font-medium leading-6 text-gray-900">登入</h1>

        <form class="mt-10 flex w-full flex-col gap-4" @submit.prevent="handleLogin" aria-label="登入表單">
          <Input
            v-model="formData.username"
            label="帳號"
            type="text"
            placeholder="請輸入帳號"
            required
            size="lg"
            :error="!!errors.username"
            :error-message="errors.username"
            @clear-error="errors.username = ''"
          />
          <div class="flex w-full items-center gap-2">
            <input id="remember-me" type="checkbox" class="h-4 w-4 rounded border border-gray-300 bg-gray-50" />
            <label for="remember-me" class="text-sm font-medium leading-[14px] text-gray-900">記住我</label>
          </div>

          <Input
            v-model="formData.password"
            label="密碼"
            type="password"
            placeholder="請輸入密碼"
            required
            size="lg"
            :error="!!errors.password"
            :error-message="errors.password"
            @clear-error="errors.password = ''"
          />
          <button type="button" class="w-full text-right text-sm font-normal text-primary-600 hover:underline" @click.prevent="handleForgotPassword">忘記密碼</button>

          <div class="flex w-full items-end gap-4 flex-wrap justify-center">
            <div class="flex-1 min-w-[150px]">
              <Input
                v-model="formData.captcha"
                label="驗證碼"
                type="text"
                placeholder="請輸入驗證碼"
                required
                size="lg"
                :error="!!errors.captcha"
                :error-message="errors.captcha"
                @clear-error="errors.captcha = ''"
              />
            </div>
            <div class="h-[49px] w-[125px]">
              <img :src="captchaImageUrl" alt="驗證碼圖片，請輸入圖片中顯示的文字或數字" class="h-full w-full rounded object-cover" aria-label="驗證碼圖片" />
            </div>
          </div>

          <div class="mt-4 w-full">
            <ButtonCTA :disabled="!isFormValid" :variant="isFormValid ? 'primary' : 'gray'" type="submit" class="h-[40px] w-full">登入</ButtonCTA>
          </div>
          <div class="text-center text-sm font-medium leading-[1.5]">
            <p class="mb-0 text-gray-500">不知道如何申請帳號?</p>
            <router-link to="/register" class="text-primary-600 hover:underline">了解申請流程</router-link>
          </div>
        </form>
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
    // 登入成功，存儲用戶信息和角色
    const isAdmin = user.username === "adm";
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        username: user.username,
        role: isAdmin ? "admin" : "user",
      })
    );
    // 觸發自定義事件，通知 Navbar 更新
    window.dispatchEvent(new Event("login-status-changed"));
    // user 帳號跳轉到案件管理頁面，adm 帳號跳轉到都市更新案件管理
    if (user.username === "user") {
      router.push("/case-management");
    } else {
      router.push("/case-management-admin");
    }
  } else {
    // 登入失敗 - 顯示錯誤訊息
    console.error("登入失敗：帳號或密碼錯誤");
    setError("username", "帳號或密碼錯誤");
    setError("password", "帳號或密碼錯誤");
  }
};

const handleForgotPassword = () => {
  router.push("/forgot-password");
};
</script>
