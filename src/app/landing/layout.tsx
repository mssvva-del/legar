/**
 * Landing-page layout — без Header і Footer.
 * Успадковує root layout (шрифти, Toaster, CookieBanner, GTM, GA4, Meta Pixel).
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
