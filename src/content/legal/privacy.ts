import type { LegalDocument } from "./types";

/**
 * PRIVACY POLICY — EDITABLE DRAFT.
 * Statements without a `review` note describe what the website code actually does today (contact form,
 * API route, optional analytics). Anything that depends on business decisions, hosting or law is flagged
 * with `review`. Have it reviewed (including by a legal adviser) before setting status to "approved".
 */
export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  intro:
    "This policy explains what information the IKASLE Technologies website collects, why, and how it is handled. It describes this website only.",
  status: "draft",
  effectiveDate: null,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      body: [
        {
          p: [
            "IKASLE Technologies (“we”, “us”) operates this website. We aim to collect only the information needed to respond to people who contact us.",
          ],
        },
      ],
      review: "Add the legal name of the business and its registered location, and confirm who is responsible for personal data.",
    },
    {
      id: "information-collected",
      title: "Information collected",
      body: [
        { p: ["When you send an enquiry through the ", { text: "contact form", href: "/contact" }, ", we receive the information you enter:"] },
        {
          list: [
            ["Your full name and email address (required)"],
            ["Phone number, company name and budget range (optional)"],
            ["Project type and a description of your project"],
          ],
        },
        {
          p: [
            "To protect the form from spam, it also includes a hidden field that people do not fill in and records when the form was opened. Your IP address is used briefly to limit how many messages can be sent from one connection (see Data security).",
          ],
        },
        { p: ["You can browse the website without providing any personal information."] },
      ],
    },
    {
      id: "how-information-is-used",
      title: "How information is used",
      body: [
        { p: ["Information from the contact form is used to read and reply to your enquiry and to discuss a possible project with you."] },
      ],
      review: "Confirm whether enquiry details are used for anything else (for example, follow-up or marketing emails). If so, describe it here.",
    },
    {
      id: "cookies-and-analytics",
      title: "Cookies and analytics",
      body: [
        {
          p: [
            "When Google Analytics 4 is configured, this website uses Google Analytics cookies to measure visitors, page views, traffic sources and interactions such as contact link clicks and successful enquiries. Contact form contents and assistant conversations are not included in our custom analytics events. Advertising personalization and Google signals are disabled. Fonts and images are served from this website.",
          ],
        },
      ],
      review: "Confirm analytics configuration, retention settings and any consent requirements for the regions served before approving this policy.",
    },
    {
      id: "third-party-services",
      title: "Third-party services",
      body: [
        {
          list: [
            [
              { strong: "Email delivery:" },
              " when online enquiries are enabled, the contents of the contact form are sent to our inbox by email through Resend, an email delivery provider.",
            ],
            [{ strong: "Hosting:" }, " the website runs on a hosting provider whose servers process requests to the site."],
            [
              { strong: "AI assistant:" },
              " when the AI service is configured, messages entered in the assistant are sent to the configured AI provider to generate a response. The website does not send assistant conversations to analytics by default. Do not enter sensitive information in the assistant.",
            ],
            [{ strong: "External links:" }, " some pages link to other websites (for example, projects we have built). Their privacy practices are their own."],
          ],
        },
      ],
      review: "Name the hosting provider and describe what its server logs contain and how long they are kept. Confirm the email inbox provider used to receive enquiries.",
    },
    {
      id: "data-security",
      title: "Data security",
      body: [
        {
          p: [
            "The contact form is protected by technical measures in the website: submissions are validated on the server, cross-site submissions are rejected, message size is limited, and repeated submissions from the same connection are rate-limited using the IP address held temporarily in server memory.",
          ],
        },
        { p: ["The website does not store contact form submissions in a database; enquiries are delivered by email."] },
      ],
      review: "Confirm HTTPS on the production domain and describe how the inbox that receives enquiries is secured and who can access it.",
    },
    {
      id: "data-retention",
      title: "Data retention",
      body: [{ p: ["Enquiry emails are kept for as long as needed to respond to and follow up on the enquiry."] }],
      review: "Decide and state a specific retention period for enquiry emails and any related records.",
    },
    {
      id: "user-rights",
      title: "Your rights",
      body: [{ p: ["You can ask us what personal information we hold about you, and ask us to correct or delete it."] }],
      review: "Have a legal adviser confirm which data-protection laws apply and list the rights and response times they require. Do not claim compliance with any specific law until this is confirmed.",
    },
    {
      id: "contact-information",
      title: "Contact information",
      body: [{ p: ["For any privacy question or request, contact us through the ", { text: "contact page", href: "/contact" }, "."] }],
      review: "Add a dedicated email address for privacy requests once one is approved.",
    },
    {
      id: "policy-updates",
      title: "Policy updates",
      body: [{ p: ["If this policy changes, the updated version will be published on this page with its effective date."] }],
    },
  ],
};
