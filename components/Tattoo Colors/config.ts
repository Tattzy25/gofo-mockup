import { TattooOption } from "@/lib/api-types";

export const TATTOO_COLORS: TattooOption[] = [
  {
    id: "black-white",
    label: "Black & White",
    value: "Black",
    imageUrl: "/black-and-white.png",
    group: "color"
  },
  {
    id: "colorful",
    label: "Colorful",
    value: "Colorful",
    imageUrl: "/colorful.png",
    group: "color"
  },
  {
    id: "custom-color",
    label: "Custom Color",
    value: "Custom",
    imageUrl: "/custom.png",
    isCustom: true,
    group: "color"
  }
];
