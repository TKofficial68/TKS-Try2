export type AppItem = {
  id: number;
  name: string;
  developer: string;
  type: "app" | "game" | string;
  category: string;
  description: string;
  iconUrl: string;
  bannerUrl: string;
  screenshots: string[];
  downloadUrl: string;
  version: string;
  size: string;
  rating: number;
  downloads: string;
  ageRating: string;
  featured: boolean;
  accentColor: string;
  createdAt: string;
};

export type Tab = "apps" | "games" | "search" | "profile";
