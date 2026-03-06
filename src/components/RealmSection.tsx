import { Quest } from "@/contexts/QuestContext";
import QuestCard from "./QuestCard";
import { motion } from "framer-motion";

const REALM_META: Record<string, { title: string; icon: string; flavour: string }> = {
  os: { title: "The Archive of Systems", icon: "📜", flavour: "Ancient scrolls of kernel wisdom await…" },
  threejs: { title: "The Creative Forge", icon: "🔥", flavour: "The forge crackles with creative fire." },
  dsa: { title: "The Algorithm Arena", icon: "⚔️", flavour: "Steel your mind for logical combat." },
  space: { title: "The Orbital Observatory", icon: "🔭", flavour: "The Observatory hums with celestial whispers." },
};

interface RealmSectionProps {
  realmKey: string;
  quests: Quest[];
}

export default function RealmSection({ realmKey, quests }: RealmSectionProps) {
  const meta = REALM_META[realmKey] ?? { title: realmKey, icon: "◆", flavour: "" };
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="stone-texture rounded-lg border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{meta.icon}</span>
        <h2 className="font-heading text-xl tracking-wide text-primary-foreground">{meta.title}</h2>
        <span className="ml-auto font-body text-sm text-muted-foreground">
          {completedCount}/{quests.length}
        </span>
      </div>
      <p className="font-body text-sm text-muted-foreground italic mb-4">{meta.flavour}</p>
      <div className="space-y-2">
        {quests.map((q) => (
          <QuestCard key={q.id} quest={q} />
        ))}
      </div>
    </motion.section>
  );
}
