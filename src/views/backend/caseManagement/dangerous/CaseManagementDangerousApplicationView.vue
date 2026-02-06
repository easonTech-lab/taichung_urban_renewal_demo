<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">新增危老重建案件</h1>
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
                <p class="text-lg font-medium text-gray-900">起造人（一）</p>
                <div class="flex flex-col gap-4">
                  <InputDropdown
                    label="起造人類別"
                    placeholder="請選擇起造人類別"
                    :button-text="formData.builderType"
                    :items="builderTypeOptions"
                    required
                    container-class="w-[364px]"
                    @item-click="(item) => handleDropdownChange('builderType', item)"
                  />
                  <ButtonCTA variant="outline" size="sm" leftIcon="plus" class="!min-w-0 w-fit">
                    新增起造人
                  </ButtonCTA>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">規劃單位</h3>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-6">
                <Input v-model="formData.designerName" label="設計人姓名" placeholder="請輸入設計人姓名" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.licenseNumber" label="開業證書字號" placeholder="請輸入開業證書字號" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.officeName" label="事務所名稱" placeholder="請輸入事務所名稱" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.businessScope" label="執行業務" placeholder="請輸入執行業務" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.officePhone" label="聯絡電話" placeholder="請輸入聯絡電話" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.officeFax" label="傳真" placeholder="請輸入傳真" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.officeAddress" label="事務所地址" placeholder="請輸入事務所地址" size="lg" required containerClass="w-[744px]" />
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
                  container-class="w-[364px]"
                  @item-click="(item) => handleDropdownChange('district', item)"
                />
                <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-6">
                  <Input v-model="formData.section" label="地段" placeholder="請輸入地段" size="lg" required containerClass="w-[364px]" />
                  <div class="flex flex-col gap-2 w-[364px]">
                    <Input v-model="formData.lotNumber" label="地號" placeholder="請輸入地號" size="lg" required containerClass="w-[364px]" />
                    <p class="text-base leading-tight text-gray-500">例：三村段20地號</p>
                  </div>
                </div>
                <ButtonCTA variant="outline" size="sm" leftIcon="plus" class="!min-w-0 w-fit">
                  新增其他筆
                </ButtonCTA>
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">基地規模</h3>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-6">
                <Input v-model="formData.siteArea" label="建築基地面積（m²）" placeholder="請輸入建築基地面積" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.siteLocation" label="建築基地位置" placeholder="請輸入建築基地位置" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.siteTotalArea" label="建築基地合計（m²）" placeholder="請輸入建築基地合計" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.siteLegalFAR" label="法定容積率（％）" placeholder="請輸入法定容積率" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.siteDescription" label="建築基地說明" placeholder="請輸入建築基地說明" size="lg" required containerClass="w-[744px]" />
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">符合條件</h3>
              <div class="flex flex-col gap-4">
                <Checkbox v-model="formData.conditions[0]" label="符合條件一：建築物結構安全評估未達最低標準" />
                <Checkbox v-model="formData.conditions[1]" label="符合條件二：耐震能力不足或不足以保障人員安全" />
                <Checkbox v-model="formData.conditions[2]" label="符合條件三：經鑑定有危險之建築物" />
                <Checkbox v-model="formData.conditions[3]" label="符合條件四：其他經主管機關認定之情形" />
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">土地及建築物所有權人</h3>
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-6">
                <InputDropdown
                  label="土地所有權人"
                  placeholder="請選擇土地所有權人"
                  :button-text="formData.landOwner"
                  :items="landOwnerOptions"
                  required
                  container-class="w-[364px]"
                  @item-click="(item) => handleDropdownChange('landOwner', item)"
                />
                <InputDropdown
                  label="建築物所有權人"
                  placeholder="請選擇建築物所有權人"
                  :button-text="formData.buildingOwner"
                  :items="buildingOwnerOptions"
                  required
                  container-class="w-[364px]"
                  @item-click="(item) => handleDropdownChange('buildingOwner', item)"
                />
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">建築物基本資料</h3>
              <div class="flex flex-col gap-6">
                <Input v-model="formData.buildingAddress" label="建築物地址" placeholder="請輸入建築物地址" size="lg" required containerClass="w-[744px]" />
                <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-6">
                  <Input v-model="formData.buildingStructure" label="建築物構造" placeholder="請輸入建築物構造" size="lg" required containerClass="w-[364px]" />
                  <div class="flex flex-col gap-2 w-[364px]">
                    <Input v-model="formData.buildingUsageDetail" label="實際使用情形" placeholder="請輸入實際使用情形" size="lg" required containerClass="w-[364px]" />
                    <p class="text-base leading-tight text-gray-500">例：住宅、商業</p>
                  </div>
                  <Input v-model="formData.buildingFloors" label="建築物樓層數（F）" placeholder="請輸入建築物樓層數" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.buildingFloorArea" label="建築物樓地板面積（m²）" placeholder="請輸入建築物樓地板面積" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.buildingHeight" label="建築物高度" placeholder="請輸入建築物高度" size="lg" required containerClass="w-[364px]" />
                  <Input v-model="formData.buildingUsage" label="建築物用途" placeholder="請輸入建築物用途" size="lg" required containerClass="w-[364px]" />
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
        <ButtonCTA variant="textPlain" size="xl" href="/case-management-dangerous/add">上一步</ButtonCTA>
        <ButtonCTA variant="outline" size="xl">暫存</ButtonCTA>
        <ButtonCTA variant="gray" size="xl" :disabled="true">下一步</ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Input from "@/components/atoms/Input.vue";
import Checkbox from "@/components/atoms/Checkbox.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import StageProgressBar from "@/components/molecules/StageProgressBar.vue";

const breadcrumbItems = [
  { label: "首頁", to: "/" },
  { label: "我的案件", to: "/case-management" },
  { label: "危老重建案件", to: "/case-management-dangerous" },
  { label: "新增危老重建案件" },
];

const builderTypeOptions: InputDropdownItem[] = [{ label: "法人（公司行號）" }, { label: "自然人" }];
const districtOptions: InputDropdownItem[] = [];
const landOwnerOptions: InputDropdownItem[] = [];
const buildingOwnerOptions: InputDropdownItem[] = [];

const formData = ref({
  builderType: "",
  designerName: "",
  licenseNumber: "",
  officeName: "",
  businessScope: "",
  officePhone: "",
  officeFax: "",
  officeAddress: "",
  district: "",
  section: "",
  lotNumber: "",
  siteArea: "",
  siteLocation: "",
  siteTotalArea: "",
  siteLegalFAR: "",
  siteDescription: "",
  conditions: [false, false, false, false],
  landOwner: "",
  buildingOwner: "",
  buildingAddress: "",
  buildingUsage: "",
  buildingStructure: "",
  buildingFloors: "",
  buildingFloorArea: "",
  buildingHeight: "",
  buildingUsageDetail: "",
  designFAR: "",
  psercbId: "",
});

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleDropdownChange = (key: keyof typeof formData.value, item: InputDropdownItem) => {
  formData.value[key] = item.label;
};
</script>
