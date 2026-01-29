import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStyleLabel(url: string) {
  try {
    const path = new URL(url).pathname;
    const raw = path.split("/").pop() || "";
    const name = raw.split(".")[0] || raw;
    
    // Check if it's an aspect ratio (e.g., 16_9, 1_1)
    if (/^\d+_\d+$/.test(name)) {
      return name.replace("_", ":");
    }

    // Check if it's a custom input
    if (name.includes("Custom: ")) {
      return name;
    }

    return name
      .replace(/[_-]+/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  } catch (e) {
    return "";
  }
}
