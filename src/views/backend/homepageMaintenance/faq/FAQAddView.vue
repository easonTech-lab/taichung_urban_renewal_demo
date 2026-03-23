<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center gap-4">
          <button type="button" class="flex h-6 w-6 items-center justify-center" @click="handleGoBack" aria-label="返回上一頁">
            <Icon name="arrowLeftOutline" class="h-6 w-6 text-gray-900" />
          </button>
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前ㄧ頁</h1>
        </div>
      </div>
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">新增問題內容</h2>
        </div>
        <div class="flex flex-col gap-6">
          <Input v-model="formData.title" label="標題(限50字)" placeholder="我家的建築是幾年的？該走危老還都更？" size="lg" :maxlength="50" required />
          <RadioGroup label="類別" required>
            <template #radios>
              <Radio
                v-for="category in categoryOptions"
                :key="category.value"
                :model-value="formData.category"
                :value="category.value"
                :label="category.label"
                name="category"
                container-class="flex items-center gap-2"
                label-class="text-sm font-medium text-gray-900"
                @update:model-value="(value) => (formData.category = value as string)"
              />
            </template>
            <div class="flex items-start">
              <ButtonCTA variant="outline" size="sm" left-icon="plusCircle" @click="handleAddCategory"> 新增類別 </ButtonCTA>
            </div>
          </RadioGroup>
          <div v-if="showNewCategory" class="flex flex-wrap items-center gap-4">
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="輸入類別"
              class="h-[52px] w-full max-w-[364px] rounded-lg border border-gray-300 bg-gray-50 px-4 text-lg text-gray-700 placeholder:text-gray-400 focus:border-primary-600 focus:outline-none"
              aria-label="輸入類別"
            />
            <ButtonCTA
              :variant="isNewCategoryValid ? 'primary' : 'gray'"
              size="l"
              class="h-12 min-w-[96px] px-5 py-3 text-base disabled:!bg-gray-500 disabled:!text-white disabled:!opacity-100"
              @click="handleCreateCategory"
              :disabled="!isNewCategoryValid"
            >
              新增
            </ButtonCTA>
          </div>
          <RichTextEditor
            v-model="formData.answer"
            label="回答(限200字)"
            :show-label="true"
            placeholder="請輸入回答內容..."
            required
            :maxlength="200"
            :enforce-maxlength="false"
            :error="isAnswerOverLimit"
            :error-message="isAnswerOverLimit ? '回答限200字以內' : ''"
          />
        </div>
      </div>
      <div class="flex items-center justify-center gap-4">
        <template v-if="isEditMode">
          <ButtonCTA variant="outline" size="l" @click="handleCancelEdit">取消</ButtonCTA>
          <ButtonCTA variant="primary" size="l" :disabled="isPublishDisabled" @click="handlePublish">儲存</ButtonCTA>
        </template>
        <template v-else>
          <ButtonCTA variant="outline" size="l" @click="handleSaveDraft">暫存</ButtonCTA>
          <ButtonCTA variant="primary" size="l" :disabled="isPublishDisabled" @click="handlePublish">發布</ButtonCTA>
        </template>
      </div>
    </div>

    <UnsavedChangesModal
      :model-value="unsavedDialog.showUnsavedChangesModal.value"
      @update:modelValue="(value) => (unsavedDialog.showUnsavedChangesModal.value = value)"
      :confirm-disabled="isPublishDisabled"
      @exit="handleExitWithoutSaving"
      @confirm="handleSaveFromUnsavedModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useUnsavedChangesDialog } from "@/composables/useUnsavedChangesDialog";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import RichTextEditor from "@/components/atoms/RichTextEditor.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import type { FaqFormData } from "@/types/backend/homepageMaintenance/faqManagement.d";

const router = useRouter();
const route = useRoute();
const unsavedDialog = useUnsavedChangesDialog();

const formData = ref<FaqFormData>({
  title: "",
  category: "",
  answer: "",
});

const categoryOptions = ref([
  { label: "我適合哪種重建方式？", value: "reconstruction-type" },
  { label: "要怎麼申請？需要準備什麼？", value: "application-process" },
  { label: "有什麼補助或政府協助？", value: "subsidy-assistance" },
]);

const showNewCategory = ref(false);
const newCategoryName = ref("");
const isEditMode = computed(() => route.query.edit === "true");
const isNewCategoryValid = computed(() => newCategoryName.value.trim().length > 0);
const answerTextLength = computed(() => getPlainTextLength(formData.value.answer));
const isAnswerOverLimit = computed(() => answerTextLength.value > 200);
const isPublishDisabled = computed(() => {
  if (!formData.value.title.trim()) return true;
  if (!formData.value.category) return true;
  if (isAnswerOverLimit.value) return true;
  return answerTextLength.value === 0;
});

const faqFormUnsavedCheck = useFormUnsavedCheck(() => buildFormSnapshot(), isEditMode);

const navigateToFAQList = () => {
  router.push("/faq-management");
};

onMounted(() => {
  if (!isEditMode.value) return;
  if (route.query.title) {
    formData.value.title = route.query.title as string;
  }
  if (route.query.category) {
    const label = route.query.category as string;
    formData.value.category = normalizeCategoryValue(label);
  }
  if (route.query.answer) {
    formData.value.answer = route.query.answer as string;
  }
  faqFormUnsavedCheck.captureInitial();
});

const getPlainTextLength = (html: string): number => {
  if (!html) return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.length || 0;
}

const buildFormSnapshot = () => {
  return JSON.stringify({
    title: formData.value.title.trim(),
    category: formData.value.category,
    answer: formData.value.answer,
  });
}

const handleSidebarItemSelect = () => {
  // Handle sidebar item selection
};

const handleGoBack = () => {
  unsavedDialog.requestUnsavedConfirmation(faqFormUnsavedCheck.hasUnsavedChanges.value, () => router.back());
};

const handleCancelEdit = () => {
  unsavedDialog.requestUnsavedConfirmation(faqFormUnsavedCheck.hasUnsavedChanges.value, navigateToFAQList);
};

const handleExitWithoutSaving = () => {
  unsavedDialog.runPendingAction();
};

const handleSaveFromUnsavedModal = () => {
  unsavedDialog.closeUnsavedChangesModal();
  handlePublish();
};

const handleAddCategory = () => {
  showNewCategory.value = true;
};

const handleCreateCategory = () => {
  const name = newCategoryName.value.trim();
  if (!name) return;
  const value = `custom-${Date.now()}`;
  categoryOptions.value.push({
    label: name,
    value,
  });
  formData.value.category = value;
  newCategoryName.value = "";
  showNewCategory.value = false;
};

const handleSaveDraft = () => {
  // TODO: Implement save draft functionality
  console.log("暫存", formData.value);
  router.push({
    path: "/faq-management",
    query: {
      toast: "success",
      msg: "暫存成功",
    },
  });
};

const handlePublish = () => {
  // TODO: Implement publish functionality
  console.log("發布", formData.value);
  router.push({
    path: "/faq-management",
    query: {
      toast: "success",
      msg: isEditMode.value ? "儲存成功" : "新增成功",
    },
  });
};

const normalizeCategoryValue = (label: string) => {
  const existing = categoryOptions.value.find((option) => option.label === label);
  if (existing) return existing.value;
  const value = `custom-${Date.now()}`;
  categoryOptions.value.push({ label, value });
  return value;
};
</script>
