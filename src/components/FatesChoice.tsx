import { useState } from "react";
import { useQuests, Quest } from "@/contexts/QuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

export default function FatesChoice() {
  const { data, completeQuest } = useQuests();
  const [chosen, setChosen] = useState<Quest | null>(null);
  const [open, setOpen] = useState(false);

  const pickRandom = () => {
    if (!data) return;
    const all = [...Object.values(data.realms).flat(), ...data.bossFights];
    const incomplete = all.filter((q) => !q.completed);
    if (incomplete.length === 0) return;
    const pick = incomplete[Math.floor(Math.random() * incomplete.length)];
    setChosen(pick);
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={pickRandom}
        className="group relative font-heading text-sm tracking-widest uppercase px-6 py-3 rounded-md border-2 border-primary bg-primary/10 text-primary-foreground transition-all hover:bg-primary/20 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
      >
        <Sparkles className="inline w-4 h-4 mr-2 text-ember group-hover:animate-spin" />
        Fate's Choice
      </button>

      <AnimatePresence>
        {open && chosen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ transformOrigin: "top center" }}
              className="stone-texture w-full max-w-md mx-4 rounded-lg border-2 border-primary bg-card p-8 text-center shadow-[0_0_40px_hsl(var(--primary)/0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <p className="font-body text-sm text-muted-foreground italic mb-3">
                A new quest emerges from the shadows…
              </p>
              <h3 className="font-heading text-xl text-foreground mb-2 animate-rune-pulse">
                {chosen.description}
              </h3>
              <p className="font-heading text-sm text-ember mb-6">+{chosen.xp} XP</p>
              {!chosen.completed && (
                <button
                  onClick={() => {
                    completeQuest(chosen.id);
                    setOpen(false);
                  }}
                  className="font-heading text-sm tracking-widest uppercase px-5 py-2.5 rounded-md border-2 border-mana bg-mana/10 text-mana transition-all hover:bg-mana/20 hover:shadow-[0_0_16px_hsl(var(--mana)/0.4)]"
                >
                  Complete Quest
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
