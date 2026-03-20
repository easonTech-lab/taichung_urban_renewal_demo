<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection :backdrop-closable="!showUnsavedToast" @item-select="handleSidebarItemSelect" />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center justify-between gap-6">
          <div class="min-w-0 flex-1">
            <h1 class="truncate text-3xl font-bold leading-[30px] text-gray-900">擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案</h1>
          </div>
          <ButtonCTA v-if="isAdminUser" variant="red-outline" size="l" class="flex items-center gap-2 !min-w-0" @click="handleDeleteCase">刪除案件</ButtonCTA>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex items-center overflow-hidden rounded-t-lg">
        <button v-for="(tab, index) in tabs" :key="index" :class="getTabClass(index)" @click="handleTabClick(index)">
          <span :class="getTabTextClass(index)">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div>
        <CaseInfoTab
          v-if="activeTab === 'info'"
          :is-admin-user="isAdminUser"
          :case-info="caseInfo"
          :officer-table-rows="officerTableRows"
          :officer-list="officerList"
          @save-officer-list="handleSaveOfficerList"
          @request-remove-officer="handleRequestRemoveOfficer"
          @unsaved-toast="handleUnsavedToast"
        />
        <ComplaintsTab
          v-if="activeTab === 'complaints'"
          :complaint-sections="complaintSections"
          @request-delete="handleRequestDeleteComplaint"
          @download="handleDownloadComplaint"
          @upload="handleUploadComplaint"
        />
        <ProgressTab
          v-if="activeTab === 'progress'"
          :is-admin-user="isAdminUser"
          :case-officer-names="caseOfficerNames"
        />
        <FilesTab
          v-if="activeTab === 'files'"
          :files="allFiles"
          @request-delete="handleRequestDeleteProjectFile"
          @download="handleDownloadFile"
        />
      </div>
    </div>

    <div class="fixed bottom-6 z-[90]" :style="deleteToastStyle">
      <Toast v-model="showDeleteToast" :message="deleteToastMessage" :show-actions="false" :show-close="false" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>

    <ConfirmDeleteModal
      v-model="confirmDeleteOpen"
      :message="confirmDeleteMessage"
      :description="confirmDeleteDescription"
      :confirm-label="confirmDeleteLabel"
      @confirm="handleConfirmDelete"
      @cancel="handleCloseConfirmDelete"
    />

    <!-- 人民陳情：隱藏檔案 input，點上傳檔案時直接開啟選檔 -->
    <input
      ref="complaintFileInputRef"
      type="file"
      multiple
      class="sr-only"
      aria-hidden="true"
      tabindex="-1"
      @change="handleComplaintFileInputChange"
    />

    <Modal v-model="showUploadComplaintWarning" size="md" backdrop-class="bg-gray-600/80" :show-close-button="true">
      <template #body>
        <div class="flex flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">!</div>
          <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">{{ uploadComplaintWarningMessage }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center px-6 pb-6">
          <ButtonCTA variant="primary" size="xs" @click="showUploadComplaintWarning = false">確認</ButtonCTA>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import Toast from "@/components/atoms/Toast.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Modal from "@/components/atoms/Modal.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import FilesTab from "@/views/backend/caseManagement/common/tabs/FilesTab.vue";
import ProgressTab from "@/views/backend/caseManagement/common/tabs/ProgressTab.vue";
import CaseInfoTab from "@/views/backend/caseManagement/common/tabs/CaseInfoTab.vue";
import ComplaintsTab from "@/views/backend/caseManagement/common/tabs/ComplaintsTab.vue";
import type { ComplaintRow, ComplaintSection, OfficerItem, OfficerTableRow, ProjectFile } from "@/types/backend/caseManagement/common/CaseDetailView.d";
const route = useRoute();
const router = useRouter();

const tabs = computed(() => {
  if (isAdminUser.value) {
    return [
      { label: "案件資訊", value: "info" },
      { label: "人民陳情", value: "complaints" },
      { label: "案件進度", value: "progress" },
      { label: "專案檔案", value: "files" },
    ];
  }
  return [
    { label: "案件資訊", value: "info" },
    { label: "案件進度", value: "progress" },
    { label: "專案檔案", value: "files" },
  ];
});

const activeTab = ref<string>("info");
const validTabValues = computed(() => tabs.value.map((tab) => tab.value));
const syncTabFromRoute = () => {
  const queryTab = route.query?.tab as string | undefined;
  if (queryTab && validTabValues.value.includes(queryTab)) {
    activeTab.value = queryTab;
  }
};
const activeTabIndex = computed(() => {
  const index = tabs.value.findIndex((tab) => tab.value === activeTab.value);
  return index === -1 ? 0 : index;
});
const isAdminUser = computed(() => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return false;
  try {
    const user = JSON.parse(userInfo);
    return user.role === "admin";
  } catch {
    return false;
  }
});

const getTabClass = (index: number): string => {
  const isActive = index === activeTabIndex.value;
  const baseClasses = ["flex flex-1 flex-col items-center justify-center p-4 transition-colors"];

  if (isActive) {
    baseClasses.push("bg-indigo-50 border-l border-r border-t border-primary-500 rounded-tl-lg rounded-tr-lg");
  } else {
    baseClasses.push("bg-gray-50 border-b border-primary-600");
  }

  return baseClasses.join(" ");
};

const getTabTextClass = (index: number): string => {
  const isActive = index === activeTabIndex.value;
  return isActive ? "text-base font-medium text-primary-500" : "text-base font-medium text-gray-500";
};

const handleTabClick = (index: number) => {
  const nextTab = tabs.value[index]?.value || "info";
  activeTab.value = nextTab;
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      tab: nextTab,
    },
  });
};

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
const handleUnsavedToast = (visible: boolean) => {
  showUnsavedToast.value = visible;
};

watch(
  () => tabs.value,
  () => {
    syncTabFromRoute();
  },
  { immediate: true }
);

watch(
  () => route.query?.tab,
  () => {
    syncTabFromRoute();
  }
);

const confirmDeleteOpen = ref(false);
const confirmDeleteMessage = ref("確認刪除此項目");
const confirmDeleteDescription = ref("內容將完全刪除無法復原");
const confirmDeleteLabel = ref("刪除");
const confirmDeleteAction = ref<(() => void) | null>(null);
const showDeleteToast = ref(false);
const deleteToastMessage = ref("檔案已刪除");
const showUnsavedToast = ref(false);
const deleteToastStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};

const caseInfo = ref({
  name: "臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案",
  number: "abc13456788999",
  applyDate: "114/10/20",
  applicantName: "陳傑瑞",
  phone: "0933123123",
  email: "abc@gmail.com",
  address: "台中市文心路二段588號",
});

const officerTableRows = ref<OfficerTableRow[]>([
  {
    name: "張泓明",
    gender: "男",
    title: "內政部地政司代理司長",
    background: "日本東京大學地震研究所 博士；銘傳大學都市規劃與防災學 碩士",
  },
  {
    name: "林靖君",
    gender: "女",
    title: "專家委員",
    background: "元智大學化學工程學系；美國奧克拉荷馬州州立大學環境工程碩士",
  },
  {
    name: "郭依佳",
    gender: "女",
    title: "專家委員",
    background: "元智大學化學工程學系；美國奧克拉荷馬州州立大學環境工程碩士",
  },
  {
    name: "朱秀秋",
    gender: "女",
    title: "中山大學公共事務管理研究所教授兼管理學院副院長",
    background: "美國北卡羅萊納州立大學景觀規劃博士",
  },
  {
    name: "曾彰豪",
    gender: "男",
    title: "逢甲大學土地管理學系副教授",
    background: "國立臺北大學都市計劃研究所博士",
  },
]);

const caseOfficerNames = computed(() => {
  const fromList = officerList.value.map((o) => o.selectedOfficer).filter(Boolean).join("、");
  if (fromList) return fromList;
  return officerTableRows.value.map((r) => r.name).join("、");
});

const officerList = ref<OfficerItem[]>(
  Array.from({ length: 5 }, () => ({
    selectedOfficer: "",
  }))
);

const complaintSections = ref<ComplaintSection[]>([
  {
    title: "書面受理資料",
    rows: [
      {
        id: "written-1",
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        id: "written-2",
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        id: "written-3",
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
  {
    title: "委員會審議紀錄",
    rows: [
      {
        id: "committee-1",
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        id: "committee-2",
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        id: "committee-3",
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
  {
    title: "人民或團體陳情意見紀錄表",
    rows: [
      {
        id: "petition-1",
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        id: "petition-2",
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        id: "petition-3",
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
]);

const allFiles = ref<ProjectFile[]>([
  {
    fileName: "小組審查文件.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileCategory: "申請人上傳",
    uploaderType: "申請人",
    fileSize: "967 KB",
  },
  {
    fileName: "專家小組審查文檔內部研討第一期專案會議.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileCategory: "幹事上傳",
    uploaderType: "幹事",
    fileSize: "967 KB",
  },
  {
    fileName: "專家小組審查文檔內部研討第一期專案會議.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileCategory: "幹事上傳",
    uploaderType: "幹事",
    fileSize: "967 KB",
  },
  {
    fileName: "都更幹事會開會通知單.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更幹事會",
    fileCategory: "承辦上傳",
    uploaderType: "承辦",
    fileSize: "25 KB",
  },
  {
    fileName: "公辦公聽會會議記錄.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "公辦公聽會",
    fileCategory: "承辦上傳",
    uploaderType: "承辦",
    fileSize: "107 KB",
  },
  {
    fileName: "公辦公聽會開會通知單.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "公辦公聽會",
    fileCategory: "承辦上傳",
    uploaderType: "承辦",
    fileSize: "107 KB",
  },
]);

const handleDeleteCase = () => {
  openConfirmDelete({
    message: "確認刪除此案件",
    description: "內容將完全刪除無法復原",
    confirmLabel: "刪除",
    onConfirm: () => {
      const fromPath = route.query?.from as string | undefined;
      const fallbackPath = isAdminUser.value ? "/case-management-admin" : "/case-management";
      router.push({
        path: fromPath || fallbackPath,
        query: {
          toast: "case-deleted",
        },
      });
    },
  });
};

const handleSaveOfficerList = (items: OfficerItem[]) => {
  officerList.value = items.map((item) => ({ ...item }));
};

const handleRequestRemoveOfficer = (row: OfficerTableRow) => {
  openConfirmDelete({
    message: "確認將該幹事從名單移除",
    description: "",
    confirmLabel: "移除",
    onConfirm: () => {
      officerTableRows.value = officerTableRows.value.filter((item) => item.name !== row.name);
      deleteToastMessage.value = "已刪除";
      showDeleteToast.value = true;
    },
  });
};

const handleRequestDeleteComplaint = (row: ComplaintRow) => {
  openConfirmDelete({
    message: "確認刪除檔案",
    description: "內容將完全刪除無法復原",
    confirmLabel: "刪除",
    onConfirm: () => {
      complaintSections.value.forEach((section) => {
        section.rows = section.rows.filter((item) => item.id !== row.id);
      });
      deleteToastMessage.value = "檔案已刪除";
      showDeleteToast.value = true;
    },
  });
};

const complaintFileInputRef = ref<HTMLInputElement | null>(null);
const uploadTargetSection = ref<ComplaintSection | null>(null);
const showUploadComplaintWarning = ref(false);
const uploadComplaintWarningMessage = ref("");

const COMPLAINT_FILE_MAX_SIZE_MB = 30;

const formatUploadedAt = (date: Date): string => {
  const y = date.getFullYear() - 1911;
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${d} ${h}:${min}`;
};

const handleUploadComplaint = (section: ComplaintSection) => {
  uploadTargetSection.value = section;
  complaintFileInputRef.value?.click();
};

const handleComplaintFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) {
    input.value = "";
    return;
  }
  const section = uploadTargetSection.value;
  if (!section) {
    input.value = "";
    return;
  }
  const maxBytes = COMPLAINT_FILE_MAX_SIZE_MB * 1024 * 1024;
  const now = formatUploadedAt(new Date());
  let added = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > maxBytes) {
      uploadComplaintWarningMessage.value = `檔案大小需限 ${COMPLAINT_FILE_MAX_SIZE_MB}MB，請重新確認`;
      showUploadComplaintWarning.value = true;
      input.value = "";
      return;
    }
    section.rows.push({
      id: `${section.title}-${Date.now()}-${i}`,
      title: file.name,
      uploadedAt: now,
    });
    added++;
  }
  if (added > 0) {
    deleteToastMessage.value = "已新增至表格";
    showDeleteToast.value = true;
  }
  input.value = "";
};

const handleDownloadComplaint = (row: ComplaintRow) => {
  console.log("Download complaint file:", row);
};

const handleRequestDeleteProjectFile = (file: ProjectFile) => {
  openConfirmDelete({
    message: "確認刪除此檔案",
    description: "內容將完全刪除無法復原",
    confirmLabel: "刪除",
    onConfirm: () => {
      allFiles.value = allFiles.value.filter((item) => item !== file);
      deleteToastMessage.value = "檔案已刪除";
      showDeleteToast.value = true;
    },
  });
};

const handleDownloadFile = (file: ProjectFile) => {
  console.log("Download file:", file);
};

const openConfirmDelete = (options: { message: string; description?: string; confirmLabel?: string; onConfirm: () => void }) => {
  confirmDeleteMessage.value = options.message;
  confirmDeleteDescription.value = options.description ?? "";
  confirmDeleteLabel.value = options.confirmLabel ?? "刪除";
  confirmDeleteAction.value = options.onConfirm;
  confirmDeleteOpen.value = true;
};

const handleConfirmDelete = () => {
  confirmDeleteAction.value?.();
  handleCloseConfirmDelete();
};

const handleCloseConfirmDelete = () => {
  confirmDeleteOpen.value = false;
  confirmDeleteAction.value = null;
};
</script>
