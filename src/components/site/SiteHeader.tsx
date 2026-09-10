import { Banknote, Phone, MessageCircle, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/components/site/SiteNav";
import logoAsset from "@/assets/logo.png.asset.json";

function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`flex shrink-0 items-center ${className}`}>
      <img
        src={logoAsset.url}
        alt="FACTTAL BR - Soluções Financeiras"
        className="h-9 w-auto max-w-[160px] object-contain md:h-12 md:max-w-[220px]"
      />
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="w-full bg-background">
      {/* Mobile: hamburger + logo only */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3 md:hidden">
        <Sheet>
          <SheetTrigger
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-md text-brand-blue-dark"
          >
            <Menu className="h-7 w-7" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[78%] max-w-xs">
            <SheetTitle className="sr-only">Menu principal</SheetTitle>
            <nav aria-label="Menu principal" className="mt-8 px-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="block border-b border-border py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue-dark"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex justify-center">
          <Logo />
        </div>

        <span className="h-10 w-10" aria-hidden="true" />
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-7xl flex-col items-center gap-6 px-4 py-5 md:flex md:flex-row md:justify-between md:gap-8 md:py-6">
        <Logo />

        <a
          href="#solicite"
          className="flex items-center gap-3 rounded-full border border-brand-blue/40 px-6 py-2.5 transition-colors hover:border-brand-blue hover:bg-brand-blue/5"
        >
          <Banknote className="h-7 w-7 text-brand-orange" aria-hidden="true" />
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Solicite sua
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-brand-blue-dark md:text-base">
              Proposta de Empréstimo
            </span>
          </span>
        </a>

        <div className="flex flex-col items-center gap-5 sm:flex-row md:gap-8">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Phone className="h-5 w-5 text-brand-blue" aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                SAC
              </span>
              <span className="text-base font-bold text-brand-blue-dark">0800 890 0367</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-left">
            <MessageCircle className="h-5 w-5 text-brand-orange" aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Peça já seu empréstimo
              </span>
              <span className="text-base font-bold text-brand-blue-dark">
                WhatsApp (18) 99826-7891
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
