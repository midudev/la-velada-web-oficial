import type { Social } from "@/types/social";

import X from "@/assets/svg/x.svg";
import Instagram from "@/assets/svg/instagram.svg";
import GitHub from "@/assets/svg/github.svg";

export const SOCIAL: Social[] = [
  {
    id: "x",
    name: "X",
    url: "https://x.com/infolavelada",
    label: "Visitar perfil de InfoLaVelada en X",
    image: {
      logo: X,
      width: 200,
      height: 200,
    },
  },

  {
    id: "instagram",
    name: "Instagram",
    url: "https://instagram.com/infoLaVelada",
    label: "Visitar perfil de InfoLaVelada en Instagram",
    image: {
      logo: Instagram,
      width: 200,
      height: 200,
    },
  },

  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/midudev/la-velada-web-oficial",
    label: "Visitar repositorio de la Velada Oficial en GitHub",
    image: {
      logo: GitHub,
      width: 200,
      height: 200,
    },
  },
];
