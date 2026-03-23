<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-10 rounded-lg bg-white p-6">
      <div class="flex items-center gap-3">
        <div class="h-7 w-1 rounded bg-primary-600"></div>
        <h2 class="text-2xl font-medium leading-6 text-gray-900">案件基本資訊</h2>
      </div>
      <div class="flex flex-wrap gap-10">
        <div class="flex w-full min-w-0 flex-col gap-2 pl-5 xl:min-w-[840px]">
          <p class="text-base font-medium text-gray-500">案件名稱</p>
          <p class="whitespace-normal break-words text-lg text-gray-900">{{ caseInfo.name }}</p>
        </div>
        <div class="flex min-w-[280px] flex-col gap-2 pl-5">
          <p class="text-base font-medium text-gray-500">案件編號</p>
          <p class="text-lg text-gray-900">{{ caseInfo.number }}</p>
        </div>
        <div class="flex min-w-[280px] flex-col gap-2 pl-5">
          <p class="text-base font-medium text-gray-500">申請日期</p>
          <p class="text-lg text-gray-900">{{ caseInfo.applyDate }}</p>
        </div>
        <div class="flex min-w-[280px] flex-col gap-2 pl-5">
          <p class="text-base font-medium text-gray-500">申請者姓名</p>
          <p class="text-lg text-gray-900">{{ caseInfo.applicantName }}</p>
        </div>
        <div class="flex min-w-[280px] flex-col gap-2 pl-5">
          <p class="text-base font-medium text-gray-500">聯絡電話</p>
          <p class="text-lg text-gray-900">{{ caseInfo.phone }}</p>
        </div>
        <div class="flex min-w-[280px] flex-col gap-2 pl-5">
          <p class="text-base font-medium text-gray-500">E-mail</p>
          <p class="text-lg text-gray-900">{{ caseInfo.email }}</p>
        </div>
        <div class="flex w-full min-w-0 flex-col gap-2 pl-5 xl:min-w-[840px]">
          <p class="text-base font-medium text-gray-500">聯絡地址</p>
          <p class="whitespace-normal break-words text-lg text-gray-900">{{ caseInfo.address }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-5 xl:flex-row">
        <button
          type="button"
          class="flex min-h-[66px] flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          @click="handleCardClick('application-basic')"
        >
          <span class="text-lg font-bold leading-[1.3] text-gray-500">{{ isDangerous ? "公開基本資料" : "申請基本資料" }}</span>
          <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-blue-100"></div>
            <Icon name="arrowRightOutline" :size="24" color="#1C64F2" class="relative z-10" />
          </div>
        </button>
        <button
          type="button"
          class="flex min-h-[66px] flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          @click="handleCardClick('review-data')"
        >
          <span class="text-lg font-bold leading-[1.3] text-gray-500">{{ isDangerous ? "危老審查獎勵" : "都市更新審議資料表" }}</span>
          <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-blue-100"></div>
            <Icon name="arrowRightOutline" :size="24" color="#1C64F2" class="relative z-10" />
          </div>
        </button>
        <button
          type="button"
          class="flex min-h-[66px] flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          @click="handleCardClick('floor-area-ratio')"
        >
          <span class="text-lg font-bold leading-[1.3] text-gray-500">{{ isDangerous ? "危老審查獎勵" : "容積獎勵項目及額度" }}</span>
          <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-blue-100"></div>
            <Icon name="arrowRightOutline" :size="24" color="#1C64F2" class="relative z-10" />
          </div>
        </button>
      </div>
    </div>
    <div v-if="isAdminUser" class="flex flex-col gap-10 rounded-lg bg-white p-6">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">審查幹事列表</h2>
        </div>
        <div v-if="hasOfficerRows" class="flex items-center gap-3">
          <ButtonCTA variant="outline" size="sm" left-icon="secretary" class="h-9 !min-w-0 px-3 py-2 text-sm" @click="handleImportOfficerList">管理名單</ButtonCTA>
          <ButtonCTA variant="outline" size="sm" left-icon="download" class="h-9 !min-w-0 px-3 py-2 text-sm" @click="handleExportOfficerList">匯出名單</ButtonCTA>
        </div>
      </div>
      <div v-if="hasOfficerRows" class="rounded-lg border border-gray-300 bg-white">
        <Table
          :columns="officerTableColumns"
          :rows="officerPaginationState.paginatedRows"
          :pagination="officerPaginationState.pagination"
          @page-change="officerPaginationState.handlePageChange"
        >
          <template #cell-index="{ rowIndex }">
            <p class="text-base text-gray-500">{{ rowIndex + 1 }}</p>
          </template>
          <template #cell-name="{ row }">
            <div class="flex flex-col gap-1">
              <p class="text-base text-gray-900">{{ row.name }}</p>
              <p class="text-base text-gray-500">{{ row.gender }}</p>
            </div>
          </template>
          <template #cell-action="{ row }">
            <div class="flex items-center gap-2">
              <ButtonCTA variant="textPlain" size="sm" left-icon="profileCard" class="p-0" @click.stop="handleOfficerProfile(row as OfficerTableRow)" aria-label="查看委員資料">
              </ButtonCTA>
              <ButtonCTA variant="textPlain" size="sm" class="p-0 text-primary-600" @click.stop="handleOfficerRemove(row as OfficerTableRow)">移除</ButtonCTA>
            </div>
          </template>
        </Table>
      </div>
      <Empty v-else class="!h-auto !gap-6 py-6" type="case" message="尚未導入審查幹事名單" button-text="導入幹事名單" :show-button="true" @button-click="handleImportOfficerList" />
    </div>
  </div>
  <Drawer v-model="isDrawerOpen" :title="drawerTitle" :width="drawerWidth" close-action="emit" @close="handleDrawerClose">
    <template #default>
      <div v-if="drawerMode === 'officerList'" class="flex flex-col gap-0">
        <div v-for="(officer, index) in localOfficerList" :key="index" class="flex items-center justify-between border-b border-gray-300 py-5">
          <div class="flex flex-1 items-center gap-2">
            <div class="flex w-5 items-center justify-center">
              <span class="text-base font-normal leading-[1.25] text-gray-500">{{ index + 1 }}</span>
            </div>
            <InputDropdown
              :button-text="officer.selectedOfficer || ''"
              placeholder="選擇"
              :items="getAvailableOfficersForIndex(index)"
              required
              :show-label="false"
              @item-click="(item) => handleOfficerSelect(index, item)"
            />
          </div>
          <div class="flex items-center px-3 py-4">
            <ButtonCTA variant="textPlain" size="base" class="p-0" @click="handleRemoveOfficer(index)"> 移除 </ButtonCTA>
          </div>
        </div>
        <div class="flex items-center justify-start border-b border-gray-300 py-5">
          <ButtonCTA variant="outline" size="xl" class="w-full" left-icon="plus" @click="handleAddNewOfficer"> 新增委員 </ButtonCTA>
        </div>
      </div>
      <div v-else class="flex flex-col gap-6">
        <Input v-model="editForm.caseNumber" label="案件編號" required size="lg" />
        <Input v-model="editForm.applyDate" label="申請日期" required size="lg" />
        <Input v-model="editForm.applicantName" label="申請者姓名" required size="lg" />
        <Input v-model="editForm.phone" label="聯絡電話" required size="lg" />
        <Input v-model="editForm.address" label="聯絡地址" required size="lg" />
        <Input v-model="editForm.email" label="E-mail" required size="lg" />
      </div>
    </template>
    <template #footer>
      <div v-if="drawerMode === 'officerList'" class="flex gap-4">
        <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel"> 取消 </ButtonCTA>
        <ButtonCTA variant="primary" size="xl" class="w-[124px]" @click="handleSave"> 儲存 </ButtonCTA>
      </div>
      <div v-else class="flex gap-4">
        <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleEditCancel"> 取消 </ButtonCTA>
        <ButtonCTA variant="primary" size="xl" class="w-[124px]" @click="handleEditSave"> 儲存 </ButtonCTA>
      </div>
    </template>
  </Drawer>
  <ConfirmDeleteModal
    v-model="showOfficerRemoveModal"
    message="確認將該幹事從名單移除"
    description=""
    confirm-label="移除"
    @confirm="handleConfirmOfficerRemove"
    @cancel="handleCloseOfficerRemove"
  />
  <UnsavedChangesModal
    :model-value="officerUnsavedDialog.showUnsavedChangesModal.value"
    @update:modelValue="(value) => (officerUnsavedDialog.showUnsavedChangesModal.value = value)"
    @exit="handleOfficerModalExit"
    @confirm="handleOfficerModalSave"
  />
  <div class="fixed bottom-6 z-[90]" :style="toastPositionStyle">
    <Toast
      v-model="showCancelToast"
      message="有尚未儲存的修改"
      :show-actions="true"
      primary-label="暫存"
      secondary-label="退出編輯"
      :auto-close="false"
      close-label="關閉提示"
      @primary="handleToastDraft"
      @secondary="handleToastExit"
      @close="handleCloseToast"
    />
  </div>
  <div class="fixed bottom-6 z-[90]" :style="toastPositionStyle">
    <Toast v-model="showDrawerDeleteToast" message="已刪除" :show-actions="false" :show-close="true" :auto-close="true" />
  </div>
  <div class="fixed bottom-6 z-[90]" :style="saveToastPositionStyle">
    <Toast v-model="showSaveToast" message="儲存成功" :show-actions="false" :show-close="true" :auto-close="true" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useUnsavedChangesDialog } from "@/composables/useUnsavedChangesDialog";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Toast from "@/components/atoms/Toast.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Empty from "@/components/atoms/Empty.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import type { DrawerMode, OfficerItem, OfficerTableRow } from "@/types/backend/caseManagement/common/CaseDetailView.d";
const props = defineProps<{
  isAdminUser: boolean;
  caseInfo: {
    name: string;
    number: string;
    applyDate: string;
    applicantName: string;
    phone: string;
    email: string;
    address: string;
  };
  officerTableRows: OfficerTableRow[];
  officerList: OfficerItem[];
}>();
const emit = defineEmits<{
  "save-officer-list": [items: OfficerItem[]];
  "request-remove-officer": [row: OfficerTableRow];
  "unsaved-toast": [visible: boolean];
}>();
const route = useRoute();
const router = useRouter();
const officerUnsavedDialog = useUnsavedChangesDialog();
const isDrawerOpen = ref(false);
const showSaveToast = ref(false);
const showCancelToast = ref(false);
const showDrawerDeleteToast = ref(false);
const showOfficerRemoveModal = ref(false);
const drawerMode = ref<DrawerMode>("officerList");
const drawerWidth = ref<"sm" | "md" | "lg" | "xl">("xl");
const pendingOfficerRemoveIndex = ref<number | null>(null);
const toastContext = ref<"officerList" | "editInfo">("editInfo");
const localOfficerList = ref<OfficerItem[]>(props.officerList.map((item) => ({ ...item })));
const editForm = ref({
  caseNumber: "abc13456788999",
  applyDate: "114/10/20",
  applicantName: "陳傑瑞",
  phone: "0933123123",
  address: "台中市文心路二段588號",
  email: "abc@gmail.com",
});
const officerPaginationState = reactive(
  useTablePagination({
    rows: computed(() => props.officerTableRows),
    pageSize: 10,
  })
);
const STORAGE_KEY_CASE_FOR_APPLICATION = "caseDetailForApplication";
const saveToastPositionStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};
const officerTableColumns: TableColumn[] = [
  { key: "index", label: "項次", width: "6%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "p-0 align-middle" },
  { key: "name", label: "委員姓名", width: "12%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "px-4 py-4 align-middle" },
  { key: "title", label: "現職", width: "20%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "px-4 py-4 align-middle" },
  { key: "background", label: "學經歷", width: "52%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "px-4 py-4 align-middle" },
  { key: "action", label: "動作", width: "10%", headerClass: "px-4 py-4 text-left text-sm font-medium text-gray-500", cellClass: "px-4 py-4 align-middle" },
];
const allAvailableOfficers: InputDropdownItem[] = [{ label: "陳傑瑞" }, { label: "張森" }, { label: "吳偉翔" }, { label: "林美華" }, { label: "王小明" }, { label: "李大同" }];
const isDangerous = computed(() => route.query?.caseType === "dangerous");
const drawerTitle = computed(() => (drawerMode.value === "officerList" ? "編輯幹事名單" : "編輯案件資訊"));
const drawerWidthPx = computed(() => {
  const widths: Record<"sm" | "md" | "lg" | "xl", number> = {
    sm: 256,
    md: 320,
    lg: 384,
    xl: 460,
  };
  return widths[drawerWidth.value];
});
const toastPositionStyle = computed(() => {
  if (!isDrawerOpen.value) {
    return {
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(900px, calc(100vw - 2rem))",
      maxWidth: "min(900px, calc(100vw - 2rem))",
      minWidth: "min(900px, calc(100vw - 2rem))",
    };
  }
  const width = `min(900px, calc(100vw - ${drawerWidthPx.value}px - 2rem))`;
  return {
    left: `max(1rem, calc((100vw - ${drawerWidthPx.value}px) / 2))`,
    transform: "translateX(-50%)",
    width,
    maxWidth: width,
    minWidth: width,
  };
});
const hasOfficerRows = computed(() => props.officerTableRows.length > 0);
watch(
  () => showCancelToast.value || officerUnsavedDialog.showUnsavedChangesModal.value,
  (visible) => {
    emit("unsaved-toast", visible);
  }
);
watch(
  () => props.officerList,
  (value) => {
    localOfficerList.value = value.map((item) => ({ ...item }));
  },
  { deep: true }
);
const buildOfficerListSnapshot = () => JSON.stringify(normalizeOfficerList(localOfficerList.value));
const { hasUnsavedChanges: hasOfficerChanges, captureInitial: captureOfficerListInitial } = useFormUnsavedCheck(buildOfficerListSnapshot);
const handleCardClick = (cardType: string) => {
  if (cardType === "application-basic") {
    try {
      sessionStorage.setItem(STORAGE_KEY_CASE_FOR_APPLICATION, JSON.stringify(props.caseInfo));
    } catch (_) {
      // ignore storage errors
    }
    const query = {
      from: route.query?.from as string | undefined,
      admin: route.query?.admin as string | undefined,
      caseType: route.query?.caseType as string | undefined,
      returnTo: route.fullPath,
    };
    if (isDangerous.value) {
      router.push({ path: "/case-management-dangerous/add", query });
    } else {
      router.push({ path: "/case-management/add/business-plan", query });
    }
    return;
  }
  if (cardType === "review-data") {
    try {
      sessionStorage.setItem(STORAGE_KEY_CASE_FOR_APPLICATION, JSON.stringify(props.caseInfo));
    } catch (_) {}
    const query = {
      from: route.query?.from as string | undefined,
      admin: route.query?.admin as string | undefined,
      caseType: route.query?.caseType as string | undefined,
      returnTo: route.fullPath,
    };
    if (isDangerous.value) {
      router.push({ path: "/case-management-dangerous/add/application", query });
    } else {
      router.push({ path: "/case-management/add/review-table", query });
    }
    return;
  }
  if (cardType === "floor-area-ratio") {
    console.log("Card clicked:", cardType);
    // TODO: Navigate to 容積獎勵項目及額度 when route exists
  }
};
const normalizeOfficerList = (items: OfficerItem[]) =>
  items
    .map((item) => ({
      selectedOfficer: item.selectedOfficer.trim(),
    }))
    .filter((item) => item.selectedOfficer !== "");
const getAvailableOfficersForIndex = (index: number) => {
  const selectedOfficers = localOfficerList.value.map((o, i) => (i !== index ? o.selectedOfficer : "")).filter((o) => o !== "");
  return allAvailableOfficers.filter((officer) => !selectedOfficers.includes(officer.label));
};
const openOfficerListDrawer = () => {
  drawerMode.value = "officerList";
  localOfficerList.value = props.officerList.map((item) => ({ ...item }));
  captureOfficerListInitial();
  isDrawerOpen.value = true;
};
const handleImportOfficerList = () => {
  localOfficerList.value = props.officerTableRows.map((row) => ({
    selectedOfficer: row.name,
  }));
  captureOfficerListInitial();
  drawerMode.value = "officerList";
  isDrawerOpen.value = true;
};
const handleExportOfficerList = () => {
  console.log("Export officer list");
};
const handleDrawerClose = () => {
  if (drawerMode.value === "officerList") {
    officerUnsavedDialog.requestUnsavedConfirmation(hasOfficerChanges.value, () => {
      isDrawerOpen.value = false;
    });
    return;
  }
  isDrawerOpen.value = false;
};
const handleOfficerSelect = (index: number, item: InputDropdownItem) => {
  localOfficerList.value[index].selectedOfficer = item.label;
};
const handleRemoveOfficer = (index: number) => {
  pendingOfficerRemoveIndex.value = index;
  showOfficerRemoveModal.value = true;
};
const handleConfirmOfficerRemove = () => {
  if (pendingOfficerRemoveIndex.value === null) return;
  localOfficerList.value.splice(pendingOfficerRemoveIndex.value, 1);
  showDrawerDeleteToast.value = true;
  handleCloseOfficerRemove();
};
const handleCloseOfficerRemove = () => {
  showOfficerRemoveModal.value = false;
  pendingOfficerRemoveIndex.value = null;
};
const handleAddNewOfficer = () => {
  localOfficerList.value.push({
    selectedOfficer: "",
  });
};
const handleCancel = () => {
  officerUnsavedDialog.requestUnsavedConfirmation(hasOfficerChanges.value, () => {
    isDrawerOpen.value = false;
  });
};
const handleSave = () => {
  handleCloseToast();
  showSaveToast.value = true;
  emit(
    "save-officer-list",
    localOfficerList.value.map((item) => ({ ...item }))
  );
  captureOfficerListInitial();
  isDrawerOpen.value = false;
};
const handleEditCancel = () => {
  toastContext.value = "editInfo";
  showCancelToast.value = true;
};
const handleEditSave = () => {
  handleCloseToast();
  showSaveToast.value = true;
  console.log("Save case info:", editForm.value);
  isDrawerOpen.value = false;
};
const handleCloseToast = () => {
  showCancelToast.value = false;
};
const handleOfficerModalExit = () => {
  officerUnsavedDialog.runPendingAction();
};
const handleOfficerModalSave = () => {
  officerUnsavedDialog.closeUnsavedChangesModal();
  handleSave();
};
const handleToastExit = () => {
  handleCloseToast();
  isDrawerOpen.value = false;
};
const handleToastDraft = () => {
  handleCloseToast();
  if (toastContext.value === "officerList") {
    handleSave();
  } else {
    handleEditSave();
  }
};
const handleOfficerProfile = (row: OfficerTableRow) => {
  sessionStorage.setItem(
    "officer-edit-data",
    JSON.stringify({
      name: row.name,
      gender: row.gender,
      title: row.title,
      education: row.background
        .split(/[；;]/)
        .map((item) => item.trim())
        .filter(Boolean),
    })
  );
  router.push({
    path: "/officer-list-management/edit",
    query: {
      mode: "view",
      returnTo: route.fullPath,
    },
  });
};
const handleOfficerRemove = (row: OfficerTableRow) => {
  emit("request-remove-officer", row);
};
defineExpose({
  openOfficerListDrawer,
});
</script>
