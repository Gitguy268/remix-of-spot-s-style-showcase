import { useMinecraftMode } from "@/contexts/MinecraftModeContext";
import { Switch } from "@/components/ui/switch";

/** Tiny 8×8 creeper face rendered via CSS box-shadow pixel art */
const CreeperFace = () => (
  <div
    className="minecraft-creeper-face"
    aria-hidden="true"
    style={{
      width: 8,
      height: 8,
      position: "relative",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        background: "#0d6e0d",
        boxShadow: `
          0 0 #0d6e0d, 1px 0 #0d6e0d, 2px 0 #3a8b3a, 3px 0 #3a8b3a, 4px 0 #3a8b3a, 5px 0 #3a8b3a, 6px 0 #0d6e0d, 7px 0 #0d6e0d,
          0 1px #3a8b3a, 1px 1px #0d6e0d, 2px 1px #0d6e0d, 3px 1px #3a8b3a, 4px 1px #3a8b3a, 5px 1px #0d6e0d, 6px 1px #0d6e0d, 7px 1px #3a8b3a,
          0 2px #3a8b3a, 1px 2px #0d6e0d, 2px 2px #000, 3px 2px #0d6e0d, 4px 2px #0d6e0d, 5px 2px #000, 6px 2px #0d6e0d, 7px 2px #3a8b3a,
          0 3px #0d6e0d, 1px 3px #0d6e0d, 2px 3px #0d6e0d, 3px 3px #0d6e0d, 4px 3px #0d6e0d, 5px 3px #0d6e0d, 6px 3px #0d6e0d, 7px 3px #0d6e0d,
          0 4px #3a8b3a, 1px 4px #0d6e0d, 2px 4px #0d6e0d, 3px 4px #000, 4px 4px #000, 5px 4px #0d6e0d, 6px 4px #0d6e0d, 7px 4px #3a8b3a,
          0 5px #0d6e0d, 1px 5px #0d6e0d, 2px 5px #000, 3px 5px #000, 4px 5px #000, 5px 5px #000, 6px 5px #0d6e0d, 7px 5px #0d6e0d,
          0 6px #3a8b3a, 1px 6px #0d6e0d, 2px 6px #000, 3px 6px #0d6e0d, 4px 6px #0d6e0d, 5px 6px #000, 6px 6px #0d6e0d, 7px 6px #3a8b3a,
          0 7px #0d6e0d, 1px 7px #3a8b3a, 2px 7px #0d6e0d, 3px 7px #0d6e0d, 4px 7px #0d6e0d, 5px 7px #0d6e0d, 6px 7px #3a8b3a, 7px 7px #0d6e0d
        `,
        transform: "scale(2.5)",
        transformOrigin: "top left",
        imageRendering: "pixelated",
      }}
    />
  </div>
);

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
        {isMinecraft ? "⛏ Survival Mode" : "Minecraft Mode"}
      </label>
      <Switch
        id="minecraft-toggle"
        checked={isMinecraft}
        onCheckedChange={toggleMinecraft}
        aria-label="Toggle Minecraft Mode"
      />
      {isMinecraft && (
        <div className="ml-1" title="Creeper says sssss...">
          <CreeperFace />
        </div>
      )}
    </div>
  );
};

export default MinecraftModeToggle;
