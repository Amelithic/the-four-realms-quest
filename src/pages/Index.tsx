import { QuestProvider, useQuests } from "@/contexts/QuestContext";
import XPBar from "@/components/XPBar";
import bgRealm from "@/assets/bg-realm.jpg";
import RealmSection from "@/components/RealmSection";
import BossFightSection from "@/components/BossFightSection";
import FatesChoice from "@/components/FatesChoice";
import AddTaskForm from "@/components/AddTaskForm";
import DustParticles from "@/components/DustParticles";
import TorchGlow from "@/components/TorchGlow";

function QuestApp() {
  const { data } = useQuests();

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-heading text-lg text-muted-foreground animate-rune-pulse">
          Summoning the Realms…
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: `url(${bgRealm})` }}
      />
      <div className="fixed inset-0 z-0 bg-background/40" />
      <TorchGlow />
      <DustParticles />

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-title text-4xl md:text-5xl tracking-wider text-foreground mb-2 animate-rune-pulse">
            The Four Realms Quest
          </h1>
          <p className="font-body text-lg text-muted-foreground italic mb-6">
            Your XP awakens the ancient runes.
          </p>
          <XPBar />
          <div className="mt-6 flex justify-center">
            <FatesChoice />
          </div>
        </div>

        {/* Realms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <RealmSection realmKey="os" quests={data.realms.os} />
          <RealmSection realmKey="threejs" quests={data.realms.threejs} />
          <RealmSection realmKey="dsa" quests={data.realms.dsa} />
          <RealmSection realmKey="space" quests={data.realms.space} />
        </div>

        {/* Boss Fights */}
        <BossFightSection bosses={data.bossFights} />

        {/* Add Task */}
        <div className="flex justify-center mt-8">
          <AddTaskForm />
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-8">
          <p className="font-body text-sm text-muted-foreground">
            ◆ Enter the Realms ◆
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <QuestProvider>
      <QuestApp />
    </QuestProvider>
  );
}
