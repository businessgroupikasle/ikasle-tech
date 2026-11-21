/**
 * Open positions on /careers and /careers/[slug]. Each job's slug is its detail-page URL.
 *
 * `roleKind` decides which role-specific questions the application form shows (see lib/careers/form-config.ts).
 * Everything a candidate reads about a role lives here, so HR can edit openings without touching components.
 * Benefits and location are written to be accurate for every opening — check them before adding new perks.
 */

export type RoleKind = "developer" | "video" | "design" | "content" | "social" | "intern";
export type JobCategory = "Development" | "Creative" | "Marketing" | "Internship";
export type JobIcon = "code" | "video" | "palette" | "pen" | "megaphone" | "graduation";

export type Job = {
  slug: string;
  title: string;
  department: string;
  experience: string;
  employmentType: "Full-Time" | "Internship";
  category: JobCategory;
  roleKind: RoleKind;
  icon: JobIcon;
  /** One or two sentences for the job card. */
  summary: string;
  /** Opening paragraph on the detail page. */
  intro: string;
  about: string[];
  responsibilities: string[];
  skills: string[];
  preferred: string[];
  education: string[];
  expectations: string[];
  /** Role-specific extras, shown after the benefits every role shares. */
  offerExtras: string[];
  /** What the assessment step looks like for this role. */
  assessment: string;
  /** Internship only: the tracks a candidate can choose. */
  tracks?: { title: string; text: string }[];
};

// Non-breaking hyphen (U+2011) keeps "On‑site" on one line in narrow cards.
export const jobLocation = "Coimbatore, Tamil Nadu · On‑site";

export const jobCategories: JobCategory[] = ["Development", "Creative", "Marketing", "Internship"];

/** Benefits every role shares (shown before each role's own extras). */
export const sharedOffer = [
  "Work on live client projects across industries, not practice exercises",
  "Regular feedback and guidance from experienced team members",
  "A collaborative office at Peelamedu, Coimbatore",
  "Room to learn new tools and technologies on the job",
];

/** The hiring steps, in order. Each job adds its own note to the assessment step. */
export const hiringSteps = [
  { title: "Application Submission", text: "Apply online with your resume, portfolio and a few details about yourself." },
  { title: "Resume Screening", text: "Our team reviews your experience, skills and work samples against the role." },
  { title: "Initial Interview", text: "A conversation about your background, interests and what you're looking for." },
  { title: "Technical / Creative Assessment", text: "A practical task that reflects the real work of the role." },
  { title: "Final Interview & Selection", text: "Meet the team leads, discuss the role in depth and receive our decision." },
];

export const jobs: Job[] = [
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    department: "Development",
    experience: "1+ Year",
    employmentType: "Full-Time",
    category: "Development",
    roleKind: "developer",
    icon: "code",
    summary: "Build and ship web applications end to end — React and Next.js interfaces, Node.js APIs and PostgreSQL databases — for real client projects.",
    intro:
      "We're looking for a Full Stack Developer who enjoys owning a feature from the database to the browser. You'll build business applications, dashboards and platforms that our clients use every day.",
    about: [
      "As a Full Stack Developer at IKASLÉ Technologies, you'll work on custom software, web applications and ERP systems for businesses across industries. One week you may be designing an API for an inventory module; the next, building the dashboard that shows its data.",
      "You'll work closely with designers, project leads and other developers, turning requirements and Figma designs into reliable, maintainable software — and you'll see your work go live with real users.",
    ],
    responsibilities: [
      "Build responsive, accessible interfaces with React, Next.js and TypeScript",
      "Design and develop REST APIs and server-side logic with Node.js",
      "Model data and write efficient queries in PostgreSQL",
      "Integrate third-party services such as payment gateways, email and messaging APIs",
      "Turn Figma designs into reusable, well-structured components",
      "Write clean code, take part in code reviews and act on feedback",
      "Investigate and fix bugs, and improve application performance",
      "Document features and support testing before each release",
    ],
    skills: [
      "JavaScript and TypeScript",
      "React and Next.js",
      "Node.js with Express or a similar framework",
      "SQL and PostgreSQL",
      "REST API design and authentication",
      "HTML, CSS and Tailwind CSS",
      "Git and collaborative workflows",
      "Structured debugging and problem solving",
    ],
    preferred: [
      "At least one web application you helped build that is live in production",
      "Experience with an ORM such as Prisma",
      "Basic Docker and CI/CD knowledge",
      "Deploying to platforms such as Vercel or AWS",
      "Automated testing with Jest or Playwright",
      "Experience with dashboards, admin panels or ERP-style systems",
    ],
    education: [
      "Bachelor's degree in Computer Science, IT or a related field",
      "Or equivalent practical experience backed by a strong set of projects",
    ],
    expectations: [
      "Take ownership of your features, from first commit to release",
      "Share progress and blockers early, and estimate tasks honestly",
      "Write code your teammates can read and maintain",
      "Keep learning — new libraries, patterns and better ways of working",
    ],
    offerExtras: ["Exposure to the full stack: frontend, backend, databases and deployment", "Code reviews that help you grow as an engineer"],
    assessment: "A short practical coding task — a small full-stack feature — followed by a walkthrough of your code and decisions.",
  },
  {
    slug: "video-editor",
    title: "Video Editor",
    department: "Video Production",
    experience: "1+ Year",
    employmentType: "Full-Time",
    category: "Creative",
    roleKind: "video",
    icon: "video",
    summary: "Edit engaging videos for brands — reels, ads, product films and corporate videos — with strong pacing, motion graphics and sound.",
    intro:
      "We're looking for a Video Editor who can turn raw footage into stories people actually watch. You'll edit everything from 15-second reels to longer brand and corporate films.",
    about: [
      "You'll be part of our video production team, editing content for client brands and for IKASLÉ's own channels. The work spans social-first reels and shorts, product videos, ad creatives, event highlights and corporate films.",
      "You'll collaborate with content creators, designers and social media managers from concept to final export, making sure every video fits its platform, its audience and the brand.",
    ],
    responsibilities: [
      "Edit raw footage into polished short-form and long-form videos",
      "Create reels and shorts optimised for each platform's format and pace",
      "Colour-correct and grade footage for a consistent look",
      "Handle sound design, music selection and voice-over sync",
      "Add motion graphics, titles, lower thirds and subtitles",
      "Organise project files, footage and asset libraries",
      "Work with content and social teams on concepts and scripts",
      "Deliver exports in the right formats and aspect ratios, on schedule",
    ],
    skills: [
      "Adobe Premiere Pro, DaVinci Resolve or Final Cut Pro",
      "Working knowledge of After Effects",
      "Colour correction and grading",
      "Audio editing and mixing",
      "Storytelling, pacing and rhythm",
      "Platform specs: aspect ratios, codecs and export settings",
      "Awareness of current social video trends",
    ],
    preferred: [
      "Motion graphics templates and animated typography",
      "On-set experience with cameras, lighting or audio",
      "Designing thumbnails and cover frames",
      "Editing for agency or brand clients",
      "Quick social edits in CapCut or similar tools",
    ],
    education: [
      "Degree or diploma in Visual Communication, Media, Film or a related field",
      "Or equivalent experience shown through a strong showreel",
    ],
    expectations: [
      "A showreel or portfolio of recent work",
      "Reliable turnaround on tight timelines",
      "Openness to feedback and multiple revision rounds",
      "Keeping each brand's visual style consistent",
    ],
    offerExtras: ["A steady variety of formats — reels, ads, product and corporate films", "Creative input from concept stage, not just the edit"],
    assessment: "An editing task using footage we provide — for example a 30–45 second reel — to see your pacing, cuts, sound and finishing.",
  },
  {
    slug: "graphic-designer",
    title: "Graphic Designer",
    department: "Creative Design",
    experience: "1+ Year",
    employmentType: "Full-Time",
    category: "Creative",
    roleKind: "design",
    icon: "palette",
    summary: "Design brand identities, social creatives, marketing collateral and UI visuals that are clear, consistent and unmistakably on-brand.",
    intro:
      "We're looking for a Graphic Designer with a strong eye for layout, typography and colour. You'll shape how our clients' brands look across social media, print and digital products.",
    about: [
      "You'll design for a wide range of clients — from new brands needing an identity to established businesses running campaigns. Your work will appear on social media, websites, packaging, brochures and presentations.",
      "You'll work alongside developers, content creators and social media managers, so your designs need to be beautiful and practical: easy to adapt, build and use.",
    ],
    responsibilities: [
      "Design social media creatives and campaign assets",
      "Create brand identities, logos and brand guidelines",
      "Produce marketing collateral: brochures, flyers, banners and presentations",
      "Design website and app visuals with the development team",
      "Adapt designs across formats, sizes and platforms",
      "Keep brand usage consistent and design files well organised",
      "Prepare print-ready and web-optimised exports",
      "Present concepts clearly and refine them based on feedback",
    ],
    skills: [
      "Adobe Photoshop and Illustrator",
      "Figma",
      "Typography, colour theory and layout",
      "Working within and building brand guidelines",
      "Print and digital specifications",
      "Developing creative concepts from a brief",
    ],
    preferred: [
      "Adobe InDesign for multi-page layouts",
      "Basic motion design in After Effects or Canva",
      "UI design for websites or apps",
      "Illustration skills",
      "Agency or multi-client experience",
    ],
    education: [
      "Degree or diploma in Graphic Design, Fine Arts, Visual Communication or a related field",
      "Or equivalent experience shown through a strong portfolio",
    ],
    expectations: [
      "A portfolio that shows your process, not just final outputs",
      "Attention to detail in spacing, alignment and typography",
      "Comfort handling several projects and revision cycles",
      "Explaining the reasoning behind your design choices",
    ],
    offerExtras: ["Projects across branding, print, social and digital products", "Collaboration with developers to see your designs built"],
    assessment: "A short design brief — for example a small social media campaign set — to see your concept, layout and execution.",
  },
  {
    slug: "content-creator",
    title: "Content Creator",
    department: "Content & Marketing",
    experience: "2+ Years",
    employmentType: "Full-Time",
    category: "Marketing",
    roleKind: "content",
    icon: "pen",
    summary: "Plan and produce content — scripts, reels, blogs and campaign copy — that tells our clients' stories and grows their engagement.",
    intro:
      "We're looking for a Content Creator who can find the story in any brand and tell it well — in a script, a caption, a blog post or on camera.",
    about: [
      "You'll create content for client brands and for IKASLÉ Technologies, from social media series and video scripts to website copy and long-form articles. Some clients are consumer brands; others are technology and B2B businesses that need complex ideas explained simply.",
      "You'll work with video editors, designers and social media managers, turning ideas into content that is planned, produced and measured.",
    ],
    responsibilities: [
      "Develop content ideas and calendars aligned with brand and campaign goals",
      "Write scripts for reels, explainer videos and ads",
      "Write website copy, blogs, SEO-friendly articles and social captions",
      "Present on camera or coordinate shoots when the content calls for it",
      "Research trends, audiences and competitors for fresh angles",
      "Brief and collaborate with designers, editors and social managers",
      "Repurpose content across platforms and formats",
      "Track content performance and refine based on what works",
    ],
    skills: [
      "Excellent written and spoken English (Tamil is a plus)",
      "Storytelling and script writing",
      "Content formats for Instagram, YouTube and LinkedIn",
      "Basic SEO for written content",
      "Research and fact-checking",
      "Content planning and calendars",
      "Basic phone shooting and editing",
    ],
    preferred: [
      "Confidence presenting on camera",
      "Experience writing for technology or B2B brands",
      "Canva or CapCut for quick content",
      "Analytics in Meta Business Suite, YouTube Studio or Google Analytics",
      "Published work with measurable results",
    ],
    education: ["Degree in Mass Communication, Journalism, English, Marketing or a related field"],
    expectations: [
      "A portfolio of published content across formats",
      "Original ideas, not recycled templates",
      "Meeting content deadlines consistently",
      "Using performance data to improve your next piece",
    ],
    offerExtras: ["Writing for consumer, technology and B2B brands", "A team of editors and designers to bring your ideas to life"],
    assessment: "A content task: a short script and caption set for a sample brand brief, followed by a discussion of your ideas.",
  },
  {
    slug: "social-media-manager",
    title: "Social Media Manager",
    department: "Digital Marketing",
    experience: "1+ Year",
    employmentType: "Full-Time",
    category: "Marketing",
    roleKind: "social",
    icon: "megaphone",
    summary: "Own social media strategy and execution for client brands — planning, publishing, community management, paid campaigns and reporting.",
    intro:
      "We're looking for a Social Media Manager who can grow brands online with a clear plan, consistent execution and numbers to show for it.",
    about: [
      "You'll manage social media for several client brands, owning everything from monthly strategy and content calendars to publishing, community management and paid campaigns.",
      "You'll be the link between clients and our creative team — briefing designers, editors and content creators, and reporting back to clients on what's working and what's next.",
    ],
    responsibilities: [
      "Build platform-wise strategies and monthly content calendars",
      "Schedule and publish across Instagram, Facebook, LinkedIn, YouTube and X",
      "Manage comments and messages promptly and in the brand's voice",
      "Plan and run paid campaigns on Meta and LinkedIn within budget",
      "Track analytics and prepare monthly reports with clear insights",
      "Coordinate creatives with designers, editors and content creators",
      "Follow trends, algorithm changes and competitor activity",
      "Discuss performance and upcoming plans with clients",
    ],
    skills: [
      "In-depth knowledge of the major social platforms",
      "Meta Business Suite and Ads Manager",
      "Scheduling tools such as Buffer, Hootsuite or Later",
      "Social analytics and reporting",
      "Copywriting for social media",
      "Campaign planning and budgeting",
      "Managing several brands at once",
    ],
    preferred: [
      "Google Ads basics",
      "Influencer collaborations",
      "Social listening tools",
      "Agency experience",
      "Certifications such as Meta Blueprint or HubSpot",
    ],
    education: ["Degree in Marketing, Mass Communication, Business or a related field"],
    expectations: [
      "Accounts you've grown, with numbers to back it up",
      "Organised, deadline-driven planning",
      "Clear and confident client communication",
      "Decisions guided by data, not guesswork",
    ],
    offerExtras: ["Brands across industries to plan, grow and report on", "Hands-on experience with paid campaigns and budgets"],
    assessment: "A short strategy exercise: a one-month content and campaign plan for a sample brand.",
  },
  {
    slug: "internships",
    title: "Internships",
    department: "Multiple Departments",
    experience: "Freshers / Students",
    employmentType: "Internship",
    category: "Internship",
    roleKind: "intern",
    icon: "graduation",
    summary: "Learn by doing — work on live projects with mentors in development, video editing, graphic design or social media.",
    intro:
      "Our internships are for students and recent graduates who want real experience, not just a certificate. You'll work on live projects with a mentor from the team.",
    about: [
      "Choose a track — development, video editing, graphic design or social media — and spend your internship contributing to real client work under the guidance of an experienced team member.",
      "You'll learn the tools and workflows professionals use every day, receive regular feedback, and finish with work you can add to your portfolio.",
    ],
    tracks: [
      { title: "Developer Intern", text: "Build features for web applications with HTML, CSS, JavaScript and React." },
      { title: "Video Editor Intern", text: "Edit reels, shorts and brand videos alongside our video team." },
      { title: "Graphic Designer Intern", text: "Design social creatives and marketing assets for client brands." },
      { title: "Social Media Intern", text: "Plan, publish and track content across client social channels." },
    ],
    responsibilities: [
      "Assist the team on live client projects in your track",
      "Complete assigned tasks and learning goals with your mentor",
      "Take part in reviews, team meetings and planning sessions",
      "Document your work and build your portfolio as you go",
      "Research tools, techniques and trends in your field",
      "Present what you've built at the end of your internship",
    ],
    skills: [
      "Basic knowledge in your chosen track",
      "Developers: HTML, CSS and JavaScript",
      "Video editors: Premiere Pro, CapCut or similar",
      "Designers: Canva, Photoshop or Figma",
      "Social media: familiarity with the major platforms",
      "Willingness to learn, ask questions and take feedback",
    ],
    preferred: [
      "College or personal projects you can show",
      "A GitHub, Behance or content portfolio",
      "Any prior internship or freelance work",
    ],
    education: ["Students in their final year, or recent graduates", "Any relevant UG, PG or diploma programme"],
    expectations: [
      "Commitment for the full internship period",
      "Showing up consistently and on time",
      "Asking questions and acting on feedback",
      "Curiosity and initiative in your work",
    ],
    offerExtras: ["A dedicated mentor from your track", "Portfolio-ready work from live projects"],
    assessment: "A short task in your chosen track, suited to your level, followed by a conversation with your future mentor.",
  },
];

export const getJob = (slug: string) => jobs.find((job) => job.slug === slug);
