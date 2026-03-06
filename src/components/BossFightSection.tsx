import { Quest, useQuests } from "@/contexts/QuestContext";
import { motion } from "framer-motion";
import { Skull, Check } from "lucide-react";

export default function BossFightSection({ bosses }: { bosses: Quest[] }) {
  const { completeQuest, lastBossCompleted } = useQuests();
  const shaking = lastBossCompleted !== null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className={`stone-texture rounded-lg border-2 border-destructive/40 bg-card p-5 ${shaking ? "animate-shake" : ""}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Skull className="w-6 h-6 text-destructive" />
        <h2 className="font-heading text-xl tracking-wide text-destructive">Boss Fights</h2>
      </div>
      <div className="space-y-3">
        {bosses.map((boss) => (
          <div
            key={boss.id}
            className={`relative flex items-center gap-3 px-4 py-4 rounded-md border-2 transition-all duration-300 ${
              boss.completed
                ? "border-mana/30 bg-mana/5"
                : "border-destructive/30 bg-popover hover:border-destructive/60 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.15)]"
            }`}
          >
            <button
              onClick={() => !boss.completed && completeQuest(boss.id)}
              disabled={boss.completed}
              className={`flex-shrink-0 w-8 h-8 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                boss.completed
                  ? "border-mana bg-mana/20"
                  : "border-destructive/50 hover:border-destructive hover:shadow-[0_0_12px_hsl(var(--destructive)/0.5)]"
              }`}
            >
              {boss.completed && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
                  <Check className="w-5 h-5 text-mana" />
                </motion.div>
              )}
            </button>
            <div className="flex-1">
              <p className={`font-body text-lg ${boss.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {boss.description}
              </p>
            </div>
            <span className={`font-heading text-sm tracking-wider ${boss.completed ? "text-mana" : "text-ember"}`}>
              +{boss.xp} XP
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
