import type { BlogPost } from "./types";

// EXAMPLE DRAFT — demonstrates the blog system. Not published: review, edit and approve before setting
// `draft: false` with a real `publishedAt` (and `author`, if one should be credited).
export const post: BlogPost = {
  slug: "planning-an-erp-rollout",
  title: "[Draft] Planning an ERP Rollout: Data, Workflows and People",
  description:
    "The three things that decide whether an ERP project succeeds — clean master data, mapped workflows and a team that is ready to use it.",
  category: "ERP & Business Automation",
  tags: ["ERP", "inventory", "business automation", "data migration", "change management"],
  cover: {
    src: "/images/services/erp-warehouse-inventory.jpg",
    alt: "Warehouse with an inventory dashboard on a laptop",
    width: 1280,
    height: 720,
  },
  author: null,
  publishedAt: null,
  draft: true,
  body: [
    {
      type: "paragraph",
      content: [
        "An ERP connects inventory, purchasing, sales, production and reporting so information is entered once and trusted everywhere. The software is only part of the work; most of the risk sits in data, workflows and people.",
      ],
    },
    { type: "heading", level: 2, text: "1. Clean master data first" },
    {
      type: "paragraph",
      content: ["Items, units, suppliers, customers and locations are the foundation everything else refers to. Before migrating, decide:"],
    },
    {
      type: "list",
      ordered: true,
      items: [
        ["Which source is the truth for each kind of record."],
        ["How duplicates and inconsistent units will be resolved."],
        ["Who owns each dataset after go-live."],
      ],
    },
    { type: "heading", level: 2, text: "2. Map the workflows end to end" },
    {
      type: "paragraph",
      content: [
        "Follow a purchase order or a production run from start to finish. Every hand-off, approval and exception is a requirement — and a place where automation can remove manual steps.",
      ],
    },
    { type: "heading", level: 2, text: "3. Prepare the people" },
    {
      type: "list",
      items: [
        ["Involve the people who do the work in testing, not only managers."],
        ["Roll out in stages so teams can adjust before the next module arrives."],
        ["Keep training short and task-based."],
      ],
    },
    {
      type: "quote",
      content: ["An ERP is adopted when it is the easiest way for people to do their job — not when it is installed."],
    },
    {
      type: "paragraph",
      content: [
        "See how we approach ",
        { text: "ERP and business automation", href: "/services/erp-business-automation" },
        ".",
      ],
    },
  ],
};
