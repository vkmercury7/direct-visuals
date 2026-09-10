import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteNav } from "@/components/site/SiteNav";
import { HeroBanner } from "@/components/site/HeroBanner";
import { CallToActionSection } from "@/components/site/CallToActionSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Empréstimo rápido e crédito pessoal online" },
      {
        name: "description",
        content:
          "Simule seu empréstimo de forma simples e rápida. Crédito pessoal para realizar seus planos com atendimento humano.",
      },
      { property: "og:title", content: "Empréstimo rápido e crédito pessoal online" },
      {
        property: "og:description",
        content: "Simule seu empréstimo de forma simples e rápida e realize seus planos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <SiteNav />
      <HeroBanner />
      <CallToActionSection />
    </main>
  );
}
