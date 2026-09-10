import heroPerson from "@/assets/hero-person.png";
import { Coins, CircleDollarSign, Banknote } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-hero">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 text-left md:gap-4 md:px-4 md:py-0 lg:min-h-[480px]">
        {/* Left headline */}
        <div>
          <h1 className="font-display text-[15px] leading-[1.1] text-primary-foreground sm:text-xl md:text-4xl lg:text-6xl">
            Precisando
            <span className="mt-1 block w-fit whitespace-nowrap rounded bg-brand-orange px-1.5 py-0.5 text-brand-orange-foreground md:mt-3 md:rounded-lg md:px-4 md:py-1">
              de dinheiro?
            </span>
          </h1>
        </div>

        {/* Center person */}
        <div className="relative flex items-end justify-center">
          <Coins
            className="absolute left-0 top-3 h-5 w-5 text-brand-orange/80 md:top-6 md:h-12 md:w-12"
            aria-hidden="true"
          />
          <CircleDollarSign
            className="absolute right-0 top-8 h-4 w-4 text-primary-foreground/50 md:top-16 md:h-9 md:w-9"
            aria-hidden="true"
          />
          <Banknote
            className="absolute bottom-8 left-1 h-4 w-4 text-primary-foreground/40 md:bottom-16 md:left-4 md:h-9 md:w-9"
            aria-hidden="true"
          />
          <img
            src={heroPerson}
            alt="Cliente comemorando a aprovação do empréstimo com o celular na mão"
            width={1024}
            height={1024}
            className="relative z-10 w-[110px] max-w-full object-contain sm:w-[150px] md:w-[300px] lg:w-[420px]"
          />
        </div>

        {/* Right message */}
        <div className="text-right">
          <h2 className="font-display text-[13px] leading-tight text-primary-foreground sm:text-lg md:text-3xl lg:text-4xl">
            Crédito para realizar
            <br />
            seus planos!
          </h2>
          <p className="mt-1 text-[10px] leading-snug text-primary-foreground/85 sm:text-xs md:mt-4 md:text-base lg:text-lg">
            Faça sua simulação de empréstimo de forma simples e rápida.
          </p>
        </div>
      </div>
    </section>
  );
}
