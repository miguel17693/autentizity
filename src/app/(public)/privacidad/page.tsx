import type { Metadata } from "next";
import ComplianceDocument from "@/components/ui/ComplianceDocument";
import { privacyPolicy } from "@/lib/compliance-content";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: privacyPolicy.description,
  alternates: { canonical: "https://autentizity.org/privacidad" },
};

export default function PrivacyPage() {
  return <ComplianceDocument document={privacyPolicy} />;
}
