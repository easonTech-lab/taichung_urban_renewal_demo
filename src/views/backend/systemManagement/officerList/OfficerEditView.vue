<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <button
          type="button"
          class="flex items-center gap-4 transition-colors hover:opacity-80"
          @click="handleGoBack"
          aria-label="返回前一頁"
        >
          <Icon name="arrowLeftOutline" class="h-6 w-6 shrink-0 text-gray-900" />
          <h2 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h2>
        </button>
      </div>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-sm">
          <div class="flex flex-col gap-2">
            <div class="flex gap-3">
              <div class="h-7 w-1 shrink-0 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ pageTitle }}</h2>
            </div>
          </div>
          <div class="flex w-[744px] flex-col gap-4">
            <div class="flex gap-4">
              <Input v-model="form.name" label="姓名" required size="lg" container-class="w-[364px] shrink-0" :disabled="isViewMode" />
              <Input v-model="form.gender" label="性別" size="lg" container-class="w-[364px] shrink-0" :disabled="isViewMode" />
            </div>
            <div class="flex gap-4">
              <Input v-model="form.email" label="信箱" size="lg" type="email" container-class="w-[364px] shrink-0" :disabled="isViewMode" />
              <Input v-model="form.phone" label="聯絡電話" size="lg" container-class="w-[364px] shrink-0" :disabled="isViewMode" />
            </div>
            <Input v-model="form.address" label="聯絡地址" size="lg" container-class="w-full" :disabled="isViewMode" />
            <Input v-model="form.title" label="現職" size="lg" container-class="w-full" :disabled="isViewMode" />
            <div class="flex flex-col gap-4">
              <Input
                v-for="(_education, index) in educationList"
                :key="`education-${index}`"
                v-model="educationList[index]"
                :label="index === 0 ? '學經歷' : undefined"
                :show-label="index === 0"
                placeholder="輸入學經歷"
                size="lg"
                container-class="w-full"
                :disabled="isViewMode"
              />
              <div v-if="!isViewMode">
                <ButtonCTA variant="outline" size="xs" left-icon="plus" class="min-w-0 px-3" @click="handleAddEducation"> 新增學經歷 </ButtonCTA>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isViewMode" class="flex justify-center gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel"> 取消 </ButtonCTA>
          <ButtonCTA
            :variant="officerUnsavedCheck.hasUnsavedChanges.value ? 'primary' : 'gray'"
            size="xl"
            class="w-[124px]"
            :disabled="!officerUnsavedCheck.hasUnsavedChanges.value"
            @click="handleSave"
          >
            儲存變更
          </ButtonCTA>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb, { type BreadcrumbItem } from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
const route = useRoute();
const router = useRouter();
const officerFromStorage = () => {
  const raw = sessionStorage.getItem(OFFICER_EDIT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const officer = JSON.parse(raw) as Record<string, string | string[]>;
    return {
      name: getStringValue(officer.name),
      gender: getStringValue(officer.gender),
      email: getStringValue(officer.email),
      phone: getStringValue(officer.phone),
      address: getStringValue(officer.address),
      title: getStringValue(officer.title),
      education: Array.isArray(officer.education) ? officer.education : [],
    };
  } catch {
    return null;
  }
}
const initialData = officerFromStorage();
const form = ref(
  initialData ?? {
    name: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    education: [],
  }
);
const OFFICER_EDIT_STORAGE_KEY = "officer-edit-data";
const officerUnsavedCheck = useFormUnsavedCheck(() => buildOfficerSnapshot());
const isViewMode = computed(() => route.query.mode === "view");
const pageTitle = computed(() => (isViewMode.value ? "幹事資訊" : "編輯幹事"));
const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: "首頁", to: "/" },
  { label: "系統管理" },
  { label: "幹事名單管理", to: "/officer-list-management" },
  { label: pageTitle.value },
]);
const getStringValue = (value: string | string[] | undefined) => {
  return typeof value === "string" ? value : "";
}
const buildEducationList = (value: string[]) => {
  const items = value.map((item) => item.trim()).filter(Boolean);
  return items.length > 0 ? items : [""];
};
const educationList = ref<string[]>(buildEducationList(form.value.education));
const buildOfficerSnapshot = () =>
  JSON.stringify({
    name: form.value.name.trim(),
    gender: form.value.gender.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone.trim(),
    address: form.value.address.trim(),
    title: form.value.title.trim(),
    education: educationList.value.map((item) => item.trim()).filter(Boolean),
  });
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
}
const handleGoBack = () => {
  const returnTo = typeof route.query.returnTo === "string" ? route.query.returnTo : "";
  if (returnTo) {
    router.push(returnTo);
    return;
  }
  router.push("/officer-list-management");
}
const handleAddEducation = () => {
  educationList.value.push("");
}
const handleSave = () => {
  // TODO: API 儲存
  form.value.education = educationList.value.map((item) => item.trim()).filter(Boolean);
  officerUnsavedCheck.captureInitial();
  console.log("Save officer:", form.value);
  router.push("/officer-list-management");
}
const handleCancel = () => {
  router.push("/officer-list-management");
}
onMounted(() => {
  if (!initialData) {
    router.replace("/officer-list-management");
    return;
  }
  officerUnsavedCheck.captureInitial();
  sessionStorage.removeItem(OFFICER_EDIT_STORAGE_KEY);
});
</script>
