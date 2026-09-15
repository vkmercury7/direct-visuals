import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NUMERO_WHATSAPP = "5518981491663";

const ASSUNTOS: { valor: string; rotulo: string; mensagem: (nome: string) => string }[] = [
  {
    valor: "cartao",
    rotulo: "Cartão de Crédito",
    mensagem: (nome) =>
      `Olá! Meu nome é ${nome}. Estou entrando em contato pelo site da Factual Financeira e gostaria de atendimento sobre Cartão de Crédito.`,
  },
  {
    valor: "emprestimo",
    rotulo: "Empréstimo",
    mensagem: (nome) =>
      `Olá! Meu nome é ${nome}. Estou entrando em contato pelo site da Factual Financeira e gostaria de atendimento sobre Empréstimo.`,
  },
  {
    valor: "suporte",
    rotulo: "Suporte",
    mensagem: (nome) =>
      `Olá! Meu nome é ${nome}. Estou entrando em contato pelo site da Factual Financeira e preciso de Suporte.`,
  },
  {
    valor: "outro",
    rotulo: "Outro",
    mensagem: (nome) =>
      `Olá! Meu nome é ${nome}. Estou entrando em contato pelo site da Factual Financeira e gostaria de falar com a equipe.`,
  },
];

export function ContactWhatsAppSection() {
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("");
  const [erro, setErro] = useState("");

  function enviar() {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      setErro("Informe seu nome para continuar.");
      return;
    }
    if (!assunto) {
      setErro("Selecione um assunto para continuar.");
      return;
    }
    const opcao = ASSUNTOS.find((item) => item.valor === assunto);
    if (!opcao) return;
    setErro("");
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(opcao.mensagem(nomeLimpo))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contato" className="w-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 pb-14 md:px-6 md:pb-20">
        <div className="grid items-center gap-8 rounded-2xl border border-border bg-brand-blue-dark px-6 py-8 md:grid-cols-2 md:gap-10 md:px-10 md:py-10">
          <div className="text-left">
            <span className="font-display text-[12px] font-bold uppercase italic tracking-[0.2em] text-brand-orange md:text-sm">
              Atendimento
            </span>
            <h2 className="mt-2 font-display text-[26px] font-bold uppercase italic leading-[1.1] text-primary-foreground md:text-3xl">
              Como podemos ajudar?
            </h2>
            <p className="mt-3 text-[15px] italic leading-[1.5] text-primary-foreground/85 md:text-base">
              Informe seu nome e selecione o assunto. Você será direcionado para nosso atendimento
              pelo WhatsApp.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="contato-nome" className="text-brand-blue-dark">
                  Seu nome
                </Label>
                <Input
                  id="contato-nome"
                  value={nome}
                  onChange={(event) => {
                    setNome(event.target.value);
                    if (erro) setErro("");
                  }}
                  placeholder="Digite seu nome"
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contato-assunto" className="text-brand-blue-dark">
                  Sobre o que você deseja falar?
                </Label>
                <Select
                  value={assunto}
                  onValueChange={(valor) => {
                    setAssunto(valor);
                    if (erro) setErro("");
                  }}
                >
                  <SelectTrigger id="contato-assunto" className="h-11 w-full">
                    <SelectValue placeholder="Selecione um assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSUNTOS.map((item) => (
                      <SelectItem key={item.valor} value={item.valor}>
                        {item.rotulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {erro ? (
                <p role="alert" className="text-[13px] text-destructive">
                  {erro}
                </p>
              ) : null}

              <Button
                type="button"
                onClick={enviar}
                className="h-12 w-full rounded-lg bg-brand-orange font-display text-[13px] font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.02c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.16 8.16 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
                </svg>
                Falar pelo WhatsApp
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
