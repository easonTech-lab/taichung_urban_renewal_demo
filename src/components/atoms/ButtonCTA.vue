<template>
  <!-- Text Button Variant (with underline) -->
  <router-link
    v-if="variant === 'text' && linkTarget && !disabled"
    :to="linkTarget"
    class="inline-flex items-center gap-2 rounded-lg text-sm font-medium leading-normal text-primary-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
    :class="textButtonClasses"
    v-bind="$attrs"
  >
    <slot />
    <Icon v-if="rightIcon" :name="rightIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <Icon v-else-if="leftIcon" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
  </router-link>
  <button
    v-else-if="variant === 'text' && (!href || disabled)"
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center gap-1 rounded-lg text-sm font-medium leading-normal text-primary-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-500"
    :class="textButtonClasses"
    v-bind="$attrs"
  >
    <slot />
    <Icon v-if="rightIcon" :name="rightIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <Icon v-else-if="leftIcon" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
  </button>
  <!-- Text Plain Button Variant (no underline) -->
  <router-link
    v-else-if="variant === 'textPlain' && linkTarget && !disabled"
    :to="linkTarget"
    class="inline-flex items-center gap-1 rounded-lg text-sm font-medium leading-normal text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
    :class="textButtonClasses"
    v-bind="$attrs"
  >
    <slot />
    <Icon v-if="rightIcon" :name="rightIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <Icon v-else-if="leftIcon" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
  </router-link>
  <button
    v-else-if="variant === 'textPlain' && (!href || disabled)"
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center gap-1 rounded-lg text-sm font-medium leading-normal text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-500"
    :class="textButtonClasses"
    v-bind="$attrs"
  >
    <slot />
    <Icon v-if="rightIcon" :name="rightIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <Icon v-else-if="leftIcon" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
  </button>
  <!-- Regular Button Variant -->
  <router-link
    v-else-if="linkTarget && !disabled"
    :to="linkTarget"
    class="flex items-center justify-center gap-1 rounded-lg font-medium leading-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    :class="[buttonClasses, sizeClasses, justifyClasses]"
    v-bind="$attrs"
  >
    <Icon v-if="leftIcon && !iconOnly" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <Icon v-if="iconOnly && leftIcon" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <span v-if="!iconOnly">
      <slot />
    </span>
    <Icon v-if="rightIcon && !iconOnly" :name="rightIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
  </router-link>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="flex items-center justify-center gap-1 rounded-lg font-medium leading-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
    :class="[buttonClasses, sizeClasses, justifyClasses]"
    v-bind="$attrs"
  >
    <Icon v-if="leftIcon && !iconOnly" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <Icon v-if="iconOnly && leftIcon" :name="leftIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
    <span v-if="!iconOnly">
      <slot />
    </span>
    <Icon v-if="rightIcon && !iconOnly" :name="rightIcon" :size="iconSize" class="shrink-0" aria-hidden="true" />
  </button>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";

type ColorVariant = "primary" | "dark" | "green" | "red" | "gray" | "white" | "alternative" | "alternativeDark" | "red-outline";
type SizeVariant = "mini" | "xs" | "sm" | "base" | "l" | "xl";

const props = withDefaults(
  defineProps<{
    href?: string;
    to?: RouteLocationRaw;
    variant?: ColorVariant | "text" | "textPlain" | "ghost" | "outline" | "none";
  size?: SizeVariant;
    outline?: boolean;
    iconOnly?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    align?: "left" | "center" | "right";
  }>(),
  {
    variant: "primary",
    size: "base",
    outline: false,
    iconOnly: false,
    type: "button",
    disabled: false,
    align: "center",
  }
);

// Size configurations (design system)
const sizeConfig = {
  mini: {
    height: "h-[52px]",
    minWidth: "min-w-0",
    paddingX: "px-5",
    paddingY: "py-2.5",
    text: "text-sm",
    icon: 20,
    iconOnlySize: "w-[52px] h-[52px]",
  },
  xs: {
    height: "h-8",
    minWidth: "min-w-[136px]",
    paddingX: "px-3",
    paddingY: "py-2",
    text: "text-xs",
    icon: 20,
    iconOnlySize: "w-8 h-8",
  },
  sm: {
    height: "h-9",
    minWidth: "min-w-[147px]",
    paddingX: "px-3",
    paddingY: "py-2",
    text: "text-sm",
    icon: 20,
    iconOnlySize: "w-10 h-10",
  },
  base: {
    height: "h-10",
    minWidth: "min-w-[171px]",
    paddingX: "px-5",
    paddingY: "py-2.5",
    text: "text-sm",
    icon: 20,
    iconOnlySize: "w-[44px] h-[44px]",
  },
  l: {
    height: "h-12",
    minWidth: "min-w-[190px]",
    paddingX: "px-5",
    paddingY: "py-3",
    text: "text-base",
    icon: 20,
    iconOnlySize: "w-12 h-12",
  },
  xl: {
    height: "h-[54px]",
    minWidth: "min-w-[198px]",
    paddingX: "px-6",
    paddingY: "py-3.5",
    text: "text-base",
    icon: 20,
    iconOnlySize: "w-[52px] h-[52px]",
  },
};

const iconSize = computed(() => {
  return sizeConfig[props.size].icon;
});

const linkTarget = computed<RouteLocationRaw | null>(() => {
  if (props.to) return props.to;
  if (props.href) return props.href;
  return null;
});


const sizeClasses = computed(() => {
  const config = sizeConfig[props.size];
  if (props.iconOnly) {
    return `${config.iconOnlySize} ${config.text}`;
  }
  return `${config.height} ${config.minWidth} ${config.paddingX} ${config.paddingY} ${config.text}`;
});

const textButtonClasses = computed(() => {
  if (props.disabled) {
    return "opacity-50 cursor-not-allowed";
  }
  return "hover:text-primary-800";
});

const buttonClasses = computed(() => {
  if (props.variant === "none") {
    return getNoneClasses();
  }
  if (props.disabled) {
    return getDisabledClasses();
  }
  if (props.variant === "outline" || props.variant === "red-outline" || props.outline) {
    return getOutlineClasses();
  }
  return getSolidClasses();
});

const justifyClasses = computed(() => {
  if (props.align === "left") return "justify-start";
  if (props.align === "right") return "justify-end";
  return "justify-center"; // center is default
});

const getSolidClasses = () => {
  const base = "focus-visible:ring-primary-600";
  const variants: Record<string, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600",
    dark: "bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-600",
    green: "bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-600",
    red: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-600",
    gray: "bg-gray-500 text-white hover:bg-gray-600 focus-visible:ring-gray-600",
    white: "bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-600 border border-gray-300",
    alternative: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-600",
    alternativeDark: "bg-indigo-900 text-white hover:bg-indigo-800 focus-visible:ring-indigo-600",
  };
  return variants[props.variant] || variants.primary;
};

const getOutlineClasses = () => {
  const base = "border bg-transparent focus-visible:ring-primary-600";
  const variants: Record<string, string> = {
    primary: "border-primary-700 text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-600",
    outline: "border-primary-700 text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-600",
    dark: "border-gray-900 text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-600",
    green: "border-green-500 text-green-500 hover:bg-green-50 focus-visible:ring-green-600",
    red: "border-red-600 text-red-600 bg-white hover:bg-red-50 focus-visible:ring-red-600",
    "red-outline": "border-red-600 text-red-600 bg-white hover:bg-red-50 focus-visible:ring-red-600",
    gray: "border-gray-500 text-gray-500 hover:bg-gray-50 focus-visible:ring-gray-600",
    white: "border-white text-white hover:bg-white/10 focus-visible:ring-white",
    alternative: "border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-600",
    alternativeDark: "border-indigo-900 text-indigo-900 hover:bg-indigo-50 focus-visible:ring-indigo-600",
  };
  return `${base} ${variants[props.variant] || variants.primary}`;
};

const getNoneClasses = () => {
  if (props.disabled) {
    return "bg-transparent text-gray-500";
  }
  return "bg-transparent text-black hover:text-gray-700 focus-visible:ring-gray-600";
};

const getDisabledClasses = () => {
  if (props.variant === "none") {
    return "bg-transparent text-gray-500";
  }
  if (props.outline) {
    return "border-gray-500 text-white bg-gray-500";
  }
  return "bg-gray-500 text-white";
};
</script>
