import type { Metadata } from "next";
import ComplianceDocument from "@/components/ui/ComplianceDocument";
import { cookiePolicy } from "@/lib/compliance-content";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: cookiePolicy.description,
  alternates: { canonical: "https://autentizity.org/cookies" },
};

export default function CookiesPage() {
  return <ComplianceDocument document={cookiePolicy} />;
}
