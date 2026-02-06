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
          :active-index="0"
        />

        <div class="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium text-gray-900">基本資料</h2>
          </div>

          <div class="flex flex-col gap-8">
            <div class="flex w-[744px] flex-col gap-4 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">基本資訊</h3>
              <div class="flex flex-col gap-3">
                <Input v-model="formData.caseName" label="案件名稱" placeholder="請輸入案件名稱" size="lg" required containerClass="w-[744px]" />
                <p class="text-sm leading-tight text-gray-500">例：擬訂臺中市OO區OO段OO小段OO地號(等)OO筆土地重建計畫案</p>
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <h3 class="text-xl font-bold text-blue-700">基地資料</h3>
              <div class="flex flex-col gap-6">
                <div v-for="(entry, index) in formData.baseLandEntries" :key="`land-${index}`" class="flex flex-col gap-4">
                  <p class="text-base font-medium text-gray-900">第{{ index + 1 }}筆</p>
                  <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                    <Input v-model="entry.zone" label="土地使用分區" placeholder="請輸入土地使用分區" size="lg" required containerClass="w-[364px]" />
                    <Input v-model="entry.legalCoverage" label="法定建蔽率（％）" placeholder="請輸入法定建蔽率" size="lg" required containerClass="w-[364px]" />
                    <Input v-model="entry.baseArea" label="基地面積（m²）" placeholder="請輸入基地面積" size="lg" required containerClass="w-[364px]" />
                    <Input v-model="entry.actualCoverage" label="實設建蔽率（％）" placeholder="請輸入實設建蔽率" size="lg" required containerClass="w-[364px]" />
                  </div>
                </div>
                <ButtonCTA variant="outline" size="sm" leftIcon="plus" class="!min-w-0 w-fit" @click="addBaseLandEntry">
                  新增其他筆
                </ButtonCTA>
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <Input v-model="formData.totalFloorArea" label="總樓地板面積（m²）" placeholder="請輸入總樓地板面積" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.buildingFloors" label="建築物樓層數（F）" placeholder="請輸入建築物樓層數" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.actualFAR" label="實設容積率（％）" placeholder="請輸入實設容積率" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.buildingHeight" label="建築物高度（含屋凸）（m）" placeholder="請輸入建築物高度" size="lg" required containerClass="w-[364px]" />
              </div>
            </div>

            <div class="flex flex-col gap-6 border-b border-gray-300 pb-6">
              <div class="grid w-[744px] grid-cols-[repeat(2,364px)] gap-4">
                <Input v-model="formData.carParking" label="實設汽車停車位（輛）" placeholder="請輸入汽車實設停車位" size="lg" required containerClass="w-[364px]" />
                <Input v-model="formData.motorParking" label="實設機車停車位（輛）" placeholder="請輸入機車實設停車位" size="lg" required containerClass="w-[364px]" />
              </div>
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
                      v-for="(image, index) in formData.renderImages"
                      :key="`render-${index}`"
                      :index="index + 1"
                      :src="image"
                      @delete="() => handleRemoveRenderImage(index)"
                    />
                  </div>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <p class="text-base font-medium text-gray-900">II. 拆除前舊建物外觀照片</p>
                  <ButtonCTA variant="outline" size="sm" class="!min-w-[84px]" @click="triggerImageUpload('demolition')">上傳照片</ButtonCTA>
                </div>
                <div class="flex flex-wrap gap-2">
                  <ImageCard
                    v-for="(image, index) in formData.demolitionImages"
                    :key="`demolition-${index}`"
                    :index="index + 1"
                    :src="image"
                    @delete="() => handleRemoveDemolitionImage(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-6">
        <ButtonCTA variant="textPlain" size="xl" href="/case-management-dangerous">上一步</ButtonCTA>
        <ButtonCTA variant="outline" size="xl">暫存</ButtonCTA>
        <ButtonCTA variant="primary" size="xl" href="/case-management-dangerous/add/application">下一步</ButtonCTA>
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
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import StageProgressBar from "@/components/molecules/StageProgressBar.vue";
import ImageCard from "@/components/molecules/ImageCard.vue";

const breadcrumbItems = [
  { label: "首頁", to: "/" },
  { label: "我的案件", to: "/case-management" },
  { label: "危老重建案件", to: "/case-management-dangerous" },
  { label: "新增危老重建案件" },
];

const formData = ref({
  caseName: "",
  baseLandEntries: [
    {
      zone: "",
      legalCoverage: "",
      baseArea: "",
      actualCoverage: "",
    },
  ],
  totalFloorArea: "",
  buildingFloors: "",
  actualFAR: "",
  buildingHeight: "",
  carParking: "",
  motorParking: "",
  renderImages: [] as string[],
  demolitionImages: [] as string[],
});

const renderInputRef = ref<HTMLInputElement | null>(null);
const demolitionInputRef = ref<HTMLInputElement | null>(null);

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const addBaseLandEntry = () => {
  formData.value.baseLandEntries.push({
    zone: "",
    legalCoverage: "",
    baseArea: "",
    actualCoverage: "",
  });
};

const triggerImageUpload = (target: "render" | "demolition") => {
  if (target === "render") {
    renderInputRef.value?.click();
    return;
  }
  demolitionInputRef.value?.click();
};

const handleImageUpload = (target: "render" | "demolition", event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  const urls = Array.from(files).map((file) => URL.createObjectURL(file));

  if (target === "render") {
    formData.value.renderImages.push(...urls);
  } else {
    formData.value.demolitionImages.push(...urls);
  }

  input.value = "";
};

const handleRemoveRenderImage = (index: number) => {
  formData.value.renderImages.splice(index, 1);
};

const handleRemoveDemolitionImage = (index: number) => {
  formData.value.demolitionImages.splice(index, 1);
};
</script>
