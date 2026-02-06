import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const WishlistDrawer = () => {
  const { items, removeItem, clearWishlist, itemCount } = useWishlist();
  const { formatPrice } = useCurrency();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Heart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            My Wishlist
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Save your favorite Spot items to find them easily later!
            </p>
            <a href="#products">
              <Button variant="default" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Button>
            </a>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-200px)] mt-4">
              <div className="space-y-4 pr-4">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-primary font-semibold">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <div className="flex gap-2 mt-2">
                        <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <ExternalLink className="w-3 h-3" />
                            View
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.name)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Shop All Items
                </Button>
              </a>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={clearWishlist}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Wishlist
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
