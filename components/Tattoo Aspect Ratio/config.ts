import { TattooOption } from "@/lib/api-types";

export const TATTOO_RATIOS: TattooOption[] = [
  {
    id: "ratio-9-16",
    label: "Portrait (9:16)",
    value: "9:16",
    imageUrl: "/ratio-9-16.png",
    group: "ratio"
  },
  {
    id: "ratio-16-9",
    label: "Landscape (16:9)",
    value: "16:9",
    imageUrl: "/ratio-16-9.png",
    group: "ratio"
  },
  {
    id: "ratio-1-1",
    label: "Square (1:1)",
    value: "1:1",
    imageUrl: "/ratio-1-1.png",
    group: "ratio"
  }
];
