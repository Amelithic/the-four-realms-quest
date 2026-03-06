import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface Quest {
  id: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface QuestData {
  realms: {
    os: Quest[];
    threejs: Quest[];
    dsa: Quest[];
    space: Quest[];
  };
  bossFights: Quest[];
}

const LEVEL_THRESHOLDS = [0, 20, 50, 90, 140, 200, 270, 350, 440, 540];

interface QuestContextType {
  data: QuestData | null;
  totalXp: number;
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  completeQuest: (id: string) => void;
  addQuest: (realm: keyof QuestData["realms"] | "boss", description: string, xp: number) => void;
  justLevelledUp: boolean;
  clearLevelUp: () => void;
  lastCompleted: string | null;
  lastBossCompleted: string | null;
}

const QuestContext = createContext<QuestContextType | null>(null);

export function useQuests() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuests must be inside QuestProvider");
  return ctx;
}

function getLevel(xp: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

const STORAGE_KEY = "four-realms-quest-progress";
const CUSTOM_QUESTS_KEY = "four-realms-custom-quests";

function saveProgress(data: QuestData) {
  const completed = [
    ...Object.values(data.realms).flat(),
    ...data.bossFights,
  ]
    .filter((q) => q.completed)
    .map((q) => q.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
}

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {}
  return new Set();
}

interface CustomQuest {
  realm: keyof QuestData["realms"] | "boss";
  quest: Quest;
}

function saveCustomQuests(quests: CustomQuest[]) {
  localStorage.setItem(CUSTOM_QUESTS_KEY, JSON.stringify(quests));
}

function loadCustomQuests(): CustomQuest[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTS_KEY);
    if (raw) return JSON.parse(raw) as CustomQuest[];
  } catch {}
  return [];
}

function applyCustomQuests(data: QuestData, custom: CustomQuest[]): QuestData {
  const result = { ...data, realms: { ...data.realms }, bossFights: [...data.bossFights] };
  for (const c of custom) {
    if (c.realm === "boss") {
      result.bossFights = [...result.bossFights, c.quest];
    } else {
      result.realms = { ...result.realms, [c.realm]: [...result.realms[c.realm], c.quest] };
    }
  }
  return result;
}

function getNextId(data: QuestData): number {
  const allIds = [
    ...Object.values(data.realms).flat(),
    ...data.bossFights,
  ].map((q) => {
    const num = parseInt(q.id.replace(/\D/g, ""), 10);
    return isNaN(num) ? 0 : num;
  });
  return Math.max(0, ...allIds) + 1;
}

function applyProgress(data: QuestData, completed: Set<string>): QuestData {
  const mark = (quests: Quest[]) =>
    quests.map((q) => (completed.has(q.id) ? { ...q, completed: true } : q));
  return {
    realms: {
      os: mark(data.realms.os),
      threejs: mark(data.realms.threejs),
      dsa: mark(data.realms.dsa),
      space: mark(data.realms.space),
    },
    bossFights: mark(data.bossFights),
  };
}

export function QuestProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<QuestData | null>(null);
  const [justLevelledUp, setJustLevelledUp] = useState(false);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [lastBossCompleted, setLastBossCompleted] = useState<string | null>(null);

  useEffect(() => {
    fetch("/quests.json")
      .then((r) => r.json())
      .then((d: QuestData) => {
        const saved = loadProgress();
        setData(saved.size > 0 ? applyProgress(d, saved) : d);
      });
  }, []);

  const allQuests = data
    ? [...Object.values(data.realms).flat(), ...data.bossFights]
    : [];
  const totalXp = allQuests.filter((q) => q.completed).reduce((s, q) => s + q.xp, 0);
  const level = getLevel(totalXp);
  const xpForCurrentLevel = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const xpForNextLevel = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 100;

  const completeQuest = useCallback(
    (id: string) => {
      if (!data) return;
      const prevXp = allQuests.filter((q) => q.completed).reduce((s, q) => s + q.xp, 0);
      const isBoss = data.bossFights.some((q) => q.id === id);

      const update = (quests: Quest[]) =>
        quests.map((q) => (q.id === id ? { ...q, completed: true } : q));

      const newData: QuestData = {
        realms: {
          os: update(data.realms.os),
          threejs: update(data.realms.threejs),
          dsa: update(data.realms.dsa),
          space: update(data.realms.space),
        },
        bossFights: update(data.bossFights),
      };
      setData(newData);
      saveProgress(newData);

      const newAllQuests = [...Object.values(newData.realms).flat(), ...newData.bossFights];
      const newXp = newAllQuests.filter((q) => q.completed).reduce((s, q) => s + q.xp, 0);
      if (getLevel(newXp) > getLevel(prevXp)) {
        setJustLevelledUp(true);
      }

      if (isBoss) {
        setLastBossCompleted(id);
        setTimeout(() => setLastBossCompleted(null), 600);
      } else {
        setLastCompleted(id);
        setTimeout(() => setLastCompleted(null), 600);
      }
    },
    [data, allQuests]
  );

  const clearLevelUp = useCallback(() => setJustLevelledUp(false), []);

  return (
    <QuestContext.Provider
      value={{
        data,
        totalXp,
        level,
        xpForCurrentLevel,
        xpForNextLevel,
        completeQuest,
        justLevelledUp,
        clearLevelUp,
        lastCompleted,
        lastBossCompleted,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}
