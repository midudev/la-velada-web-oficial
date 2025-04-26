type BannerId = "revolut";
type BannerName = "Revolut";

export interface Banner {
  id: BannerId;
  name: BannerName;
  url: string;
  label: string;
  image: {
    logo: any;
    width: number;
    height: number;
  };
}
