export const LOAN_CONFIG = {
  min: 500,
  max: 20000,
  step: 500,
  initial: 5000,
  quickValues: [1000, 3000, 5000, 10000],
} as const;

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
