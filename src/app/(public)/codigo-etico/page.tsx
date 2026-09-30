import type { Metadata } from "next";
import ComplianceDocument from "@/components/ui/ComplianceDocument";
import { codeOfEthics } from "@/lib/compliance-content";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Código Ético",
  description: codeOfEthics.description,
  alternates: { canonical: "https://autentizity.org/codigo-etico" },
};

export default function CodeOfEthicsPage() {
  return <ComplianceDocument document={codeOfEthics} />;
}
