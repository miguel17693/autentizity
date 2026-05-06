import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PreviewToggle from "@/components/ui/PreviewToggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PreviewToggle />
    </>
  );
}
