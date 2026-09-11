import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function cpfValido(cpf: string) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i += 1) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10]);
}

const cardApplicationSchema = z.object({
  nome: z.string().trim().min(3).max(120).refine((value) => value.split(/\s+/).length >= 2),
  cpf: z.string().regex(/^\d{11}$/).refine(cpfValido),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date <= new Date();
  }),
  email: z.string().trim().email().max(255),
  telefone: z.string().regex(/^\d{11}$/),
  rendaMensal: z.number().int().positive().max(100_000_000),
  profissao: z.string().trim().min(2).max(100),
  cep: z.string().regex(/^\d{8}$/),
  endereco: z.string().trim().min(2).max(160),
  numero: z.string().trim().min(1).max(20),
  complemento: z.string().trim().max(100),
  bairro: z.string().trim().min(2).max(100),
  cidade: z.string().trim().min(2).max(100),
  estado: z.string().trim().regex(/^[A-Za-z]{2}$/).transform((value) => value.toUpperCase()),
  limitePretendido: z.number().int().min(30000).max(1000000).refine((value) => value % 10000 === 0),
});

export type CardApplicationInput = z.input<typeof cardApplicationSchema>;

export const submitCardApplication = createServerFn({ method: "POST" })
  .inputValidator((data) => cardApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"] ?? (import.meta.env["VITE_SUPABASE_URL"] as string | undefined);
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined);
    if (!url || !key) throw new Error("Serviço indisponível.");

    const client = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: id, error } = await client.rpc("submit_card_application", {
      p_nome: data.nome,
      p_cpf: data.cpf,
      p_data_nascimento: data.dataNascimento,
      p_email: data.email,
      p_telefone: data.telefone,
      p_renda_mensal: data.rendaMensal,
      p_profissao: data.profissao,
      p_cep: data.cep,
      p_endereco: data.endereco,
      p_numero: data.numero,
      p_complemento: data.complemento,
      p_bairro: data.bairro,
      p_cidade: data.cidade,
      p_estado: data.estado,
      p_limite_pretendido: data.limitePretendido,
    });
    if (error || !id) throw new Error("Não foi possível enviar a solicitação.");
    return { success: true };
  });