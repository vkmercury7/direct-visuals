import heroPerson from "@/assets/hero-person.png";
import { Coins, CircleDollarSign, Banknote } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-hero">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 text-center md:grid-cols-3 md:gap-4 md:py-0 md:text-left lg:min-h-[480px]">
        {/* Left headline */}
        <div className="order-1 md:order-none">
          <h1 className="font-display text-4xl leading-[1.05] text-primary-foreground sm:text-5xl lg:text-6xl">
            Precisando
            <span className="mt-3 block w-fit mx-auto rounded-lg bg-brand-orange px-4 py-1 text-brand-orange-foreground md:mx-0">
              de dinheiro?
            </span>
          </h1>
        </div>

        {/* Center person */}
        <div className="relative order-3 flex items-end justify-center md:order-none">
          <Coins
            className="absolute left-0 top-6 h-10 w-10 text-brand-orange/80 md:h-12 md:w-12"
            aria-hidden="true"
          />
          <CircleDollarSign
            className="absolute right-2 top-16 h-9 w-9 text-primary-foreground/50"
            aria-hidden="true"
          />
          <Banknote
            className="absolute bottom-16 left-4 h-9 w-9 text-primary-foreground/40"
            aria-hidden="true"
          />
          <img
            src={heroPerson}
            alt="Cliente comemorando a aprovação do empréstimo com o celular na mão"
            width={1024}
            height={1024}
            className="relative z-10 w-[240px] max-w-full object-contain sm:w-[300px] lg:w-[420px]"
          />
        </div>

        {/* Right message */}
        <div className="order-2 md:order-none md:text-right">
          <h2 className="font-display text-2xl leading-tight text-primary-foreground sm:text-3xl lg:text-4xl">
            Crédito para realizar
            <br />
            seus planos!
          </h2>
          <p className="mt-4 text-base text-primary-foreground/85 lg:text-lg">
            Faça sua simulação de empréstimo de forma simples e rápida.
          </p>
        </div>
      </div>
    </section>
  );
}
