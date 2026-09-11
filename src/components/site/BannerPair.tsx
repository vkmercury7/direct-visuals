import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Wifi } from "lucide-react";
import factualLogo from "@/assets/factual-logo.png";
import phoneBanner from "@/assets/banner-phone.jpg";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/site/LoadingScreen";

export function BannerPair() {
  const navigate = useNavigate();
  const [preparingCard, setPreparingCard] = useState(false);

  function openCardApplication() {
    setPreparingCard(true);
    window.setTimeout(() => navigate({ to: "/cartao" }), 2000);
  }

  return (
    <section className="w-full bg-background">
      {preparingCard ? <LoadingScreen titulo="Preparando sua solicitação" subtitulo="Aguarde alguns instantes..." rodape="" /> : null}
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
        {/* Banner cartão de crédito */}
        <article className="relative grid min-h-[190px] grid-cols-[minmax(0,1.2fr)_minmax(112px,0.8fr)] items-center gap-2 overflow-hidden rounded-xl bg-brand-blue-dark px-4 py-5 md:min-h-[210px] md:grid-cols-[minmax(0,1.15fr)_minmax(170px,0.85fr)] md:gap-5 md:px-7">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%] skew-x-[-10deg] bg-brand-blue/45" aria-hidden="true" />
          <div className="relative z-10 min-w-0 text-left">
            <h3 className="font-display text-[18px] font-bold italic uppercase leading-[1.05] text-primary-foreground md:text-[27px]">
              Cartão de crédito<br />Factual
            </h3>
            <p className="mt-2 text-[12px] italic leading-[1.25] text-primary-foreground/85 md:text-[15px]">
              Praticidade e segurança para acompanhar você todos os dias.
            </p>
            <div className="mt-2 space-y-0.5 text-primary-foreground/80 md:mt-3">
              <span className="flex items-center gap-1 text-[10px] uppercase italic md:text-xs">
                <Check className="h-3 w-3 shrink-0 text-brand-orange" aria-hidden="true" /> Solicitação online
              </span>
              <span className="flex items-center gap-1 text-[10px] uppercase italic md:text-xs">
                <Check className="h-3 w-3 shrink-0 text-brand-orange" aria-hidden="true" /> Sujeito à análise
              </span>
            </div>
            <Button type="button" size="sm" onClick={openCardApplication} className="mt-3 h-8 rounded-md bg-brand-orange px-2.5 font-display text-[10px] font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark md:h-9 md:px-3 md:text-xs">
              Quero meu cartão <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>

          <div className="relative z-10 flex min-w-0 justify-end" aria-label="Representação do cartão de crédito Factual">
            <div className="relative aspect-[1.586/1] w-full max-w-[180px] rotate-[5deg] overflow-hidden rounded-lg border border-primary-foreground/20 bg-brand-blue shadow-soft md:max-w-[205px]">
              <div className="absolute inset-x-0 top-0 h-1 bg-brand-orange" aria-hidden="true" />
              <div className="absolute left-3 top-4 max-w-[72%] rounded-sm bg-primary-foreground px-1.5 py-1 md:left-4 md:top-5">
                <img src={factualLogo} alt="FACTUAL FINANCEIRA" className="h-auto w-auto max-w-full object-contain" />
              </div>
              <div className="absolute bottom-4 left-3 h-5 w-7 rounded-sm border border-brand-orange/70 bg-brand-orange/80 md:bottom-5 md:left-4 md:h-6 md:w-8" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 border-t border-brand-blue-dark/40" />
                <span className="absolute inset-y-0 left-1/2 border-l border-brand-blue-dark/40" />
              </div>
              <Wifi className="absolute bottom-4 right-3 h-6 w-6 rotate-90 text-primary-foreground/75 md:bottom-5 md:right-4" aria-hidden="true" />
              <span className="absolute bottom-2 left-3 text-[7px] font-bold uppercase text-primary-foreground/65 md:left-4 md:text-[8px]">Cartão de crédito</span>
            </div>
          </div>
        </article>

        {/* Banner WhatsApp */}
        <article className="relative flex min-h-[150px] items-center overflow-hidden rounded-xl bg-brand-blue px-5 py-6 md:min-h-[210px] md:px-8">
          <img
            src={phoneBanner}
            alt="Pessoa sorrindo enquanto usa o celular"
            loading="lazy"
            width={1280}
            height={640}
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-brand-blue-dark via-brand-blue-dark/85 to-transparent"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-[70%] text-left">
            <h3 className="font-display text-[20px] font-bold italic uppercase leading-[1.05] text-primary-foreground md:text-3xl">
              Solicite seu empréstimo
            </h3>
            <p className="mt-2 flex items-center gap-2 text-[16px] font-bold italic text-brand-orange md:text-xl">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 fill-current md:h-6 md:w-6"
                aria-hidden="true"
              >
                <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.02c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.16 8.16 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
              </svg>
              WhatsApp (18) 99826-7891
            </p>
            <p className="mt-2 text-[12px] uppercase italic leading-[1.3] text-primary-foreground/85 md:text-sm">
              De segunda a sexta, das 9h às 17h
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
