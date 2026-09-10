export const navItems = [
  "Sobre Nós",
  "Nossa Empresa",
  "Produtos para Você",
  "FAQ",
  "Fale Conosco",
  "Seja um Parceiro",
  "LGPD",
  "Trabalhe Conosco",
];

export function SiteNav() {
  return (
    <nav aria-label="Menu principal" className="hidden w-full bg-brand-blue md:block">
      <ul className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 md:gap-x-9 md:py-3">
        {navItems.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="block py-1 text-[13px] font-semibold uppercase tracking-wide text-primary-foreground/90 transition-colors hover:text-brand-orange md:text-sm"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
