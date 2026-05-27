import type { Metadata } from "next";
import { StubPage } from "@/components/shared/StubPage";

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Аналітика, новини законодавства, реальні кейси, гайди по ТЦК/ВЛК/СЗЧ від адвокатів-партнерів LEGAR.",
};

export default function Page() {
  return <StubPage title="Блог LEGAR" />;
}
