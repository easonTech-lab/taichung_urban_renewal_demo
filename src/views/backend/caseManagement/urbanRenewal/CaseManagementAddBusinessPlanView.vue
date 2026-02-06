<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">新增都更案件</h1>
      </div>

      <div class="flex flex-col gap-4">
        <StageProgressBar
          :steps="['基本資料', '都市更新審議資料表', '容積獎勵項目及額度']"
          :active-index="0"
        />

        <div class="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium text-gray-900">基本資料</h2>
          </div>
          <Tabs :items="tabItems" v-model="activeTab" />

          <div v-if="activeTab === 0" class="flex flex-col gap-6">

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <div class="flex flex-col gap-4 w-[744px]">
              <Input v-model="formData.caseName" label="案件名稱" placeholder="請輸入案件名稱" size="lg" required containerClass="w-[744px]" />
              <p class="text-sm leading-tight text-gray-500">
                例：擬訂臺中市OO區OO段OO小段OO地號(等)OO筆土地都市更新事業計畫案
              </p>
            </div>
            <div class="flex flex-wrap gap-4">
              <DatePicker
                v-model="formData.applyDate"
                label="申請日期"
                placeholder="請選擇申請日期"
                required
                containerClass="w-full md:w-[364px]"
              />
              <div class="flex w-full flex-col gap-2 md:w-[364px]">
                <DatePicker
                  v-model="formData.hearingDate"
                  label="自辦公聽會日期"
                  placeholder="請選擇自辦公聽會日期"
                  required
                  containerClass="w-full"
                />
                <Checkbox v-model="formData.hasPosted" label="已依法張貼里辦公處及登報" containerClass="pt-2" />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">申請者基本資訊</h3>
            <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
              <Input v-model="formData.applicantName" label="申請者姓名" placeholder="請輸入申請者姓名" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.applicantId" label="統一編號" placeholder="請輸入統一編號" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.applicantPhone" label="聯絡電話" placeholder="請輸入聯絡電話" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.applicantAddress" label="聯絡地址" placeholder="請輸入聯絡地址" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.applicantEmail" label="E-mail" placeholder="請輸入E-mail" size="lg" required containerClass="w-[364px]" />
              <div class="w-[364px]"></div>
            </div>
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">受託單位基本資訊</h3>
            <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
              <Input v-model="formData.entrustedUnit" label="受託單位" placeholder="請輸入受託單位" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.entrustedId" label="統一編號" placeholder="請輸入統一編號" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.entrustedPhone" label="聯絡電話" placeholder="請輸入聯絡電話" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.entrustedAddress" label="聯絡地址" placeholder="請輸入聯絡地址" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.entrustedEmail" label="E-mail" placeholder="請輸入E-mail" size="lg" required containerClass="w-[364px]" />
              <div class="w-[364px]"></div>
            </div>
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">更新單元基本資訊</h3>
            <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
              <div class="col-span-2">
                <Input v-model="formData.unitLocation" label="更新單元位置" placeholder="請輸入更新單元位置" size="lg" required containerClass="w-[744px]" />
              </div>
              <Input v-model="formData.unitScope" label="更新單元範圍" placeholder="請輸入更新單元範圍" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.unitArea" label="更新單元面積" placeholder="請輸入更新單元面積" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.landUseZone" label="土地使用分區" placeholder="請輸入土地使用分區" size="lg" required containerClass="w-[364px]" />
              <div class="w-[364px]"></div>
            </div>
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">範圍內所有權人數</h3>
            <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
              <Input v-model="formData.landOwners" label="土地所有權人數（人）" placeholder="請輸入土地所有權人數" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.legalBuildingOwners" label="合法建築物所有權人數（人）" placeholder="請輸入合法建築物所有權人數" size="lg" required containerClass="w-[364px]" />
            </div>
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">範圍內建築物棟數</h3>
            <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
              <Input v-model="formData.legalBuildingCount" label="合法建築物棟數（棟）" placeholder="請輸入合法建築物棟數" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.illegalBuildingCount" label="舊違章建物棟數（棟）" placeholder="請輸入舊違章建物棟數" size="lg" required containerClass="w-[364px]" />
            </div>
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">範圍內建築物樓地板面積</h3>
            <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
              <Input v-model="formData.legalBuildingArea" label="合法建築物面積（m²）" placeholder="請輸入合法建築物面積" size="lg" required containerClass="w-[364px]" />
              <Input v-model="formData.illegalBuildingArea" label="舊違章建築物面積（m²）" placeholder="請輸入舊違章建築物面積" size="lg" required containerClass="w-[364px]" />
            </div>
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">劃定基準</h3>
            <InputDropdown
              label="臺中市都市更新自治條例第8條"
              placeholder="請選擇符合條例"
              :button-text="formData.ordinance"
              :items="ordinanceOptions"
              required
              container-class="w-full md:w-[364px]"
              @item-click="(item) => handleDropdownChange('ordinance', item)"
            />
          </div>

          <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
            <h3 class="text-xl font-bold text-blue-700">指標評估標準</h3>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-4">
                <label class="relative inline-block text-base font-medium text-gray-900">
                  指標評估標準
                  <span class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
                </label>
                <div class="flex flex-col gap-5">
                  <Radio
                    :model-value="formData.indicatorVersion"
                    value="107-05-08"
                    label="107年5月8日版"
                    name="indicator-version"
                    label-class="text-sm font-medium text-gray-900"
                    @update:model-value="(value) => handleRadioChange('indicatorVersion', value as string)"
                  />
                  <Radio
                    :model-value="formData.indicatorVersion"
                    value="114-09-17"
                    label="114年9月17日版"
                    name="indicator-version"
                    label-class="text-sm font-medium text-gray-900"
                    @update:model-value="(value) => handleRadioChange('indicatorVersion', value as string)"
                  />
                </div>
              </div>

              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <InputDropdown
                  label="指標評估標準 1"
                  placeholder="請選擇符合指標"
                  :button-text="formData.indicatorStandard1"
                  :items="indicatorStandardOptions"
                  required
                  container-class="w-[364px]"
                  @item-click="(item) => handleDropdownChange('indicatorStandard1', item)"
                />
                <InputDropdown
                  label="指標評估標準 2"
                  placeholder="請選擇符合指標"
                  :button-text="formData.indicatorStandard2"
                  :items="indicatorStandardOptions"
                  required
                  container-class="w-[364px]"
                  @item-click="(item) => handleDropdownChange('indicatorStandard2', item)"
                />
                <InputDropdown
                  label="指標評估標準 3"
                  placeholder="請選擇符合指標"
                  :button-text="formData.indicatorStandard3"
                  :items="indicatorStandardOptions"
                  required
                  container-class="w-[364px]"
                  @item-click="(item) => handleDropdownChange('indicatorStandard3', item)"
                />
                <div class="w-[364px]"></div>
              </div>

              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <Input
                  v-model="formData.neighborConsentRate"
                  label="鄰地協調同意比例（％）"
                  placeholder="請輸入鄰地協調同意比例"
                  size="lg"
                  required
                  containerClass="w-[364px]"
                />
                <InputDropdown
                  label="範圍內同意比例（％）"
                  placeholder="範圍內同意比例"
                  :button-text="formData.internalConsentRate"
                  :items="consentRateOptions"
                  required
                  container-class="w-[364px]"
                  @item-click="(item) => handleDropdownChange('internalConsentRate', item)"
                />
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <label class="relative inline-block text-base font-medium text-gray-900">
                範圍內是否涉及畸零地
                <span class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
              </label>
              <div class="flex flex-col gap-5">
                <Radio
                  :model-value="formData.oddLot"
                  value="yes"
                  label="是"
                  name="odd-lot"
                  label-class="text-sm font-medium text-gray-900"
                  @update:model-value="(value) => handleRadioChange('oddLot', value as string)"
                />
                <Radio
                  :model-value="formData.oddLot"
                  value="no"
                  label="否"
                  name="odd-lot"
                  label-class="text-sm font-medium text-gray-900"
                  @update:model-value="(value) => handleRadioChange('oddLot', value as string)"
                />
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <label class="relative inline-block text-base font-medium text-gray-900">
                範圍內是否涉及歷史建築物或暫定歷史建築物或聚落
                <span class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
              </label>
              <div class="flex flex-col gap-5">
                <Radio
                  :model-value="formData.historicBuilding"
                  value="yes"
                  label="是"
                  name="historic-building"
                  label-class="text-sm font-medium text-gray-900"
                  @update:model-value="(value) => handleRadioChange('historicBuilding', value as string)"
                />
                <Radio
                  :model-value="formData.historicBuilding"
                  value="no"
                  label="否"
                  name="historic-building"
                  label-class="text-sm font-medium text-gray-900"
                  @update:model-value="(value) => handleRadioChange('historicBuilding', value as string)"
                />
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <label class="relative inline-block text-base font-medium text-gray-900">
                範圍內是否涉及公有地
                <span class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
              </label>
              <div class="flex flex-col gap-5">
                <div class="flex flex-col gap-2">
                  <Radio
                    :model-value="formData.publicLand"
                    value="yes"
                    label="是"
                    name="public-land"
                    label-class="text-sm font-medium text-gray-900"
                    @update:model-value="(value) => handleRadioChange('publicLand', value as string)"
                  />
                  <Input
                    v-if="formData.publicLand === 'yes'"
                    v-model="formData.publicLandArea"
                    label="面積"
                    placeholder="請輸入涉及公有地面積（m²）"
                    size="lg"
                    required
                    containerClass="w-full md:w-[364px]"
                  />
                </div>
                <Radio
                  :model-value="formData.publicLand"
                  value="no"
                  label="否"
                  name="public-land"
                  label-class="text-sm font-medium text-gray-900"
                  @update:model-value="(value) => handleRadioChange('publicLand', value as string)"
                />
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <label class="relative inline-block text-base font-medium text-gray-900">
                鄰接道路是否涉及未開闢道路
                <span class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
              </label>
              <div class="flex flex-col gap-5">
                <div class="flex flex-col gap-2">
                  <Radio
                    :model-value="formData.unopenedRoad"
                    value="yes"
                    label="是"
                    name="unopened-road"
                    label-class="text-sm font-medium text-gray-900"
                    @update:model-value="(value) => handleRadioChange('unopenedRoad', value as string)"
                  />
                  <Input
                    v-if="formData.unopenedRoad === 'yes'"
                    v-model="formData.unopenedRoadCount"
                    label="面積"
                    placeholder="請輸入數量/條"
                    size="lg"
                    required
                    containerClass="w-full md:w-[364px]"
                  />
                </div>
                <Radio
                  :model-value="formData.unopenedRoad"
                  value="no"
                  label="否"
                  name="unopened-road"
                  label-class="text-sm font-medium text-gray-900"
                  @update:model-value="(value) => handleRadioChange('unopenedRoad', value as string)"
                />
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <label class="relative inline-block text-base font-medium text-gray-900">
                鄰接道路是否涉及未達8公尺
                <span class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
              </label>
              <div class="flex flex-col gap-5">
                <div class="flex flex-col gap-2">
                  <Radio
                    :model-value="formData.narrowRoad"
                    value="yes"
                    label="是，涉及未達8公尺"
                    name="narrow-road"
                    label-class="text-sm font-medium text-gray-900"
                    @update:model-value="(value) => handleRadioChange('narrowRoad', value as string)"
                  />
                  <Input
                    v-if="formData.narrowRoad === 'yes'"
                    v-model="formData.narrowRoadLength"
                    label="面積"
                    placeholder="請輸入公尺/條"
                    size="lg"
                    required
                    containerClass="w-full md:w-[364px]"
                  />
                </div>
                <Radio
                  :model-value="formData.narrowRoad"
                  value="no"
                  label="否，無涉及鄰接道路未達8公尺"
                  name="narrow-road"
                  label-class="text-sm font-medium text-gray-900"
                  @update:model-value="(value) => handleRadioChange('narrowRoad', value as string)"
                />
              </div>
            </div>

            <Input v-model="formData.note" label="備註" placeholder="請輸入備註" size="lg" required containerClass="w-full md:w-[364px]" />
          </div>
          </div>

          <div v-else class="flex flex-col gap-6">
            <div class="flex flex-col gap-6 border-b border-gray-300 pb-8">
              <h3 class="text-xl font-bold text-blue-700">基本資訊</h3>
              <div class="flex flex-col gap-4">
                <Input v-model="publicForm.caseName" label="案件名稱" placeholder="請輸入案件名稱" size="lg" required />
                <p class="text-sm leading-tight text-gray-500">
                  例：擬訂臺中市OO區OO段OO小段OO地號(等)OO筆土地都市更新事業計畫案
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">基地資料</h3>
              <div class="flex flex-col gap-4">
                <div v-for="(plot, index) in publicForm.basePlots" :key="index" class="flex flex-col gap-4 border-b border-gray-300 pb-6 last:border-b-0 last:pb-0">
                  <div class="flex items-center gap-1 text-lg font-medium text-gray-900">第{{ index + 1 }}筆</div>
                  <div class="flex flex-wrap gap-4">
                    <div class="flex w-full flex-col gap-2 md:w-[364px]">
                      <Input v-model="plot.landUseZone" label="土地使用分區" placeholder="請輸入土地使用分區" size="lg" required />
                      <p class="text-sm leading-tight text-gray-500">例：第三種住宅區</p>
                    </div>
                    <Input v-model="plot.legalCoverage" label="法定建蔽率（％）" placeholder="請輸入法定建蔽率" size="lg" required containerClass="w-full md:w-[364px]" />
                    <Input v-model="plot.siteArea" label="基地面積（m²）" placeholder="請輸入基地面積" size="lg" required containerClass="w-full md:w-[364px]" />
                    <Input v-model="plot.actualCoverage" label="實設建蔽率（％）" placeholder="請輸入實設建蔽率" size="lg" required containerClass="w-full md:w-[364px]" />
                  </div>
                  <ButtonCTA
                    v-if="index === publicForm.basePlots.length - 1"
                    variant="outline"
                    size="xs"
                    left-icon="plus"
                    type="button"
                    class="!min-w-0 self-start"
                    @click="handleAddBasePlot"
                  >
                    新增其他筆
                  </ButtonCTA>
                </div>

                <div class="flex flex-wrap gap-4">
                  <Input v-model="publicForm.totalFloorArea" label="總樓地板面積（m²）" placeholder="請輸入總樓地板面積" size="lg" required containerClass="w-full md:w-[364px]" />
                  <Input v-model="publicForm.floorCount" label="建築物樓層數（F）" placeholder="請輸入建築物樓層數" size="lg" required containerClass="w-full md:w-[364px]" />
                  <Input v-model="publicForm.floorAreaRatio" label="實設容積率（％）" placeholder="請輸入實設容積率" size="lg" required containerClass="w-full md:w-[364px]" />
                  <Input v-model="publicForm.buildingHeight" label="建築物高度（含屋凸）（m）" placeholder="請輸入建築物高度" size="lg" required containerClass="w-full md:w-[364px]" />
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-4">
              <Input v-model="publicForm.carParking" label="實設汽車停車位（輛）" placeholder="請輸入汽車實設停車位" size="lg" required containerClass="w-full md:w-[364px]" />
              <Input v-model="publicForm.motorParking" label="實設機車停車位（輛）" placeholder="請輸入機車實設停車位" size="lg" required containerClass="w-full md:w-[364px]" />
            </div>

            <div class="flex flex-col gap-4">
              <h3 class="text-xl font-bold text-blue-700">圖說及相片</h3>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-4 border-b border-gray-300 pb-8">
                  <div class="flex items-center justify-between gap-4">
                    <p class="text-base font-medium text-gray-900">
                      I.3D 模擬圖（可搭配現況環境模擬呈現，6樓以下小基地建築規模者得以設計立面外觀圖提供）
                    </p>
                    <ButtonCTA variant="outline" size="sm" class="!min-w-[84px]" @click="triggerImageUpload('render')">上傳照片</ButtonCTA>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <ImageCard
                      v-for="(image, index) in publicForm.renderImages"
                      :key="`render-${index}`"
                      :index="index + 1"
                      :src="image"
                      @delete="() => handleRemoveRenderImage(index)"
                    />
                  </div>
                </div>
                <div class="flex items-center justify-between gap-4 pb-8">
                  <p class="text-base font-medium text-gray-900">II. 拆除前舊建物外觀照片</p>
                  <ButtonCTA variant="outline" size="sm" class="!min-w-[84px]" @click="triggerImageUpload('demolition')">上傳照片</ButtonCTA>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-6">
        <template v-if="activeTab === 0">
          <ButtonCTA variant="outline" size="xl">暫存</ButtonCTA>
          <ButtonCTA variant="primary" size="xl" href="/case-management/add/review-table">下一步</ButtonCTA>
        </template>
        <template v-else>
          <ButtonCTA variant="textPlain" size="xl">上一步</ButtonCTA>
          <ButtonCTA variant="outline" size="xl">暫存</ButtonCTA>
          <ButtonCTA variant="gray" size="xl" href="/case-management/add/review-table" :disabled="true">下一步</ButtonCTA>
        </template>
      </div>
      <input ref="renderInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload('render', $event)" />
      <input ref="demolitionInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload('demolition', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Input from "@/components/atoms/Input.vue";
import Radio from "@/components/atoms/Radio.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import StageProgressBar from "@/components/molecules/StageProgressBar.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import Checkbox from "@/components/atoms/Checkbox.vue";
import Tabs, { type TabItem } from "@/components/atoms/Tabs.vue";
import ImageCard from "@/components/molecules/ImageCard.vue";

const breadcrumbItems = [
  { label: "首頁", to: "/" },
  { label: "案件管理", to: "/case-management" },
  { label: "都市更新案件", to: "/case-management" },
  { label: "內容頁" },
];

const tabItems: TabItem[] = [{ label: "申請基本資料" }, { label: "公開基本資料" }];
const activeTab = ref(0);

const ordinanceOptions: InputDropdownItem[] = [];
const indicatorStandardOptions: InputDropdownItem[] = [];
const consentRateOptions: InputDropdownItem[] = [];

const formData = ref({
  caseName: "",
  applyDate: null as Date | null,
  hearingDate: null as Date | null,
  hasPosted: false,
  applicantName: "",
  applicantId: "",
  applicantPhone: "",
  applicantAddress: "",
  applicantEmail: "",
  entrustedUnit: "",
  entrustedId: "",
  entrustedPhone: "",
  entrustedAddress: "",
  entrustedEmail: "",
  unitLocation: "",
  unitScope: "",
  unitArea: "",
  landUseZone: "",
  landOwners: "",
  legalBuildingOwners: "",
  legalBuildingCount: "",
  illegalBuildingCount: "",
  legalBuildingArea: "",
  illegalBuildingArea: "",
  ordinance: "",
  indicatorVersion: "",
  indicatorStandard1: "",
  indicatorStandard2: "",
  indicatorStandard3: "",
  neighborConsentRate: "",
  internalConsentRate: "",
  oddLot: "",
  historicBuilding: "",
  publicLand: "",
  publicLandArea: "",
  unopenedRoad: "",
  unopenedRoadCount: "",
  narrowRoad: "",
  narrowRoadLength: "",
  note: "",
});

const publicForm = ref({
  caseName: "",
  basePlots: [
    {
      landUseZone: "",
      legalCoverage: "",
      siteArea: "",
      actualCoverage: "",
    },
  ],
  totalFloorArea: "",
  floorCount: "",
  floorAreaRatio: "",
  buildingHeight: "",
  carParking: "",
  motorParking: "",
  renderImages: [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
  ],
  demolitionImages: [],
});

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

type StringFieldKey = {
  [Key in keyof typeof formData.value]: typeof formData.value[Key] extends string ? Key : never;
}[keyof typeof formData.value];

const handleDropdownChange = (key: StringFieldKey, item: InputDropdownItem) => {
  formData.value[key] = item.label;
};

const handleRadioChange = (key: StringFieldKey, value: string) => {
  formData.value[key] = value;
};

const handleAddBasePlot = () => {
  publicForm.value.basePlots.push({
    landUseZone: "",
    legalCoverage: "",
    siteArea: "",
    actualCoverage: "",
  });
};

const handleRemoveRenderImage = (index: number) => {
  publicForm.value.renderImages.splice(index, 1);
};

const renderInputRef = ref<HTMLInputElement | null>(null);
const demolitionInputRef = ref<HTMLInputElement | null>(null);

const triggerImageUpload = (target: "render" | "demolition") => {
  if (target === "render") {
    renderInputRef.value?.click();
  } else {
    demolitionInputRef.value?.click();
  }
};

const handleImageUpload = (target: "render" | "demolition", event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const files = Array.from(input.files);
  const urls = files.map((file) => URL.createObjectURL(file));
  if (target === "render") {
    publicForm.value.renderImages.push(...urls);
  } else {
    publicForm.value.demolitionImages.push(...urls);
  }
  input.value = "";
};
</script>
