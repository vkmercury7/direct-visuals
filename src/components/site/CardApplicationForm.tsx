import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CardApplicationResult, type CardApprovalResult } from "@/components/site/CardApplicationResult";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { cpfValido, formatBRL } from "@/lib/loan-flow";
import { submitCardApplication } from "@/lib/card-application.functions";

type FormData = {
  nome: string; cpf: string; dataNascimento: string; email: string; telefone: string;
  rendaMensal: string; profissao: string; cep: string; endereco: string; numero: string;
  complemento: string; bairro: string; cidade: string; estado: string; limitePretendido: number;
};

const initialData: FormData = { nome: "", cpf: "", dataNascimento: "", email: "", telefone: "", rendaMensal: "", profissao: "", cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", limitePretendido: 2000 };
const fieldClass = "h-12 rounded-md border-border bg-background px-4 text-base text-brand-blue-dark placeholder:italic placeholder:text-muted-foreground";

function digits(value: string, max: number) { return value.replace(/\D/g, "").slice(0, max); }
function maskCpf(value: string) { return digits(value, 11).replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4"); }
function maskPhone(value: string) { const d = digits(value, 11); if (d.length <= 2) return d ? `(${d}` : ""; if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`; return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`; }
function maskCep(value: string) { const d = digits(value, 8); return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d; }
function maskMoney(value: string) { const d = digits(value, 10); return d ? (Number(d) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : ""; }

function Field({ label, error, children }: { label: string; error: string | undefined; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm font-semibold text-brand-blue-dark">{label}</Label>{children}{error ? <p className="mt-1 text-xs italic text-destructive">{error}</p> : null}</div>;
}

export function CardApplicationForm() {
  const navigate = useNavigate();
  const submit = useServerFn(submitCardApplication);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CardApprovalResult | null>(null);
  const set = (key: keyof FormData, value: string | number) => setData((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    sessionStorage.setItem("cartao:solicitacao", JSON.stringify(data));
  }, [data]);

  function validateStep(target: number) {
    const next: Record<string, string> = {};
    if (target === 1) {
      if (data.nome.trim().split(/\s+/).length < 2) next["nome"] = "Informe seu nome completo.";
      if (!cpfValido(data.cpf)) next["cpf"] = "Informe um CPF válido.";
      if (!data.dataNascimento || data.dataNascimento > new Date().toISOString().slice(0, 10)) next["dataNascimento"] = "Informe uma data válida.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) next["email"] = "Informe um e-mail válido.";
      if (digits(data.telefone, 11).length !== 11) next["telefone"] = "Informe um celular válido.";
    } else if (target === 2) {
      if (Number(digits(data.rendaMensal, 10)) <= 0) next["rendaMensal"] = "Informe sua renda mensal.";
      if (data.profissao.trim().length < 2) next["profissao"] = "Informe sua profissão.";
      if (digits(data.cep, 8).length !== 8) next["cep"] = "Informe um CEP válido.";
      for (const key of ["endereco", "numero", "bairro", "cidade"] as const) if (!data[key].trim()) next[key] = "Campo obrigatório.";
      if (!/^[A-Za-z]{2}$/.test(data.estado.trim())) next["estado"] = "Use a sigla com 2 letras.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function continueTo(next: number) { if (validateStep(step)) { setErrors({}); setStep(next); window.scrollTo({ top: 0, behavior: "smooth" }); } }

  async function send() {
    if (!validateStep(1) || !validateStep(2)) return;
    setSubmitting(true);
    setErrors({});
    try {
      const submissionResult = await submit({ data: {
        nome: data.nome, cpf: digits(data.cpf, 11), dataNascimento: data.dataNascimento,
        email: data.email, telefone: digits(data.telefone, 11), rendaMensal: Number(digits(data.rendaMensal, 10)),
        profissao: data.profissao, cep: digits(data.cep, 8), endereco: data.endereco, numero: data.numero,
        complemento: data.complemento, bairro: data.bairro, cidade: data.cidade, estado: data.estado,
        limitePretendido: data.limitePretendido * 100,
      }});
      setSubmitting(false);
      setAnalyzing(true);
      await new Promise((resolve) => setTimeout(resolve, 7000));
      sessionStorage.removeItem("cartao:solicitacao");
      setResult(submissionResult);
      setAnalyzing(false);
    } catch {
      setErrors({ submit: "Não foi possível enviar agora. Tente novamente em instantes." });
      setSubmitting(false);
      setAnalyzing(false);
    }
  }

  if (result) return <CardApplicationResult data={data} result={result} />;

  if (analyzing) return <LoadingScreen titulo="Analisando sua solicitação" subtitulo="Estamos processando suas informações. Isso levará apenas alguns instantes." rodape="" />;

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <div className="mb-7" aria-label={`Etapa ${step} de 3`}>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase text-muted-foreground"><span className="text-brand-orange">Etapa {step} de 3</span><span>{Math.round(step / 3 * 100)}%</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full bg-brand-orange transition-all ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`} /></div>
      </div>

      {step === 1 ? <div className="space-y-4">
        <h2 className="font-display text-xl font-bold italic uppercase text-brand-blue-dark">Seus dados</h2>
        <Field label="Nome Completo" error={errors["nome"]}><Input aria-label="Nome Completo" value={data.nome} onChange={(e) => set("nome", e.target.value)} maxLength={120} autoComplete="name" className={fieldClass} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CPF" error={errors["cpf"]}><Input aria-label="CPF" value={data.cpf} onChange={(e) => set("cpf", maskCpf(e.target.value))} inputMode="numeric" autoComplete="off" className={fieldClass} /></Field>
          <Field label="Data de Nascimento" error={errors["dataNascimento"]}><Input aria-label="Data de Nascimento" type="date" value={data.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)} max={new Date().toISOString().slice(0, 10)} className={`${fieldClass} pr-3`} /></Field>
        </div>
        <Field label="E-mail" error={errors["email"]}><Input aria-label="E-mail" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} maxLength={255} autoComplete="email" className={fieldClass} /></Field>
        <Field label="Celular / WhatsApp" error={errors["telefone"]}><Input aria-label="Celular / WhatsApp" type="tel" inputMode="numeric" value={data.telefone} onChange={(e) => set("telefone", maskPhone(e.target.value))} autoComplete="tel" className={fieldClass} /></Field>
        <Button type="button" onClick={() => continueTo(2)} className="mt-2 h-12 w-full bg-brand-orange font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark">Continuar <ArrowRight /></Button>
      </div> : null}

      {step === 2 ? <div className="space-y-4">
        <h2 className="font-display text-xl font-bold italic uppercase text-brand-blue-dark">Conte um pouco sobre você</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Renda Mensal" error={errors["rendaMensal"]}><Input aria-label="Renda Mensal" value={data.rendaMensal} onChange={(e) => set("rendaMensal", maskMoney(e.target.value))} inputMode="numeric" placeholder="R$ 3.500,00" className={fieldClass} /></Field>
          <Field label="Profissão" error={errors["profissao"]}><Input aria-label="Profissão" value={data.profissao} onChange={(e) => set("profissao", e.target.value)} maxLength={100} className={fieldClass} /></Field>
          <Field label="CEP" error={errors["cep"]}><Input aria-label="CEP" value={data.cep} onChange={(e) => set("cep", maskCep(e.target.value))} inputMode="numeric" autoComplete="postal-code" className={fieldClass} /></Field>
          <Field label="Endereço" error={errors["endereco"]}><Input aria-label="Endereço" value={data.endereco} onChange={(e) => set("endereco", e.target.value)} maxLength={160} autoComplete="street-address" className={fieldClass} /></Field>
          <Field label="Número" error={errors["numero"]}><Input aria-label="Número" value={data.numero} onChange={(e) => set("numero", e.target.value)} maxLength={20} className={fieldClass} /></Field>
          <Field label="Complemento (opcional)" error={undefined}><Input aria-label="Complemento (opcional)" value={data.complemento} onChange={(e) => set("complemento", e.target.value)} maxLength={100} className={fieldClass} /></Field>
          <Field label="Bairro" error={errors["bairro"]}><Input aria-label="Bairro" value={data.bairro} onChange={(e) => set("bairro", e.target.value)} maxLength={100} className={fieldClass} /></Field>
          <Field label="Cidade" error={errors["cidade"]}><Input aria-label="Cidade" value={data.cidade} onChange={(e) => set("cidade", e.target.value)} maxLength={100} autoComplete="address-level2" className={fieldClass} /></Field>
          <Field label="Estado" error={errors["estado"]}><Input aria-label="Estado" value={data.estado} onChange={(e) => set("estado", e.target.value.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase())} placeholder="UF" autoComplete="address-level1" className={fieldClass} /></Field>
        </div>
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setStep(1)} className="h-12 flex-1 border-brand-blue text-brand-blue-dark"><ArrowLeft /> Voltar</Button><Button type="button" onClick={() => continueTo(3)} className="h-12 flex-1 bg-brand-orange font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark">Continuar <ArrowRight /></Button></div>
      </div> : null}

      {step === 3 ? <div>
        <h2 className="font-display text-xl font-bold italic uppercase text-brand-blue-dark">Qual limite você gostaria de ter?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Informe apenas o limite pretendido. O valor selecionado não representa aprovação, garantia ou limite definitivo do cartão.</p>
        <div className="mt-7 text-center"><p className="text-xs font-bold uppercase text-brand-blue">Limite pretendido</p><p className="mt-1 font-display text-4xl font-bold italic text-brand-blue-dark">{formatBRL(data.limitePretendido)}</p></div>
        <Slider className="mt-7" min={300} max={10000} step={100} value={[data.limitePretendido]} onValueChange={(value) => set("limitePretendido", value[0] ?? 2000)} aria-label="Limite pretendido" />
        <div className="mt-5 grid grid-cols-5 gap-1.5">{[500,1000,2000,3000,5000].map((value) => <Button key={value} type="button" variant={data.limitePretendido === value ? "default" : "outline"} onClick={() => set("limitePretendido", value)} className="h-9 px-1 text-[10px] sm:text-xs">{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</Button>)}</div>
        <aside className="mt-6 flex gap-3 rounded-md border border-brand-blue/20 bg-secondary p-4 text-sm leading-relaxed text-brand-blue-dark/80"><Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" /><p>O limite definitivo, caso haja aprovação, será definido após análise das informações fornecidas e poderá ser diferente do valor pretendido.</p></aside>
        {errors["submit"] ? <p className="mt-3 text-center text-sm italic text-destructive">{errors["submit"]}</p> : null}
        <div className="mt-6 flex gap-3"><Button type="button" variant="outline" onClick={() => setStep(2)} disabled={submitting} className="h-12 flex-1 border-brand-blue text-brand-blue-dark"><ArrowLeft /> Voltar</Button><Button type="button" onClick={send} disabled={submitting} className="h-12 flex-[1.6] bg-brand-orange font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark">{submitting ? <><Loader2 className="animate-spin" /> Salvando</> : <>Enviar solicitação <ArrowRight /></>}</Button></div>
      </div> : null}
    </div>
  );
}