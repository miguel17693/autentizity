import { draftMode } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PreviewToggle from "@/components/ui/PreviewToggle";
import FondoSwitch from "@/components/ui/FondoSwitch";
import { FONDO_INLINE_SCRIPT } from "@/lib/fondo";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: FONDO_INLINE_SCRIPT }} />
      <FondoSwitch />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PreviewToggle enabled={isEnabled} />
    </>
  );
}
