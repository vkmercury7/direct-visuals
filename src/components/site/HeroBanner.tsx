import heroBanner from "@/assets/hero-banner.webp";

export function HeroBanner() {
  return (
    <section className="w-full overflow-hidden bg-background">
      <img
        src={heroBanner}
        alt="Banner promocional da Factual Financeira: Precisando de dinheiro? Crédito para realizar seus planos"
        width={1920}
        height={718}
        className="h-auto w-full"
      />
    </section>
  );
}
