import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatBRL,
  formatarTaxa,
  mascararCpf,
  type DadosPessoais,
  type SimulacaoEscolhida,
} from "@/lib/loan-flow";

type LoanContractDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  dados: DadosPessoais;
  simulacao: SimulacaoEscolhida;
};

const secoes = [
  {
    titulo: "4. PAGAMENTO DAS PARCELAS",
    conteudo: <p>O cliente compromete-se a realizar o pagamento das parcelas nas datas e condições apresentadas na contratação.</p>,
  },
  {
    titulo: "5. ATRASO E INADIMPLÊNCIA",
    conteudo: (
      <>
        <p>O não pagamento das obrigações nas datas acordadas poderá caracterizar inadimplência.</p>
        <p>Em caso de atraso poderão ser aplicados os encargos previstos no contrato e permitidos pela legislação aplicável.</p>
        <p>Poderão ser realizados procedimentos de cobrança relacionados às obrigações vencidas.</p>
        <p>Quando legalmente aplicável, informações sobre débitos em aberto também poderão ser comunicadas aos órgãos e bancos de dados de proteção ao crédito, incluindo serviços como SERASA, observados os procedimentos previstos na legislação aplicável.</p>
      </>
    ),
  },
  {
    titulo: "6. REGULARIZAÇÃO",
    conteudo: (
      <>
        <p>Em caso de débito em atraso, o cliente poderá utilizar os canais oficiais disponibilizados para consultar:</p>
        <ul className="list-disc space-y-1 pl-5"><li>saldo atualizado</li><li>parcelas pendentes</li><li>opções de pagamento</li><li>eventual negociação</li><li>regularização da dívida</li></ul>
        <p>Após eventual quitação ou regularização, serão adotados os procedimentos aplicáveis à atualização da situação do débito.</p>
      </>
    ),
  },
  {
    titulo: "7. TRATAMENTO DE DADOS",
    conteudo: (
      <>
        <p>Os dados fornecidos pelo cliente poderão ser tratados quando necessários para:</p>
        <ul className="list-disc space-y-1 pl-5"><li>análise da solicitação</li><li>contratação</li><li>execução da operação</li><li>prevenção a fraudes</li><li>cobrança</li><li>proteção do crédito</li><li>cumprimento de obrigações legais</li><li>exercício regular de direitos</li></ul>
        <p>O tratamento deverá observar a Política de Privacidade e a legislação aplicável.</p>
      </>
    ),
  },
  {
    titulo: "8. COMUNICAÇÕES E DOCUMENTOS",
    conteudo: (
      <><p>Documentos e comunicações referentes à operação poderão ser enviados para o e-mail e demais canais informados pelo cliente.</p><p>O cliente deve manter seus dados atualizados e conferir os documentos relacionados à contratação.</p></>
    ),
  },
  {
    titulo: "9. CONDIÇÕES FINANCEIRAS",
    conteudo: (
      <><p>Antes da conclusão definitiva da contratação, deverão ser apresentadas as condições efetivamente aplicáveis à operação, incluindo, quando cabível:</p><ul className="list-disc space-y-1 pl-5"><li>valor contratado</li><li>número de parcelas</li><li>valor das parcelas</li><li>juros</li><li>tributos</li><li>tarifas</li><li>encargos</li><li>CET</li><li>valor total da operação</li></ul></>
    ),
  },
  {
    titulo: "10. INADIMPLÊNCIA E PROTEÇÃO AO CRÉDITO",
    conteudo: (
      <><p>Caso existam obrigações vencidas e não regularizadas, poderão ser adotadas medidas de cobrança previstas no contrato e permitidas pela legislação.</p><p>Quando aplicável, o débito poderá ser comunicado aos órgãos de proteção ao crédito, observados os direitos do cliente e os procedimentos legais correspondentes.</p></>
    ),
  },
  {
    titulo: "11. ACEITE ELETRÔNICO",
    conteudo: (
      <><p>A contratação poderá ocorrer por meio eletrônico.</p><p>O aceite do cliente deverá ficar registrado no sistema e estar vinculado às condições apresentadas na contratação.</p></>
    ),
  },
  {
    titulo: "12. DISPOSIÇÕES FINAIS",
    conteudo: (
      <><p>Este documento apresenta condições gerais e deverá refletir as condições efetivamente aplicáveis à operação.</p><p>Nenhuma cláusula representa garantia automática de aprovação, liberação ou concessão do crédito.</p></>
    ),
  },
];

export function LoanContractDialog({ aberto, onOpenChange, dados, simulacao }: LoanContractDialogProps) {
  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-lg bg-card p-0">
        <DialogHeader className="shrink-0 border-b border-border px-5 py-5 pr-12 text-left md:px-7">
          <div className="flex items-center gap-2 text-brand-orange"><FileText className="h-5 w-5" aria-hidden="true" /><span className="text-xs font-bold uppercase">FACTUAL FINANCEIRA</span></div>
          <DialogTitle className="font-display text-xl font-bold uppercase text-brand-blue-dark md:text-2xl">Contrato de empréstimo pessoal</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">Este instrumento apresenta as condições gerais aplicáveis à operação de crédito contratada eletronicamente.</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-5 py-5 text-sm leading-relaxed text-brand-blue-dark md:px-7">
          <p>Os dados definitivos da operação serão apresentados ao cliente conforme as condições efetivamente aplicáveis à contratação.</p>

          <section className="mt-6 border-t border-border pt-5">
            <h3 className="font-display font-bold uppercase text-brand-blue">1. Identificação das partes</h3>
            <h4 className="mt-4 text-xs font-bold uppercase text-brand-orange">Cliente</h4>
            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
              <div><dt className="font-semibold">Nome:</dt><dd>{dados.nome}</dd></div>
              <div><dt className="font-semibold">CPF:</dt><dd>{mascararCpf(dados.cpf)}</dd></div>
              <div><dt className="font-semibold">E-mail:</dt><dd className="break-all">{dados.email}</dd></div>
              <div><dt className="font-semibold">Telefone:</dt><dd>{dados.telefone || "Não informado"}</dd></div>
            </dl>
            <h4 className="mt-5 text-xs font-bold uppercase text-brand-orange">Contratada / Credora</h4>
            <p className="mt-2 font-semibold">FACTUAL FINANCEIRA</p>
          </section>

          <section className="mt-6 space-y-3 border-t border-border pt-5">
            <h3 className="font-display font-bold uppercase text-brand-blue">2. Objeto</h3>
            <p>Este contrato estabelece as condições gerais relacionadas à operação de empréstimo pessoal escolhida pelo cliente durante a solicitação.</p>
            <p>As condições financeiras definitivas deverão corresponder à proposta efetivamente apresentada ao cliente.</p>
          </section>

          <section className="mt-6 border-t border-border pt-5 space-y-3">
            <h3 className="font-display font-bold uppercase text-brand-blue">3. Informações da operação</h3>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div><dt className="font-semibold">Valor solicitado:</dt><dd>{formatBRL(simulacao.valorSolicitado)}</dd></div>
              <div><dt className="font-semibold">Quantidade de parcelas:</dt><dd>{simulacao.parcelas}</dd></div>
              <div><dt className="font-semibold">Valor da parcela:</dt><dd>{formatBRL(simulacao.valorParcela)}</dd></div>
              <div><dt className="font-semibold">Taxa de juros:</dt><dd>{formatarTaxa(simulacao.taxaMensal)}</dd></div>
              <div><dt className="font-semibold">CET:</dt><dd>Informado nas condições definitivas</dd></div>
              <div><dt className="font-semibold">Valor total:</dt><dd>{formatBRL(simulacao.totalEstimado)}</dd></div>
            </dl>
          </section>

          {secoes.map((secao) => (
            <section key={secao.titulo} className="mt-6 space-y-3 border-t border-border pt-5">
              <h3 className="font-display font-bold uppercase text-brand-blue">{secao.titulo}</h3>
              {secao.conteudo}
            </section>
          ))}

          <aside className="mt-6 rounded-lg border border-brand-blue/20 bg-secondary p-4 text-brand-blue-dark">
            Leia atentamente todas as condições antes de confirmar a contratação. Em caso de dúvida, utilize os canais oficiais da FACTUAL FINANCEIRA.
          </aside>
          <Button type="button" onClick={() => onOpenChange(false)} className="mt-5 h-11 w-full bg-brand-blue font-bold uppercase text-primary-foreground hover:bg-brand-blue/90">Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}