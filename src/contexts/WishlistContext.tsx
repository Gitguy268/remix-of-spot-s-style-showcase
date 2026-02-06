import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  const addItem = (item: Omit<WishlistItem, "addedAt">) => {
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
  };

  const removeItem = (name: string) => {
    setItems((prev) => prev.filter((item) => item.name !== name));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const isInWishlist = (name: string) => {
    return items.some((item) => item.name === name);
  };

  const toggleItem = (item: Omit<WishlistItem, "addedAt">) => {
    if (isInWishlist(item.name)) {
      removeItem(item.name);
    } else {
      addItem(item);
    }
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
        clearWishlist,
        itemCount: items.length,
      }}
    >
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
