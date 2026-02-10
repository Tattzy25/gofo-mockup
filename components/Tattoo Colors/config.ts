import { TattooOption } from "@/lib/api-types";

export const TATTOO_COLORS: TattooOption[] = [
  {
    id: "black-white",
    label: "Black & White",
    value: "Black",
    imageUrl: "/B%26W.png",
    group: "color"
  },
  {
    id: "colorful",
    label: "Full Color",
    value: "Colorful",
    imageUrl: "/FULLCOLOR.png",
    group: "color"
  }
];
