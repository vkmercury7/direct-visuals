export const LOAN_CONFIG = {
  min: 250,
  max: 4500,
  step: 250,
  initial: 1500,
  quickValues: [500, 1500, 3000, 4500],
} as const;

// Taxas provisórias de simulação (a.m.). Alterar aqui muda toda a aplicação.
export const LOAN_RATES: Record<number, number> = {
  3: 0.0299,
  6: 0.0329,
  9: 0.0349,
  12: 0.0379,
  18: 0.0419,
};

export const LOAN_TERMS = [3, 6, 9, 12, 18];

export type OpcaoParcelamento = {
  parcelas: number;
  taxaMensal: number;
  valorParcela: number;
  totalEstimado: number;
};

/** Sistema PRICE: PMT = P * [i(1+i)^n] / [(1+i)^n - 1] */
export function calcularParcela(principal: number, taxaMensal: number, n: number) {
  if (taxaMensal <= 0) return Math.round((principal / n) * 100) / 100;
  const f = Math.pow(1 + taxaMensal, n);
  return Math.round(((principal * (taxaMensal * f)) / (f - 1)) * 100) / 100;
}

export function calcularOpcoes(principal: number): OpcaoParcelamento[] {
  return LOAN_TERMS.map((n) => {
    const taxaMensal = LOAN_RATES[n] ?? 0;
    const valorParcela = calcularParcela(principal, taxaMensal, n);
    return {
      parcelas: n,
      taxaMensal,
      valorParcela,
      totalEstimado: Math.round(valorParcela * n * 100) / 100,
    };
  });
}

export function formatarTaxa(taxa: number) {
  return `${(taxa * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}% a.m.`;
}

const VALOR_KEY = "solicitacao:valorDesejado";

export function salvarValorDesejado(valor: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(VALOR_KEY, String(valor));
}

export function lerValorDesejado(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(VALOR_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return valorValido(n) ? n : null;
}

const SIM_KEY = "solicitacao:simulacao";

export type SimulacaoEscolhida = OpcaoParcelamento & { valorSolicitado: number };

export function salvarSimulacao(sim: SimulacaoEscolhida) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SIM_KEY, JSON.stringify(sim));
}

export const minLoanAmount = LOAN_CONFIG.min;
export const maxLoanAmount = LOAN_CONFIG.max;

export function valorValido(valor: number) {
  return Number.isFinite(valor) && valor >= minLoanAmount && valor <= maxLoanAmount;
}

export function clampValor(valor: number) {
  return Math.min(maxLoanAmount, Math.max(minLoanAmount, valor));
}

export type DadosPessoais = {
  nome: string;
  email: string;
  cpf: string;
  nascimento: string;
};

const STORAGE_KEY = "solicitacao:dadosPessoais";

export function salvarDadosPessoais(dados: DadosPessoais) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

export function lerDadosPessoais(): DadosPessoais | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DadosPessoais;
    if (!parsed?.nome || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function primeiroNome(nome: string) {
  return nome.trim().split(/\s+/)[0] ?? "";
}

export function mascararCpf(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}

export function formatarData(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

export function cpfValido(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}
