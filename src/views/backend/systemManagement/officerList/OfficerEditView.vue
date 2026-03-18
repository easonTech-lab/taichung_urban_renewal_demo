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
              <h2 class="text-2xl font-medium leading-6 text-gray-900">編輯幹事</h2>
            </div>
          </div>
          <div class="flex w-[744px] flex-col gap-4">
            <div class="flex gap-4">
              <Input v-model="form.name" label="姓名" required size="lg" container-class="w-[364px] shrink-0" />
              <Input v-model="form.gender" label="性別" size="lg" container-class="w-[364px] shrink-0" />
            </div>
            <div class="flex gap-4">
              <Input v-model="form.email" label="信箱" size="lg" type="email" container-class="w-[364px] shrink-0" />
              <Input v-model="form.phone" label="聯絡電話" size="lg" container-class="w-[364px] shrink-0" />
            </div>
            <Input v-model="form.address" label="聯絡地址" size="lg" container-class="w-full" />
            <Input v-model="form.title" label="現職" size="lg" container-class="w-full" />
            <div class="flex flex-col gap-4">
              <Input
                v-for="(education, index) in educationList"
                :key="`education-${index}`"
                v-model="educationList[index]"
                :label="index === 0 ? '學經歷' : undefined"
                :show-label="index === 0"
                size="lg"
                container-class="w-full"
              />
              <div>
                <ButtonCTA variant="outline" size="xs" left-icon="plus" class="min-w-0 px-3" @click="handleAddEducation"> 新增學經歷 </ButtonCTA>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel"> 取消 </ButtonCTA>
          <ButtonCTA variant="gray" size="xl" class="w-[124px]" @click="handleSave"> 儲存變更 </ButtonCTA>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb, { type BreadcrumbItem } from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";

const router = useRouter();
const route = useRoute();

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: "首頁", to: "/" },
  { label: "系統管理" },
  { label: "幹事名單管理", to: "/officer-list-management" },
  { label: "編輯幹事" },
]);

const OFFICER_EDIT_STORAGE_KEY = "officer-edit-data";

const getStringValue = (value: string | string[] | undefined) => {
  return typeof value === "string" ? value : "";
};

const officerFromState = () => {
  const state = history.state as { officer?: Record<string, string | string[]> } | null;
  const o = state?.officer;
  if (!o || typeof o !== "object") return null;
  return {
    name: getStringValue(o.name),
    gender: getStringValue(o.gender),
    email: getStringValue(o.email),
    phone: getStringValue(o.phone),
    address: getStringValue(o.address),
    title: getStringValue(o.title),
    education: Array.isArray(o.education) ? o.education : [],
  };
};

const officerFromQuery = () => {
  const raw = route.query.officer;
  const queryValue = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  if (!queryValue) return null;

  try {
    const officer = JSON.parse(decodeURIComponent(queryValue)) as Record<string, string | string[]>;
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
};

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
};

const initialData = officerFromQuery() ?? officerFromState() ?? officerFromStorage();
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

const buildEducationList = (value: string[]) => {
  const items = value.map((item) => item.trim()).filter(Boolean);
  return items.length > 0 ? items : [""];
};

const educationList = ref<string[]>(buildEducationList(form.value.education));

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleGoBack = () => {
  router.push("/officer-list-management");
};

const handleCancel = () => {
  router.push("/officer-list-management");
};

const handleAddEducation = () => {
  educationList.value.push("");
};

const handleSave = () => {
  // TODO: API 儲存
  form.value.education = educationList.value.map((item) => item.trim()).filter(Boolean);
  console.log("Save officer:", form.value);
  router.push("/officer-list-management");
};

onMounted(() => {
  if (!initialData) {
    router.replace("/officer-list-management");
    return;
  }
  sessionStorage.removeItem(OFFICER_EDIT_STORAGE_KEY);
});
</script>
