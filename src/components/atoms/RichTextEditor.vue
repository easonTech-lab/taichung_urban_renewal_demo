<template>
  <div class="inline-flex flex-col items-start gap-2" :class="[containerClass || 'w-full']">
    <!-- Label -->
    <label v-if="showLabel && label" class="relative inline-block text-base font-medium text-gray-900">
      {{ label }}
      <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
    </label>
    <div class="w-full rounded-lg border bg-gray-50" :class="editorContainerClasses">
      <!-- Toolbar -->
      <div class="border-b border-gray-300 p-2">
        <!-- First Row: Formatting Buttons -->
        <div class="flex flex-wrap items-center">
          <div class="flex flex-wrap items-center space-x-1 rtl:space-x-reverse">
            <!-- Bold -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive('bold') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().toggleBold().run()"
            >
              <Icon name="richtext/bold" :size="20" class="h-5 w-5" />
              <span class="sr-only">Bold</span>
            </button>
            <!-- Italic -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive('italic') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().toggleItalic().run()"
            >
              <Icon name="richtext/italic" :size="20" class="h-5 w-5" />
              <span class="sr-only">Italic</span>
            </button>
            <!-- Underline -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive('underline') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().toggleUnderline().run()"
            >
              <Icon name="richtext/underline" :size="20" class="h-5 w-5" />
              <span class="sr-only">Underline</span>
            </button>
            <!-- Strike -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive('strike') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().toggleStrike().run()"
            >
              <Icon name="richtext/strike" :size="20" class="h-5 w-5" />
              <span class="sr-only">Strike</span>
            </button>
            <!-- Highlight -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive('highlight') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().toggleHighlight().run()"
            >
              <Icon name="richtext/highlight" :size="20" class="h-5 w-5" />
              <span class="sr-only">Highlight</span>
            </button>
            <!-- Code -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive('code') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().toggleCode().run()"
            >
              <Icon name="richtext/code" :size="20" class="h-5 w-5" />
              <span class="sr-only">Code</span>
            </button>
            <!-- Link -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive('link') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="setLink"
            >
              <Icon name="richtext/link" :size="20" class="h-5 w-5" />
              <span class="sr-only">Link</span>
            </button>
            <!-- Remove Link -->
            <button
              v-if="editor?.isActive('link')"
              type="button"
              class="cursor-pointer rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              @click="editor?.chain().focus().unsetLink().run()"
            >
              <Icon name="richtext/linkRemove" :size="20" class="h-5 w-5" />
              <span class="sr-only">Remove link</span>
            </button>
            <!-- Text Size Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="cursor-pointer rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                @click="showTextSizeDropdown = !showTextSizeDropdown"
              >
                <Icon name="richtext/textSize" :size="20" class="h-5 w-5" />
                <span class="sr-only">Text size</span>
              </button>
              <div
                v-if="showTextSizeDropdown"
                v-click-outside="() => (showTextSizeDropdown = false)"
                class="absolute z-10 mt-1 w-72 rounded-lg border border-gray-300 bg-white shadow-lg"
              >
                <ul class="space-y-1 p-2 text-sm font-medium text-gray-500">
                  <li>
                    <button type="button" class="inline-flex w-full items-center rounded p-2 hover:bg-gray-100 hover:text-gray-900" @click="setFontSize('16px')">
                      16px (Default)
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full items-center rounded p-2 text-xs hover:bg-gray-100 hover:text-gray-900" @click="setFontSize('12px')">
                      12px (Tiny)
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full items-center rounded p-2 text-sm hover:bg-gray-100 hover:text-gray-900" @click="setFontSize('14px')">
                      14px (Small)
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full items-center rounded p-2 text-lg hover:bg-gray-100 hover:text-gray-900" @click="setFontSize('18px')">
                      18px (Lead)
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full items-center rounded p-2 text-2xl hover:bg-gray-100 hover:text-gray-900" @click="setFontSize('24px')">
                      24px (Large)
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full items-center rounded p-2 text-4xl hover:bg-gray-100 hover:text-gray-900" @click="setFontSize('36px')">
                      36px (Huge)
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <!-- Text Color Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="cursor-pointer rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                @click="showTextColorDropdown = !showTextColorDropdown"
              >
                <Icon name="richtext/textColor" :size="20" class="h-5 w-5" />
                <span class="sr-only">Text color</span>
              </button>
              <div v-if="showTextColorDropdown" v-click-outside="() => (showTextColorDropdown = false)" class="absolute z-10 mt-1 w-48 rounded-sm bg-white p-2 shadow-sm">
                <div class="mb-3 grid grid-cols-6 items-center gap-2 rounded p-1.5 hover:bg-gray-100">
                  <input
                    v-model="customColor"
                    type="color"
                    class="col-span-3 h-8 w-full rounded border border-gray-300 bg-gray-100 p-px px-1"
                    @change="setTextColor(customColor)"
                  />
                  <label class="col-span-3 text-xs font-medium text-gray-500 hover:text-gray-900">Pick a color</label>
                </div>
                <div class="mb-3 grid grid-cols-6 gap-1">
                  <button v-for="color in colorOptions" :key="color" type="button" :style="{ backgroundColor: color }" class="h-6 w-6 rounded-md" @click="setTextColor(color)">
                    <span class="sr-only">{{ color }}</span>
                  </button>
                </div>
                <button
                  type="button"
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium leading-5 text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  @click="resetTextColor"
                >
                  Reset color
                </button>
              </div>
            </div>
            <!-- Font Family Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="cursor-pointer rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                @click="showFontFamilyDropdown = !showFontFamilyDropdown"
              >
                <Icon name="richtext/fontFamily" :size="20" class="h-5 w-5" />
                <span class="sr-only">Font family</span>
              </button>
              <div
                v-if="showFontFamilyDropdown"
                v-click-outside="() => (showFontFamilyDropdown = false)"
                class="absolute z-10 mt-1 w-48 rounded-lg border border-gray-300 bg-white shadow-lg"
              >
                <ul class="space-y-1 p-2 text-sm font-medium text-gray-500">
                  <li v-for="font in fontOptions" :key="font.value">
                    <button
                      type="button"
                      :style="{ fontFamily: font.value }"
                      class="inline-flex w-full items-center rounded p-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                      @click="setFontFamily(font.value)"
                    >
                      {{ font.label }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <!-- Separator -->
            <div class="px-1">
              <span class="block h-4 w-px bg-gray-100"></span>
            </div>
            <!-- Align Left -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().setTextAlign('left').run()"
            >
              <Icon name="richtext/alignLeft" :size="20" class="h-5 w-5" />
              <span class="sr-only">Align left</span>
            </button>
            <!-- Align Center -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().setTextAlign('center').run()"
            >
              <Icon name="richtext/alignCenter" :size="20" class="h-5 w-5" />
              <span class="sr-only">Align center</span>
            </button>
            <!-- Align Right -->
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-sm p-1.5 transition-colors',
                editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ]"
              @click="editor?.chain().focus().setTextAlign('right').run()"
            >
              <Icon name="richtext/alignRight" :size="20" class="h-5 w-5" />
              <span class="sr-only">Align right</span>
            </button>
          </div>
        </div>
        <!-- Second Row: Media, Lists -->
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <!-- Add Image -->
          <label class="cursor-pointer rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
            <input ref="imageInputRef" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
            <Icon name="richtext/image" :size="20" class="h-5 w-5" />
            <span class="sr-only">Add image</span>
          </label>
          <!-- Bullet List -->
          <button
            type="button"
            :class="[
              'cursor-pointer rounded-sm p-1.5 transition-colors',
              editor?.isActive('bulletList') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
            ]"
            @click="editor?.chain().focus().toggleBulletList().run()"
          >
            <Icon name="richtext/bulletList" :size="20" class="h-5 w-5" />
            <span class="sr-only">Toggle list</span>
          </button>

          <!-- Ordered List -->
          <button
            type="button"
            :class="[
              'cursor-pointer rounded-sm p-1.5 transition-colors',
              editor?.isActive('orderedList') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
            ]"
            @click="editor?.chain().focus().toggleOrderedList().run()"
          >
            <Icon name="richtext/orderedList" :size="20" class="h-5 w-5" />
            <span class="sr-only">Toggle ordered list</span>
          </button>

          <!-- Blockquote -->
          <button
            type="button"
            :class="[
              'cursor-pointer rounded-sm p-1.5 transition-colors',
              editor?.isActive('blockquote') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
            ]"
            @click="editor?.chain().focus().toggleBlockquote().run()"
          >
            <Icon name="richtext/blockquote" :size="20" class="h-5 w-5" />
            <span class="sr-only">Toggle blockquote</span>
          </button>

          <!-- Horizontal Rule -->
          <button
            type="button"
            class="cursor-pointer rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            @click="editor?.chain().focus().setHorizontalRule().run()"
          >
            <Icon name="richtext/horizontalRule" :size="20" class="h-5 w-5" />
            <span class="sr-only">Toggle Horizontal Rule</span>
          </button>
        </div>
      </div>
      <!-- Editor Content -->
      <div class="rounded-b-lg bg-white px-4 py-2">
        <EditorContent :editor="editor" class="prose prose-sm max-w-none" />
      </div>
      <!-- Character Count -->
      <div v-if="maxlength" class="flex justify-end px-4 pb-2">
        <span class="text-xs text-gray-500" :class="{ 'text-red-500': characterCount > maxlength }"> {{ characterCount }}/{{ maxlength }} </span>
      </div>
    </div>
    <p v-if="errorMessage" class="w-full text-base leading-6 text-red-600">{{ errorMessage }}</p>
  </div>
</template>
<script setup lang="ts">
import { Extension } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { ref, onBeforeUnmount, watch, computed } from "vue";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";
import Icon from "@/components/atoms/Icon.vue";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
// Click outside directive
interface HTMLElementWithClickOutside extends HTMLElement {
  clickOutsideEvent?: (event: MouseEvent) => void;
}
// Custom FontSize extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace("px", ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: { chain: () => any }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => any }) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    } as any;
  },
});
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    label?: string;
    showLabel?: boolean;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;
    labelPosition?: "horizontal" | "vertical";
    containerClass?: string;
    maxlength?: number; // 最大字數限制
    enforceMaxlength?: boolean; // 是否強制阻擋超過 maxlength
  }>(),
  {
    modelValue: "",
    placeholder: "開始輸入內容...",
    showLabel: false,
    required: false,
    error: false,
    errorMessage: "",
    labelPosition: "vertical",
    containerClass: "",
    enforceMaxlength: true,
  }
);
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
// Dropdown states
const showTextSizeDropdown = ref(false);
const showTextColorDropdown = ref(false);
const showFontFamilyDropdown = ref(false);
const customColor = ref("#e66465");
// Color options
const colorOptions = [
  "#1A56DB",
  "#0E9F6E",
  "#FACA15",
  "#F05252",
  "#FF8A4C",
  "#0694A2",
  "#B4C6FC",
  "#8DA2FB",
  "#5145CD",
  "#771D1D",
  "#FCD9BD",
  "#99154B",
  "#7E3AF2",
  "#CABFFD",
  "#D61F69",
  "#F8B4D9",
  "#F6C196",
  "#A4CAFE",
  "#5145CD",
  "#B43403",
  "#FCE96A",
  "#1E429F",
  "#768FFD",
  "#BCF0DA",
  "#EBF5FF",
  "#16BDCA",
  "#E74694",
  "#83B0ED",
  "#03543F",
  "#111928",
  "#4B5563",
  "#6B7280",
  "#D1D5DB",
  "#F3F4F6",
  "#F9FAFB",
];
// Font options
const fontOptions = [
  { label: "Default", value: "Inter, ui-sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Lucida Sans Unicode", value: "'Lucida Sans Unicode', sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];
const vClickOutside = {
  mounted(el: HTMLElementWithClickOutside, binding: { value: () => void }) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: HTMLElementWithClickOutside) {
    if (el.clickOutsideEvent) {
      document.removeEventListener("click", el.clickOutsideEvent);
    }
  },
};
// Initialize editor
const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    Link.configure({
      openOnClick: false,
    }),
    Image,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Color,
    FontSize,
    Highlight.configure({
      multicolor: true,
    }),
    FontFamily,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    // 計算純文字字數
    const textLength = getPlainTextLength(html);

    // 如果有字數限制且超過限制，不更新值
    if (props.enforceMaxlength && props.maxlength && textLength > props.maxlength) {
      // 恢復到之前的值
      const previousHTML = props.modelValue || "";
      editor.commands.setContent(previousHTML);
      return;
    }

    emit("update:modelValue", html);
  },
});
// Watch for external changes
watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value?.getHTML() === value;
    if (!isSame) {
      editor.value?.commands.setContent(value || "");
    }
  }
);
// 計算純文字字數的函數
const getPlainTextLength = (html: string): number => {
  if (!html) return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.length || 0;
};
// 計算當前字數
const characterCount = computed(() => {
  if (!editor.value) return 0;
  return getPlainTextLength(editor.value.getHTML());
});
const editorContainerClasses = computed(() => {
  if (props.error || props.errorMessage) {
    return "border-red-500";
  }
  return "border-gray-300";
});
// Methods
const setLink = () => {
  const previousUrl = editor.value?.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  if (url === null) {
    return;
  }

  if (url === "") {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.value?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
};
const setFontSize = (size: string) => {
  (editor.value?.chain().focus() as any).setFontSize(size).run();
  showTextSizeDropdown.value = false;
};
const setTextColor = (color: string) => {
  editor.value?.chain().focus().setColor(color).run();
  showTextColorDropdown.value = false;
};
const resetTextColor = () => {
  editor.value?.chain().focus().unsetColor().run();
  showTextColorDropdown.value = false;
};
const setFontFamily = (font: string) => {
  editor.value?.chain().focus().setFontFamily(font).run();
  showFontFamilyDropdown.value = false;
};
const imageInputRef = ref<HTMLInputElement | null>(null);
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    // Create a FileReader to convert file to base64 or data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        editor.value?.chain().focus().setImage({ src: dataUrl }).run();
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    if (imageInputRef.value) {
      imageInputRef.value.value = "";
    }
  }
};
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
<style>
.ProseMirror {
  outline: none;
  min-height: 200px;
}
.ProseMirror p.is-editor-empty:first-child::before {
  color: #9ca3af;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
