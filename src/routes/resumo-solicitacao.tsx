import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  formatBRL,
  formatarData,
  formatarTaxa,
  lerDadosPessoais,
  lerSimulacao,
  mascararCpf,
  salvarSimulacao,
  type DadosPessoais,
  type SimulacaoEscolhida,
} from "@/lib/loan-flow";

export const Route = createFileRoute("/resumo-solicitacao")({
  head: () => ({
    meta: [
      { title: "Confira sua solicitação — resumo da simulação" },
      {
        name: "description",
        content:
          "Revise seus dados pessoais e as condições selecionadas antes de continuar com sua solicitação.",
      },
      { property: "og:title", content: "Confira sua solicitação — resumo da simulação" },
      {
        property: "og:description",
        content: "Revise seus dados e as condições selecionadas antes de continuar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResumoSolicitacao,
});

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="italic text-muted-foreground">{rotulo}</dt>
      <dd className="font-display font-bold italic text-brand-blue-dark">{valor}</dd>
    </div>
  );
}

function ResumoSolicitacao() {
  const navigate = useNavigate();
  const [dados, setDados] = useState<DadosPessoais | null>(null);
  const [sim, setSim] = useState<SimulacaoEscolhida | null>(null);

  useEffect(() => {
    const d = lerDadosPessoais();
    const s = lerSimulacao();
    if (!d || !s) {
      navigate({ to: "/" });
      return;
    }
    setDados(d);
    setSim(s);
  }, [navigate]);

  if (!dados || !sim) return <div className="min-h-screen bg-background" />;

  function continuar() {
    if (!dados || !sim) return;
    salvarSimulacao(sim);
    navigate({ to: "/analise-solicitacao" });
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <SiteNav />

      <section className="mx-auto w-full max-w-3xl px-4 pb-14 pt-8 md:px-6 md:pb-20 md:pt-12">
        <div className="text-center">
          <h1 className="font-display text-[30px] font-bold italic uppercase leading-[1.1] text-brand-blue-dark md:text-4xl">
            Confira sua solicitação
          </h1>
          <p className="mt-3 text-[18px] italic leading-[1.3] text-brand-blue md:text-xl">
            Revise seus dados e as condições selecionadas antes de continuar.
          </p>
        </div>

        <section className="mt-7 rounded-xl border border-border bg-card p-5 md:mt-9 md:p-7">
          <h2 className="font-display text-[16px] font-bold italic uppercase tracking-wide text-brand-blue">
            Dados do cliente
          </h2>
          <dl className="mt-4 space-y-3 text-[15px] text-brand-blue-dark md:text-base">
            <Linha rotulo="Nome" valor={dados.nome} />
            <Linha rotulo="CPF" valor={mascararCpf(dados.cpf)} />
            <Linha rotulo="E-mail" valor={dados.email} />
            <Linha rotulo="Data de nascimento" valor={formatarData(dados.nascimento)} />
          </dl>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft md:mt-8 md:p-7">
          <h2 className="font-display text-[16px] font-bold italic uppercase tracking-wide text-brand-orange">
            Resumo do empréstimo
          </h2>
          <dl className="mt-4 space-y-3 text-[15px] text-brand-blue-dark md:text-base">
            <Linha rotulo="Valor solicitado" valor={formatBRL(sim.valorSolicitado)} />
            <Linha rotulo="Parcelamento" valor={`${sim.parcelas} parcelas`} />
            <Linha rotulo="Valor estimado da parcela" valor={formatBRL(sim.valorParcela)} />
            <Linha rotulo="Taxa utilizada na simulação" valor={formatarTaxa(sim.taxaMensal)} />
            <Linha rotulo="Total estimado" valor={formatBRL(sim.totalEstimado)} />
          </dl>
        </section>

        <Button
          type="button"
          onClick={continuar}
          className="mt-8 h-12 w-full rounded-md bg-brand-orange text-base font-bold uppercase italic tracking-wide text-brand-orange-foreground hover:bg-brand-orange/90"
        >
          Continuar <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </section>

      <SiteFooter />
    </main>
  );
}
