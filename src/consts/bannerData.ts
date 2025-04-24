import RevolutBanner from "@/assets/banners/revolut.png";
import type { Banner } from "@/types/bannerType";

export const BANNERS: Banner[] = [
  {
    id: "revolut",
    name: "Revolut",
    url: "https://www.revolut.com/es-ES/velada5-revolut",
    label: "Ir a la promoción de Revolut",
    image: {
      logo: RevolutBanner.src,
      width: 600,
      height: 200,
    },
  },

];