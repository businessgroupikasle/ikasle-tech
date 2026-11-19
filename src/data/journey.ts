export type JourneyMilestone = {
  year: string;
  title: string;
  subtitle?: string;
  description: string;
};

/** Oldest first. The last milestone is shown as the current one. */
export const journeyMilestones: JourneyMilestone[] = [
  {
    year: "2020",
    title: "The Beginning of a Vision",
    subtitle: "Where It All Started.",
    description: "An idea was born to bring technology and creativity together and explore new possibilities through digital solutions.",
  },
  {
    year: "2021",
    title: "Laying the Foundation",
    subtitle: "Learning to Build.",
    description: "We focused on establishing our foundation, developing our capabilities and shaping the values that would guide our journey.",
  },
  {
    year: "2022",
    title: "Growth and Exploration",
    subtitle: "Expanding Our Horizons.",
    description: "We explored new technologies, learned from new challenges and expanded our understanding of the digital world.",
  },
  {
    year: "2023",
    title: "Making an Impact",
    subtitle: "Turning Ideas Into Experiences.",
    description: "We strengthened our capabilities and continued creating digital solutions around evolving business requirements.",
  },
  {
    year: "2024",
    title: "Evolving for the Future",
    subtitle: "Adapting and Improving.",
    description: "We focused on improving our approach, embracing change and preparing ourselves for the next stage of growth.",
  },
  {
    year: "2025",
    title: "Building Smarter Solutions",
    subtitle: "Exploring Intelligent Technology.",
    description: "We expanded our interest in AI, automation and smarter ways to approach digital product development.",
  },
  {
    year: "2026",
    title: "Engineering What's Next",
    subtitle: "A New Chapter Begins.",
    description: "We are sharpening our identity as a software engineering company, strengthening our capabilities and opening new opportunities for international collaboration.",
  },
  {
    year: "2027",
    title: "Scaling New Frontiers & Autonomous Systems",
    subtitle: "The Future We Are Engineering.",
    description: "Expanding into autonomous agent workflows, advanced AI platforms, and deepened international partnerships to empower businesses with future-ready technology.",
  },
];
