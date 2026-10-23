import type { BlogPost } from "./types";

// EXAMPLE DRAFT — demonstrates the blog system (including code blocks and tables). Not published: review,
// edit and approve before setting `draft: false` with a real `publishedAt` (and `author`, if credited).
export const post: BlogPost = {
  slug: "server-components-data-fetching",
  title: "[Draft] Fetching Data in React Server Components Without Waterfalls",
  description:
    "How to fetch data on the server in the Next.js App Router, avoid sequential request waterfalls, and keep client JavaScript small.",
  category: "Web Development",
  tags: ["Next.js", "React Server Components", "App Router", "performance", "TypeScript"],
  cover: {
    src: "/images/services/web-app-saas-dashboard.jpg",
    alt: "Desktop monitor displaying a web application dashboard with charts",
    width: 1024,
    height: 1024,
  },
  author: null,
  publishedAt: null,
  draft: true,
  body: [
    {
      type: "paragraph",
      content: [
        "In the App Router, components are Server Components by default. They can be ",
        { code: "async" },
        " and read data directly, which removes a whole layer of client-side loading states — as long as the requests do not wait on each other unnecessarily.",
      ],
    },
    { type: "heading", level: 2, text: "The waterfall problem" },
    {
      type: "paragraph",
      content: ["Awaiting independent requests one after another makes the page as slow as the sum of all of them:"],
    },
    {
      type: "code",
      language: "tsx",
      filename: "app/dashboard/page.tsx",
      code: `export default async function Page() {
  const orders = await getOrders();   // waits…
  const stock = await getStock();     // …then waits again
  return <Dashboard orders={orders} stock={stock} />;
}`,
    },
    { type: "heading", level: 2, text: "Start independent requests together" },
    {
      type: "paragraph",
      content: [
        "When requests do not depend on each other, start them at the same time with ",
        { code: "Promise.all" },
        ". The page now takes as long as the slowest request, not the total.",
      ],
    },
    {
      type: "code",
      language: "tsx",
      filename: "app/dashboard/page.tsx",
      code: `export default async function Page() {
  const [orders, stock] = await Promise.all([getOrders(), getStock()]);
  return <Dashboard orders={orders} stock={stock} />;
}`,
    },
    { type: "heading", level: 3, text: "Stream the slow parts" },
    {
      type: "paragraph",
      content: [
        "If one section is much slower than the rest, move it into its own component inside ",
        { code: "<Suspense>" },
        ". The rest of the page renders immediately and the slow part streams in when ready.",
      ],
    },
    {
      type: "table",
      caption: "Choosing an approach",
      headers: ["Situation", "Approach"],
      rows: [
        ["Requests depend on each other", "Await in sequence — the order is real"],
        ["Independent requests", "Promise.all"],
        ["One slow section", "Separate component + Suspense"],
      ],
    },
    {
      type: "quote",
      content: ["Keep interactivity in small client components and let the server do the data work."],
    },
    {
      type: "paragraph",
      content: [
        "Read more about how we approach ",
        { text: "web application development", href: "/services/web-application-development" },
        ".",
      ],
    },
  ],
};
