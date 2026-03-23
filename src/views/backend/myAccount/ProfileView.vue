<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">{{ isAdmin ? "人員帳號管理" : "編輯個人資料" }}</h1>
      </div>
      <div class="flex flex-col gap-10">
        <div class="rounded-lg bg-white p-8 shadow-sm">
          <div class="mb-10 flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">編輯個人資料</h2>
          </div>
          <div v-if="isAdmin" class="flex flex-col gap-4">
            <div class="w-full max-w-[364px]">
              <InputDropdown
                label="人員類別"
                :button-text="adminFormData.personnelType"
                placeholder="請選擇人員類別"
                :items="personnelTypeOptions"
                required
                @item-click="handlePersonnelTypeSelect"
              />
            </div>
            <div class="w-full max-w-[744px]">
              <Input v-model="adminFormData.name" label="人員姓名" type="text" size="lg" placeholder="請輸入姓名" required />
            </div>
            <div class="flex gap-4">
              <div class="w-full max-w-[364px]">
                <Input v-model="adminFormData.account" label="帳號" type="text" size="lg" required />
              </div>
              <div class="flex w-full max-w-[364px] flex-col gap-5">
                <label class="text-base font-medium text-gray-900">密碼</label>
                <ButtonCTA variant="textPlain" size="base" class="self-start p-0 underline" @click="handleChangePassword"> 變更密碼 </ButtonCTA>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-full max-w-[364px]">
                <Input v-model="adminFormData.officialEmail" label="公務信箱" type="email" size="lg" placeholder="請輸入公務信箱" required />
              </div>
              <div class="w-full max-w-[364px]">
                <Input v-model="adminFormData.officialExtension" label="公務分機" type="text" size="lg" placeholder="請輸入公務分機" required />
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-full max-w-[364px]">
                <InputDropdown
                  label="局處"
                  :button-text="adminFormData.department"
                  placeholder="請選擇局處"
                  :items="departmentOptions"
                  required
                  @item-click="handleDepartmentSelect"
                />
              </div>
              <div class="w-full max-w-[364px]">
                <InputDropdown label="科別" :button-text="adminFormData.division" placeholder="請選擇科別" :items="divisionOptions" required @item-click="handleDivisionSelect" />
              </div>
            </div>
            <div class="w-full max-w-[744px]">
              <Textarea v-model="adminFormData.reason" label="申請事由" size="lg" placeholder="請輸入申請事由" required />
            </div>
          </div>
          <div v-else class="flex flex-col gap-4">
            <div class="w-full max-w-[364px]">
              <Input v-model="userFormData.name" label="申請人姓名" type="text" size="lg" placeholder="請輸入姓名" />
            </div>
            <div class="flex gap-4">
              <div class="w-full max-w-[364px]">
                <Input v-model="userFormData.idNumber" label="身分證字號" type="text" size="lg" disabled />
              </div>
              <div class="w-full max-w-[364px]">
                <Input v-model="userFormData.account" label="帳號" type="text" size="lg" disabled />
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-full max-w-[364px]">
                <Input v-model="userFormData.phone" label="手機號碼" type="tel" size="lg" placeholder="請輸入手機號碼" />
              </div>
              <div class="w-full max-w-[364px]">
                <Input v-model="userFormData.email" label="電子信箱" type="email" size="lg" placeholder="請輸入電子信箱" />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-base font-medium text-gray-900">密碼</label>
              <ButtonCTA variant="text" size="base" class="self-start p-0" @click="handleChangePassword"> 變更密碼 </ButtonCTA>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-4">
          <ButtonCTA
            :variant="profileUnsavedCheck.hasUnsavedChanges.value ? 'primary' : 'gray'"
            size="xl"
            class="w-[124px]"
            :disabled="!profileUnsavedCheck.hasUnsavedChanges.value"
            @click="handleSave"
          >
            {{ isAdmin ? "儲存變更" : "儲存" }}
          </ButtonCTA>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Input from "@/components/atoms/Input.vue";
import Textarea from "@/components/atoms/Textarea.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import InputDropdown from "@/components/atoms/InputDropdown.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
const router = useRouter();
const profileUnsavedCheck = useFormUnsavedCheck(() => buildProfileSnapshot());
const adminFormData = ref({
  personnelType: "業務承辦人員",
  name: "陳傑瑞",
  account: "tmcg01mb",
  officialEmail: "tt05@taichung.gov.tw",
  officialExtension: "(04) 2228-9111#58030",
  department: "秘書處",
  division: "都市修復工程科",
  reason: "都市更新",
});
const userFormData = ref({
  name: "陳傑瑞",
  idNumber: "A123456789",
  account: "A123456789",
  phone: "0911111111",
  email: "1111111@gmail.com",
});
const personnelTypeOptions = [
  { label: "業務承辦人員" },
  { label: "審議委員" },
  { label: "系統管理人員" },
  { label: "府內人員" },
  { label: "府外人員" },
  { label: "局內人員" },
  { label: "申請者" },
];
const departmentOptions = [{ label: "秘書處" }, { label: "都市修復工程科" }, { label: "住宅發展工程處" }, { label: "都市更新工程科" }, { label: "都計測量工程科" }];
const divisionOptions = [{ label: "都市修復工程科" }, { label: "住宅發展工程處" }, { label: "都市更新工程科" }, { label: "都計測量工程科" }];
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
const buildProfileSnapshot = () =>
  JSON.stringify(
    isAdmin.value
      ? {
          personnelType: adminFormData.value.personnelType.trim(),
          name: adminFormData.value.name.trim(),
          account: adminFormData.value.account.trim(),
          officialEmail: adminFormData.value.officialEmail.trim(),
          officialExtension: adminFormData.value.officialExtension.trim(),
          department: adminFormData.value.department.trim(),
          division: adminFormData.value.division.trim(),
          reason: adminFormData.value.reason.trim(),
        }
      : {
          name: userFormData.value.name.trim(),
          idNumber: userFormData.value.idNumber.trim(),
          account: userFormData.value.account.trim(),
          phone: userFormData.value.phone.trim(),
          email: userFormData.value.email.trim(),
        }
  );
profileUnsavedCheck.captureInitial();
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
}
const handlePersonnelTypeSelect = (item: any) => {
  adminFormData.value.personnelType = item.label;
}
const handleDepartmentSelect = (item: any) => {
  adminFormData.value.department = item.label;
}
const handleDivisionSelect = (item: any) => {
  adminFormData.value.division = item.label;
}
const handleChangePassword = () => {
  router.push("/change-password");
}
const handleSave = () => {
  // TODO: 實現儲存功能
  if (isAdmin.value) {
    console.log("Save admin profile", adminFormData.value);
  } else {
    console.log("Save user profile", userFormData.value);
  }
  profileUnsavedCheck.captureInitial();
  // 這裡可以調用 API 儲存資料
}
</script>
