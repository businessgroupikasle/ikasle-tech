export type Client = {
  name: string;
  slug: string;
  logo: string;
  category: string;
  /** Live verified website URL if officially available */
  url?: string;
  /** Slogan or subtext from official branding */
  tagline?: string;
  /** Width-to-height classification for optimal optical sizing */
  aspect: "square" | "horizontal" | "wide";
};

export const clients: Client[] = [
  {
    name: "ACME Bricks & Blocks",
    slug: "acme-bricks",
    logo: "/images/clients/acme-bricks.webp",
    category: "Construction & Infrastructure",
    tagline: "Quality Construction Materials",
    url: "https://acmebricks.in",
    aspect: "horizontal",
  },
  {
    name: "Uzhavar Connect",
    slug: "uzhavar-connect",
    logo: "/images/clients/uzhavar-connect.webp",
    category: "AgriTech & Farm Development",
    tagline: "Grow Your Land. Grow Your Future.",
    url: "https://uzhavarconnect.com/",
    aspect: "square",
  },
  {
    name: "Rent-O-Mate",
    slug: "rent-o-mate",
    logo: "/images/clients/rent-o-mate.png",
    category: "Smart Appliance Rentals",
    tagline: "Water Purifiers On Rent",
    url: "https://rentomate.life",
    aspect: "wide",
  },
  {
    name: "GET Events",
    slug: "get-events",
    logo: "/images/clients/get-events.png",
    category: "Event Management & Celebrations",
    tagline: "Hub of Memories & Celebration",
    aspect: "horizontal",
  },
  {
    name: "Giftery",
    slug: "giftery",
    logo: "/images/clients/giftery.png",
    category: "Corporate Gifting & Merchandise",
    tagline: "Creating Memories For Brand",
    aspect: "horizontal",
  },
  {
    name: "AKVINZ",
    slug: "akvinz",
    logo: "/images/clients/akvinz.png",
    category: "Water Purification Systems",
    tagline: "Be Pure, Live Fresh",
    aspect: "wide",
  },
];
