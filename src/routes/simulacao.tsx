import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  LOAN_CONFIG,
  clampValor,
  valorValido,
  formatBRL,
  formatarData,
  lerDadosPessoais,
  mascararCpf,
  primeiroNome,
  type DadosPessoais,
} from "@/lib/loan-flow";

export const Route = createFileRoute("/simulacao")({
  head: () => ({
    meta: [
      { title: "Simulação de empréstimo — escolha o valor" },
      {
        name: "description",
        content:
          "Escolha o valor que deseja solicitar e continue sua simulação de empréstimo com análise de perfil.",
      },
      { property: "og:title", content: "Simulação de empréstimo — escolha o valor" },
      {
        property: "og:description",
        content: "Escolha o valor desejado e continue sua solicitação de empréstimo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulacao,
});

function DadoItem({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-[12px] uppercase italic tracking-wide text-muted-foreground">{rotulo}</p>
      <p className="text-[16px] font-semibold text-brand-blue-dark md:text-lg">{valor}</p>
    </div>
  );
}

function Simulacao() {
  const navigate = useNavigate();
  const [dados, setDados] = useState<DadosPessoais | null>(null);
  const [pronto, setPronto] = useState(false);
  const [valor, setValor] = useState<number>(LOAN_CONFIG.initial);

  useEffect(() => {
    const d = lerDadosPessoais();
    if (!d) {
      navigate({ to: "/" });
      return;
    }
    setDados(d);
    setPronto(true);
  }, [navigate]);

  if (!pronto || !dados) {
    return <div className="min-h-screen bg-background" />;
  }

  function continuar() {
    const valorDesejado = clampValor(valor);
    if (!valorValido(valorDesejado)) {
      setValor(LOAN_CONFIG.initial);
      return;
    }
    salvarValorDesejado(valorDesejado);
    navigate({ to: "/parcelamento" });
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <SiteNav />

      <section className="mx-auto w-full max-w-3xl px-4 pb-14 pt-8 md:px-6 md:pb-20 md:pt-12">
        <div className="text-center">
          <h1 className="font-display text-[30px] font-bold italic uppercase leading-[1.1] text-brand-blue-dark md:text-4xl">
            Olá, {primeiroNome(dados.nome)}!
          </h1>
          <p className="mt-3 text-[18px] italic leading-[1.3] text-brand-blue md:text-xl">
            Agora escolha o valor que deseja solicitar.
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-border bg-card p-5 md:mt-10 md:p-7">
          <h2 className="font-display text-[16px] font-bold italic uppercase tracking-wide text-brand-blue">
            Seus dados
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <DadoItem rotulo="Nome" valor={dados.nome} />
            <DadoItem rotulo="CPF" valor={mascararCpf(dados.cpf)} />
            <DadoItem rotulo="Data de nascimento" valor={formatarData(dados.nascimento)} />
            <DadoItem rotulo="E-mail" valor={dados.email} />
          </div>
        </section>

        <div className="mt-10 text-center md:mt-14">
          <h2 className="font-display text-[25px] font-bold italic uppercase leading-[1.1] text-brand-orange md:text-3xl">
            Quanto você deseja solicitar?
          </h2>
          <p className="mt-3 text-[17px] italic leading-[1.4] text-brand-blue md:text-xl">
            Escolha um valor para continuarmos com sua simulação.
          </p>
        </div>

        <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft md:mt-8 md:p-8">
          <p className="text-center text-[12px] uppercase italic tracking-[0.18em] text-muted-foreground">
            Valor desejado
          </p>
          <p className="mt-2 text-center font-display text-[38px] font-bold italic leading-none text-brand-blue-dark md:text-5xl">
            {formatBRL(valor)}
          </p>

          <div className="mt-7">
            <Slider
              value={[valor]}
              min={LOAN_CONFIG.min}
              max={LOAN_CONFIG.max}
              step={LOAN_CONFIG.step}
              onValueChange={([v]) => setValor(v ?? LOAN_CONFIG.initial)}
              aria-label="Valor desejado"
            />
            <div className="mt-2 flex justify-between text-[12px] italic text-muted-foreground">
              <span>{formatBRL(LOAN_CONFIG.min)}</span>
              <span>{formatBRL(LOAN_CONFIG.max)}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LOAN_CONFIG.quickValues.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setValor(v)}
                className={`h-11 rounded-md border text-[15px] font-bold italic transition-colors ${
                  valor === v
                    ? "border-brand-orange bg-brand-orange text-brand-orange-foreground"
                    : "border-border bg-background text-brand-blue-dark hover:border-brand-blue"
                }`}
              >
                {formatBRL(v).replace(",00", "")}
              </button>
            ))}
          </div>
        </section>

        <aside className="mt-6 flex gap-3 rounded-xl border border-border bg-secondary p-4 md:mt-8 md:p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
          <div>
            <h3 className="text-[15px] font-bold italic uppercase text-brand-blue-dark md:text-base">
              Sua solicitação passará por análise
            </h3>
            <p className="mt-1 text-[14px] leading-[1.45] text-brand-blue-dark/80 md:text-[15px]">
              Após continuar, as informações serão analisadas para verificar as opções disponíveis
              para o seu perfil.
            </p>
            <p className="mt-2 text-[13px] italic text-muted-foreground">
              Não há garantia de aprovação ou liberação de crédito.
            </p>
          </div>
        </aside>

        <Button
          type="button"
          onClick={continuar}
          className="mt-8 h-12 w-full rounded-md bg-brand-orange text-base font-bold uppercase italic tracking-wide text-brand-orange-foreground hover:bg-brand-orange/90"
        >
          Continuar solicitação <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </section>

      <SiteFooter />
    </main>
  );
}
