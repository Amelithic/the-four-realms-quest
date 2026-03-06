import { useState } from "react";
import { useQuests, QuestData } from "@/contexts/QuestContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const REALM_OPTIONS: { value: keyof QuestData["realms"] | "boss"; label: string }[] = [
  { value: "os", label: "📜 The Archive of Systems" },
  { value: "threejs", label: "🔥 The Creative Forge" },
  { value: "dsa", label: "⚔️ The Algorithm Arena" },
  { value: "space", label: "🔭 The Orbital Observatory" },
  { value: "boss", label: "💀 Boss Fight" },
];

export default function AddTaskForm() {
  const { addQuest } = useQuests();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [xp, setXp] = useState(10);
  const [realm, setRealm] = useState<keyof QuestData["realms"] | "boss">("os");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    addQuest(realm, description.trim(), xp);
    setDescription("");
    setXp(10);
    setRealm("os");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-border hover:border-primary/50">
          <Plus className="w-4 h-4" />
          Add a task
        </Button>
      </DialogTrigger>
      <DialogContent className="stone-texture border-border bg-card sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-wide text-primary-foreground">
            Forge a New Quest
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Realm</Label>
            <Select value={realm} onValueChange={(v) => setRealm(v as typeof realm)}>
              <SelectTrigger className="border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REALM_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Task Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your quest…"
              className="border-border bg-background min-h-[80px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">
              XP Value: <span className="font-heading text-foreground">{xp}</span>
            </Label>
            <Slider
              value={[xp]}
              onValueChange={([v]) => setXp(v)}
              min={5}
              max={100}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between font-body text-xs text-muted-foreground">
              <span>5</span>
              <span>100</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Quest
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
