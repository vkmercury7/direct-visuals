import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-12 rounded-md border-border bg-background px-4 text-base text-brand-blue-dark placeholder:italic placeholder:text-muted-foreground";

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function LoanForm() {
  const [accepted, setAccepted] = useState(false);
  const [cpf, setCpf] = useState("");

  return (
    <form
      className="mx-auto w-full max-w-2xl text-left"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          id="nome"
          name="nome"
          required
          autoComplete="name"
          aria-label="Nome completo"
          placeholder="Nome Completo*"
          className={`${fieldClass} md:col-span-2`}
        />

        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-label="E-mail"
          placeholder="E-mail*"
          className={`${fieldClass} md:col-span-2`}
        />

        <Input
          id="cpf"
          name="cpf"
          inputMode="numeric"
          aria-label="CPF"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(maskCpf(e.target.value))}
          className={fieldClass}
        />

        <Input
          id="nascimento"
          name="nascimento"
          type="date"
          aria-label="Data de Nascimento"
          placeholder="Data de Nascimento"
          className={fieldClass}
        />
      </div>

      <div className="mt-6 flex items-start gap-3">
        <Checkbox
          id="termos"
          checked={accepted}
          onCheckedChange={(v) => setAccepted(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor="termos" className="text-[15px] font-normal leading-snug text-brand-blue-dark">
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
        className="mt-7 h-12 w-full rounded-md bg-brand-orange text-base font-bold uppercase italic tracking-wide text-brand-orange-foreground hover:bg-brand-orange/90"
      >
        Continuar <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
      </Button>
    </form>
  );
}
