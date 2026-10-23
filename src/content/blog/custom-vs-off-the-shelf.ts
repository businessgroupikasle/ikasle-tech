import type { BlogPost } from "./types";

// EXAMPLE DRAFT — demonstrates the blog system. Not published: review, edit and approve before setting
// `draft: false` with a real `publishedAt` (and `author`, if one should be credited).
export const post: BlogPost = {
  slug: "custom-software-vs-off-the-shelf",
  title: "[Draft] Custom Software or Off-the-Shelf? A Practical Way to Decide",
  description:
    "A simple framework for deciding when packaged software is enough and when a custom system is worth building — based on workflows, integrations and change.",
  category: "Software Development",
  tags: ["custom software", "build vs buy", "SaaS", "requirements", "integration"],
  cover: {
    src: "/images/services/custom-software-code-laptop.jpg",
    alt: "Laptop on a desk showing source code in a split-screen editor",
    width: 1280,
    height: 852,
  },
  author: null,
  publishedAt: null,
  draft: true,
  body: [
    {
      type: "paragraph",
      content: [
        "Most businesses start with off-the-shelf tools, and that is usually the right call. The question is not ",
        { strong: "whether" },
        " custom software is better — it is when the cost of working around a packaged product becomes higher than the cost of building something that fits.",
      ],
    },
    { type: "heading", level: 2, text: "Start with the workflow, not the feature list" },
    {
      type: "paragraph",
      content: [
        "Feature comparisons hide the real question: does the tool follow the way your team actually works? Write down the three or four workflows that matter most — from the first step to the last — and check each one against the product.",
      ],
    },
    {
      type: "list",
      items: [
        ["Where do people copy data from one system into another?"],
        ["Which steps happen in spreadsheets because the tool cannot model them?"],
        ["Which approvals or rules live only in someone's head?"],
      ],
    },
    { type: "heading", level: 2, text: "Signals that packaged software is enough" },
    {
      type: "list",
      items: [
        ["Your process is close to the industry standard the product was designed for."],
        ["Integrations you need are already offered by the vendor."],
        ["Workarounds are occasional, not daily."],
      ],
    },
    { type: "heading", level: 2, text: "Signals that a custom system may pay off" },
    {
      type: "list",
      items: [
        ["Teams re-enter the same data in several tools every day."],
        ["The workflow is a competitive difference you do not want to flatten into a template."],
        ["You need to connect systems the vendors do not support."],
      ],
    },
    {
      type: "quote",
      content: ["The best custom software often starts small: one painful workflow, done properly, then extended."],
    },
    { type: "heading", level: 2, text: "A quick comparison" },
    {
      type: "table",
      caption: "Typical trade-offs — every project differs.",
      headers: ["Consideration", "Off-the-shelf", "Custom"],
      rows: [
        ["Time to start", "Immediate", "Needs a build phase"],
        ["Fit to your workflow", "You adapt to the tool", "The tool adapts to you"],
        ["Integrations", "Limited to what the vendor offers", "Built for your systems"],
        ["Ongoing changes", "Depends on the vendor roadmap", "Under your control"],
      ],
    },
    { type: "heading", level: 2, text: "Next step" },
    {
      type: "paragraph",
      content: [
        "If you are unsure, map one workflow end to end and look for the manual steps. That map is also the best starting point for a conversation about ",
        { text: "custom software development", href: "/services#custom-software" },
        ".",
      ],
    },
  ],
};
