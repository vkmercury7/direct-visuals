import { useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { cpfValido, salvarDadosPessoais } from "@/lib/loan-flow";

const fieldClass =
  "h-12 rounded-md border-border bg-background px-4 text-base text-brand-blue-dark placeholder:italic placeholder:text-muted-foreground";

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function maskTelefone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function telefoneValido(value: string) {
  const d = value.replace(/\D/g, "");
  return d.length === 11 && d[2] === "9" && Number(d.slice(0, 2)) >= 11;
}

type Errors = Partial<
  Record<"nome" | "email" | "cpf" | "nascimento" | "telefone" | "termos", string>
>;

function ErrorText({ children }: { children?: string | undefined }) {
  if (!children) return null;
  return <p className="mt-1 text-[13px] italic text-destructive">{children}</p>;
}

export function LoanForm() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (nome.trim().split(/\s+/).length < 2) next.nome = "Informe seu nome completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      next.email = "Informe um e-mail válido.";
    if (!cpf.trim()) next.cpf = "Informe seu CPF.";
    else if (!cpfValido(cpf)) next.cpf = "CPF inválido.";
    if (!nascimento) next.nascimento = "Informe sua data de nascimento.";
    if (!telefone.trim()) next.telefone = "Informe seu celular.";
    else if (!telefoneValido(telefone)) next.telefone = "Informe um celular válido.";
    if (!accepted) next.termos = "É necessário aceitar os termos.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    salvarDadosPessoais({ nome: nome.trim(), email: email.trim(), cpf, nascimento, telefone });
    setLoading(true);
    setTimeout(() => {
      navigate({ to: "/simulacao" });
    }, 3000);
  }

  if (loading) return <LoadingScreen />;

  return (
    <form className="mx-auto w-full max-w-2xl text-left" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            id="nome"
            name="nome"
            autoComplete="name"
            aria-label="Nome completo"
            placeholder="Nome Completo*"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={fieldClass}
          />
          <ErrorText>{errors.nome}</ErrorText>
        </div>

        <div className="md:col-span-2">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-label="E-mail"
            placeholder="E-mail*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          <ErrorText>{errors.email}</ErrorText>
        </div>

        <div>
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
          <ErrorText>{errors.cpf}</ErrorText>
        </div>

        <div>
          <div className="relative">
            <Input
              id="nascimento"
              name="nascimento"
              type="date"
              aria-label="Data de Nascimento"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className={`${fieldClass} pr-12 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 ${nascimento ? "" : "text-transparent [&::-webkit-datetime-edit]:text-transparent"}`}
            />
            {!nascimento && (
              <span className="pointer-events-none absolute inset-y-0 left-4 right-12 flex items-center overflow-hidden whitespace-nowrap text-base italic text-muted-foreground">
                Data de Nascimento
              </span>
            )}
          </div>
          <ErrorText>{errors.nascimento}</ErrorText>
        </div>

        <div className="md:col-span-2">
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            aria-label="Celular / WhatsApp"
            placeholder="Celular / WhatsApp*"
            value={telefone}
            onChange={(e) => setTelefone(maskTelefone(e.target.value))}
            className={fieldClass}
          />
          <ErrorText>{errors.telefone}</ErrorText>
          <p className="mt-1.5 flex items-start gap-1.5 text-left text-[11px] leading-snug text-muted-foreground md:text-xs">
            <Phone className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            <span>
              Utilizaremos este número para entrar em contato sobre sua solicitação de empréstimo.
            </span>
          </p>
        </div>
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
      <ErrorText>{errors.termos}</ErrorText>

      <Button
        type="submit"
        className="mt-7 h-12 w-full rounded-md bg-brand-orange text-base font-bold uppercase italic tracking-wide text-brand-orange-foreground hover:bg-brand-orange/90"
      >
        Continuar <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
      </Button>
    </form>
  );
}
