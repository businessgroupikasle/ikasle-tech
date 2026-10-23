import { LegalPage } from "@/components/legal/LegalPage";
import { termsAndConditions } from "@/content/legal/terms";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms for using the IKASLE Technologies website.",
  path: "/terms-and-conditions",
  // Draft: kept out of search results until approved.
  noindex: termsAndConditions.status === "draft",
});

export default function TermsPage() {
  return <LegalPage doc={termsAndConditions} />;
}
