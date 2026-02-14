/**
 * Get badge variant based on badge type
 * Centralizes badge variant logic used across ProductCard and ProductQuickView
 */
export function getBadgeVariant(badge?: string): "default" | "secondary" | "destructive" | "outline" {
  if (!badge) return "secondary";
  return badge === "New" ? "default" : "secondary";
}
