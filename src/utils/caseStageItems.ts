type CaseStageItem = {
  id: number;
  label: string;
  deletable: boolean;
};

const BASE_STAGE_ITEMS: CaseStageItem[] = [
  { id: 1, label: "案件申請", deletable: false },
  { id: 2, label: "公辦公聽會", deletable: false },
  { id: 3, label: "都更幹事會", deletable: false },
  { id: 4, label: "專案小組", deletable: false },
  { id: 5, label: "都更大會", deletable: false },
  { id: 6, label: "最終核定", deletable: false },
];

const CASE_STAGE_ITEMS_STORAGE_KEY = "caseStageItems";

const getCaseStageItemsStorageKey = (caseType?: string) => {
  const suffix = caseType?.trim();
  return suffix ? `${CASE_STAGE_ITEMS_STORAGE_KEY}:${suffix}` : CASE_STAGE_ITEMS_STORAGE_KEY;
};

const isCaseStageItemArray = (value: unknown): value is CaseStageItem[] => {
  return Array.isArray(value) && value.every((item) => typeof item?.id === "number" && typeof item?.label === "string" && typeof item?.deletable === "boolean");
};

const cloneBaseStageItems = () => BASE_STAGE_ITEMS.map((item) => ({ ...item }));

const loadStoredCaseStageItems = (caseType?: string) => {
  try {
    const raw = localStorage.getItem(getCaseStageItemsStorageKey(caseType));
    if (!raw) return cloneBaseStageItems();
    const parsed = JSON.parse(raw);
    return isCaseStageItemArray(parsed) ? parsed : cloneBaseStageItems();
  } catch {
    return cloneBaseStageItems();
  }
};

const saveStoredCaseStageItems = (items: CaseStageItem[], caseType?: string) => {
  localStorage.setItem(getCaseStageItemsStorageKey(caseType), JSON.stringify(items));
};

const buildNextStageLabel = (baseLabel: string, items: CaseStageItem[]) => {
  const escaped = baseLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escaped}(\\d+)?$`);
  const maxSuffix = items.reduce((max, item) => {
    const match = item.label.match(pattern);
    if (!match) return max;
    if (!match[1]) return Math.max(max, 1);
    return Math.max(max, Number(match[1]));
  }, 0);

  return maxSuffix <= 1 ? `${baseLabel}2` : `${baseLabel}${maxSuffix + 1}`;
};

const appendStoredCaseStageItem = (baseLabel: string, caseType?: string) => {
  const items = loadStoredCaseStageItems(caseType);
  const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const label = buildNextStageLabel(baseLabel, items);
  const nextItems = [...items, { id: nextId, label, deletable: true }];

  saveStoredCaseStageItems(nextItems, caseType);
  return nextItems;
};

export type { CaseStageItem };
export { BASE_STAGE_ITEMS, loadStoredCaseStageItems, saveStoredCaseStageItems, appendStoredCaseStageItem };
