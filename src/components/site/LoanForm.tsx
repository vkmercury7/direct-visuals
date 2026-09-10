import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function LoanForm() {
  const [accepted, setAccepted] = useState(false);

  return (
    <form
      className="mx-auto w-full max-w-2xl text-left"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="nome" className="text-sm font-semibold text-brand-blue-dark">
            Nome Completo*
          </Label>
          <Input
            id="nome"
            name="nome"
            required
            autoComplete="name"
            placeholder="Digite seu nome completo"
            className="mt-1.5 h-11 rounded-md border-border bg-background"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="email" className="text-sm font-semibold text-brand-blue-dark">
            E-mail*
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Digite seu e-mail"
            className="mt-1.5 h-11 rounded-md border-border bg-background"
          />
        </div>

        <div>
          <Label htmlFor="cpf" className="text-sm font-semibold text-brand-blue-dark">
            CPF
          </Label>
          <Input
            id="cpf"
            name="cpf"
            inputMode="numeric"
            placeholder="000.000.000-00"
            className="mt-1.5 h-11 rounded-md border-border bg-background"
          />
        </div>

        <div>
          <Label htmlFor="nascimento" className="text-sm font-semibold text-brand-blue-dark">
            Data de Nascimento
          </Label>
          <Input
            id="nascimento"
            name="nascimento"
            type="date"
            className="mt-1.5 h-11 rounded-md border-border bg-background"
          />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <Checkbox
          id="termos"
          checked={accepted}
          onCheckedChange={(v) => setAccepted(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor="termos" className="text-sm font-normal leading-snug text-brand-blue-dark">
          Li e aceito os{" "}
          <a href="#" className="font-semibold underline">
            Termos de Uso
          </a>{" "}
          e a{" "}
          <a href="#" className="font-semibold underline">
            Política de Privacidade
          </a>
          .
        </Label>
      </div>

      <Button
        type="submit"
        disabled={!accepted}
        className="mt-6 h-12 w-full rounded-md bg-brand-orange text-base font-bold uppercase tracking-wide text-brand-orange-foreground hover:bg-brand-orange/90"
      >
        Continuar <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
      </Button>
    </form>
  );
}
