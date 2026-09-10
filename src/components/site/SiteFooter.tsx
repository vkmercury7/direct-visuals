import logoAsset from "@/assets/logo.png.asset.json";

const GROUP_ONE = ["Home", "Sobre nós", "Nossa empresa", "Fale conosco"];
const GROUP_TWO = ["Cartão de crédito", "Crédito para empresa", "Empréstimo pessoal"];

export function SiteFooter() {
  return (
    <footer className="w-full bg-brand-orange text-brand-orange-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:grid md:grid-cols-[240px_1fr] md:items-start md:gap-12 md:py-14">
        <div className="flex flex-col items-center md:items-start">
          <img
            src={logoAsset.url}
            alt="FACTTAL BR - Soluções Financeiras"
            className="h-auto w-[75%] max-w-[260px] object-contain md:w-full md:max-w-[220px]"
          />
        </div>

        <div className="mt-8 text-center md:mt-0 md:text-left">
          <p className="font-display text-[19px] italic uppercase leading-[1.15] md:text-2xl">
            Você tem crédito com a gente.
          </p>
          <p className="font-display text-[24px] font-bold italic uppercase leading-[1.1] md:text-3xl">
            Faça já o seu empréstimo.
          </p>

          <nav aria-label="Links do rodapé" className="mt-8 md:mt-10 md:flex md:gap-16">
            <ul className="space-y-2 md:space-y-3">
              {GROUP_ONE.map((item) => (
                <li key={item} className="text-[15px] italic uppercase leading-[1.5] md:text-base">
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-2 md:mt-0 md:space-y-3">
              {GROUP_TWO.map((item) => (
                <li key={item} className="text-[15px] italic uppercase leading-[1.5] md:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="w-full bg-brand-orange-dark">
        <p className="mx-auto max-w-5xl px-6 py-4 text-center text-[12px] italic uppercase leading-[1.4] md:text-sm">
          © 2026 FACTTAL BR — TODOS OS DIREITOS RESERVADOS.
        </p>
      </div>
    </footer>
  );
}
