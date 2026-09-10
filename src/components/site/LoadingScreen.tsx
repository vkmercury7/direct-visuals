import logoAsset from "@/assets/facttal-logo.png";

type LoadingScreenProps = {
  titulo?: string;
  subtitulo?: string;
  rodape?: string;
};

export function LoadingScreen({
  titulo = "Estamos buscando as melhores opções para você",
  subtitulo = "Isso leva apenas alguns instantes.",
  rodape = "Analisando suas informações",
}: LoadingScreenProps = {}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 text-center">
      <img
        src={logoAsset}
        alt="FACTTAL BR - Soluções Financeiras"
        className="h-10 w-auto max-w-[180px] object-contain md:h-14 md:max-w-[240px]"
      />

      <div className="mt-10 h-16 w-16 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-orange md:h-20 md:w-20" />

      <h2 className="mt-8 font-display text-[22px] font-bold italic uppercase leading-[1.15] text-brand-blue-dark md:text-3xl">
        {titulo}
      </h2>
      <p className="mt-3 text-[15px] italic text-brand-blue md:text-lg">
        {subtitulo}
      </p>
      <p className="mt-6 text-[13px] italic uppercase tracking-wide text-muted-foreground md:text-sm">
        {rodape}
        <span className="inline-flex">
          <span className="animate-pulse [animation-delay:0ms]">.</span>
          <span className="animate-pulse [animation-delay:200ms]">.</span>
          <span className="animate-pulse [animation-delay:400ms]">.</span>
        </span>
      </p>
    </div>
  );
}
