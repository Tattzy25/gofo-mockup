import { TattooOption } from "@/lib/api-types";

export const TATTOO_STYLES: TattooOption[] = [
  {
    id: "neo-traditional",
    label: "Neo Traditional",
    value: "Neo Traditional",
    imageUrl: "/neo-traditional.png",
    group: "style"
  },
  {
    id: "traditional",
    label: "Traditional",
    value: "Traditional",
    imageUrl: "/traditional.png",
    group: "style"
  },
  {
    id: "fine-line",
    label: "Fine Line",
    value: "Fine Line",
    imageUrl: "/fine-line.png",
    group: "style"
  },
  {
    id: "trash-polka",
    label: "Trash Polka",
    value: "Trash Polka",
    imageUrl: "/trash-polka.png",
    group: "style"
  },
  {
    id: "blackwork",
    label: "Blackwork",
    value: "Blackwork",
    imageUrl: "/blackwork.png",
    group: "style"
  },
  {
    id: "tribal",
    label: "Tribal",
    value: "Tribal",
    imageUrl: "/tribal.png",
    group: "style"
  },
  {
    id: "japanese",
    label: "Japanese",
    value: "Japanese",
    imageUrl: "/japanese.png",
    group: "style"
  },
  {
    id: "watercolor",
    label: "Watercolor",
    value: "Watercolor",
    imageUrl: "/watercolor.png",
    group: "style"
  },
  {
    id: "realism",
    label: "Realism",
    value: "Realism",
    imageUrl: "/realism.png",
    group: "style"
  },
  {
    id: "black-and-grey",
    label: "Black and Grey",
    value: "Black and Grey",
    imageUrl: "/black-and-grey.png",
    group: "style"
  },
  {
    id: "custom-style",
    label: "Custom Style",
    value: "Custom",
    imageUrl: "/custom.png",
    isCustom: true,
    group: "style"
  }
];
