import { LoanForm } from "@/components/site/LoanForm";

export function CallToActionSection() {
  return (
    <section id="solicite" className="w-full bg-background">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 text-center md:py-20">
        <h2 className="font-display text-lg italic uppercase leading-tight text-brand-blue-dark sm:text-2xl lg:text-3xl">
          Mais de um milhão de sonhos realizados em duas décadas.
        </h2>
        <p className="mt-4 text-sm italic text-brand-blue md:text-base lg:text-lg">
          Realize seus projetos de vida também. Faça seu Empréstimo.
        </p>

        <div className="h-10 md:h-20" aria-hidden="true" />

        <h3 className="font-display text-base italic uppercase leading-tight text-brand-orange sm:text-xl lg:text-3xl">
          Solicite já o seu empréstimo
        </h3>
        <p className="mt-3 text-sm text-brand-blue md:text-base">
          Preencha seus dados abaixo para continuar sua solicitação.
        </p>

        <div className="h-6 md:h-10" aria-hidden="true" />

        <LoanForm />
      </div>
    </section>
  );
}
