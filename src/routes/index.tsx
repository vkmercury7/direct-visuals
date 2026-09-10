import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteNav } from "@/components/site/SiteNav";
import { HeroBanner } from "@/components/site/HeroBanner";
import { CallToActionSection } from "@/components/site/CallToActionSection";
import { BannerPair } from "@/components/site/BannerPair";
import { StoreLocator } from "@/components/site/StoreLocator";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FACTUAL FINANCEIRA | Soluções de Crédito" },
      {
        name: "description",
        content:
          "Simule seu empréstimo de forma simples e rápida. Crédito pessoal para realizar seus planos com atendimento humano.",
      },
      { property: "og:title", content: "FACTUAL FINANCEIRA | Soluções de Crédito" },
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
      <BannerPair />
      <div className="h-14 bg-background md:h-24" aria-hidden="true" />
      <StoreLocator />
      <div className="h-6 bg-background md:h-10" aria-hidden="true" />
      <SiteFooter />
    </main>
  );
}
