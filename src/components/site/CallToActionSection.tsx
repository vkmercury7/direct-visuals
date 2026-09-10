import { LoanForm } from "@/components/site/LoanForm";

export function CallToActionSection() {
  return (
    <section id="solicite" className="w-full bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 pb-14 pt-10 text-center md:px-6 md:pb-20 md:pt-16">
        <h2 className="font-display text-[28px] font-bold italic uppercase leading-[1.15] text-brand-blue-dark md:text-4xl">
          Mais de um milhão de sonhos realizados em duas décadas.
        </h2>
        <p className="mt-4 text-[20px] italic leading-[1.2] text-brand-blue md:text-2xl">
          Realize seus projetos de vida também. Faça seu Empréstimo.
        </p>

        <div className="h-12 md:h-16" aria-hidden="true" />

        <h3 className="font-display text-[25px] font-bold italic uppercase leading-[1.1] text-brand-orange md:text-3xl">
          Solicite já o seu empréstimo
        </h3>
        <p className="mt-3 text-[17px] italic leading-[1.5] text-brand-blue md:text-xl">
          Preencha seus dados abaixo para continuar sua solicitação.
        </p>

        <div className="h-14 md:h-16" aria-hidden="true" />

        <LoanForm />
      </div>
    </section>
  );
}
