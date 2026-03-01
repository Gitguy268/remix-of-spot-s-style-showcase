import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/useSound";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Sound toggle button. Displays a speaker icon that toggles
 * sound effects on/off. State persisted via localStorage.
 */
const SoundToggle = () => {
  const { isSoundEnabled, toggleSound } = useSound();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSound}
          className="w-9 h-9"
          aria-label={isSoundEnabled ? "Mute sound effects" : "Enable sound effects"}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Sound: {isSoundEnabled ? "On" : "Off"}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SoundToggle;
