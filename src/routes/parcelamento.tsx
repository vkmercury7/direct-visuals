import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Info } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  calcularOpcoes,
  formatBRL,
  formatarTaxa,
  lerDadosPessoais,
  lerValorDesejado,
  salvarSimulacao,
  type OpcaoParcelamento,
} from "@/lib/loan-flow";

export const Route = createFileRoute("/parcelamento")({
  head: () => ({
    meta: [
      { title: "Opções de parcelamento — simulação" },
      {
        name: "description",
        content:
          "Veja as opções de parcelamento calculadas para o valor solicitado e escolha como deseja pagar.",
      },
      { property: "og:title", content: "Opções de parcelamento — simulação" },
      {
        property: "og:description",
        content: "Compare as opções de parcelas estimadas para o valor solicitado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Parcelamento,
});

function Parcelamento() {
  const navigate = useNavigate();
  const [valor, setValor] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionada, setSelecionada] = useState<number | null>(null);

  useEffect(() => {
    const dados = lerDadosPessoais();
    const v = lerValorDesejado();
    if (!dados || !v) {
      navigate({ to: "/" });
      return;
    }
    setValor(v);
    const t = setTimeout(() => setCarregando(false), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  const opcoes = useMemo(() => (valor ? calcularOpcoes(valor) : []), [valor]);

  const menorParcela = useMemo(
    () =>
      opcoes.reduce<OpcaoParcelamento | null>(
        (acc, o) => (!acc || o.valorParcela < acc.valorParcela ? o : acc),
        null,
      ),
    [opcoes],
  );
  const menorCusto = useMemo(
    () =>
      opcoes.reduce<OpcaoParcelamento | null>(
        (acc, o) => (!acc || o.totalEstimado < acc.totalEstimado ? o : acc),
        null,
      ),
    [opcoes],
  );

  if (!valor) return <div className="min-h-screen bg-background" />;

  if (carregando) {
    return (
      <LoadingScreen
        titulo="Calculando suas opções"
        subtitulo="Estamos preparando as condições disponíveis para sua simulação."
        rodape="Isso leva apenas alguns instantes"
      />
    );
  }

  const escolhida = opcoes.find((o) => o.parcelas === selecionada) ?? null;

  function continuar() {
    if (!escolhida || !valor) return;
    salvarSimulacao({ ...escolhida, valorSolicitado: valor });
    navigate({ to: "/resumo-solicitacao" });
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <SiteNav />

      <section className="mx-auto w-full max-w-3xl px-4 pb-14 pt-8 md:px-6 md:pb-20 md:pt-12">
        <div className="text-center">
          <h1 className="font-display text-[30px] font-bold italic uppercase leading-[1.1] text-brand-blue-dark md:text-4xl">
            Escolha como deseja pagar
          </h1>
          <p className="mt-3 text-[18px] italic leading-[1.3] text-brand-blue md:text-xl">
            Confira as opções de parcelamento para o valor solicitado.
          </p>
        </div>

        <section className="mt-7 rounded-xl border border-border bg-card p-5 text-center shadow-soft md:mt-9 md:p-6">
          <p className="text-[12px] uppercase italic tracking-[0.18em] text-muted-foreground">
            Valor solicitado
          </p>
          <p className="mt-2 font-display text-[34px] font-bold italic leading-none text-brand-blue-dark md:text-5xl">
            {formatBRL(valor)}
          </p>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-6">
          {opcoes.map((o, i) => {
            const ativo = selecionada === o.parcelas;
            const span = i < 3 ? "md:col-span-2" : "md:col-span-3";
            const destaque =
              menorParcela?.parcelas === o.parcelas
                ? "Menor parcela"
                : menorCusto?.parcelas === o.parcelas
                  ? "Menor custo total"
                  : null;
            return (
              <button
                key={o.parcelas}
                type="button"
                onClick={() => setSelecionada(o.parcelas)}
                aria-pressed={ativo}
                className={`w-full rounded-xl border bg-card p-5 text-left transition-colors ${span} ${
                  ativo
                    ? "border-brand-orange ring-2 ring-brand-orange/30"
                    : "border-border hover:border-brand-blue"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-[17px] font-bold italic uppercase tracking-wide text-brand-blue">
                    {o.parcelas} parcelas
                  </h2>
                  <span className="flex items-center gap-2">
                    {destaque && (
                      <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-bold uppercase italic tracking-wide text-brand-blue-dark">
                        {destaque}
                      </span>
                    )}
                    {ativo && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-brand-orange-foreground">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </span>
                </div>

                <p className="mt-3 text-[13px] italic text-muted-foreground">
                  {o.parcelas}x de
                </p>
                <p className="font-display text-[30px] font-bold italic leading-none text-brand-blue-dark md:text-4xl">
                  {formatBRL(o.valorParcela)}
                </p>

                <dl className="mt-4 space-y-1 text-[14px] italic text-brand-blue-dark/80">
                  <div className="flex justify-between">
                    <dt>Taxa:</dt>
                    <dd className="font-semibold">{formatarTaxa(o.taxaMensal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Total estimado:</dt>
                    <dd className="font-semibold">{formatBRL(o.totalEstimado)}</dd>
                  </div>
                </dl>

                <span
                  className={`mt-4 flex h-10 w-full items-center justify-center rounded-md text-[14px] font-bold uppercase italic tracking-wide ${
                    ativo
                      ? "bg-brand-orange text-brand-orange-foreground"
                      : "border border-border bg-background text-brand-blue-dark"
                  }`}
                >
                  {ativo ? "Selecionado" : "Selecionar"}
                </span>
              </button>
            );
          })}
        </div>

        {escolhida && (
          <section className="mt-8 rounded-xl border border-border bg-card p-5 md:p-7">
            <h2 className="font-display text-[16px] font-bold italic uppercase tracking-wide text-brand-orange">
              Resumo da sua simulação
            </h2>
            <dl className="mt-4 space-y-3 text-[15px] text-brand-blue-dark md:text-base">
              <Linha rotulo="Valor solicitado" valor={formatBRL(valor)} />
              <Linha rotulo="Parcelamento" valor={`${escolhida.parcelas}x`} />
              <Linha rotulo="Valor da parcela" valor={formatBRL(escolhida.valorParcela)} />
              <Linha
                rotulo="Taxa utilizada na simulação"
                valor={formatarTaxa(escolhida.taxaMensal)}
              />
              <Linha rotulo="Total estimado" valor={formatBRL(escolhida.totalEstimado)} />
            </dl>
          </section>
        )}

        <aside className="mt-6 flex gap-3 rounded-xl border border-border bg-secondary p-4 md:p-5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
          <div className="text-[14px] leading-[1.45] text-brand-blue-dark/80 md:text-[15px]">
            <p>
              Esta é uma simulação. As condições definitivas estão sujeitas à análise de crédito e
              às condições contratuais aplicáveis.
            </p>
            <p className="mt-2">
              Taxas, tributos, IOF e CET definitivos devem ser apresentados antes da contratação.
            </p>
          </div>
        </aside>

        <Button
          type="button"
          disabled={!escolhida}
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

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="italic text-muted-foreground">{rotulo}</dt>
      <dd className="font-display font-bold italic text-brand-blue-dark">{valor}</dd>
    </div>
  );
}
