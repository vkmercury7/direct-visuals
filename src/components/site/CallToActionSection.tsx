export function CallToActionSection() {
  return (
    <section id="solicite" className="w-full bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-20 text-center md:py-28">
        <h2 className="font-display text-2xl uppercase leading-tight text-brand-blue-dark sm:text-3xl lg:text-4xl">
          Mais de um milhão de sonhos realizados.
        </h2>
        <p className="mt-5 text-base text-muted-foreground lg:text-lg">
          Realize seus projetos também. Solicite sua proposta de empréstimo.
        </p>

        <div className="h-24 md:h-36" aria-hidden="true" />

        <h3 className="font-display text-xl uppercase leading-tight text-brand-orange sm:text-2xl lg:text-3xl">
          Solicite já o seu empréstimo
        </h3>
        <p className="mt-4 text-base text-muted-foreground lg:text-lg">
          Preencha o formulário abaixo e nossa equipe entra em contato com você!
        </p>
      </div>
    </section>
  );
}
