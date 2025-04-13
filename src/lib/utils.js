/*import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 
*/ 
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines Tailwind classes, avoids conflicts, handles conditionals
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
