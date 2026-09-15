import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, CreditCard, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingScreen } from "@/components/site/LoadingScreen";

type Produto = {
  id: string;
  icone: typeof Wallet;
  titulo: string;
  texto: string;
  beneficios: string[];
  cta: string;
  destaque?: boolean;
  selo?: string;
};

const PRODUTOS: Produto[] = [
  {
    id: "emprestimo",
    icone: Wallet,
    titulo: "Empréstimo Pessoal",
    texto:
      "Solicite valores de R$ 250 a R$ 4.500 de forma digital, com condições apresentadas durante a simulação.",
    beneficios: [
      "Solicitação online",
      "Valores de R$ 250 a R$ 4.500",
      "Parcelamento disponível",
      "Sujeito à análise de crédito",
    ],
    cta: "Simular empréstimo",
  },
  {
    id: "cartao",
    icone: CreditCard,
    titulo: "Cartão de Crédito",
    texto: "Praticidade para suas compras com solicitação totalmente digital.",
    beneficios: [
      "Solicitação online",
      "Processo digital",
      "Consulte o resultado da sua solicitação",
      "Limite sujeito à análise",
    ],
    cta: "Conhecer o cartão",
    destaque: true,
    selo: "Factual Simple",
  },
  {
    id: "openfinance",
    icone: Landmark,
    titulo: "Open Finance",
    texto:
      "Compartilhe seus dados financeiros, mediante seu consentimento, para complementar sua análise.",
    beneficios: [
      "Compartilhamento mediante consentimento",
      "Você escolhe quais dados compartilhar",
      "Processo realizado por ambiente autorizado",
      "Pode complementar uma futura análise",
    ],
    cta: "Saiba mais",
  },
];

export function ProductsSection() {
  const navigate = useNavigate();
  const [preparandoCartao, setPreparandoCartao] = useState(false);
  const [openFinanceAberto, setOpenFinanceAberto] = useState(false);

  function acionar(id: string) {
    if (id === "emprestimo") {
      document.getElementById("solicite")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (id === "cartao") {
      setPreparandoCartao(true);
      window.setTimeout(() => navigate({ to: "/cartao" }), 2000);
      return;
    }
    setOpenFinanceAberto(true);
  }

  return (
    <section id="produtos" className="w-full bg-background">
      {preparandoCartao ? (
        <LoadingScreen
          titulo="Preparando sua solicitação"
          subtitulo="Aguarde alguns instantes..."
          rodape=""
        />
      ) : null}

      <div className="mx-auto w-full max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <div className="text-center">
          <span className="font-display text-[12px] font-bold uppercase italic tracking-[0.2em] text-brand-orange md:text-sm">
            Nossas soluções
          </span>
          <h2 className="mt-2 font-display text-[28px] font-bold uppercase italic leading-[1.1] text-brand-blue-dark md:text-4xl">
            Produtos Factual
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[16px] italic leading-[1.4] text-brand-blue md:text-lg">
            Soluções financeiras pensadas para diferentes momentos da sua vida.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {PRODUTOS.map((produto) => {
            const Icone = produto.icone;
            return (
              <article
                key={produto.id}
                className={`flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 md:p-7 md:hover:-translate-y-1 md:hover:shadow-lg ${
                  produto.destaque
                    ? "border-brand-orange/60 shadow-md"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                    <Icone className="h-6 w-6" aria-hidden="true" />
                  </span>
                  {produto.selo ? (
                    <span className="rounded-full bg-brand-orange px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-brand-orange-foreground">
                      {produto.selo}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-5 font-display text-[21px] font-bold uppercase italic leading-[1.1] text-brand-blue-dark md:text-2xl">
                  {produto.titulo}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.5] text-muted-foreground">
                  {produto.texto}
                </p>

                <ul className="mt-5 space-y-2">
                  {produto.beneficios.map((beneficio) => (
                    <li
                      key={beneficio}
                      className="flex items-start gap-2 text-[14px] leading-[1.4] text-brand-blue"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange"
                        aria-hidden="true"
                      />
                      {beneficio}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Button
                    type="button"
                    onClick={() => acionar(produto.id)}
                    className="h-11 w-full rounded-lg bg-brand-orange font-display text-[13px] font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark"
                  >
                    {produto.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Dialog open={openFinanceAberto} onOpenChange={setOpenFinanceAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold uppercase italic text-brand-blue-dark">
              Open Finance
            </DialogTitle>
            <DialogDescription className="pt-2 text-left text-[15px] leading-[1.6] text-muted-foreground">
              Open Finance é o sistema que permite ao cliente compartilhar determinados dados
              financeiros com instituições participantes, mediante consentimento. A disponibilidade
              dessa funcionalidade na Factual dependerá das integrações e condições aplicáveis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setOpenFinanceAberto(false)}
              className="h-11 w-full rounded-lg bg-brand-orange font-display text-[13px] font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
