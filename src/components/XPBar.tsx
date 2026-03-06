import { useQuests } from "@/contexts/QuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function XPBar() {
  const { totalXp, level, xpForCurrentLevel, xpForNextLevel, justLevelledUp, clearLevelUp } = useQuests();
  const progress = Math.min(((totalXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100, 100);

  useEffect(() => {
    if (justLevelledUp) {
      const t = setTimeout(clearLevelUp, 3000);
      return () => clearTimeout(t);
    }
  }, [justLevelledUp, clearLevelUp]);

  return (
    <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg tracking-wider text-accent animate-rune-pulse">
              ⦿ Level {level}
            </span>
            <AnimatePresence>
              {justLevelledUp && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -10 }}
                  className="font-heading text-sm text-ember"
                >
                  ✦ LEVEL UP! ✦
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="font-body text-sm text-muted-foreground">
            {totalXp} XP · Next: {xpForNextLevel} XP
          </span>
        </div>
        <div className="h-3 rounded-full bg-input overflow-hidden border border-border">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(var(--xp-start)), hsl(var(--xp-mid)), hsl(var(--xp-end)))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
