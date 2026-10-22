import { brand } from "@/lib/brand";
import type { ProjectCategory } from "@/types";

export type WorkShot = {
  src: string;
  alt: string;
  /** Which part of the screenshot each folder page shows (CSS object-position). */
  focus: [string, string];
  /** Crop for the wide card on /work (CSS object-position). */
  cover: string;
};

export type Work = {
  slug: string;
  name: string;
  type: string;
  description: string;
  tags: string[];
  /** Work page filters. */
  categories: ProjectCategory[];
  /** Live URL. Only set for projects that are publicly reachable. */
  url?: string;
  cta: string;
  /** Real product screenshot. Projects without one get an illustrative, clearly labelled mockup. */
  shot?: WorkShot;
  /** Folder colour, from the IKASLE palette. */
  color: string;
};

/** Live products: the home page "Works" section and the Work page. Screenshots are of the real sites. */
export const works: Work[] = [
  {
    slug: "kiddos-foods",
    name: "Kiddos Foods",
    type: "E-commerce Website",
    description: "A modern food e-commerce platform built to showcase and sell healthy products with a smooth shopping experience.",
    tags: ["E-commerce", "Food products", "Web"],
    categories: ["E-commerce", "Web Applications"],
    url: "https://kiddosfoods.com",
    cta: "Visit Website",
    shot: {
      src: "/images/works/kiddos-foods-store.webp",
      alt: "Kiddos Foods store: the Best Selling Products section with product cards, prices and category filters",
      focus: ["8% 70%", "92% 70%"],
      cover: "50% 0%",
    },
    color: brand.blue,
  },
  {
    slug: "uzhavar-connect",
    name: "Uzhavar Connect",
    type: "E-commerce / Agriculture Platform",
    description:
      "A digital agriculture-focused platform connecting farming services, land development, and rural growth through a modern web experience.",
    tags: ["Agriculture", "Farm services", "Web"],
    categories: ["E-commerce", "Web Applications"],
    url: "https://uzhavarconnect.com/",
    cta: "Visit Website",
    shot: {
      src: "/images/works/uzhavar-connect-home.webp",
      alt: "Uzhavar Connect home page: “Grow Your Land. Grow Your Future.” hero over a farm landscape, with Book a Service and Explore Services buttons",
      focus: ["24% 45%", "84% 55%"],
      cover: "30% 40%",
    },
    color: brand.blueAction,
  },
  {
    slug: "kiddos-foods-erp",
    name: "Kiddos Foods ERP",
    type: "ERP Platform",
    description: "An operations-focused ERP system built to manage procurement, production, inventory, packaging, pricing, and business workflows.",
    tags: ["ERP", "Procurement", "Production", "Inventory"],
    categories: ["ERP Solutions", "Business Automation"],
    url: "https://erpkiddosfoods.in",
    cta: "Visit ERP",
    shot: {
      src: "/images/works/kiddos-foods-erp-dashboard.webp",
      alt: "Kiddos Foods ERP executive dashboard: module sidebar, revenue, profit, inventory and cash KPI cards",
      focus: ["0% 30%", "62% 25%"],
      cover: "0% 0%",
    },
    color: brand.navy,
  },
  {
    slug: "wahid",
    name: "Wahid",
    type: "Mobile App",
    description: "A mobile-first product experience designed for accessibility, smooth interaction, and modern app usability.",
    tags: ["Mobile app"],
    categories: ["Mobile Applications"],
    cta: "Explore App",
    color: brand.blueDeep,
  },
];
