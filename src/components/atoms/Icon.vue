<!--
Icon 組件 - 動態載入 SVG 圖標

使用方法：
  <Icon name="download" :size="24" color="#3F83F8" />

新增圖標步驟：
  1. 將 SVG 文件放到 src/assets/svg/ 目錄
  2. 使用 <Icon name="文件名（不含.svg）" /> 即可

注意：
  - name prop 必須與 SVG 文件名（不含 .svg 後綴）完全匹配
  - 例如：文件名為 download.svg，則使用 name="download"
-->
<template>
  <!-- 動態載入的 SVG 圖標 -->
  <div
    :class="['inline-block', $attrs.class]"
    :style="{
      width: size,
      height: size,
      display: 'inline-block',
      color: color === 'currentColor' ? 'inherit' : color,
    }"
    v-html="svgContent"
    v-if="svgContent"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    name: string; // 圖標名稱（對應 src/assets/svg/ 目錄下的文件名，不含 .svg 後綴）
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
    strokeLinecap?: "round" | "butt" | "square";
    strokeLinejoin?: "round" | "miter" | "bevel";
    fill?: string;
  }>(),
  {
    color: "currentColor",
    size: 24,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  }
);

const svgContent = ref<string>("");

// 使用 import.meta.glob 預先載入所有 SVG 文件（包括子目錄）
const svgModules = import.meta.glob("../../assets/svg/**/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// 創建 SVG 文件名到內容的映射
const svgMap = new Map<string, string>();
if (svgModules && typeof svgModules === "object") {
  Object.keys(svgModules).forEach((path) => {
    const fileName = path.split("/").pop()?.replace(".svg", "") || "";
    // 提取子目錄路徑（例如：richtext/bold）
    const pathParts = path.split("/");
    const svgIndex = pathParts.findIndex((part) => part === "svg");
    if (svgIndex !== -1 && svgIndex < pathParts.length - 1) {
      const subPath = pathParts.slice(svgIndex + 1, -1).join("/");
      const fullPath = subPath ? `${subPath}/${fileName}` : fileName;

      if (fileName && svgModules[path]) {
        // 支持完整路徑（例如：richtext/bold）
        svgMap.set(fullPath, svgModules[path]);
        svgMap.set(fullPath.toLowerCase(), svgModules[path]);
        // 支持多種命名格式
        svgMap.set(fileName.toLowerCase(), svgModules[path]);
        svgMap.set(fileName, svgModules[path]);
        // 支持 camelCase 轉 kebab-case
        const kebabCase = fileName.replace(/([A-Z])/g, "-$1").toLowerCase();
        if (kebabCase !== fileName.toLowerCase()) {
          svgMap.set(kebabCase, svgModules[path]);
        }
      }
    } else if (fileName && svgModules[path]) {
      // 根目錄的 SVG 文件
      svgMap.set(fileName.toLowerCase(), svgModules[path]);
      svgMap.set(fileName, svgModules[path]);
      const kebabCase = fileName.replace(/([A-Z])/g, "-$1").toLowerCase();
      if (kebabCase !== fileName.toLowerCase()) {
        svgMap.set(kebabCase, svgModules[path]);
      }
    }
  });
}

// 載入 SVG 文件的輔助函數
const loadSvgModule = (name: string): string | null => {
  // 生成可能的文件名變體
  const variants = [name, name.toLowerCase(), name.replace(/([A-Z])/g, "-$1").toLowerCase()];
  const uniqueVariants = Array.from(new Set(variants));

  // 嘗試每種文件名格式
  for (const variant of uniqueVariants) {
    const svg = svgMap.get(variant);
    if (svg) {
      return svg;
    }
  }

  return null;
};

// 載入 SVG 文件
const loadSvg = () => {
  if (!props.name) {
    svgContent.value = "";
    return;
  }

  // 從預載入的映射中獲取 SVG
  const rawSvg = loadSvgModule(props.name);

  if (!rawSvg) {
    console.error(`Failed to load icon: ${props.name}.svg`, `Make sure the file exists in src/assets/svg/${props.name}.svg`);
    svgContent.value = "";
    return;
  }

  try {
    // 解析 SVG 內容
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawSvg, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (!svgElement) {
      console.error(`Invalid SVG file: ${props.name}.svg`);
      svgContent.value = "";
      return;
    }

    // 獲取原始 viewBox（如果有的話）
    const originalViewBox = svgElement.getAttribute("viewBox") || `0 0 ${props.size} ${props.size}`;

    // 移除 SVG 元素上的 class 和 style 屬性（這些應該由 Icon 組件控制）
    svgElement.removeAttribute("class");
    svgElement.removeAttribute("style");
    svgElement.removeAttribute("width");
    svgElement.removeAttribute("height");

    // 獲取內部 HTML 內容
    let processedHTML = svgElement.innerHTML;

    // 判斷是否有原始顏色（固定顏色值，如 #9CA3AF, #3F83F8, white）
    // 複雜圖標通常有固定的設計顏色
    const hasOriginalColors =
      processedHTML.includes('fill="white"') ||
      processedHTML.includes('stroke="#') ||
      processedHTML.includes("stroke='#") ||
      /stroke="[#][0-9A-Fa-f]{3,6}"/.test(processedHTML) ||
      /fill="[#][0-9A-Fa-f]{3,6}"/.test(processedHTML);

    // 對於沒有 fill 屬性的元素，如果 fill prop 是 "none"，確保設置 fill="none"
    // SVG 預設 fill 是 "black"，所以沒有 fill 屬性的元素會顯示為黑色
    if (props.fill === "none") {
      // 匹配所有沒有 fill 屬性的 SVG 元素（path, rect, circle 等）
      // 只處理沒有 fill 屬性的元素，避免覆蓋已有的 fill 值
      processedHTML = processedHTML.replace(/<(path|rect|circle|ellipse|polygon|polyline|line|g)(\s+)(?!.*\bfill=)([^>]*?)(\/?>)/g, (_match, tag, space1, attrs, closing) => {
        // 添加 fill="none"，注意空格處理
        const cleanAttrs = attrs.trim();
        return `<${tag}${space1}fill="none"${cleanAttrs ? " " + cleanAttrs : ""}${closing}`;
      });
    }

    // 調試信息（暫時保留，用於排查問題）

    // 處理 stroke 和 fill 顏色
    // 對於有原始顏色的圖標，完全保留原始顏色，不做任何替換
    // 除非用戶明確指定了 color 或 fill prop
    if (hasOriginalColors) {
      // 有原始顏色的圖標（如 pubhearing），保留原始顏色
      // 只有當用戶明確指定了 color 或 fill 時才覆蓋
      if (props.color && props.color !== "currentColor") {
        // 用戶指定了顏色，替換所有 stroke
        processedHTML = processedHTML.replace(/stroke="[^"]*"/g, `stroke="${props.color}"`);
        processedHTML = processedHTML.replace(/stroke='[^']*'/g, `stroke='${props.color}'`);
      }
      if (props.fill && props.fill !== "none") {
        // 用戶指定了 fill，替換所有非 none 的 fill
        processedHTML = processedHTML.replace(/fill="(?!none)[^"]*"/g, `fill="${props.fill}"`);
        processedHTML = processedHTML.replace(/fill='(?!none)[^']*'/g, `fill='${props.fill}'`);
      }
      // 否則完全保留原始 stroke 和 fill 值，不做任何替換
    } else {
      // 簡單圖標（沒有原始顏色），使用 props 的值
      if (props.color && props.color !== "currentColor") {
        processedHTML = processedHTML.replace(/stroke="[^"]*"/g, `stroke="${props.color}"`);
        processedHTML = processedHTML.replace(/stroke='[^']*'/g, `stroke='${props.color}'`);
      } else {
        processedHTML = processedHTML.replace(/stroke="[^"]*"/g, `stroke="currentColor"`);
        processedHTML = processedHTML.replace(/stroke='[^']*'/g, `stroke='currentColor'`);
      }

      if (props.fill && props.fill !== "none") {
        processedHTML = processedHTML.replace(/fill="(?!none)[^"]*"/g, `fill="${props.fill}"`);
        processedHTML = processedHTML.replace(/fill='(?!none)[^']*'/g, `fill='${props.fill}'`);
      } else if (props.fill === "none") {
        processedHTML = processedHTML.replace(/fill="[^"]*"/g, 'fill="none"');
        processedHTML = processedHTML.replace(/fill='[^']*'/g, "fill='none'");
      }
    }

    // 替換 stroke-width（如果有固定值）
    processedHTML = processedHTML.replace(/stroke-width="[^"]*"/g, `stroke-width="${props.strokeWidth}"`);

    // 構建最終的 SVG
    // 對於有原始顏色的圖標，不要設置外層的 color style，避免影響內部元素
    const svgStyle = hasOriginalColors ? "" : `style="color: ${props.color}"`;

    // 移除 SVG 元素上的 class 和 style 屬性（這些應該由 Icon 組件控制）
    // 構建最終的 SVG，樣式由外層 div 控制
    svgContent.value = `<svg width="${props.size}" height="${props.size}" viewBox="${originalViewBox}" ${svgStyle} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${processedHTML}</svg>`;
  } catch (error) {
    console.error(`Failed to load icon: ${props.name}`, error);
    svgContent.value = "";
  }
};

// 監聽 props 變化，重新載入圖標
watch(
  () => props.name,
  () => {
    loadSvg();
  },
  { immediate: false }
);

watch(
  () => [props.size, props.color, props.fill],
  () => {
    if (svgContent.value) {
      loadSvg(); // 重新載入以應用新的樣式
    }
  }
);

onMounted(() => {
  loadSvg();
});
</script>
