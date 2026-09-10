import { Banknote, Phone, MessageCircle } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-5 md:flex-row md:justify-between md:gap-8 md:py-6">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-primary-foreground">
            <Banknote className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="font-display text-xl leading-none tracking-tight text-brand-blue-dark">
            SUA LOGO
          </span>
        </a>

        {/* Center CTA */}
        <a
          href="#solicite"
          className="flex items-center gap-3 rounded-full border border-brand-blue/40 px-6 py-2.5 transition-colors hover:border-brand-blue hover:bg-brand-blue/5"
        >
          <Banknote className="h-7 w-7 text-brand-orange" aria-hidden="true" />
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Solicite sua
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-brand-blue-dark md:text-base">
              Proposta de Empréstimo
            </span>
          </span>
        </a>

        {/* Contacts */}
        <div className="flex flex-col items-center gap-5 sm:flex-row md:gap-8">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Phone className="h-5 w-5 text-brand-blue" aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                SAC
              </span>
              <span className="text-base font-bold text-brand-blue-dark">0800 000 0000</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-left">
            <MessageCircle className="h-5 w-5 text-brand-orange" aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Peça já seu empréstimo
              </span>
              <span className="text-base font-bold text-brand-blue-dark">
                WhatsApp (00) 00000-0000
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
