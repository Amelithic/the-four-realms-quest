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

export function QuestProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<QuestData | null>(null);
  const [justLevelledUp, setJustLevelledUp] = useState(false);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [lastBossCompleted, setLastBossCompleted] = useState<string | null>(null);

  useEffect(() => {
    fetch("/quests.json")
      .then((r) => r.json())
      .then((d: QuestData) => setData(d));
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
