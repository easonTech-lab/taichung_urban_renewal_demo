<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <h1 class="max-w-[400px] truncate text-3xl font-bold leading-[30px] text-gray-900">擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案</h1>
            <div
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary-500 bg-white hover:bg-gray-50"
              @click="handleOpenOfficerDrawer"
              title="編輯幹事名單"
            >
              <Icon name="pencil" :size="24" color="#1C64F2" class="m-auto" />
            </div>
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
          ref="caseInfoTabRef"
          :is-admin-user="isAdminUser"
          :case-info="caseInfo"
          :officer-table-rows="officerTableRows"
          :officer-list="officerList"
          @save-officer-list="handleSaveOfficerList"
          @request-remove-officer="handleRequestRemoveOfficer"
        />
        <ComplaintsTab
          v-if="activeTab === 'complaints'"
          :complaint-sections="complaintSections"
          @request-delete="handleRequestDeleteComplaint"
          @download="handleDownloadComplaint"
          @upload="handleUploadComplaint"
        />
        <ProgressTab v-if="activeTab === 'progress'" :is-admin-user="isAdminUser" />
        <FilesTab
          v-if="activeTab === 'files'"
          :files="allFiles"
          @request-delete="handleRequestDeleteProjectFile"
          @download="handleDownloadFile"
        />
      </div>
    </div>

    <div class="fixed bottom-6 left-1/2 z-[90] w-[min(900px,calc(100vw-2rem))] -translate-x-1/2">
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
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, nextTick, watch } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import Toast from "@/components/atoms/Toast.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import FilesTab from "@/views/backend/caseManagement/common/tabs/FilesTab.vue";
import ProgressTab from "@/views/backend/caseManagement/common/tabs/ProgressTab.vue";
import CaseInfoTab from "@/views/backend/caseManagement/common/tabs/CaseInfoTab.vue";
import ComplaintsTab from "@/views/backend/caseManagement/common/tabs/ComplaintsTab.vue";
import type { ComplaintRow, ComplaintSection, OfficerItem, OfficerTableRow, ProjectFile } from "@/types/backend/caseManagement/common/caseDetail.d";
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

const caseInfoTabRef = ref<InstanceType<typeof CaseInfoTab> | null>(null);
const confirmDeleteOpen = ref(false);
const confirmDeleteMessage = ref("確認刪除此項目");
const confirmDeleteDescription = ref("內容將完全刪除無法復原");
const confirmDeleteLabel = ref("刪除");
const confirmDeleteAction = ref<(() => void) | null>(null);
const showDeleteToast = ref(false);
const deleteToastMessage = ref("檔案已刪除");

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
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
  {
    title: "委員會審議紀錄",
    rows: [
      {
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
  {
    title: "人民或團體陳情意見紀錄表",
    rows: [
      {
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
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

const handleOpenOfficerDrawer = () => {
  if (activeTab.value !== "info") {
    activeTab.value = "info";
    nextTick(() => {
      caseInfoTabRef.value?.openOfficerListDrawer();
    });
    return;
  }
  caseInfoTabRef.value?.openOfficerListDrawer();
};

const handleDeleteCase = () => {
  openConfirmDelete({
    message: "確認刪除此案件",
    description: "內容將完全刪除無法復原",
    confirmLabel: "刪除",
    onConfirm: () => {
      // TODO: Implement delete case logic
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
        section.rows = section.rows.filter((item) => item.title !== row.title);
      });
      deleteToastMessage.value = "檔案已刪除";
      showDeleteToast.value = true;
    },
  });
};

const handleUploadComplaint = (section: ComplaintSection) => {
  console.log("Upload complaint file for:", section.title);
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
