import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import brazilMap from "@/assets/brazil-map.png";

const STATES = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

const PINS: { top: string; left: string; matriz?: boolean }[] = [
  { top: "18%", left: "34%" },
  { top: "23%", left: "58%" },
  { top: "26%", left: "72%" },
  { top: "36%", left: "76%" },
  { top: "44%", left: "68%" },
  { top: "40%", left: "40%" },
  { top: "52%", left: "55%" },
  { top: "58%", left: "44%" },
  { top: "63%", left: "66%", matriz: true },
  { top: "70%", left: "58%" },
  { top: "76%", left: "50%" },
  { top: "82%", left: "47%" },
  { top: "33%", left: "20%" },
];

export function StoreLocator() {
  const [state, setState] = useState("");

  return (
    <section id="lojas" className="w-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 pb-10 md:grid md:grid-cols-2 md:items-center md:gap-10 md:px-6 md:pb-16">
        <div className="text-center md:text-left">
          <h2 className="font-display text-[27px] font-bold italic uppercase leading-[1.05] text-brand-orange md:text-4xl">
            Sempre uma loja
            <br />
            perto de você!
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-[17px] italic leading-[1.45] text-brand-blue md:mx-0 md:max-w-md md:text-xl">
            Encontre uma de nossas unidades espalhadas pelo Brasil.
          </p>
          <p className="mt-2 text-[17px] font-bold italic leading-[1.45] text-brand-blue-dark md:text-xl">
            Conheça a mais perto de você!
          </p>

          <div className="relative mt-6 md:max-w-sm">
            <label htmlFor="estado" className="sr-only">
              Selecione o estado
            </label>
            <select
              id="estado"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="h-14 w-full appearance-none rounded-lg border border-brand-orange bg-background px-4 pr-11 text-left text-[17px] italic text-brand-blue-dark outline-none focus:ring-2 focus:ring-brand-orange/40"
            >
              <option value="">Selecione</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-orange"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mt-8 md:mt-0">
          <div className="relative mx-auto w-[85%] max-w-sm md:w-full md:max-w-md">
            <img
              src={brazilMap}
              alt="Mapa do Brasil com as nossas unidades"
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full drop-shadow-[0_14px_24px_rgba(0,0,0,0.18)]"
            />
            {PINS.map((pin, i) => (
              <MapPin
                key={i}
                style={{ top: pin.top, left: pin.left }}
                className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-full drop-shadow md:h-6 md:w-6 ${
                  pin.matriz ? "fill-brand-blue-dark text-background" : "fill-brand-orange-dark text-background"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-8 md:justify-start">
            <span className="flex items-center gap-1 text-[15px] font-bold italic uppercase text-brand-blue-dark">
              <MapPin className="h-5 w-5 fill-brand-blue-dark" aria-hidden="true" /> Matriz
            </span>
            <span className="flex items-center gap-1 text-[15px] font-bold italic uppercase text-brand-orange">
              <MapPin className="h-5 w-5 fill-brand-orange" aria-hidden="true" /> Filial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
