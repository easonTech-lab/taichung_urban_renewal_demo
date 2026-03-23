<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">{{ isFromCaseDetail ? '編輯危老重建案件' : '新增危老重建案件' }}</h1>
      </div>
      <div class="flex flex-col gap-4">
        <StageProgressBar
          :steps="['公開基本資料', '危老申請書', '危老審查獎勵']"
          :active-index="1"
        />
        <div class="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium text-gray-900">危老申請書</h2>
          </div>
          <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">起造人資料</h3>
              <div class="flex flex-col gap-4">
                <p class="text-base font-normal text-gray-900">起造人（一）</p>
                <div class="flex flex-col gap-4">
                  <InputDropdown
                    label="起造人類別"
                    placeholder="請選擇起造人類別"
                    :button-text="formData.builderType"
                    :items="builderTypeOptions"
                    required
                    containerClass="w-[364px]"
                    @item-click="(item) => handleDropdownChange('builderType', item)"
                  />
                  <ButtonCTA variant="outline" size="sm" left-icon="plus" class="!min-w-0 w-fit">
                    新增起造人
                  </ButtonCTA>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">規劃單位</h3>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <Input v-model="formData.designerName" label="設計人姓名" placeholder="請輸入設計人姓名" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.licenseNumber" label="開業證書字號" placeholder="請輸入開業證書字號" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.officeName" label="事務所名稱" placeholder="請輸入事務所名稱" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.businessScope" label="執行業務" placeholder="請輸入執行業務" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.officePhone" label="聯絡電話" placeholder="請輸入聯絡電話" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.officeFax" label="傳真" placeholder="請輸入傳真" size="lg" required containerClass="w-[364px]" />
                <div class="col-span-2">
                  <Input v-model="formData.officeAddress" label="事務所地址" placeholder="請輸入事務所地址" size="lg" required containerClass="w-[744px]" />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">重建計畫範圍內土地座落</h3>
              <div class="flex flex-col gap-4">
                <InputDropdown
                  label="所屬行政區"
                  placeholder="請選擇所屬行政區"
                  :button-text="formData.district"
                  :items="districtOptions"
                  required
                  containerClass="w-[364px]"
                  @item-click="(item) => handleDropdownChange('district', item)"
                />
                <div class="flex w-[744px] flex-col gap-2">
                  <Input v-model="formData.lotNumber" label="地號" placeholder="請輸入地號" size="lg" required containerClass="w-[744px]" />
                  <p class="text-base leading-tight text-gray-500">例：三村段20地號</p>
                </div>
                <ButtonCTA variant="outline" size="sm" left-icon="plus" class="!min-w-0 w-fit">
                  新增其他筆
                </ButtonCTA>
              </div>
            </div>
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">基地概要</h3>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <DatePicker v-model="formData.buildingLineDate" label="建築線指定" placeholder="請選擇日期" containerClass="w-[364px]" />
                <div class="flex flex-col gap-2">
                  <p class="text-base font-medium text-gray-900">
                    字號 <span class="text-red-500">*</span>
                  </p>
                  <Input v-model="formData.permitNumber" :show-label="false" placeholder="請輸入執照文號" size="lg" required containerClass="w-[364px]" />
                </div>
                <Input v-model="formData.legalCoverageRatio" label="法定建蔽率（％）" size="lg" required :disabled="true" containerClass="w-[364px]" />
                <Input v-model="formData.legalFAR" label="法定容積率" placeholder="請輸入法定容積率" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.totalSiteArea" label="基地面積合計（m²）" size="lg" required :disabled="true" containerClass="w-[364px]" />
                <div class="flex flex-col gap-2">
                  <Input v-model="formData.landUseZone" label="土地使用分區" placeholder="請輸入土地使用分區" size="lg" required containerClass="w-[364px]" />
                  <p class="text-base leading-tight text-gray-500">例：第三種住宅</p>
                </div>
                <div class="col-span-2">
                  <Input v-model="formData.siteOfficeAddress" label="事務所地址" placeholder="請輸入事務所地址" size="lg" required containerClass="w-[744px]" />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">符合條件</h3>
              <div class="flex flex-col gap-4">
                <Radio v-model="formData.condition" name="dangerous-conditions" value="condition-1" label="符合條件一：建築物結構安全評估未達最低標準" />
                <Radio v-model="formData.condition" name="dangerous-conditions" value="condition-2" label="符合條件二：耐震能力不足或不足以保障人員安全" />
                <Radio v-model="formData.condition" name="dangerous-conditions" value="condition-3" label="符合條件三：經鑑定有危險之建築物" />
                <Radio v-model="formData.condition" name="dangerous-conditions" value="condition-4" label="符合條件四：其他經主管機關認定之情形" />
              </div>
            </div>
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">土地及建築物所有權人</h3>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <InputDropdown
                  label="土地所有權人"
                  placeholder="請選擇土地所有權人"
                  :button-text="formData.landOwner"
                  :items="landOwnerOptions"
                  required
                  containerClass="w-[364px]"
                  @item-click="(item) => handleDropdownChange('landOwner', item)"
                />
                <InputDropdown
                  label="建築物所有權人"
                  placeholder="請選擇建築物所有權人"
                  :button-text="formData.buildingOwner"
                  :items="buildingOwnerOptions"
                  required
                  containerClass="w-[364px]"
                  @item-click="(item) => handleDropdownChange('buildingOwner', item)"
                />
              </div>
            </div>
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">建築物基本資料</h3>
              <div class="flex flex-col gap-6">
                <Input v-model="formData.buildingAddress" label="建築地址" placeholder="請輸入建築地址" size="lg" required containerClass="w-[752px]" />
                <div class="flex w-[752px] flex-wrap items-start gap-6">
                  <div class="flex flex-col gap-2 w-[364px]">
                    <Input v-model="formData.buildingConditionType" label="建物狀況/類型" placeholder="請輸入建物狀況/類型" size="lg" required containerClass="w-[364px]" />
                    <p class="text-base leading-tight text-gray-500">例：透天厝、住宅</p>
                  </div>
                  <div class="flex flex-col gap-2 w-[364px]">
                    <Input v-model="formData.actualUsage" label="實際使用情形" placeholder="請輸入實際使用情形" size="lg" required containerClass="w-[364px]" />
                    <p class="text-base leading-tight text-gray-500">例：住宅、商業</p>
                  </div>
                </div>
                <div class="flex w-[752px] flex-wrap items-start gap-6">
                  <Input v-model="formData.preRebuildBuildingCount" label="重建前棟數" placeholder="請輸入重建前棟數" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.preRebuildFloorCount" label="重建前樓層數" placeholder="請輸入重建前樓層數" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.preRebuildHouseholdCount" label="重建前戶數" placeholder="請輸入重建前戶數" size="lg" required containerClass="w-[364px]" />
                </div>
                <div class="flex w-[752px] flex-wrap items-start gap-6">
                  <Input v-model="formData.postRebuildBuildingCount" label="重建後棟數" placeholder="請輸入重建後棟數" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.postRebuildFloorCount" label="重建後樓層數" placeholder="請輸入重建後樓層數" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.postRebuildHouseholdCount" label="重建後戶數" placeholder="請輸入重建後戶數" size="lg" required containerClass="w-[364px]" />
                </div>
                <div class="flex w-[752px] flex-wrap items-start gap-6">
                  <Input v-model="formData.designFAR" label="設計容積率（％）" placeholder="請輸入設計容積率" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.psercbId" label="PSERCB初評案件編號" placeholder="請輸入PSERCB初評案件編號" size="lg" required containerClass="w-[364px]" />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <h3 class="text-xl font-bold text-blue-700">其他政府規定事項</h3>
              <p class="text-base text-gray-900">此欄空白</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center gap-6">
        <template v-if="isFromCaseDetail">
          <ButtonCTA variant="outline" size="xl" :to="cancelTarget">取消</ButtonCTA>
          <ButtonCTA :variant="hasDangerousApplicationChanges ? 'primary' : 'gray'" size="xl" :disabled="!hasDangerousApplicationChanges">儲存</ButtonCTA>
        </template>
        <template v-else>
          <ButtonCTA variant="textPlain" size="xl" :to="{ path: '/case-management-dangerous/add' }">上一步</ButtonCTA>
          <ButtonCTA variant="outline" size="xl">暫存</ButtonCTA>
          <ButtonCTA variant="gray" size="xl" :disabled="true">下一步</ButtonCTA>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import StageProgressBar from "@/components/molecules/StageProgressBar.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import type { DangerousApplicationFormData } from "@/types/backend/caseManagement/dangerous/CaseManagementDangerousApplicationView.d";
type DropdownStringKey = "builderType" | "district" | "landOwner" | "buildingOwner";
const route = useRoute();
const isFromCaseDetail = ref(false);
const formData = ref<DangerousApplicationFormData>({
  builderType: "",
  designerName: "",
  licenseNumber: "",
  officeName: "",
  businessScope: "",
  officePhone: "",
  officeFax: "",
  officeAddress: "",
  district: "",
  lotNumber: "",
  buildingLineDate: null,
  permitNumber: "",
  legalCoverageRatio: "98.9",
  legalFAR: "",
  totalSiteArea: "2045.84",
  landUseZone: "",
  siteOfficeAddress: "",
  condition: "",
  landOwner: "",
  buildingOwner: "",
  buildingAddress: "",
  buildingConditionType: "",
  actualUsage: "",
  preRebuildBuildingCount: "",
  preRebuildFloorCount: "",
  preRebuildHouseholdCount: "",
  postRebuildBuildingCount: "",
  postRebuildFloorCount: "",
  postRebuildHouseholdCount: "",
  designFAR: "",
  psercbId: "",
});
const builderTypeOptions: InputDropdownItem[] = [{ label: "法人（公司行號）" }, { label: "自然人" }];
const districtOptions: InputDropdownItem[] = [];
const landOwnerOptions: InputDropdownItem[] = [];
const buildingOwnerOptions: InputDropdownItem[] = [];
const STORAGE_KEY_CASE_FOR_APPLICATION = "caseDetailForApplication";
const cancelTarget = computed(() => {
  const returnTo = route.query?.returnTo;
  if (typeof returnTo === "string" && returnTo.trim()) {
    return returnTo;
  }
  return { path: "/case-management-dangerous" };
});
const breadcrumbItems = computed(() => [
  { label: "首頁", to: "/" },
  { label: "我的案件", to: "/case-management" },
  { label: "危老重建案件", to: "/case-management-dangerous" },
  { label: isFromCaseDetail.value ? "編輯危老重建案件" : "新增危老重建案件" },
]);
const buildDangerousApplicationSnapshot = () =>
  JSON.stringify({
    ...formData.value,
    builderType: formData.value.builderType.trim(),
    designerName: formData.value.designerName.trim(),
    licenseNumber: formData.value.licenseNumber.trim(),
    officeName: formData.value.officeName.trim(),
    businessScope: formData.value.businessScope.trim(),
    officePhone: formData.value.officePhone.trim(),
    officeFax: formData.value.officeFax.trim(),
    officeAddress: formData.value.officeAddress.trim(),
    district: formData.value.district.trim(),
    lotNumber: formData.value.lotNumber.trim(),
    permitNumber: formData.value.permitNumber.trim(),
    legalCoverageRatio: formData.value.legalCoverageRatio.trim(),
    legalFAR: formData.value.legalFAR.trim(),
    totalSiteArea: formData.value.totalSiteArea.trim(),
    landUseZone: formData.value.landUseZone.trim(),
    siteOfficeAddress: formData.value.siteOfficeAddress.trim(),
    condition: formData.value.condition.trim(),
    landOwner: formData.value.landOwner.trim(),
    buildingOwner: formData.value.buildingOwner.trim(),
    buildingAddress: formData.value.buildingAddress.trim(),
    buildingConditionType: formData.value.buildingConditionType.trim(),
    actualUsage: formData.value.actualUsage.trim(),
    preRebuildBuildingCount: formData.value.preRebuildBuildingCount.trim(),
    preRebuildFloorCount: formData.value.preRebuildFloorCount.trim(),
    preRebuildHouseholdCount: formData.value.preRebuildHouseholdCount.trim(),
    postRebuildBuildingCount: formData.value.postRebuildBuildingCount.trim(),
    postRebuildFloorCount: formData.value.postRebuildFloorCount.trim(),
    postRebuildHouseholdCount: formData.value.postRebuildHouseholdCount.trim(),
    designFAR: formData.value.designFAR.trim(),
    psercbId: formData.value.psercbId.trim(),
    buildingLineDate: formData.value.buildingLineDate ? new Date(formData.value.buildingLineDate).toISOString() : null,
  });
const { hasUnsavedChanges: hasDangerousApplicationChanges, captureInitial: captureDangerousApplicationInitial } = useFormUnsavedCheck(buildDangerousApplicationSnapshot, isFromCaseDetail);
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
const handleDropdownChange = (key: DropdownStringKey, item: InputDropdownItem) => {
  formData.value[key] = item.label;
};
onMounted(() => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_CASE_FOR_APPLICATION);
    if (!raw) return;
    isFromCaseDetail.value = true;
    const data = JSON.parse(raw) as {
      name?: string;
      applicantName?: string;
      phone?: string;
      email?: string;
      address?: string;
    };
    sessionStorage.removeItem(STORAGE_KEY_CASE_FOR_APPLICATION);
    if (data.phone) formData.value.officePhone = data.phone;
    if (data.address) {
      formData.value.officeAddress = data.address;
      formData.value.siteOfficeAddress = data.address;
    }
  } catch (_) {
    // ignore
  }
  captureDangerousApplicationInitial();
});
</script>
