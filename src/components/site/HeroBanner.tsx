import heroBanner from "@/assets/hero-banner.png.asset.json";

export function HeroBanner() {
  return (
    <section className="w-full overflow-hidden bg-background">
      <img
        src={heroBanner.url}
        alt="Banner promocional da Factual Financeira: Precisando de dinheiro? Crédito para realizar seus planos"
        width={1920}
        height={800}
        className="h-auto w-full"
      />
    </section>
  );
}
