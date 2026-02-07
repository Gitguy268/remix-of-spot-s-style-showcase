import { useMinecraftMode } from "@/contexts/MinecraftModeContext";
import { Switch } from "@/components/ui/switch";

const MinecraftModeToggle = () => {
  const { isMinecraft, toggleMinecraft } = useMinecraftMode();

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {/* Minecraft grass block icon */}
      <div className="minecraft-toggle__icon" aria-hidden="true">
        <div className="minecraft-toggle__grass-top" />
        <div className="minecraft-toggle__dirt" />
      </div>
      <label
        htmlFor="minecraft-toggle"
        className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
      >
        Minecraft Mode
      </label>
      <Switch
        id="minecraft-toggle"
        checked={isMinecraft}
        onCheckedChange={toggleMinecraft}
        aria-label="Toggle Minecraft Mode"
      />
    </div>
  );
};

export default MinecraftModeToggle;
