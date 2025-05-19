import RevolutBanner from "@/assets/banners/revolut.png";
import type { Banner } from "@/types/bannerType";

export const BANNERS: Banner[] = [
  {
    id: "revolut",
    name: "Revolut",
    url: "https://get.revolut.com/z4lF/velada5nl",
    label: "Ir a la promoción de Revolut",
    image: {
      logo: RevolutBanner.src,
      width: 600,
      height: 200,
    },
  },

];