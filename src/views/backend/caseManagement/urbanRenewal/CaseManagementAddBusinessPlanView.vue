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
              <RadioGroup label="指標評估標準" required container-class="gap-5">
                <template #radios>
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
                </template>
              </RadioGroup>

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
              <RadioGroup label="範圍內是否涉及畸零地" required container-class="gap-5">
                <template #radios>
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
                </template>
              </RadioGroup>
            </div>

            <div class="flex flex-col gap-4">
              <RadioGroup label="範圍內是否涉及歷史建築物或暫定歷史建築物或聚落" required container-class="gap-5">
                <template #radios>
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
                </template>
              </RadioGroup>
            </div>

            <div class="flex flex-col gap-4">
              <RadioGroup label="範圍內是否涉及公有地" required container-class="gap-5">
                <template #radios>
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
                </template>
              </RadioGroup>
            </div>

            <div class="flex flex-col gap-4">
              <RadioGroup label="鄰接道路是否涉及未開闢道路" required container-class="gap-5">
                <template #radios>
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
                </template>
              </RadioGroup>
            </div>

            <div class="flex flex-col gap-4">
              <RadioGroup label="鄰接道路是否涉及未達8公尺" required container-class="gap-5">
                <template #radios>
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
                </template>
              </RadioGroup>
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
        <template v-if="isFromCaseDetail">
          <ButtonCTA variant="outline" size="xl" :to="cancelTarget">取消</ButtonCTA>
          <ButtonCTA variant="primary" size="xl" :disabled="!hasBusinessPlanChanges">儲存</ButtonCTA>
        </template>
        <template v-else-if="activeTab === 0">
          <ButtonCTA variant="outline" size="xl" @click="handleDraft">暫存</ButtonCTA>
          <ButtonCTA
            :variant="canGoNextToReviewTable ? 'primary' : 'gray'"
            size="xl"
            :to="canGoNextToReviewTable ? { path: '/case-management/add/review-table' } : undefined"
            :disabled="!canGoNextToReviewTable"
          >
            下一步
          </ButtonCTA>
        </template>
        <template v-else>
          <ButtonCTA variant="outline" size="xl" @click="handleDraft">暫存</ButtonCTA>
          <ButtonCTA variant="gray" size="xl" :to="{ path: '/case-management/add/review-table' }" :disabled="true">下一步</ButtonCTA>
        </template>
      </div>
      <Modal v-model="showDraftNameWarningModal" size="md" :static="false" :show-close-button="false" close-action="emit" backdrop-class="bg-gray-600/80">
        <template #header>
          <div class="flex w-full items-center justify-end px-4 pt-4">
            <button
              type="button"
              class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
              aria-label="關閉"
              @click="showDraftNameWarningModal = false"
            >
              <Icon name="close" :size="20" aria-hidden="true" />
            </button>
          </div>
        </template>
        <template #body>
          <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
            <div class="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gray-400 text-[28px] font-medium leading-none text-white">!</div>
            <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">請先填寫案件名稱，才能暫存案件</p>
          </div>
        </template>
        <template #footer>
          <div class="flex w-full items-center justify-center px-6 pb-6 pt-0">
            <ButtonCTA variant="primary" size="xs" class="h-[37px] w-[120px] px-3 py-2 text-sm font-medium leading-[1.5]" @click="showDraftNameWarningModal = false">
              確認
            </ButtonCTA>
          </div>
        </template>
      </Modal>
      <input ref="renderInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload('render', $event)" />
      <input ref="demolitionInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload('demolition', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Modal from "@/components/atoms/Modal.vue";
import Radio from "@/components/atoms/Radio.vue";
import RadioGroup from "@/components/atoms/RadioGroup.vue";
import Checkbox from "@/components/atoms/Checkbox.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import ImageCard from "@/components/molecules/ImageCard.vue";
import StageProgressBar from "@/components/molecules/StageProgressBar.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Tabs, { type TabItem } from "@/components/atoms/Tabs.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";


/** 從案件詳情按鈕進入為編輯，從新增流程進入為新增 */
const isFromCaseDetail = ref(false);
const route = useRoute();
const router = useRouter();
const cancelTarget = computed(() => {
  const returnTo = route.query?.returnTo;
  if (typeof returnTo === "string" && returnTo.trim()) {
    return returnTo;
  }
  return { path: "/case-management" };
});

const breadcrumbItems = computed(() => [
  { label: "首頁", to: "/" },
  { label: "案件管理", to: "/case-management" },
  { label: "都市更新案件", to: "/case-management" },
  { label: isFromCaseDetail.value ? "編輯都更案件" : "新增都更案件" },
]);

const tabItems: TabItem[] = [{ label: "申請基本資料" }, { label: "公開基本資料" }];
const activeTab = ref(0);
const showDraftNameWarningModal = ref(false);

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

const STORAGE_KEY_CASE_FOR_APPLICATION = "caseDetailForApplication";

const buildBusinessPlanSnapshot = () =>
  JSON.stringify({
    formData: formData.value,
    publicForm: publicForm.value,
  });

const { hasUnsavedChanges: hasBusinessPlanChanges, captureInitial: captureBusinessPlanInitial } = useFormUnsavedCheck(buildBusinessPlanSnapshot, isFromCaseDetail);
const hasTextValue = (value: string) => value.trim() !== "";
const canGoNextToReviewTable = computed(() => {
  const requiredTextFields = [
    formData.value.caseName,
    formData.value.applicantName,
    formData.value.applicantId,
    formData.value.applicantPhone,
    formData.value.applicantAddress,
    formData.value.applicantEmail,
    formData.value.entrustedUnit,
    formData.value.entrustedId,
    formData.value.entrustedPhone,
    formData.value.entrustedAddress,
    formData.value.entrustedEmail,
    formData.value.unitLocation,
    formData.value.unitScope,
    formData.value.unitArea,
    formData.value.landUseZone,
    formData.value.landOwners,
    formData.value.legalBuildingOwners,
    formData.value.legalBuildingCount,
    formData.value.illegalBuildingCount,
    formData.value.legalBuildingArea,
    formData.value.illegalBuildingArea,
    formData.value.ordinance,
    formData.value.indicatorVersion,
    formData.value.indicatorStandard1,
    formData.value.indicatorStandard2,
    formData.value.indicatorStandard3,
    formData.value.neighborConsentRate,
    formData.value.internalConsentRate,
    formData.value.oddLot,
    formData.value.historicBuilding,
    formData.value.publicLand,
    formData.value.unopenedRoad,
    formData.value.narrowRoad,
    formData.value.note,
  ];

  if (!formData.value.applyDate || !formData.value.hearingDate) {
    return false;
  }

  if (!requiredTextFields.every(hasTextValue)) {
    return false;
  }

  if (formData.value.publicLand === "yes" && !hasTextValue(formData.value.publicLandArea)) {
    return false;
  }

  if (formData.value.unopenedRoad === "yes" && !hasTextValue(formData.value.unopenedRoadCount)) {
    return false;
  }

  if (formData.value.narrowRoad === "yes" && !hasTextValue(formData.value.narrowRoadLength)) {
    return false;
  }

  return true;
});
const canDraftCurrentTab = computed(() => {
  const caseName = activeTab.value === 0 ? formData.value.caseName : publicForm.value.caseName;
  return hasTextValue(caseName);
});

/** 解析案件詳情頁傳入的申請日期（例：114/10/20）為 Date */
function parseApplyDateFromCaseInfo(value: string): Date | null {
  if (!value || typeof value !== "string") return null;
  const m = value.trim().match(/^(\d+)\/(\d+)\/(\d+)$/);
  if (!m) return null;
  const rocYear = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  const year = rocYear + 1911;
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}

onMounted(() => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_CASE_FOR_APPLICATION);
    if (raw) {
      isFromCaseDetail.value = true;
      const data = JSON.parse(raw) as {
        name?: string;
        number?: string;
        applyDate?: string;
        applicantName?: string;
        phone?: string;
        email?: string;
        address?: string;
      };
      sessionStorage.removeItem(STORAGE_KEY_CASE_FOR_APPLICATION);
      if (data.name) formData.value.caseName = data.name;
      if (data.applyDate) {
        const d = parseApplyDateFromCaseInfo(data.applyDate);
        if (d) formData.value.applyDate = d;
      }
      if (data.applicantName) formData.value.applicantName = data.applicantName;
      if (data.phone) formData.value.applicantPhone = data.phone;
      if (data.address) formData.value.applicantAddress = data.address;
      if (data.email) formData.value.applicantEmail = data.email;
    }
  } catch (_) {
    // ignore
  } finally {
    if (isFromCaseDetail.value) {
      captureBusinessPlanInitial();
    }
  }
});

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleDraft = () => {
  if (!canDraftCurrentTab.value) {
    showDraftNameWarningModal.value = true;
    return;
  }
  console.log("Draft business plan:", activeTab.value === 0 ? formData.value : publicForm.value);
  router.push({
    path: "/case-management",
    query: {
      toast: "draft-success",
    },
  });
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
