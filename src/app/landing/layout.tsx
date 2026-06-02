/**
 * Landing-page layout — з повноцінним Header і StickySOS, без Footer.
 * Успадковує root layout (шрифти, Toaster, CookieBanner, GTM, GA4, Meta Pixel).
 */
import { Header } from "@/components/layout/Header";
import { StickySOS } from "@/components/layout/StickySOS";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <StickySOS />
    </>
  );
}
