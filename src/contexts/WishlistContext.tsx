import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  name: string;
  price: string;
  image: string;
  category: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (name: string) => void;
  isInWishlist: (name: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, "addedAt">) => void;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = "spot-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storageKey = user ? `${WISHLIST_KEY}-${user.id}` : WISHLIST_KEY;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, [user]);

  // Save to localStorage when items change
  useEffect(() => {
    const storageKey = user ? `${WISHLIST_KEY}-${user.id}` : WISHLIST_KEY;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, user]);

  const addItem = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      if (prev.some((i) => i.name === item.name)) return prev;
      
      const newItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };
      
      return [...prev, newItem];
    });
    toast({
      title: "Added to Wishlist",
      description: `${item.name} has been saved to your wishlist.`,
    });
  }, [toast]);

  const removeItem = useCallback((name: string) => {
    setItems((prev) => prev.filter((item) => item.name !== name));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  }, [toast]);

  const isInWishlist = useCallback((name: string) => {
    return items.some((item) => item.name === name);
  }, [items]);

  const toggleItem = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    if (items.some((i) => i.name === item.name)) {
      removeItem(item.name);
    } else {
      addItem(item);
    }
  }, [items, addItem, removeItem]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  }, [toast]);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    isInWishlist,
    toggleItem,
    clearWishlist,
    itemCount: items.length,
  }), [items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
