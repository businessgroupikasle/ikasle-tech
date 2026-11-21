import type { RoleKind } from "@/data/careers";

/** A role-specific link field in the Skills & Experience step. */
export type RoleLink = { key: string; label: string; placeholder: string; required: boolean };

export type RoleFormConfig = {
  /** Heading for the role-specific skills chips (e.g. "Technical skills"). */
  skillsLabel: string;
  skillOptions: string[];
  toolsLabel: string;
  toolOptions: string[];
  links: RoleLink[];
  /** Placeholder for "Previous project details", tuned to the role. */
  projectsHint: string;
};

/**
 * What the application form asks for each kind of role, so a developer sees technical skills and a GitHub field,
 * a video editor sees editing tools and a showreel field, and so on. "general" is used for open applications.
 */
export const roleFormConfig: Record<RoleKind | "general", RoleFormConfig> = {
  developer: {
    skillsLabel: "Technical skills",
    skillOptions: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "PostgreSQL", "MySQL", "MongoDB", "REST APIs", "GraphQL", "Tailwind CSS", "Python", "PHP"],
    toolsLabel: "Tools & platforms",
    toolOptions: ["Git / GitHub", "VS Code", "Docker", "Postman", "Prisma", "Vercel", "AWS", "Firebase", "Jest", "Playwright", "Figma"],
    links: [{ key: "github", label: "GitHub profile", placeholder: "https://github.com/your-username", required: false }],
    projectsHint: "Describe 1–2 applications you built: what they did, your part in them and the tech stack used.",
  },
  video: {
    skillsLabel: "Video skills",
    skillOptions: ["Short-form reels", "Long-form editing", "Colour grading", "Sound design", "Motion graphics", "Subtitles & captions", "Storytelling", "Thumbnail design", "Camera operation"],
    toolsLabel: "Editing software",
    toolOptions: ["Adobe Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "After Effects", "CapCut", "Audition", "Photoshop"],
    links: [{ key: "showreel", label: "Showreel link", placeholder: "YouTube, Vimeo or Google Drive link to your showreel", required: true }],
    projectsHint: "Describe videos you edited: the format (reel, ad, corporate film…), the client or purpose, and the result.",
  },
  design: {
    skillsLabel: "Design skills",
    skillOptions: ["Brand identity", "Logo design", "Social media creatives", "Print design", "Typography", "Illustration", "UI design", "Packaging", "Presentation design"],
    toolsLabel: "Design software",
    toolOptions: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Adobe InDesign", "After Effects", "Canva", "CorelDRAW", "Procreate"],
    links: [{ key: "designPortfolio", label: "Design portfolio link", placeholder: "Behance, Dribbble or portfolio website", required: true }],
    projectsHint: "Describe 1–2 design projects: the brief, your concept and what you delivered.",
  },
  content: {
    skillsLabel: "Content skills",
    skillOptions: ["Script writing", "Copywriting", "Blog & SEO writing", "Social captions", "On-camera presenting", "Content planning", "Research", "Video shooting", "Tamil content"],
    toolsLabel: "Tools & platforms",
    toolOptions: ["Instagram", "YouTube", "LinkedIn", "WordPress", "Canva", "CapCut", "Google Analytics", "Meta Business Suite", "ChatGPT / AI tools"],
    links: [{ key: "publishedWork", label: "Published work link", placeholder: "A blog, channel or page with your content", required: true }],
    projectsHint: "Describe content you created: the brand, the format and the results (reach, engagement, leads…).",
  },
  social: {
    skillsLabel: "Social media skills",
    skillOptions: ["Content calendars", "Community management", "Meta Ads", "LinkedIn Ads", "Google Ads", "Analytics & reporting", "Influencer collaboration", "Copywriting", "Client communication"],
    toolsLabel: "Platforms & tools",
    toolOptions: ["Meta Business Suite", "Meta Ads Manager", "LinkedIn Campaign Manager", "Buffer", "Hootsuite", "Later", "Canva", "Google Analytics"],
    links: [{ key: "managedAccounts", label: "Accounts you've managed", placeholder: "Links to brand pages you managed or grew", required: true }],
    projectsHint: "Describe accounts or campaigns you managed: the brand, your strategy and the results.",
  },
  intern: {
    skillsLabel: "Skills in your chosen track",
    skillOptions: ["HTML & CSS", "JavaScript", "React", "Video editing", "Graphic design", "Social media", "Content writing", "Photography"],
    toolsLabel: "Tools you've used",
    toolOptions: ["VS Code", "Git / GitHub", "Premiere Pro", "CapCut", "Photoshop", "Canva", "Figma", "Instagram"],
    links: [{ key: "projectWork", label: "Project or portfolio link", placeholder: "GitHub, Behance, a page or a Drive link with your work", required: false }],
    projectsHint: "Describe college, personal or freelance projects: what you made and what you learned.",
  },
  general: {
    skillsLabel: "Key skills",
    skillOptions: ["Web development", "Video editing", "Graphic design", "Content writing", "Social media", "Digital marketing", "UI/UX design", "Project coordination"],
    toolsLabel: "Tools & software",
    toolOptions: ["VS Code", "Git / GitHub", "Figma", "Photoshop", "Premiere Pro", "Canva", "Meta Business Suite", "Google Analytics"],
    links: [],
    projectsHint: "Describe your most relevant projects and your part in them.",
  },
};

export const internshipTracks = ["Developer Intern", "Video Editor Intern", "Graphic Designer Intern", "Social Media Intern"] as const;
