// 用於從 router meta 產生側邊欄與 avatar 下拉選單所需的選單資料
import type { RouteRecordRaw } from "vue-router";
import { routes } from "@/router";

type SidebarRole = "admin" | "user";

export interface SidebarMenuSubItem {
  label: string;
  value: string;
  route: string;
}

export interface SidebarMenuItem {
  title: string;
  icon: string;
  subItems: SidebarMenuSubItem[];
  defaultExpanded?: boolean;
}

export interface SidebarMetaItem {
  section: string;
  icon: string;
  label: string;
  roles: SidebarRole[];
  sectionOrder?: number;
  order?: number;
  defaultExpanded?: boolean;
}

type SidebarMeta = SidebarMetaItem | SidebarMetaItem[];

const getSidebarMetaItems = (route: RouteRecordRaw): SidebarMetaItem[] => {
  const meta = route.meta as { sidebar?: SidebarMeta } | undefined;
  if (!meta?.sidebar) return [];
  return Array.isArray(meta.sidebar) ? meta.sidebar : [meta.sidebar];
};

const buildSidebarMenuConfig = (role: SidebarRole): SidebarMenuItem[] => {
  const grouped = new Map<
    string,
    {
      title: string;
      icon: string;
      defaultExpanded?: boolean;
      sectionOrder: number;
      subItems: Array<SidebarMenuSubItem & { order: number }>;
    }
  >();

  routes.forEach((route) => {
    const metaItems = getSidebarMetaItems(route);
    metaItems
      .filter((item) => item.roles.includes(role))
      .forEach((item) => {
        const sectionKey = item.section;
        const sectionOrder = item.sectionOrder ?? 999;
        const existing = grouped.get(sectionKey);
        const section = existing || {
          title: item.section,
          icon: item.icon,
          defaultExpanded: item.defaultExpanded,
          sectionOrder,
          subItems: [],
        };

        section.subItems.push({
          label: item.label,
          value: item.label,
          route: route.path,
          order: item.order ?? 999,
        });

        if (item.defaultExpanded) {
          section.defaultExpanded = true;
        }

        grouped.set(sectionKey, section);
      });
  });

  return Array.from(grouped.values())
    .sort((a, b) => a.sectionOrder - b.sectionOrder)
    .map((section) => ({
      title: section.title,
      icon: section.icon,
      defaultExpanded: section.defaultExpanded,
      subItems: section.subItems.sort((a, b) => a.order - b.order).map(({ order: _order, ...item }) => item),
    }));
};

export const useSidebarMenuConfig = (isAdmin: boolean) => {
  return buildSidebarMenuConfig(isAdmin ? "admin" : "user");
};
