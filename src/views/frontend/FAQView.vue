<template>
  <div class="flex min-h-screen flex-col bg-[#f3f5fa]">
    <!-- 內容區域 -->
    <div class="flex-1">
      <!-- 麵包屑和標題 -->
      <div class="flex flex-col items-start gap-6 px-[60px] pt-[40px]">
        <Breadcrumb />
        <h1 class="text-[30px] font-bold leading-[30px] text-gray-900">常見問題</h1>
      </div>
      <!-- 搜尋框 -->
      <div class="mt-6 px-[60px]">
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <SearchInput
              v-model="searchQuery"
              placeholder="關鍵字搜尋"
              button-text="搜尋"
              input-variant="gray"
              icon-color="text-primary-600"
              button-variant="primary"
              button-class="h-10 px-5"
              aria-label="搜尋常見問題"
              @submit="handleSearch"
            />
          </div>
        </div>
      </div>
      <!-- 主要內容區：左側分類 + 右側詳細內容 -->
      <div class="mt-6 flex items-start gap-10 px-[60px] pb-[40px]">
        <!-- 左側：搜索結果統計（搜索時顯示）或分類導航手風琴（無搜索時顯示） -->
        <div class="w-[360px] shrink-0">
          <!-- 搜索結果統計 -->
          <div v-if="appliedSearchQuery.trim()" class="flex items-end gap-2">
            <p class="text-2xl font-medium leading-normal text-black">搜尋結果共</p>
            <p class="text-3xl font-bold leading-normal text-primary-700">{{ allMatchingQuestions.length }}</p>
            <p class="text-2xl font-medium leading-normal text-black">筆</p>
          </div>
          <!-- 分類導航手風琴 -->
          <div v-else class="flex flex-col gap-6">
            <div v-for="(category, categoryIndex) in faqCategories" :key="categoryIndex" class="flex flex-col gap-6">
              <!-- 分類標題（可展開/收起） -->
              <button
                type="button"
                class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-6 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="isCategoryOpen(categoryIndex) ? 'bg-blue-500' : 'bg-transparent hover:bg-gray-50'"
                :aria-expanded="isCategoryOpen(categoryIndex)"
                :aria-controls="`category-${categoryIndex}-questions`"
                :aria-label="`${category.title}，點擊${isCategoryOpen(categoryIndex) ? '收起' : '展開'}子問題列表`"
                @click="selectCategory(categoryIndex)"
                @keydown.enter="selectCategory(categoryIndex)"
                @keydown.space.prevent="selectCategory(categoryIndex)"
              >
                <p class="flex-1 text-xl font-medium" :class="isCategoryOpen(categoryIndex) ? 'text-blue-50' : 'text-gray-900'">
                  {{ category.title }}
                </p>
                <svg
                  class="h-6 w-6 shrink-0 transition-transform"
                  :class="[isCategoryOpen(categoryIndex) ? 'rotate-180' : '', isCategoryOpen(categoryIndex) ? 'text-blue-50' : 'text-gray-900']"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7" />
                </svg>
              </button>
              <!-- 子問題列表（展開時顯示） -->
              <div
                v-show="isCategoryOpen(categoryIndex)"
                :id="`category-${categoryIndex}-questions`"
                class="flex flex-col gap-4 pl-10"
                role="region"
                :aria-label="`${category.title}的子問題列表`"
              >
                <button
                  v-for="(question, questionIndex) in category.questions"
                  :key="questionIndex"
                  type="button"
                  class="cursor-pointer rounded py-0 text-left text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :class="activeQuestionId === question.id ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'"
                  :aria-label="`${question.title}，點擊查看詳細答案`"
                  :aria-current="activeQuestionId === question.id ? 'true' : undefined"
                  @click.stop="selectQuestion(question.id)"
                  @keydown.enter.stop="selectQuestion(question.id)"
                  @keydown.space.stop.prevent="selectQuestion(question.id)"
                >
                  {{ question.title }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 右側：詳細內容手風琴 -->
        <div class="flex-1">
          <div class="flex flex-col gap-6">
            <!-- 搜索結果視圖 -->
            <template v-if="appliedSearchQuery.trim()">
              <Empty v-if="allMatchingQuestions.length === 0" />
              <template v-else>
                <div v-for="(categoryGroup, categoryIndex) in groupedSearchResults" :key="categoryIndex" class="flex flex-col gap-6">
                  <h2 class="text-2xl font-bold leading-normal tracking-[-0.24px] text-gray-900">{{ categoryGroup.categoryTitle }}</h2>
                  <div class="flex flex-col gap-6">
                    <template v-for="question in categoryGroup.questions" :key="question.id">
                      <div
                        v-if="activeQuestionId === question.id"
                        :id="`question-${question.id}-content`"
                        class="flex flex-col items-start gap-6 rounded-lg bg-white p-5"
                        role="region"
                        :aria-label="`${question.title}的詳細答案`"
                      >
                        <button
                          type="button"
                          class="flex w-full cursor-pointer items-center gap-2 rounded text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          :aria-expanded="true"
                          :aria-controls="`question-${question.id}-content`"
                          :aria-label="`${question.title}，點擊收起`"
                          @click="selectQuestion(question.id)"
                          @keydown.enter="selectQuestion(question.id)"
                          @keydown.space.prevent="selectQuestion(question.id)"
                        >
                          <div class="relative size-6 shrink-0">
                            <div class="absolute inset-0 rounded-full bg-blue-200"></div>
                            <div class="absolute inset-1 flex items-center justify-center rounded-full bg-blue-500">
                              <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                              </svg>
                            </div>
                          </div>
                          <p class="text-xl font-medium text-gray-900">{{ question.title }}</p>
                        </button>
                        <div class="pl-8 text-base leading-loose text-gray-800" v-html="question.content"></div>
                      </div>
                      <!-- 收起的問題（只顯示標題） -->
                      <button
                        v-else
                        type="button"
                        class="flex w-full cursor-pointer items-center gap-2 rounded-lg p-5 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        :aria-expanded="false"
                        :aria-controls="`question-${question.id}-content`"
                        :aria-label="`${question.title}，點擊展開查看詳細答案`"
                        @click="selectQuestion(question.id)"
                        @keydown.enter="selectQuestion(question.id)"
                        @keydown.space.prevent="selectQuestion(question.id)"
                      >
                        <div class="relative size-6 shrink-0">
                          <div class="absolute inset-0 rounded-full border-2 border-blue-500"></div>
                          <div class="absolute inset-1 flex items-center justify-center rounded-full bg-white">
                            <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                        <p class="text-xl font-medium text-gray-900">{{ question.title }}</p>
                      </button>
                    </template>
                  </div>
                </div>
              </template>
            </template>
            <!-- 正常視圖（無搜索時顯示） -->
            <template v-else>
              <h2 v-show="activeCategory" class="text-2xl font-bold leading-normal tracking-[-0.24px] text-gray-900">{{ activeCategory?.title || "" }}</h2>
              <div v-if="currentQuestions.length > 0" class="flex flex-col gap-6">
                <template v-for="(question, index) in currentQuestions" :key="question.id">
                  <!-- 展開的問題（顯示詳細內容） -->
                  <div
                    v-if="activeQuestionId === question.id"
                    :id="`question-${question.id}-content`"
                    class="flex flex-col items-start gap-6 rounded-lg bg-white p-5"
                    role="region"
                    :aria-label="`${question.title}的詳細答案`"
                  >
                    <button
                      type="button"
                      class="flex w-full cursor-pointer items-center gap-2 rounded text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :aria-expanded="true"
                      :aria-controls="`question-${question.id}-content`"
                      :aria-label="`${question.title}，點擊收起`"
                      @click="selectQuestion(question.id)"
                      @keydown.enter="selectQuestion(question.id)"
                      @keydown.space.prevent="selectQuestion(question.id)"
                    >
                      <div class="relative size-6 shrink-0">
                        <div class="absolute inset-0 rounded-full bg-blue-200"></div>
                        <div class="absolute inset-1 flex items-center justify-center rounded-full bg-blue-500">
                          <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                          </svg>
                        </div>
                      </div>
                      <p class="text-xl font-medium text-gray-900">{{ question.title }}</p>
                    </button>
                    <div class="pl-8 text-base leading-loose text-gray-800" v-html="question.content"></div>
                  </div>
                  <!-- 收起的問題（只顯示標題） -->
                  <button
                    v-else
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-lg p-5 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    :aria-expanded="false"
                    :aria-controls="`question-${question.id}-content`"
                    :aria-label="`${question.title}，點擊展開查看詳細答案`"
                    @click="selectQuestion(question.id)"
                    @keydown.enter="selectQuestion(question.id)"
                    @keydown.space.prevent="selectQuestion(question.id)"
                  >
                    <div class="relative size-6 shrink-0">
                      <div class="absolute inset-0 rounded-full border-2 border-blue-500"></div>
                      <div class="absolute inset-1 flex items-center justify-center rounded-full bg-white">
                        <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <p class="text-xl font-medium text-gray-900">{{ question.title }}</p>
                  </button>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Empty from "@/components/atoms/Empty.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SearchInput from "@/components/atoms/SearchInput.vue";
import FooterSection from "@/components/sections/global/FooterSection.vue";

export interface FAQQuestion {
  id: string;
  title: string;
  content: string;
}

export interface FAQCategory {
  title: string;
  questions: FAQQuestion[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "我適合哪種重建或改善方式？",
    questions: [
      {
        id: "q1-1",
        title: "都更、危老、整建維護差在哪？",
        content: `<p class="mb-2">三者都是提升都市環境與建築安全的重要工具，但適用範圍與重點不同：</p>
<ol class="list-decimal ms-6 mb-2">
  <li class="mb-2">
    <strong>都市更新（都更）</strong>
    <ul class="list-disc ms-6 mb-2">
      <li class="mb-1"><strong>重點：</strong>透過「整體規劃」，以重建或整建維護方式改善老舊地區，提升居住品質與公共設施。</li>
      <li class="mb-1"><strong>特色：</strong>通常需達一定基地面積與住戶同意門檻，更新後可享有容積獎勵與公設改善。</li>
      <li><strong>適合對象：</strong>老舊、公共設施不足、巷道狹窄的整片區域。</li>
    </ul>
  </li>
  <li class="mb-2">
    <strong>危險及老舊建築物重建（危老）</strong>
    <ul class="list-disc ms-6 mb-2">
      <li class="mb-1"><strong>重點：</strong>針對單一或少數建物，程序單純、時程較快，鼓勵加速重建，提升耐震與防災能力。</li>
      <li class="mb-1"><strong>特色：</strong>只要建物屋齡達30年以上且有安全疑慮，就可申請，不需像都更一樣做整體區域規劃。</li>
      <li><strong>適合對象：</strong>老舊、耐震不足但範圍小的建物。</li>
    </ul>
  </li>
  <li>
    <strong>整建維護</strong>
    <ul class="list-disc ms-6 mb-2">
      <li class="mb-1"><strong>重點：</strong>不拆除原有建物，而是透過加強結構、修繕外觀、改善公共設施來延長建物壽命。</li>
      <li class="mb-1"><strong>特色：</strong>成本低、施工期短，對原有住戶影響較小。</li>
      <li><strong>適合對象：</strong>建物結構安全、僅外觀或設備老舊者。</li>
    </ul>
  </li>
</ol>`,
      },
      {
        id: "q1-2",
        title: "哪些房子可以申請政府補助？",
        content: "<p>符合條件的房子可以申請政府補助...</p>",
      },
      {
        id: "q1-3",
        title: "我的社區算老舊街區嗎？",
        content: "<p>判斷老舊街區的標準...</p>",
      },
    ],
  },
  {
    title: "怎麼申請？需要準備什麼？",
    questions: [
      {
        id: "q2-1",
        title: "需要準備什麼資料、文件？",
        content: "<p>申請所需資料...</p>",
      },
      {
        id: "q2-2",
        title: "從申請到蓋好，大概要多久？",
        content: "<p>時程說明...</p>",
      },
      {
        id: "q2-3",
        title: "我可以找誰來幫忙處理流程？",
        content: "<p>協助單位說明...</p>",
      },
    ],
  },
  {
    title: "有什麼補助或政府資源？",
    questions: [
      {
        id: "q3-1",
        title: "危老可以拿到多少容積獎勵？",
        content: "<p>容積獎勵說明...</p>",
      },
      {
        id: "q3-2",
        title: "整建維護最多補助多少錢？",
        content: "<p>補助金額說明...</p>",
      },
      {
        id: "q3-3",
        title: "政府能幫忙找建商或建築師嗎？",
        content: "<p>協助資源說明...</p>",
      },
    ],
  },
];

const searchQuery = ref("");
const appliedSearchQuery = ref(""); // 應用於過濾的搜尋關鍵字（點擊搜尋後才應用）
const activeCategoryIndexes = ref<number[]>([0]); // 改為數組，但一次只能展開一個
const activeQuestionId = ref<string | null>(null);

// 初始化時選擇第一個分類的第一個問題
if (faqCategories.length > 0 && faqCategories[0].questions.length > 0) {
  activeQuestionId.value = faqCategories[0].questions[0].id;
}

// 當前顯示的分類（用於右側顯示，優先顯示第一個展開的分類）
const activeCategory = computed(() => {
  if (activeCategoryIndexes.value.length > 0) {
    return faqCategories[activeCategoryIndexes.value[0]] || null;
  }
  return null;
});

// 檢查分類是否展開
const isCategoryOpen = (index: number) => {
  return activeCategoryIndexes.value.includes(index);
};

// 獲取所有匹配搜尋的問題（跨分類）
const allMatchingQuestions = computed(() => {
  if (!appliedSearchQuery.value.trim()) return [];
  const query = appliedSearchQuery.value.trim().toLowerCase();
  const matching: Array<{ categoryIndex: number; categoryTitle: string; question: FAQQuestion }> = [];
  faqCategories.forEach((category, categoryIndex) => {
    category.questions.forEach((question) => {
      // 搜尋標題
      if (question.title.toLowerCase().includes(query)) {
        matching.push({ categoryIndex, categoryTitle: category.title, question });
        return;
      }
      // 搜尋內容（去除 HTML 標籤後）
      const textContent = stripHtmlTags(question.content).toLowerCase();
      if (textContent.includes(query)) {
        matching.push({ categoryIndex, categoryTitle: category.title, question });
      }
    });
  });

  return matching;
});

// 按分類分組的搜索結果
const groupedSearchResults = computed(() => {
  if (!appliedSearchQuery.value.trim() || allMatchingQuestions.value.length === 0) return [];
  const groups = new Map<string, FAQQuestion[]>();
  allMatchingQuestions.value.forEach((item) => {
    if (!groups.has(item.categoryTitle)) {
      groups.set(item.categoryTitle, []);
    }
    groups.get(item.categoryTitle)!.push(item.question);
  });
  return Array.from(groups.entries()).map(([categoryTitle, questions]) => ({
    categoryTitle,
    questions,
  }));
});

// 當前分類的問題列表（無搜索時顯示當前分類的問題）
const currentQuestions = computed(() => {
  if (!activeCategory.value) return [];
  return activeCategory.value.questions;
});

// 去除 HTML 標籤，提取純文字
const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

//點擊分類標題展開/收起
const selectCategory = (index: number) => {
  const currentIndex = activeCategoryIndexes.value.indexOf(index);
  if (currentIndex > -1) {
    // 如果點擊已展開的分類，則收起
    activeCategoryIndexes.value = [];
    activeQuestionId.value = null;
  } else {
    // 展開分類：先關閉其他所有分類，只展開當前點擊的分類
    activeCategoryIndexes.value = [index];
    // 自動選擇第一個問題
    if (faqCategories[index]?.questions.length > 0) {
      activeQuestionId.value = faqCategories[index].questions[0].id;
    }
  }
};

//點擊問題標題展開/收起
const selectQuestion = (questionId: string) => {
  // 如果點擊的是已展開的問題，則收起
  if (activeQuestionId.value === questionId) {
    activeQuestionId.value = null;
  } else {
    activeQuestionId.value = questionId;
  }
};

const handleSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    // 有搜尋關鍵字時，預設所有結果都是收起的
    activeQuestionId.value = null;
  } else {
    // 沒有搜尋關鍵字時，恢復到只展開第一個分類
    activeCategoryIndexes.value = [0];
    if (faqCategories[0]?.questions.length > 0) {
      activeQuestionId.value = faqCategories[0].questions[0].id;
    }
  }
};
</script>
