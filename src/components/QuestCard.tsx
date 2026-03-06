import { Quest, useQuests } from "@/contexts/QuestContext";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const { completeQuest, lastCompleted } = useQuests();
  const justDone = lastCompleted === quest.id;

  return (
    <motion.div
      layout
      className={`stone-texture relative flex items-center gap-3 px-4 py-3 rounded-md border transition-colors duration-300 ${
        quest.completed
          ? "border-mana/30 bg-mana/5"
          : "border-border bg-card hover:border-primary/50"
      }`}
      animate={justDone ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => !quest.completed && completeQuest(quest.id)}
        disabled={quest.completed}
        className={`flex-shrink-0 w-7 h-7 rounded border-2 flex items-center justify-center transition-all duration-300 ${
          quest.completed
            ? "border-mana bg-mana/20"
            : "border-muted-foreground/40 hover:border-accent hover:shadow-[0_0_8px_hsl(var(--accent)/0.4)]"
        }`}
      >
        {quest.completed && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
            <Check className="w-4 h-4 text-mana" />
          </motion.div>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-body text-base leading-snug ${quest.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {quest.description}
        </p>
      </div>
      <span className={`font-heading text-xs tracking-wider flex-shrink-0 ${quest.completed ? "text-mana" : "text-ghost-blue"}`}>
        +{quest.xp} XP
      </span>
    </motion.div>
  );
}
