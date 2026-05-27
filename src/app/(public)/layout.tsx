import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickySOS } from "@/components/layout/StickySOS";
import { SkipLink } from "@/components/layout/SkipLink";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        className="flex-1 focus:outline-none"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
      <StickySOS />
    </>
  );
}
