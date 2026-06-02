/**
 * Landing-page layout — без Header і Footer.
 * Успадковує root layout (шрифти, Toaster, CookieBanner, GTM, GA4, Meta Pixel).
 * Містить плаваючу кнопку SOS (телефон + месенджери).
 */
import { StickySOS } from "@/components/layout/StickySOS";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StickySOS />
    </>
  );
}
