export type JourneyMilestone = {
  year: string;
  title: string;
  description: string;
};

/** Oldest first. The last milestone is shown as the current one. */
export const journeyMilestones: JourneyMilestone[] = [
  { year: "2020", title: "The Beginning of a Vision", description: "Connecting technology and creativity." },
  { year: "2021", title: "Laying the Foundation", description: "Building our team and core values." },
  { year: "2022", title: "Growth and Exploration", description: "Exploring new technologies and expertise." },
  { year: "2023", title: "Making an Impact", description: "Strengthening partnerships through better solutions." },
  { year: "2024", title: "Evolving for the Future", description: "Growing into an adaptive, future-focused company." },
  { year: "2025", title: "Building Smarter Solutions", description: "Bringing AI and automation into the products we build." },
  { year: "2026", title: "Engineering What's Next", description: "Delivering intelligent, scalable products for growing businesses." },
];
