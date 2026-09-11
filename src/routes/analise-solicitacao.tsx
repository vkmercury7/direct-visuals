import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, CheckCircle2, Info, Loader2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { PixDialog } from "@/components/site/PixDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createPixCharge, type PixChargeResult } from "@/lib/pix.functions";
import {
  GUARANTEE_AMOUNT,
  GUARANTEE_INFO,
  formatBRL,
  lerDadosPessoais,
  lerSimulacao,
  type DadosPessoais,
  type SimulacaoEscolhida,
} from "@/lib/loan-flow";

export const Route = createFileRoute("/analise-solicitacao")({
  head: () => ({
    meta: [
      { title: "Solicitação analisada — condições da operação" },
      {
        name: "description",
        content:
          "Veja o resultado da análise da sua solicitação, as condições selecionadas e a garantia prevista na contratação.",
      },
      { property: "og:title", content: "Solicitação analisada — condições da operação" },
      {
        property: "og:description",
        content: "Resultado da análise, condições selecionadas e garantia da operação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnaliseSolicitacao,
});

function AnaliseSolicitacao() {
  const navigate = useNavigate();
  const [sim, setSim] = useState<SimulacaoEscolhida | null>(null);
  const [dados, setDados] = useState<DadosPessoais | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [aceite, setAceite] = useState(false);
  const [gerandoPix, setGerandoPix] = useState(false);
  const [erroPix, setErroPix] = useState<string | null>(null);
  const [pix, setPix] = useState<PixChargeResult | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [pago, setPago] = useState(false);
  const gerarPix = useServerFn(createPixCharge);

  useEffect(() => {
    const d = lerDadosPessoais();
    const s = lerSimulacao();
    if (!d || !s) {
      navigate({ to: "/" });
      return;
    }
    setDados(d);
    setSim(s);
    const t = setTimeout(() => setCarregando(false), 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  const aoPagar = useCallback(() => {
    setModalAberto(false);
    setPago(true);
  }, []);

  async function confirmar() {
    if (!dados) return;
    setErroPix(null);
    setGerandoPix(true);
    try {
      const resultado = await gerarPix({
        data: { name: dados.nome, email: dados.email, cpf: dados.cpf },
      });
      setPix(resultado);
      setModalAberto(true);
    } catch {
      setErroPix("Não foi possível gerar o PIX agora. Tente novamente em instantes.");
    } finally {
      setGerandoPix(false);
    }
  }

  if (!sim) return <div className="min-h-screen bg-background" />;

  if (carregando) {
    return (
      <LoadingScreen
        titulo="Finalizando sua análise"
        subtitulo="Estamos processando as informações da sua solicitação."
        rodape="Aguarde alguns instantes"
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <SiteNav />

      <section className="mx-auto w-full max-w-3xl px-4 pb-14 pt-8 md:px-6 md:pb-20 md:pt-12">
        <div className="text-center">
          <h1 className="font-display text-[30px] font-bold italic uppercase leading-[1.1] text-brand-blue-dark md:text-4xl">
            Solicitação analisada
          </h1>
          <p className="mt-3 font-display text-[22px] font-bold italic uppercase leading-[1.15] text-brand-orange md:text-3xl">
            Empréstimo pré-aprovado
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[16px] italic leading-[1.4] text-brand-blue md:text-lg">
            Identificamos uma condição disponível para sua solicitação, sujeita às verificações e
            condições finais da contratação.
          </p>
        </div>

        <section className="mt-7 rounded-xl border border-border bg-card p-5 text-center shadow-soft md:mt-9 md:p-7">
          <h2 className="font-display text-[16px] font-bold italic uppercase tracking-wide text-brand-blue">
            Sua solicitação
          </h2>
          <p className="mt-4 text-[12px] uppercase italic tracking-[0.18em] text-muted-foreground">
            Valor solicitado
          </p>
          <p className="mt-1 font-display text-[34px] font-bold italic leading-none text-brand-blue-dark md:text-5xl">
            {formatBRL(sim.valorSolicitado)}
          </p>
          <p className="mt-5 text-[12px] uppercase italic tracking-[0.18em] text-muted-foreground">
            Parcelamento escolhido
          </p>
          <p className="mt-1 font-display text-[22px] font-bold italic text-brand-blue-dark md:text-2xl">
            {sim.parcelas}x de {formatBRL(sim.valorParcela)}
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5 md:mt-8 md:p-7">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
            <div>
              <h2 className="font-display text-[16px] font-bold italic uppercase tracking-wide text-brand-blue">
                Garantia da operação
              </h2>
              <p className="mt-2 text-[15px] leading-[1.45] text-brand-blue-dark/80 md:text-base">
                Esta operação possui uma garantia prevista nas condições da contratação.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-secondary p-5 text-center">
            <p className="text-[12px] uppercase italic tracking-[0.18em] text-muted-foreground">
              Valor da garantia
            </p>
            <p className="mt-2 font-display text-[34px] font-bold italic leading-none text-brand-blue-dark md:text-4xl">
              {formatBRL(GUARANTEE_AMOUNT)}
            </p>
          </div>

          <dl className="mt-5 space-y-3 text-[14px] text-brand-blue-dark md:text-[15px]">
            {GUARANTEE_INFO.map((item) => (
              <div key={item.pergunta} className="border-b border-border/60 pb-2 last:border-0 last:pb-0">
                <dt className="text-[12px] uppercase italic tracking-wide text-muted-foreground">
                  {item.pergunta}
                </dt>
                <dd className="mt-1 leading-[1.45]">{item.resposta}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="mt-6 flex gap-3 rounded-xl border border-border bg-secondary p-4 md:p-5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
          <div className="text-[14px] leading-[1.45] text-brand-blue-dark/80 md:text-[15px]">
            <p>
              Importante: a pré-aprovação não representa garantia definitiva de liberação dos
              recursos. A contratação está sujeita às condições e verificações aplicáveis.
            </p>
            <p className="mt-2">
              Consulte todas as condições, encargos e o CET antes de confirmar a contratação.
            </p>
          </div>
        </aside>

        <div className="mt-6 flex items-start gap-3">
          <Checkbox
            id="aceite-condicoes"
            checked={aceite}
            onCheckedChange={(v) => setAceite(v === true)}
            className="mt-1"
          />
          <label
            htmlFor="aceite-condicoes"
            className="text-[14px] leading-[1.45] text-brand-blue-dark md:text-[15px]"
          >
            Li e compreendi as{" "}
            <a
              href="#condicoes-da-operacao"
              className="font-semibold text-brand-blue underline underline-offset-2"
            >
              condições da operação
            </a>
            , incluindo as informações sobre a garantia e as condições da contratação.
          </label>
        </div>

        {pago ? (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-brand-blue/30 bg-secondary p-4 md:p-5">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-brand-blue" aria-hidden="true" />
            <div>
              <p className="font-display text-[16px] font-bold uppercase italic text-brand-blue-dark">
                Pagamento aprovado
              </p>
              <p className="mt-1 text-[14px] leading-[1.45] text-brand-blue-dark/80 md:text-[15px]">
                Recebemos a confirmação do seu PIX. Sua solicitação seguirá para as etapas
                seguintes da contratação.
              </p>
            </div>
          </div>
        ) : (
          <>
            <Button
              type="button"
              disabled={!aceite || gerandoPix}
              onClick={confirmar}
              className="mt-8 h-12 w-full rounded-md bg-brand-orange text-base font-bold uppercase italic tracking-wide text-brand-orange-foreground hover:bg-brand-orange/90"
            >
              {gerandoPix ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Gerando PIX
                </>
              ) : (
                <>
                  Confirmar <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </Button>
            {erroPix ? (
              <p className="mt-3 text-center text-[14px] italic text-destructive">{erroPix}</p>
            ) : null}
          </>
        )}

        <PixDialog
          aberto={modalAberto}
          onOpenChange={setModalAberto}
          pix={pix}
          valor={GUARANTEE_AMOUNT}
          onPago={aoPagar}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
