import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/content/legal/privacy";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How the IKASLE Technologies website collects, uses and protects information.",
  path: "/privacy-policy",
  // Draft: kept out of search results until approved.
  noindex: privacyPolicy.status === "draft",
});

export default function PrivacyPolicyPage() {
  return <LegalPage doc={privacyPolicy} />;
}
