/** Industry filters on the Clientele page, in display order (after "All"). */
export const clientIndustries = [
  "Healthcare",
  "Construction & Infrastructure",
  "Food & Beverages",
  "Energy & Sustainability",
  "Consumer Products",
  "Events & Media",
  "Education",
  "Agriculture",
  "Automotive",
] as const;

export type ClientIndustry = (typeof clientIndustries)[number];

export type Client = {
  name: string;
  slug: string;
  logo: string;
  /** Specific line of business, shown on the card. */
  category: string;
  /** Broad industry the Clientele page filters by. */
  industry: ClientIndustry;
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
    slug: "acme-bricks", industry: "Construction & Infrastructure",
    logo: "/images/clients/acme-bricks.webp",
    category: "Construction & Infrastructure",
    tagline: "Quality Construction Materials",
    url: "https://acmebricks.in",
    aspect: "horizontal",
  },
  {
    name: "Uzhavar Connect",
    slug: "uzhavar-connect", industry: "Agriculture",
    logo: "/images/clients/uzhavar-connect.webp",
    category: "AgriTech & Farm Development",
    tagline: "Grow Your Land. Grow Your Future.",
    url: "https://uzhavarconnect.com/",
    aspect: "square",
  },
  {
    name: "Rent-O-Mate",
    slug: "rent-o-mate", industry: "Consumer Products",
    logo: "/images/clients/rent-o-mate.png",
    category: "Smart Appliance Rentals",
    tagline: "Water Purifiers On Rent",
    url: "https://rentomate.life",
    aspect: "wide",
  },
  {
    name: "GET Events",
    slug: "get-events", industry: "Events & Media",
    logo: "/images/clients/get-events-logo.jpeg",
    category: "Event Management & Celebrations",
    tagline: "Hub of Memories & Celebration",
    url: "https://getcorporateevents.com/",
    aspect: "horizontal",
  },
  {
    name: "Giftery",
    slug: "giftery", industry: "Consumer Products",
    logo: "/images/clients/giftery-logo.png",
    category: "Corporate Gifting & Merchandise",
    tagline: "Creating Memories For Brand",
    url: "https://gifterys.com/",
    aspect: "horizontal",
  },
  {
    name: "AKVINZ",
    slug: "akvinz", industry: "Consumer Products",
    logo: "/images/clients/akvinz.png",
    category: "Water Purification Systems",
    tagline: "Be Pure, Live Fresh",
    url: "https://akvinz.com/",
    aspect: "wide",
  },
  {
    slug: "teta", industry: "Energy & Sustainability",
    name: "TETA",
    category: "Business",
    logo: "/images/clients/teta-logo.png",
    url: "https://teztaenergy.com/",
    aspect: "horizontal",
  },
  {
    slug: "zeste-energy", industry: "Energy & Sustainability",
    name: "Zeste Energy",
    category: "Energy",
    logo: "/images/clients/zeste-energy.webp",
    url: "https://zeste.energy/",
    aspect: "horizontal"
  },
  { "slug": "saravana-videos", industry: "Events & Media", "name": "Saravana Videos", "category": "Video Production", "logo": "/images/clients/saravana-videos.webp", "url": "https://saravanavideos.in/", "aspect": "horizontal" },
  { "slug": "linga-construction", industry: "Construction & Infrastructure", "name": "Linga Construction", "category": "Construction & Infrastructure", "logo": "/images/clients/linga-construction.webp", "url": "https://lingadevelopers.com/", "aspect": "horizontal" },
  { "slug": "chimp", industry: "Food & Beverages", "name": "Chimp Premium Soda", "category": "Food & Beverages", "logo": "/images/clients/chimp.webp", "url": "https://chimpsoda.com/", "aspect": "horizontal" },
  { "slug": "mahil-pharmacy", industry: "Healthcare", "name": "Mahil Pharmacy", "category": "Pharmacy & Healthcare", "logo": "/images/clients/mahil-pharmacy.webp", "url": "https://mahilpharrmacy.com/", "aspect": "horizontal" },
  { "slug": "bananza", industry: "Food & Beverages", "name": "Bananza", "category": "Food & Beverages", "logo": "/images/clients/bananza.webp", "url": "https://bananza.in/", "aspect": "horizontal" },
  { "slug": "dream-cadd", industry: "Education", "name": "Dream CADD", "category": "Training & Education", "logo": "/images/clients/dream-cadd.webp", "url": "https://www.dreamcadd.com/", "aspect": "horizontal" },
  { "slug": "krish-dental", industry: "Healthcare", "name": "Krish Dental Studio", "category": "Dental Care", "logo": "/images/clients/krish-dental.webp", "url": "https://www.krishdentalstudio.com/", "aspect": "horizontal" },
  { "slug": "sencirc", industry: "Energy & Sustainability", "name": "Sencirc", "category": "Sustainability", "logo": "/images/clients/sencirc.webp", "url": "https://sencirc.com/", "aspect": "horizontal" },
  { "slug": "shifters", industry: "Automotive", "name": "Shifters", "category": "Automotive", "logo": "/images/clients/shifters.webp", "url": "https://shifters.in/", "aspect": "square" },
];
