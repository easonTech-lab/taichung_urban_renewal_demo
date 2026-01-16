<template>
  <div class="flex min-h-screen flex-col bg-indigo-50">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <SidebarSection @item-select="handleSidebarItemSelect" />

      <!-- Main Content -->
      <div class="flex flex-1 flex-col gap-10 p-10">
        <!-- Breadcrumb and Title -->
        <div class="flex flex-col gap-6">
          <Breadcrumb />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">編輯個人資料</h1>
        </div>

        <!-- Form Card -->
        <div class="flex flex-col gap-10">
          <!-- Form Section -->
          <div class="rounded-lg bg-white p-8 shadow-sm">
            <!-- Section Title -->
            <div class="mb-10 flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">編輯個人資料</h2>
            </div>

            <!-- Form Fields -->
            <div class="flex flex-col gap-4">
              <!-- 申請人姓名 -->
              <div class="w-full max-w-[364px]">
                <Input v-model="formData.name" label="申請人姓名" type="text" size="lg" placeholder="請輸入姓名" />
              </div>

              <!-- 身分證字號和帳號 -->
              <div class="flex gap-4">
                <div class="w-full max-w-[364px]">
                  <Input v-model="formData.idNumber" label="身分證字號" type="text" size="lg" disabled />
                </div>
                <div class="w-full max-w-[364px]">
                  <Input v-model="formData.account" label="帳號" type="text" size="lg" disabled />
                </div>
              </div>

              <!-- 手機號碼和電子信箱 -->
              <div class="flex gap-4">
                <div class="w-full max-w-[364px]">
                  <Input v-model="formData.phone" label="手機號碼" type="tel" size="lg" placeholder="請輸入手機號碼" />
                </div>
                <div class="w-full max-w-[364px]">
                  <Input v-model="formData.email" label="電子信箱" type="email" size="lg" placeholder="請輸入電子信箱" />
                </div>
              </div>

              <!-- 密碼 -->
              <div class="flex flex-col gap-2">
                <label class="text-base font-medium text-gray-900">密碼</label>
                <ButtonCTA variant="text" size="base" class="self-start p-0" @click="handleChangePassword"> 變更密碼 </ButtonCTA>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel"> 取消 </ButtonCTA>
            <ButtonCTA variant="gray" size="xl" class="w-[124px]" @click="handleSave"> 儲存 </ButtonCTA>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Input from "@/components/atoms/Input.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const router = useRouter();

// Form Data
const formData = ref({
  name: "陳傑瑞",
  idNumber: "A123456789",
  account: "A123456789",
  phone: "0911111111",
  email: "1111111@gmail.com",
});

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleChangePassword = () => {
  router.push("/change-password");
};

const handleCancel = () => {
  // 返回上一頁或重置表單
  router.back();
};

const handleSave = () => {
  // TODO: 實現儲存功能
  console.log("Save profile", formData.value);
  // 這裡可以調用 API 儲存資料
};
</script>
