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
        <div class="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-sm">
          <!-- Section Title -->
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">新增年度</h2>
          </div>

          <!-- Form Fields -->
          <div class="flex flex-col gap-4">
            <!-- Case Category and Reporting Year Row -->
            <div class="flex gap-4">
              <!-- Case Category -->
              <div class="flex w-[364px] flex-col gap-2">
                <div class="flex items-center gap-2">
                  <label class="text-base font-medium text-gray-900">案件類別</label>
                  <span class="text-red-500">*</span>
                </div>
                <InputDropdown
                  :button-text="selectedCategory"
                  placeholder="請選擇案件類別"
                  :items="categoryOptions"
                  variant="outline"
                  @item-click="handleCategoryChange"
                />
              </div>

              <!-- Reporting Year -->
              <div class="flex w-[364px] flex-col gap-2">
                <div class="flex items-center gap-2">
                  <label class="text-base font-medium text-gray-900">填報年度</label>
                  <span class="text-red-500">*</span>
                </div>
                <div class="w-full">
                  <Input
                    v-model="reportingYear"
                    placeholder="請輸入填報年度"
                    type="text"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <!-- Annual Count -->
            <div class="flex w-[364px] flex-col gap-2">
              <div class="flex items-center gap-2">
                <label class="text-base font-medium text-gray-900">年件數</label>
                <span class="text-red-500">*</span>
              </div>
              <div class="w-full">
                <Input
                  v-model="annualCount"
                  placeholder="請輸入年度件數"
                  type="text"
                  size="lg"
                />
              </div>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import Input from "@/components/atoms/Input.vue";
import Icon from "@/components/atoms/Icon.vue";

const router = useRouter();

// Form State
const selectedCategory = ref<string>("");
const reportingYear = ref<string>("");
const annualCount = ref<string>("");

// Category Options
const categoryOptions: InputDropdownItem[] = [
  { label: "都更案件" },
  { label: "危老案件" },
];

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleGoBack = () => {
  router.back();
};

const handleCategoryChange = (item: InputDropdownItem) => {
  selectedCategory.value = item.label;
};

const handleCancel = () => {
  router.back();
};

const handleSave = () => {
  // TODO: Implement save logic
  console.log("Saving:", {
    category: selectedCategory.value,
    reportingYear: reportingYear.value,
    annualCount: annualCount.value,
  });
  // After saving, navigate back
  router.push("/case-statistics");
};
</script>
