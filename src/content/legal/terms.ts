import type { LegalDocument } from "./types";

/**
 * TERMS & CONDITIONS — EDITABLE DRAFT.
 * General website terms only: no contract terms, warranties or jurisdiction-specific clauses have been
 * invented. Sections flagged with `review` need business and legal approval before status becomes "approved".
 */
export const termsAndConditions: LegalDocument = {
  title: "Terms & Conditions",
  intro: "These terms describe the conditions for using the IKASLE Technologies website. Please read them before using the site.",
  status: "draft",
  effectiveDate: null,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      body: [{ p: ["By using this website you agree to these terms. If you do not agree, please do not use the website."] }],
      review: "Add the legal name of the business that operates the website.",
    },
    {
      id: "website-usage",
      title: "Website usage",
      body: [
        {
          p: [
            "The content on this website is provided for general information about IKASLE Technologies and its services. It may change at any time without notice.",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        {
          p: [
            "Unless stated otherwise, the content of this website — including text, graphics, logos and code samples — belongs to IKASLE Technologies or is used with permission. Do not copy or reuse it without permission, except as allowed by law.",
          ],
        },
        { p: ["Names, logos and screenshots of client projects belong to their respective owners and are shown with their context."] },
      ],
      review: "Confirm permission to display each client project, name and screenshot shown on the website.",
    },
    {
      id: "service-enquiries",
      title: "Service enquiries",
      body: [
        {
          p: [
            "Sending an enquiry through the website does not create a contract or an obligation for either party. Any project is agreed separately in writing, on terms specific to that project.",
          ],
        },
      ],
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      body: [
        {
          p: [
            "The website links to external websites, such as projects we have built. We are not responsible for their content, availability or privacy practices.",
          ],
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: [
        { p: ["When using the website, do not:"] },
        {
          list: [
            ["try to disrupt, overload or gain unauthorised access to the website or its systems;"],
            ["send spam, malicious code or misleading information through the contact form;"],
            ["use the website for any unlawful purpose."],
          ],
        },
      ],
    },
    {
      id: "limitations-and-disclaimers",
      title: "Limitations and disclaimers",
      body: [
        {
          p: [
            "We work to keep the website accurate and available, but it is provided “as is”. Some interface previews are illustrative and are labelled as such. Information on the website is not professional advice for a specific project.",
          ],
        },
      ],
      review: "Have a legal adviser write the limitation-of-liability wording appropriate for the jurisdiction the business operates in.",
    },
    {
      id: "changes-to-terms",
      title: "Changes to these terms",
      body: [{ p: ["We may update these terms. The current version, with its effective date, is always published on this page."] }],
    },
    {
      id: "contact-information",
      title: "Contact information",
      body: [{ p: ["Questions about these terms can be sent through the ", { text: "contact page", href: "/contact" }, "."] }],
      review: "Add the governing law and jurisdiction, and an approved contact email if one should be listed.",
    },
  ],
};
