import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

type WebhookPayload = {
  event?: string;
  data?: {
    transaction_id?: string;
    status?: string;
    metadata?: { order_id?: string };
  };
};

export const Route = createFileRoute("/api/public/pinpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["PINPAY_WEBHOOK_SECRET"];
        if (!secret) {
          console.error("pinpay_webhook_secret_missing");
          return new Response(null, { status: 500 });
        }

        const signature = request.headers.get("x-webhook-signature");
        if (!signature) return new Response(null, { status: 401 });

        const rawBody = await request.text();
        const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");

        const received = Buffer.from(signature);
        const expectedBuf = Buffer.from(expected);
        if (received.length !== expectedBuf.length || !timingSafeEqual(received, expectedBuf)) {
          return new Response(null, { status: 401 });
        }

        let payload: WebhookPayload;
        try {
          payload = JSON.parse(rawBody) as WebhookPayload;
        } catch {
          return new Response(null, { status: 400 });
        }

        const event = payload.event;
        const data = payload.data ?? {};
        if (!event || !data.transaction_id) return new Response(null, { status: 200 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const dedupeKey = `${data.transaction_id}:${event}`;
        const { error: dedupeError } = await supabaseAdmin
          .from("processed_webhooks")
          .insert({ key: dedupeKey });
        if (dedupeError) {
          // chave duplicada = evento já processado
          return new Response(null, { status: 200 });
        }

        const novoStatus =
          event === "payment_approved"
            ? "paid"
            : event === "payment_refunded"
              ? "refunded"
              : event === "payment_failed"
                ? (data.status ?? "failed")
                : null;

        if (novoStatus) {
          const query = supabaseAdmin.from("orders").update({ status: novoStatus });
          const { error } = data.metadata?.order_id
            ? await query.eq("id", data.metadata.order_id)
            : await query.eq("pinpay_id", data.transaction_id);
          if (error) {
            console.error("pinpay_webhook_update_failed", error.message);
            return new Response(null, { status: 500 });
          }
        }

        return new Response(null, { status: 200 });
      },
    },
  },
});
