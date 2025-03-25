type SocialId = "x" | "instagram" | "github";

type SocialName = "X" | "Instagram" | "GitHub";

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
