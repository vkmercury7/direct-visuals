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

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator(validar)
  .handler(async ({ data }): Promise<PixChargeResult> => {
    const token = process.env["PINPAY_TOKEN"];
    if (!token) {
      throw new Error("pagamento_indisponivel");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error: dbErr } = await supabaseAdmin
      .from("orders")
      .insert({ amount: PIX_AMOUNT_CENTS, status: "awaiting_payment" })
      .select()
      .single();

    if (dbErr || !order) {
      console.error("pix_order_insert_failed", dbErr?.message);
      throw new Error("erro_interno");
    }

    const siteUrl =
      process.env["PUBLIC_SITE_URL"] ??
      "https://project--a327450f-1522-4314-baf9-374281a248f6.lovable.app";

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
