import { createServerFn } from "@tanstack/react-start";

export type PixChargeResult = {
  order_id: string;
  qr_code: string | null;
  qr_code_url: string | null;
  expires_at: string | null;
};

export const PIX_AMOUNT_CENTS = 2990;

type CreatePixInput = {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
};

function validar(input: CreatePixInput): CreatePixInput {
  const name = String(input?.name ?? "").trim();
  const email = String(input?.email ?? "").trim();
  const cpf = String(input?.cpf ?? "").replace(/\D/g, "");
  const phone = String(input?.phone ?? "").replace(/\D/g, "");
  if (!name || !email || cpf.length !== 11) {
    throw new Error("dados_invalidos");
  }
  return { name, email, cpf, phone };
}

// Cliente server-side com a chave publicável (pública) + token de serviço.
// Evita depender da service role key, que não existe fora do ambiente Lovable.
async function getServerDb() {
  const { createClient } = await import("@supabase/supabase-js");
  const url =
    process.env["SUPABASE_URL"] ?? (import.meta.env["VITE_SUPABASE_URL"] as string | undefined);
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined);
  const token = process.env["PIX_SERVER_TOKEN"];
  if (!url || !key || !token) {
    console.error("pix_db_config_missing", {
      url: Boolean(url),
      key: Boolean(key),
      token: Boolean(token),
    });
    throw new Error("erro_interno");
  }
  const client = createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return { client, token };
}

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator(validar)
  .handler(async ({ data }): Promise<PixChargeResult> => {
    const token = process.env["PINPAY_TOKEN"];
    if (!token) {
      throw new Error("pagamento_indisponivel");
    }

    const { client: db, token: serviceToken } = await getServerDb();

    const { data: orderId, error: dbErr } = await db.rpc("pix_create_order", {
      p_token: serviceToken,
      p_amount: PIX_AMOUNT_CENTS,
    });

    if (dbErr || !orderId) {
      console.error("pix_order_insert_failed", dbErr?.message);
      throw new Error("erro_interno");
    }

    const order = { id: orderId as string };


    // Origem da cobrança: variável explícita > variáveis do provedor de deploy
    // (Netlify define URL / DEPLOY_PRIME_URL) > origem real da requisição atual.
    const siteUrl = await (async () => {
      const explicito =
        process.env["PUBLIC_SITE_URL"] ??
        process.env["URL"] ??
        process.env["DEPLOY_PRIME_URL"];
      if (explicito) return explicito.replace(/\/+$/, "");
      try {
        const { getRequestUrl } = await import("@tanstack/react-start/server");
        return getRequestUrl().origin;
      } catch {
        return "";
      }
    })();

    try {
      const response = await fetch("https://api.usepinpay.com/functions/v1/api-v1/pix", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Idempotency-Key": order.id,
        },
        body: JSON.stringify({
          amount: PIX_AMOUNT_CENTS,
          description: "Confirmação de contratação",
          customer: {
            name: data.name,
            email: data.email,
            document: { type: "CPF", number: data.cpf },
            ...(data.phone ? { phone: data.phone } : {}),
          },
          expires_in: 1200,
          webhook_url: `${siteUrl}/api/public/pinpay-webhook`,
          metadata: {
            order_id: order.id,
            external_reference: order.id,
            checkout_url: `${siteUrl}/analise-solicitacao`,
          },
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        const detalhe = await response.text().catch(() => "");
        console.error("pinpay_pix_failed", response.status, detalhe.slice(0, 500));
        await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
        throw new Error("gateway_error");
      }

      const resposta = (await response.json()) as {
        id?: string;
        transaction_id?: string;
        qr_code?: string;
        qr_code_url?: string;
        expires_at?: string;
        pix?: { qr_code?: string; qr_code_url?: string; expires_at?: string };
      };

      const patch = {
        pinpay_id: resposta.id ?? resposta.transaction_id ?? null,
        qr_code: resposta.pix?.qr_code ?? resposta.qr_code ?? null,
        qr_code_url: resposta.pix?.qr_code_url ?? resposta.qr_code_url ?? null,
        expires_at: resposta.pix?.expires_at ?? resposta.expires_at ?? null,
      };

      await supabaseAdmin.from("orders").update(patch).eq("id", order.id);

      return {
        order_id: order.id,
        qr_code: patch.qr_code,
        qr_code_url: patch.qr_code_url,
        expires_at: patch.expires_at,
      };
    } catch (error) {
      if (error instanceof Error && (error.message === "gateway_error" || error.message === "erro_interno")) {
        throw error;
      }
      console.error("pinpay_pix_exception", error instanceof Error ? error.message : "unknown");
      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
      throw new Error("gateway_error");
    }
  });
