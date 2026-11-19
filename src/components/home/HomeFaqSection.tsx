import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqItem } from "@/components/faq/FaqAccordion";
import { Reveal } from "@/components/animations/Reveal";

const HOME_FAQS: FaqItem[] = [
  {
    id: "what-we-do",
    question: "What does IKASLÉ Technologies do?",
    answer:
      "IKASLÉ Technologies is a software engineering company based in Coimbatore, India. We provide custom software development, website development, web application development, mobile app development, ERP solutions, AI and automation, and UI/UX and product design services.",
  },
  {
    id: "location",
    question: "Where is IKASLÉ Technologies located?",
    answer:
      "IKASLÉ Technologies is based in Coimbatore, Tamil Nadu, India. Our team works from India and welcomes project enquiries from businesses in international markets.",
  },
  {
    id: "international-clients",
    question: "Does IKASLÉ Technologies work with international clients?",
    answer:
      "Our portfolio includes website projects from the United Kingdom and the United Arab Emirates. We are also open to working with businesses from other international markets.",
  },
  {
    id: "uae-saudi",
    question: "Can businesses in the UAE and Saudi Arabia work with IKASLÉ Technologies?",
    answer:
      "Yes. Businesses in the UAE and Saudi Arabia can contact IKASLÉ Technologies for software development, website development, enterprise applications, SaaS platforms and business automation enquiries.",
  },
  {
    id: "business-types",
    question: "What types of businesses do you work with?",
    answer:
      "We work with startups, small and medium-sized businesses (SMEs), and enterprises looking to build digital products, modernize existing systems or improve business operations through technology.",
  },
  {
    id: "custom-requirements",
    question: "Can you develop custom software based on our business requirements?",
    answer:
      "Yes. We develop custom software around specific business workflows, operational requirements, integrations and product goals. The development approach is defined according to each project's scope and technical requirements.",
  },
  {
    id: "saas-web-apps",
    question: "Do you develop SaaS platforms and web applications?",
    answer:
      "Yes. Our services include SaaS platform development, custom web applications, business portals and other browser-based digital products built around business requirements.",
  },
  {
    id: "mobile-apps",
    question: "Can you develop both Android and iOS applications?",
    answer:
      "We provide mobile app development for Android and iOS, focusing on functionality, user experience, integrations and maintainable application architecture.",
  },
  {
    id: "erp-automation",
    question: "Do you provide ERP and business automation solutions?",
    answer:
      "Yes. Our ERP and business automation services focus on connecting business processes such as inventory, sales, purchasing, manufacturing and reporting through integrated software systems.",
  },
  {
    id: "ai-solutions",
    question: "Do you provide AI-powered software development?",
    answer:
      "We provide AI and automation solutions focused on intelligent workflows, business process automation and connecting software systems to improve operational efficiency.",
  },
  {
    id: "maintenance-support",
    question: "Do you provide ongoing maintenance and technical support?",
    answer:
      "We support software beyond initial development through maintenance, monitoring, optimization, enhancements and scaling, based on the agreed engagement scope.",
  },
  {
    id: "start-project",
    question: "How do we start a software development project with IKASLÉ Technologies?",
    answer:
      "Start by sharing your idea, business requirements or project brief through our contact form. Our team can understand your objectives, discuss technical requirements and identify an appropriate development approach.",
  },
];

export function HomeFaqSection() {
  return (
    <section aria-labelledby="home-faq-title" className="relative border-t border-line/60 bg-white pt-20 pb-0 sm:pt-24">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>ANSWERS TO COMMON SOFTWARE DEVELOPMENT QUESTIONS</Eyebrow>

          <h2
            id="home-faq-title"
            className="mt-4 text-balance text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.75rem] leading-[1.15] max-w-3xl"
          >
            Everything You Need to Know Before Building.
          </h2>

          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-[17px]">
            Frequently asked questions about our engineering capabilities, international collaboration and software development process.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl">
          <FaqAccordion items={HOME_FAQS} />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-1.5 font-medium text-accent-strong transition-colors hover:text-accent-hover"
          >
            <span>View all questions &amp; answers</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

