import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "Our Work", href: "/work" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Custom Software", href: "/services#custom-software" },
      { label: "Web Applications", href: "/services#web-applications" },
      { label: "Mobile Apps", href: "/services#mobile-apps" },
      { label: "ERP & Business Automation", href: "/services#erp-solutions" },
      { label: "AI & Intelligent Solutions", href: "/services#ai-automation" },
      { label: "UI/UX & Product Design", href: "/services#product-design" },
    ],
  },
];
