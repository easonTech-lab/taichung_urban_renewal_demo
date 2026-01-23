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
          <div class="flex items-center gap-4">
            <button
              class="flex items-center justify-center text-gray-900 transition-colors hover:text-gray-700"
              @click="handleGoBack"
              aria-label="返回上一頁"
            >
              <Icon name="arrowleft" :size="24" color="#1F2A37" />
            </button>
            <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前ㄧ頁</h1>
          </div>
        </div>

        <!-- Form Card -->
        <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
          <!-- Section Title -->
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">編輯案件件數</h2>
          </div>

          <!-- Display Fields -->
          <div class="flex flex-col gap-6">
            <!-- Case Category and Reporting Year Row -->
            <div class="flex border-b border-gray-300 pb-6">
              <!-- Case Category -->
              <div class="flex w-[280px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">案件類別</p>
                <p class="text-base font-normal text-gray-900">{{ caseData.caseCategory }}</p>
              </div>

              <!-- Reporting Year -->
              <div class="flex w-[280px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">填報年度</p>
                <p class="text-base font-normal text-gray-900">{{ caseData.year }}</p>
              </div>
            </div>

            <!-- Annual Count Input -->
            <div class="flex flex-col gap-2 px-5">
              <label class="text-base font-medium text-gray-900">年件數</label>
              <Input v-model="annualCount" placeholder="請輸入年度件數" type="text" size="lg" />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-4">
          <button
            class="flex h-[52px] items-center justify-center rounded-lg border border-primary-700 bg-white px-6 text-base font-medium text-primary-700 transition-colors hover:bg-primary-50"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            class="flex h-[52px] items-center justify-center rounded-lg bg-primary-700 px-6 text-base font-medium text-white transition-colors hover:bg-primary-800"
            @click="handleSave"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Input from "@/components/atoms/Input.vue";
import Icon from "@/components/atoms/Icon.vue";

const router = useRouter();
const route = useRoute();

// Form State
const annualCount = ref<string>("");

// Case Data (從路由參數或查詢參數獲取)
const caseData = ref({
  caseCategory: "都更案件",
  year: "114",
  annualCount: "103",
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

const handleSave = () => {
  // TODO: Implement save logic
  console.log("Saving annual count:", annualCount.value);
  // After saving, navigate back
  router.push("/case-statistics");
};

// 初始化數據
onMounted(() => {
  // 從路由查詢參數獲取數據（如果有的話）
  if (route.query.category) {
    caseData.value.caseCategory = route.query.category as string;
  }
  if (route.query.year) {
    caseData.value.year = route.query.year as string;
  }
  if (route.query.annualCount) {
    caseData.value.annualCount = route.query.annualCount as string;
    annualCount.value = route.query.annualCount as string;
  } else {
    annualCount.value = caseData.value.annualCount;
  }
});
</script>
