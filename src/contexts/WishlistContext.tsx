import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
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

  // Memoize storage key to avoid recomputation
  const storageKey = useMemo(
    () => (user ? `${WISHLIST_KEY}-${user.id}` : WISHLIST_KEY),
    [user]
  );

  // Load wishlist from localStorage on mount or when user changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, [storageKey]);

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const isInWishlist = useCallback(
    (name: string) => items.some((item) => item.name === name),
    [items]
  );

  const addItem = useCallback(
    (item: Omit<WishlistItem, "addedAt">) => {
      if (isInWishlist(item.name)) return;
      
      const newItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };
      
      setItems((prev) => [...prev, newItem]);
      toast({
        title: "Added to Wishlist",
        description: `${item.name} has been saved to your wishlist.`,
      });
    },
    [isInWishlist, toast]
  );

  const removeItem = useCallback(
    (name: string) => {
      setItems((prev) => prev.filter((item) => item.name !== name));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
    [toast]
  );

  const toggleItem = useCallback(
    (item: Omit<WishlistItem, "addedAt">) => {
      if (isInWishlist(item.name)) {
        removeItem(item.name);
      } else {
        addItem(item);
      }
    },
    [isInWishlist, addItem, removeItem]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  }, [toast]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      isInWishlist,
      toggleItem,
      clearWishlist,
      itemCount: items.length,
    }),
    [items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist]
  );

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
