import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, FileText, Info } from "lucide-react";
import factualCard from "@/assets/factual-card-isolated.png";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CardData = {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  rendaMensal: string;
  profissao: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type CardApprovalResult = {
  status: "recebida" | "aprovada";
  approvedLimit?: number;
  annualFee?: number;
  cardProduct?: string;
};

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-bold uppercase text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-semibold text-brand-blue-dark">{value}</dd></div>;
}

function TermsDialog({ open, onOpenChange, approvedLimit, annualFee }: { open: boolean; onOpenChange: (open: boolean) => void; approvedLimit: number; annualFee: number }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto rounded-lg p-5 sm:p-7">
      <DialogHeader>
        <DialogTitle className="font-display text-xl font-bold uppercase text-brand-blue-dark">Termos e Condições</DialogTitle>
        <DialogDescription className="font-semibold uppercase text-brand-blue">Cartão Factual Simple</DialogDescription>
      </DialogHeader>
      <div className="space-y-5 text-sm leading-relaxed text-foreground/80">
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Identificação do produto</h3><p>Cartão Factual Simple, modalidade cartão de crédito, com limite aprovado de {(approvedLimit / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.</p></section>
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Anuidade</h3><p>A anuidade é de {(annualFee / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. A primeira cobrança ocorre na contratação e uma nova cobrança poderá ocorrer a cada 12 meses enquanto o cartão permanecer ativo.</p></section>
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Pagamento e utilização</h3><p>As condições de pagamento, utilização do cartão e vencimento da fatura serão apresentadas antes da conclusão da contratação.</p></section>
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Atraso</h3><p>Eventuais encargos aplicáveis em caso de atraso serão informados nas condições definitivas do produto.</p></section>
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Tratamento de dados</h3><p>Os dados informados serão tratados para análise, contratação, atendimento e cumprimento das obrigações relacionadas ao produto.</p></section>
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Cancelamento</h3><p>As condições e os canais disponíveis para cancelamento serão apresentados na contratação.</p></section>
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Canais de atendimento</h3><p>SAC 0800 890 0367 e WhatsApp (18) 99826-7891.</p></section>
        <section><h3 className="font-bold uppercase text-brand-blue-dark">Disposições gerais</h3><p>A contratação depende da apresentação e aceitação das condições definitivas do Cartão Factual Simple.</p></section>
      </div>
      <DialogFooter><DialogClose asChild><Button type="button" className="bg-brand-blue text-primary-foreground hover:bg-brand-blue-dark">Fechar</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function CardApplicationResult({ data, result }: { data: CardData; result: CardApprovalResult }) {
  const navigate = useNavigate();
  const [termsOpen, setTermsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [continuationNotice, setContinuationNotice] = useState(false);

  if (result.status !== "aprovada" || result.approvedLimit === undefined || result.annualFee === undefined) {
    return <div className="px-5 py-10 text-center md:px-10 md:py-12">
      <CheckCircle2 className="mx-auto h-14 w-14 text-brand-orange" aria-hidden="true" />
      <h2 className="mt-5 font-display text-2xl font-bold italic uppercase text-brand-blue-dark">Solicitação recebida</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-blue-dark/80">Recebemos suas informações para análise da solicitação do Cartão Factual.</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-blue-dark/80">Caso seja necessário, entraremos em contato pelos dados informados.</p>
      <p className="mt-4 text-xs font-semibold uppercase text-muted-foreground">Este envio não representa aprovação nem garantia de limite.</p>
      <Button type="button" onClick={() => navigate({ to: "/" })} className="mt-7 h-11 bg-brand-orange px-5 font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark">Voltar para a página inicial</Button>
    </div>;
  }

  const product = result.cardProduct ?? "Factual Simple";
  const approvedLimit = result.approvedLimit;
  const annualFee = result.annualFee;
  const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return <div className="space-y-5 px-4 py-6 sm:px-7 md:py-8">
    <header className="text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />
      <p className="mt-3 text-xs font-bold uppercase text-brand-orange">Cartão {product}</p>
      <h2 className="mt-1 font-display text-2xl font-bold italic uppercase leading-tight text-brand-blue-dark md:text-3xl">Seu Cartão Factual Simple<br />foi aprovado</h2>
      <p className="mt-5 text-xs font-bold uppercase text-muted-foreground">Limite de crédito aprovado</p>
      <p className="mt-1 font-display text-4xl font-bold italic text-brand-blue-dark">{money(approvedLimit)}</p>
      <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-muted-foreground">O limite corresponde às condições aprovadas para esta solicitação e poderá ser alterado futuramente conforme as regras aplicáveis ao produto.</p>
    </header>

    <div className="flex justify-center overflow-hidden rounded-md bg-brand-blue-dark px-5 py-4"><img src={factualCard} alt="Cartão Factual Simple" className="h-auto w-full max-w-[390px] object-contain" /></div>

    <section className="rounded-md border border-border bg-card p-5"><h3 className="font-display font-bold uppercase text-brand-blue-dark">Dados do titular</h3><dl className="mt-4 grid gap-4 sm:grid-cols-2"><Detail label="Nome" value={data.nome} /><Detail label="CPF" value={maskCpf(data.cpf)} /><Detail label="Data de nascimento" value={formatDate(data.dataNascimento)} /><Detail label="E-mail" value={data.email} /><Detail label="Telefone" value={formatPhone(data.telefone)} /><Detail label="Profissão" value={data.profissao} /><Detail label="Renda informada" value={data.rendaMensal} /></dl></section>

    <section className="rounded-md border border-border bg-card p-5"><h3 className="font-display font-bold uppercase text-brand-blue-dark">Endereço de entrega do cartão</h3><p className="mt-3 text-sm font-semibold text-brand-blue-dark">{data.endereco}, {data.numero}{data.complemento ? ` — ${data.complemento}` : ""}</p><p className="mt-1 text-sm text-brand-blue-dark/80">{data.bairro} — {data.cidade}/{data.estado} — CEP {data.cep}</p><p className="mt-4 text-xs leading-relaxed text-muted-foreground">Caso a contratação seja concluída, o cartão será enviado para o endereço informado nesta solicitação.</p></section>

    <section className="rounded-md border border-border bg-card p-5"><div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-brand-orange" /><h3 className="font-display font-bold uppercase text-brand-blue-dark">Cartão Factual Simple</h3></div><dl className="mt-4 grid grid-cols-2 gap-4"><Detail label="Limite aprovado" value={money(approvedLimit)} /><Detail label="Tipo" value="Cartão de crédito" /><Detail label="Anuidade" value={money(annualFee)} /><Detail label="Renovação" value="A cada 12 meses" /><Detail label="Situação" value="Aprovado" /></dl></section>

    <section className="rounded-md border border-brand-orange/30 bg-secondary p-5"><h3 className="font-display font-bold uppercase text-brand-blue-dark">Anuidade do cartão</h3><p className="mt-3 font-display text-2xl font-bold text-brand-orange">{money(annualFee)}</p><p className="mt-3 text-sm leading-relaxed text-brand-blue-dark/80">O Cartão Factual Simple possui anuidade de {money(annualFee)}. A primeira cobrança ocorre na contratação do cartão. Enquanto o cartão permanecer ativo, uma nova cobrança de anuidade poderá ocorrer a cada período de 12 meses, conforme as condições contratuais do produto.</p><p className="mt-4 border-l-4 border-brand-orange pl-3 text-sm font-semibold text-brand-blue-dark">Esta cobrança corresponde à anuidade do cartão e não representa pagamento para garantir aprovação ou aumentar o limite.</p></section>

    <aside className="flex gap-3 rounded-md border border-brand-blue/20 bg-secondary p-4 text-sm leading-relaxed text-brand-blue-dark/80"><Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" /><p><strong>Importante:</strong> A aprovação está vinculada às informações e condições da solicitação analisada. Leia os termos e condições do Cartão Factual Simple antes de concluir a contratação.</p></aside>

    <Button type="button" variant="outline" onClick={() => setTermsOpen(true)} className="h-11 w-full border-brand-blue text-brand-blue-dark"><FileText /> Ler termos do cartão</Button>
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-brand-blue-dark"><Checkbox checked={accepted} onCheckedChange={(checked) => setAccepted(checked === true)} aria-label="Aceitar termos e condições do Cartão Factual Simple" className="mt-0.5" /><span>Li e estou de acordo com os Termos e Condições do Cartão Factual Simple, incluindo a informação sobre a anuidade de {money(annualFee)}.</span></label>
    {continuationNotice ? <p className="text-center text-sm text-muted-foreground">A continuação da contratação será disponibilizada quando a operação específica do cartão estiver ativa.</p> : null}
    <Button type="button" disabled={!accepted} onClick={() => setContinuationNotice(true)} className="h-12 w-full bg-brand-orange font-bold uppercase text-brand-orange-foreground hover:bg-brand-orange-dark">Continuar contratação</Button>
    <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} approvedLimit={approvedLimit} annualFee={annualFee} />
  </div>;
}