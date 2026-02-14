import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react";

interface MinecraftModeContextType {
  isMinecraft: boolean;
  toggleMinecraft: () => void;
}

const MinecraftModeContext = createContext<MinecraftModeContextType>({
  isMinecraft: false,
  toggleMinecraft: () => {},
});

export const useMinecraftMode = () => useContext(MinecraftModeContext);

export const MinecraftModeProvider = ({ children }: { children: ReactNode }) => {
  const [isMinecraft, setIsMinecraft] = useState(() => {
    try {
      return localStorage.getItem("minecraft-mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isMinecraft) {
      html.classList.add("minecraft-mode");
    } else {
      html.classList.remove("minecraft-mode");
    }
    try {
      localStorage.setItem("minecraft-mode", String(isMinecraft));
    } catch (error) {
      // Silently fail if localStorage is not available
      console.warn("Failed to save minecraft mode to localStorage:", error);
    }
  }, [isMinecraft]);

  const toggleMinecraft = useCallback(() => setIsMinecraft((prev) => !prev), []);

  const value = useMemo(
    () => ({ isMinecraft, toggleMinecraft }),
    [isMinecraft, toggleMinecraft]
  );

  return (
    <MinecraftModeContext.Provider value={value}>
      {children}
    </MinecraftModeContext.Provider>
  );
};
