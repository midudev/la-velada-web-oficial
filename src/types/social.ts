type SocialId = "x" | "instagram" | "github" | "youtube" | "twitch" | "tiktok";

type SocialName = "X" | "Instagram" | "GitHub" | "Youtube" | "Twitch" | "TikTok";

export interface Social {
  id: SocialId;
  name: SocialName;
  url: string;
  label: string;
  image: {
    logo: any;
    width: number;
    height: number;
  };
}
