<template>
  <div class="min-h-screen bg-[#f3f5fa]">
    <div class="px-[60px] pb-0 pt-[40px]">
      <Breadcrumb />
    </div>
    <div class="px-[60px] py-[40px]">
      <div class="rounded-lg bg-white px-[60px] py-[40px] shadow-sm">
        <div class="border-b border-gray-300 pb-8">
          <h1 class="text-2xl font-medium leading-[1.5] text-gray-900">
            {{ newsDetail.title }}
          </h1>
          <div class="mt-8 flex items-center justify-between">
            <div class="flex flex-wrap items-center gap-6">
              <p class="text-base text-gray-700">發布日期：{{ newsDetail.publishDate }}</p>
              <p class="text-base text-gray-700">發布單位：{{ newsDetail.department }}</p>
              <span class="inline-flex items-center justify-center rounded border border-primary-500 px-2 py-1 text-sm font-medium text-primary-500">
                {{ newsDetail.category }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-base text-gray-700">
              <span>瀏覽人次: {{ newsDetail.views.toLocaleString() }}</span>
              <Icon name="shareNodes" :size="20" class="h-5 w-5" />
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center gap-6">
          <div class="w-full text-[18px] leading-[1.8] text-gray-900">
            <p class="mb-0">{{ newsDetail.intro }}</p>
            <p class="mb-0">{{ newsDetail.paragraph1 }}</p>
            <p class="mb-0">&nbsp;</p>
            <p class="mb-0 text-[20px] font-bold">{{ newsDetail.sectionTitle }}</p>
            <p class="mb-0">{{ newsDetail.paragraph2 }}</p>
            <p>{{ newsDetail.paragraph3 }}</p>
          </div>

          <div class="w-full">
            <div class="aspect-[2560/1707] w-full overflow-hidden rounded-lg">
              <img :src="newsDetail.imageUrl" alt="公開消息圖片" class="h-full w-full object-cover" />
            </div>
            <p class="mt-2 text-base font-medium text-gray-500">
              {{ newsDetail.caption }}
            </p>
          </div>

          <div class="w-full text-[18px] leading-[1.8] text-gray-900">
            <p class="mb-0 text-[20px] font-bold">{{ newsDetail.sectionTitle2 }}</p>
            <p class="mb-0">{{ newsDetail.paragraph4 }}</p>
            <ol class="mb-0 list-decimal">
              <li v-for="(item, index) in newsDetail.listItems" :key="index" class="ml-6">
                {{ item }}
              </li>
            </ol>
            <p class="mb-0">{{ newsDetail.paragraph5 }}</p>
            <p class="mb-0">{{ newsDetail.paragraph6 }}</p>
            <p class="mb-0">{{ newsDetail.paragraph7 }}</p>
            <p class="mb-0">&nbsp;</p>
            <p class="mb-0">【重點摘要】</p>
            <ul class="list-disc">
              <li v-for="(item, index) in newsDetail.summaryItems" :key="index" class="ml-6">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-10 px-[60px]">
        <h2 class="text-2xl font-semibold leading-[1.5] text-gray-900">相關消息</h2>
        <div class="mt-8 flex flex-col gap-5">
          <button
            v-for="item in relatedNews"
            :key="item.id"
            class="flex items-center gap-4 text-left"
            @click="handleRelatedClick(item.id)"
          >
            <span class="w-[100px] text-[18px] text-gray-500">{{ item.publishDate }}</span>
            <span class="inline-flex items-center justify-center rounded border border-primary-500 px-2 py-1 text-sm font-medium text-primary-500">
              {{ item.category }}
            </span>
            <span class="text-[20px] text-gray-900">
              {{ item.title }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import FooterSection from "@/components/sections/global/FooterSection.vue";
const route = useRoute();
const router = useRouter();
const newsId = Number(route.params.id || 1);

const newsDetail = {
  id: newsId,
  title: "臺中市率先完成全市老屋大規模重建計劃領先全台",
  publishDate: "114/10/30",
  department: "臺中市政府都市發展局",
  category: "新聞快訊",
  views: 3690321,
  intro: "臺中市都市再生邁入嶄新里程碑！",
  paragraph1:
    "為解決舊市區建物老化及防災安全問題，臺中市政府都市發展局今（15）日宣布，已率先全國完成「全市老屋大規模重建計劃」的總體盤點與策略規劃。此計劃打破過去單點式的危老重建限制，將舊城區及各行政區的老舊街廓進行整體性規劃，不僅核准重建面積高居六都之冠，更成為全台首個完成全市性老屋重建藍圖的城市。",
  sectionTitle: "打破單點重建限制 推動「大片區」再生",
  paragraph2:
    "都發局長表示，過去的危老重建多屬小基地、單棟建築的更新，難以改善整體街道景觀與公共設施不足的問題。市府團隊歷經兩年研議，透過「大數據盤點」與「街廓整體規劃」，指認出全市具有高度防災風險且具重建潛力的150處優先推動區塊。",
  paragraph3:
    "透過這項計劃，市府主動劃定「策略性重建單元」，並搭配去年（114年）修訂的容積獎勵機制，成功整合多個原本產權零碎的基地。目前已成功輔導中區、西區及豐原區等多個大型指標案進入實質開發階段，單案平均基地面積突破1,000平方公尺，規模效益顯著。",
  imageUrl: "https://www.figma.com/api/mcp/asset/d2482fa6-c231-4f78-8612-e0c62c395b39",
  caption: "臺中市在「危老重建核准面積」與「案件成長速度」上屢次獲得全國第一或第二的佳績，正積極推動更大規模的都更計畫（圖: 臺中市都發局提供）",
  sectionTitle2: "三大策略領先全台",
  paragraph4: "本計劃具備三大領先全台的創新策略：",
  listItems: [
    "全區域精準快篩：運用AI技術與GIS地理資訊系統，率先完成全市屋齡30年以上建物的耐震快篩，建立完整的「老屋防災資料庫」。",
    "主動媒合大基地：不僅是被動受理申請，市府更成立「都市再生專案辦公室」，主動針對大面積老舊街區進行地主意願整合與招商媒合。",
    "預審制度法制化：針對大規模重建案，創設「預審快速通關」機制，將行政審查時間縮短一半，大幅降低開發成本與不確定性。",
  ],
  paragraph5: "落實宜居城市願景",
  paragraph6:
    "市長指出，臺中市身為全台第二大城，都市更新不僅是為了美觀，更是為了市民的居住安全。隨著「全市老屋大規模重建計劃」的全面實施，預計未來5年內將帶動超過新台幣500億元的營建投資，並釋出更多高品質的公共開放空間與社會住宅單元，實現「舊城新生、安全宜居」的城市願景。",
  paragraph7:
    "民眾若欲查詢自家住宅是否位於優先推動區塊，或了解相關輔導資源，即日起可至臺中市政府都市發展局官網「都市更新與危老重建專區」查詢。",
  summaryItems: [
    "核心成就：全台首創以「全市」為範圍，完成老屋重建的整體盤點與策略規劃。",
    "政策突破：從「單點危老」升級為「街廓式大規模重建」，解決公設不足與景觀零碎問題。",
    "數據亮點：重建案平均基地面積擴大，核准面積與整合速度均領先其他五都。",
  ],
};

const relatedNews = [
  {
    id: 1,
    publishDate: "114/11/09",
    category: "新聞快訊",
    title: "本處辦理「114年度老屋新用計畫2.0」潭子區老屋第2次進駐者徵選，入選結果公告",
  },
  {
    id: 2,
    publishDate: "114/10/30",
    category: "新聞快訊",
    title: "本東區分館「台中都市更新大小事」講座",
  },
  {
    id: 3,
    publishDate: "114/10/12",
    category: "新聞快訊",
    title: "公告訂定「臺中市免辦建築執照處理原則」，並自即日起生效",
  },
  {
    id: 4,
    publishDate: "114/10/12",
    category: "新聞快訊",
    title: "公開閱覽「豐原車站東側豐原區翁明段659地號等12筆土地都市更新事業」公開評選文件",
  },
  {
    id: 5,
    publishDate: "114/09/26",
    category: "新聞快訊",
    title: "「臺中市新建建築工程工地地下水資源再利用名冊」(114年12月更新)",
  },
];

const handleRelatedClick = (id: number) => {
  router.push(`/news/${id}`);
};
</script>
