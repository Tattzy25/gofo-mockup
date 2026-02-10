export type ChromeGlowVariant = "default" | "hover" | "selected";

// "Liquid metal chrome" glow via layered shadows (no shader).
// Keep as strings so any component can reuse without duplicating literals.
export const CHROME_GLOW: Record<ChromeGlowVariant, string> = {
  default:
    "0 0 0 1px rgba(255,255,255,0.14), 0 18px 40px rgba(0,0,0,0.45), 0 0 22px rgba(190,210,255,0.16), 0 0 34px rgba(255,255,255,0.08)",
  hover:
    "0 0 0 1px rgba(255,255,255,0.18), 0 24px 56px rgba(0,0,0,0.5), 0 0 30px rgba(190,210,255,0.22), 0 0 44px rgba(255,255,255,0.12)",
  selected:
    "0 0 0 1px rgba(255,255,255,0.22), 0 28px 64px rgba(0,0,0,0.55), 0 0 38px rgba(190,210,255,0.28), 0 0 60px rgba(255,255,255,0.16)",
};

