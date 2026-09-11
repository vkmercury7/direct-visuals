import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import factualLogo from "@/assets/factual-logo.png";
import { CardApplicationForm } from "@/components/site/CardApplicationForm";

export const Route = createFileRoute("/cartao")({
  head: () => ({ meta: [
    { title: "Solicite seu Cartão Factual" },
    { name: "description", content: "Envie seus dados para análise da solicitação do Cartão de Crédito Factual." },
    { property: "og:title", content: "Solicite seu Cartão Factual" },
    { property: "og:description", content: "Solicitação online do Cartão de Crédito Factual, sujeita à análise." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CardPage,
});

function CardPage() {
  return <main className="min-h-screen bg-secondary px-4 py-6 md:py-10">
    <div className="mx-auto w-full max-w-[600px]">
      <header className="text-center">
        <a href="/" className="inline-flex"><img src={factualLogo} alt="FACTUAL FINANCEIRA" className="h-auto w-auto max-w-[190px] object-contain md:max-w-[230px]" /></a>
        <div className="mt-5 flex items-center justify-center gap-2 text-brand-orange"><CreditCard className="h-5 w-5" aria-hidden="true" /><span className="text-xs font-bold uppercase">Cartão de crédito</span></div>
        <h1 className="mt-2 font-display text-[27px] font-bold italic uppercase leading-tight text-brand-blue-dark md:text-4xl">Solicite seu Cartão Factual</h1>
        <p className="mt-2 text-sm text-brand-blue md:text-base">Preencha seus dados para continuar sua solicitação.</p>
        <p className="mt-1 text-xs font-semibold uppercase text-muted-foreground">Sujeito à análise.</p>
      </header>
      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-soft"><CardApplicationForm /></section>
    </div>
  </main>;
}