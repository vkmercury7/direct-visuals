import heroBannerAsset from "@/assets/hero-banner-2026.png.asset.json";

export function HeroBanner() {
  return (
    <section className="w-full overflow-hidden bg-background">
      <img
        src={heroBannerAsset.url}
        alt="Banner promocional da Factual Financeira: Precisando de dinheiro? Crédito para realizar seus planos"
        width={1920}
        height={718}
        className="h-auto w-full"
      />
    </section>
  );
}
