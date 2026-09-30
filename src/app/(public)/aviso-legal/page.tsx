import type { Metadata } from "next";
import ComplianceDocument from "@/components/ui/ComplianceDocument";
import { legalNotice } from "@/lib/compliance-content";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: legalNotice.description,
  alternates: { canonical: "https://autentizity.org/aviso-legal" },
};

export default function LegalNoticePage() {
  return <ComplianceDocument document={legalNotice} />;
}
