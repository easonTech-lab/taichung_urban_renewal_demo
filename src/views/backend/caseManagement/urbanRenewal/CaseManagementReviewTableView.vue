<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">{{ isFromCaseDetail ? '編輯都更案件' : '新增都更案件' }}</h1>
      </div>
      <div class="flex flex-col gap-4">
        <StageProgressBar
          :steps="['基本資料', '都市更新審議資料表', '容積獎勵項目及額度']"
          :active-index="1"
        />
        <div class="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium text-gray-900">都市更新審議資料表</h2>
          </div>
          <div class="flex flex-col gap-6">
            <div class="flex w-[744px] flex-col gap-4 border-b border-gray-300 pb-6">
              <Input
                v-model="formData.caseName"
                label="案件名稱"
                size="lg"
                required
                disabled
                containerClass="w-full"
              />
              <Input
                v-model="formData.baseLandNumber"
                label="基地地號"
                placeholder="請輸入基地地號"
                size="lg"
                required
                containerClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-6">
              <h3 class="text-xl font-bold text-blue-700">土地使用及環境設計資料</h3>
              <div class="flex w-[744px] flex-col gap-6 border-b border-gray-300 pb-6">
                <div
                  v-for="entry in formData.landUseEntries"
                  :key="entry.label"
                  class="flex flex-col gap-4"
                >
                  <p class="text-lg font-medium text-gray-900">{{ entry.label }}</p>
                  <div class="grid grid-cols-[repeat(2,364px)] gap-4">
                    <Input
                      v-model="entry.zone"
                      label="土地使用分區"
                      size="lg"
                      required
                      disabled
                      containerClass="w-[364px]"
                    />
                    <Input
                      v-model="entry.legalCoverage"
                      label="法定建蔽率（％）"
                      size="lg"
                      required
                      disabled
                      containerClass="w-[364px]"
                    />
                    <Input
                      v-model="entry.baseArea"
                      label="基地面積（m²）"
                      size="lg"
                      required
                      disabled
                      containerClass="w-[364px]"
                    />
                    <Input
                      v-model="entry.actualCoverage"
                      label="實設建蔽率（％）"
                      size="lg"
                      required
                      disabled
                      containerClass="w-[364px]"
                    />
                  </div>
                </div>
                <Input
                  v-model="formData.averageFloorAreaRatio"
                  label="法定平均容積率（％）"
                  size="lg"
                  required
                  disabled
                  containerClass="w-[364px]"
                />
              </div>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4 border-b border-gray-300 pb-6">
                <Input
                  v-for="field in floorAreaFields"
                  :key="field.key"
                  v-model="formData[field.key]"
                  :label="field.label"
                  :placeholder="field.placeholder"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
              </div>
              <div class="flex w-[744px] flex-col gap-4 border-b border-gray-300 pb-6">
                <p class="text-lg font-medium text-gray-900">各樓層使用概況</p>
                <div class="grid grid-cols-[repeat(2,364px)] gap-4">
                  <div class="flex flex-col gap-4">
                    <Input
                      v-model="formData.basementUsage"
                      label="地下層"
                      placeholder="請輸入地下層使用概況，無則填無"
                      size="lg"
                      required
                      containerClass="w-[364px]"
                    />
                    <p class="text-base text-gray-500">例：地下一層停車空間、變電室、機房；地下二層停車空間</p>
                  </div>
                  <div class="flex flex-col gap-4">
                    <Input
                      v-model="formData.basementAndGroundUsage"
                      label="地下層與底部層"
                      placeholder="請輸入地下層與底部層，無則填無"
                      size="lg"
                      required
                      containerClass="w-[364px]"
                    />
                    <p class="text-base text-gray-500">例：一般零售業、門廳、社區公共設施等</p>
                  </div>
                  <div class="flex flex-col gap-4">
                    <Input
                      v-model="formData.standardFloorUsage"
                      label="標準層"
                      placeholder="請輸入標準層使用概況"
                      size="lg"
                      required
                      containerClass="w-[364px]"
                    />
                    <p class="text-base text-gray-500">例：集合住宅</p>
                  </div>
                  <div class="flex flex-col gap-4">
                    <Input
                      v-model="formData.topFloorUsage"
                      label="頂部層"
                      placeholder="請輸入頂部層使用概況"
                      size="lg"
                      required
                      containerClass="w-[364px]"
                    />
                    <p class="text-base text-gray-500">例：集合住宅</p>
                  </div>
                </div>
              </div>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-x-6 gap-y-4 border-b border-gray-300 pb-6">
                <div class="flex flex-col gap-4">
                  <Input
                    v-model="formData.legalCarParking"
                    label="法定汽車停車位（輛）"
                    placeholder="請輸入法定汽車停車位"
                    size="lg"
                    required
                    containerClass="w-[364px]"
                  />
                </div>
                <div class="flex flex-col gap-4">
                  <Input
                    v-model="formData.actualCarParking"
                    label="實設汽車停車位（輛）"
                    size="lg"
                    required
                    disabled
                    containerClass="w-[364px]"
                  />
                  <p class="text-base text-gray-500">例：平面65輛</p>
                </div>
                <Input
                  v-model="formData.legalMotorParking"
                  label="法定機車停車位（輛）"
                  placeholder="請輸入法定機車停車位"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.actualMotorParking"
                  label="實設機車停車位（輛）"
                  size="lg"
                  required
                  disabled
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.legalLoadingParking"
                  label="法定裝卸停車位（輛）"
                  placeholder="請輸入法定裝卸停車位，無則填無"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.actualLoadingParking"
                  label="實設裝卸停車位（輛）"
                  placeholder="請輸入法定裝卸停車位，無則填無"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
              </div>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <Input
                  v-model="formData.basementFloorArea"
                  label="地下層樓板面積（m²）"
                  placeholder="請輸入地下層樓板面積，無則填無"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.excavationScale"
                  label="地下開挖規模（％）"
                  placeholder="請輸入法地下開挖規模，無則填無"
                  size="lg"
                  :required="isExcavationRequired"
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.maxFloors"
                  label="最大樓層數（層）"
                  placeholder="請輸入最大樓層數"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.buildingHeight"
                  label="建築物高度（m）"
                  placeholder="請輸入建築物高度"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.roofExtraHeight"
                  label="屋頂物凸出高度（m）"
                  placeholder="請輸入屋頂物凸出高度"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
              </div>
            </div>
            <div class="flex flex-col gap-6">
              <h3 class="text-xl font-bold text-blue-700">更新前後戶數</h3>
              <div class="flex w-[364px] flex-col gap-4">
                <Input
                  v-model="formData.beforeHouseholds"
                  label="更新前戶數（戶）"
                  placeholder="請輸入更新前戶數"
                  size="lg"
                  required
                  containerClass="w-full"
                />
                <Input
                  v-model="formData.afterHouseholds"
                  label="更新後戶數（戶）"
                  placeholder="請輸入更新後戶數"
                  size="lg"
                  required
                  containerClass="w-full"
                />
              </div>
            </div>
            <div class="flex flex-col gap-6">
              <h3 class="text-xl font-bold text-blue-700">安置戶數</h3>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <Input
                  v-model="formData.legalRehousing"
                  label="合法安置戶數（戶）"
                  placeholder="請輸入合法安置戶數，無則填0"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
                <Input
                  v-model="formData.illegalRehousing"
                  label="違章安置戶數（戶）"
                  placeholder="請輸入違章安置戶數，無則填0"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
              </div>
            </div>
            <div class="flex flex-col gap-6">
              <h3 class="text-xl font-bold text-blue-700">其他設施及情形</h3>
              <div class="flex flex-col gap-6">
                <div v-for="field in facilityFields" :key="field.key" class="flex flex-col gap-4">
                  <RadioGroup :label="field.label" required container-class="gap-5">
                    <template #radios>
                      <div class="flex flex-col gap-5">
                        <Radio
                          :model-value="formData[field.key]"
                          value="yes"
                          label="是"
                          :name="field.key"
                          label-class="text-sm font-medium text-gray-900"
                          @update:model-value="(value) => handleRadioChange(field.key, value as string)"
                        />
                        <div v-if="formData[field.key] === 'yes'" class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4 pl-4">
                          <template v-for="inputField in facilityDetailFields[field.key]" :key="inputField.key">
                            <Input
                              v-model="formData[inputField.key]"
                              :label="inputField.label"
                              :placeholder="inputField.placeholder"
                              size="lg"
                              required
                              :containerClass="inputField.fullWidth ? 'w-[744px]' : 'w-[364px]'"
                            />
                          </template>
                        </div>
                        <Radio
                          :model-value="formData[field.key]"
                          value="no"
                          label="否"
                          :name="field.key"
                          label-class="text-sm font-medium text-gray-900"
                          @update:model-value="(value) => handleRadioChange(field.key, value as string)"
                        />
                      </div>
                    </template>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-6">
              <h3 class="text-xl font-bold text-blue-700">申請資料</h3>
              <div class="flex flex-col gap-6">
                <h4 class="text-lg font-medium text-gray-900">實施者資料</h4>
                <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                  <Input
                    v-model="formData.executorName"
                    label="實施者姓名"
                    placeholder="請輸入實施者姓名"
                    size="lg"
                    required
                    containerClass="w-[364px]"
                  />
                  <Input
                    v-model="formData.executorAddress"
                    label="實施者地址"
                    placeholder="請輸入實施者地址"
                    size="lg"
                    required
                    containerClass="w-[364px]"
                  />
                  <Input
                    v-model="formData.executorPhone"
                    label="實施者聯絡電話"
                    placeholder="請輸入實施者聯絡電話"
                    size="lg"
                    required
                    containerClass="w-[364px]"
                  />
                  <Input
                    v-model="formData.executorFax"
                    label="實施者傳真"
                    placeholder="請輸入實施者傳真"
                    size="lg"
                    required
                    containerClass="w-[364px]"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-10">
                  <div v-for="(unit, index) in planningUnits" :key="unit.id" class="flex flex-col gap-6">
                    <h4 class="text-lg font-medium text-gray-900">規劃單位資料（{{ planningUnitLabels[index] || index + 1 }}）</h4>
                    <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                      <Input
                        v-model="unit.designerName"
                        label="設計人姓名"
                        placeholder="請輸入設計人姓名"
                        size="lg"
                        required
                        containerClass="w-[364px]"
                      />
                      <Input
                        v-model="unit.officeName"
                        label="事務所名稱"
                        placeholder="請輸入事務所名稱"
                        size="lg"
                        required
                        containerClass="w-[364px]"
                      />
                      <Input
                        v-model="unit.businessScope"
                        label="執行業務"
                        placeholder="請輸入執行業務"
                        size="lg"
                        required
                        containerClass="w-[364px]"
                      />
                      <Input
                        v-model="unit.officePhone"
                        label="聯絡電話"
                        placeholder="請輸入聯絡電話"
                        size="lg"
                        required
                        containerClass="w-[364px]"
                      />
                      <Input
                        v-model="unit.officeFax"
                        label="傳真"
                        placeholder="請輸入傳真"
                        size="lg"
                        required
                        containerClass="w-[364px]"
                      />
                      <div class="w-[364px]"></div>
                      <div class="col-span-2">
                        <Input
                          v-model="unit.officeAddress"
                          label="事務所地址"
                          placeholder="請輸入事務所地址"
                          size="lg"
                          required
                          containerClass="w-[744px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ButtonCTA variant="outline" size="xs" class="self-start" leftIcon="plus" @click="addPlanningUnit">
                  新增規劃單位
                </ButtonCTA>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-6">
          <template v-if="isFromCaseDetail">
            <ButtonCTA variant="outline" size="xl" :to="cancelTarget">取消</ButtonCTA>
            <ButtonCTA variant="primary" size="xl" :disabled="!hasReviewTableChanges">儲存</ButtonCTA>
          </template>
          <template v-else>
            <ButtonCTA variant="text" size="xl" :to="{ path: '/case-management/add/business-plan' }">上一步</ButtonCTA>
            <ButtonCTA variant="outline" size="xl">暫存</ButtonCTA>
            <ButtonCTA variant="primary" size="xl" :disabled="true">下一步</ButtonCTA>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import StageProgressBar from "@/components/molecules/StageProgressBar.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
type FacilityKey = (typeof facilityFields)[number]["key"];
/** 從案件詳情按鈕進入為編輯，從新增流程進入為新增 */
const route = useRoute();
const isFromCaseDetail = ref(false);
const planningUnits = reactive([
  {
    id: 1,
    designerName: "",
    officeName: "",
    businessScope: "",
    officePhone: "",
    officeFax: "",
    officeAddress: "",
  },
]);
const formData = reactive<Record<string, any>>({
  caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地都市更新事業計畫案",
  baseLandNumber: "",
  landUseEntries: [
    {
      label: "第一筆",
      zone: "第二種住宅",
      legalCoverage: "45",
      baseArea: "940.00",
      actualCoverage: "44.88",
    },
    {
      label: "第二筆",
      zone: "第三種住宅",
      legalCoverage: "45",
      baseArea: "940.00",
      actualCoverage: "44.88",
    },
  ],
  averageFloorAreaRatio: "45",
  industrialVolume: "",
  legalFloorAreaRatio: "",
  residentialVolume: "",
  residentialUnits: "",
  commercialVolume: "",
  commercialUnits: "",
  otherVolume: "",
  otherUnits: "",
  basementUsage: "",
  basementAndGroundUsage: "",
  standardFloorUsage: "",
  topFloorUsage: "",
  legalCarParking: "",
  actualCarParking: "平面40輛",
  legalMotorParking: "",
  actualMotorParking: "20輛",
  legalLoadingParking: "",
  actualLoadingParking: "",
  basementFloorArea: "",
  excavationScale: "",
  maxFloors: "",
  buildingHeight: "",
  roofExtraHeight: "",
  beforeHouseholds: "",
  afterHouseholds: "",
  legalRehousing: "",
  illegalRehousing: "",
  hasPublicFacilities: "no",
  hasRoadPlan: "no",
  hasSidewalkPlan: "no",
  hasOtherArea: "no",
  publicFacilityType: "",
  publicFacilityFloor: "",
  publicFacilityArea: "",
  roadPlanDetail: "",
  roadPlanArea: "",
  sidewalkPlanDetail: "",
  sidewalkPlanArea: "",
  otherAreaSize: "",
  executorName: "",
  executorAddress: "",
  executorPhone: "",
  executorFax: "",
});
const floorAreaFields = [
  { key: "industrialVolume", label: "工業使用容積（m²）", placeholder: "請輸入工業使用容積，無則填無" },
  { key: "legalFloorAreaRatio", label: "法定容積率（％）", placeholder: "請輸入法定平均容積率" },
  { key: "residentialVolume", label: "住宅使用容積（m²）", placeholder: "請輸入住宅用容積，無則填無" },
  { key: "residentialUnits", label: "住宅單元（戶）", placeholder: "請輸入住宅單元，無則填無" },
  { key: "commercialVolume", label: "商業使用容積（m²）", placeholder: "請輸入商業使用容積，無則填無" },
  { key: "commercialUnits", label: "商業單元（戶）", placeholder: "請輸入商業單元，無則填無" },
  { key: "otherVolume", label: "其他使用容積（m²）", placeholder: "請輸入其他使用容積，無則填無" },
  { key: "otherUnits", label: "其他單元（戶）", placeholder: "請輸入其他單元，無則填無" },
] as const;
const facilityFields = [
  { key: "hasPublicFacilities", label: "是否有提供公益設施" },
  { key: "hasRoadPlan", label: "是否有開闢道路計畫情形" },
  { key: "hasSidewalkPlan", label: "是否有留設人行步道及騎樓情形" },
  { key: "hasOtherArea", label: "是否有其他需補充面積" },
] as const;
const facilityDetailFields: Record<FacilityKey, Array<{ key: string; label: string; placeholder: string; fullWidth?: boolean }>> = {
  hasPublicFacilities: [
    { key: "publicFacilityType", label: "種類", placeholder: "請輸入公益設施種類" },
    { key: "publicFacilityFloor", label: "樓層（F）", placeholder: "請輸入公益設施樓層" },
    { key: "publicFacilityArea", label: "面積（m²）", placeholder: "請輸入公益設施面積" },
  ],
  hasRoadPlan: [
    { key: "roadPlanDetail", label: "情形", placeholder: "請輸入開闢道路計畫情形" },
    { key: "roadPlanArea", label: "面積（m²）", placeholder: "請輸入公益設施面積" },
  ],
  hasSidewalkPlan: [
    { key: "sidewalkPlanDetail", label: "情形", placeholder: "請輸入留設人行步道及騎樓情形" },
    { key: "sidewalkPlanArea", label: "面積（m²）", placeholder: "請輸入公益設施面積" },
  ],
  hasOtherArea: [
    { key: "otherAreaSize", label: "面積（m²）", placeholder: "請輸入面積", fullWidth: true },
  ],
} as const;
const STORAGE_KEY_CASE_FOR_APPLICATION = "caseDetailForApplication";
const planningUnitLabels = ["一", "二", "三", "四", "五"];
const cancelTarget = computed(() => {
  const returnTo = route.query?.returnTo;
  if (typeof returnTo === "string" && returnTo.trim()) {
    return returnTo;
  }
  return { path: "/case-management" };
});
const breadcrumbItems = computed(() => {
  const base = [
    { label: "首頁", to: "/" },
    { label: "我的案件", to: "/case-management" },
    { label: "都市更新案件", to: "/case-management" },
  ];
  if (isFromCaseDetail.value) {
    return [...base, { label: "編輯都更案件" }];
  }
  return [...base, { label: "新增都更案件", to: "/case-management/add/business-plan" }, { label: "都市更新審議資料表" }];
});
const isExcavationRequired = computed(() => formData.basementFloorArea?.toString().trim().length > 0);
const buildReviewTableSnapshot = () =>
  JSON.stringify({
    formData,
    planningUnits,
  });
const { hasUnsavedChanges: hasReviewTableChanges, captureInitial: captureReviewTableInitial } = useFormUnsavedCheck(buildReviewTableSnapshot, isFromCaseDetail);
const addPlanningUnit = () => {
  planningUnits.push({
    id: Date.now(),
    designerName: "",
    officeName: "",
    businessScope: "",
    officePhone: "",
    officeFax: "",
    officeAddress: "",
  });
};
const handleSidebarItemSelect = (item: string) => {
  console.log("Selected item:", item);
};
const handleRadioChange = (key: FacilityKey, value: string) => {
  formData[key] = value;
};
onMounted(() => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_CASE_FOR_APPLICATION);
    if (raw) {
      isFromCaseDetail.value = true;
      const data = JSON.parse(raw) as { name?: string };
      sessionStorage.removeItem(STORAGE_KEY_CASE_FOR_APPLICATION);
      if (data.name) formData.caseName = data.name;
    }
  } catch (_) {
    // ignore
  } finally {
    if (isFromCaseDetail.value) {
      captureReviewTableInitial();
    }
  }
});
</script>
