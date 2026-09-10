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

        const { createClient } = await import("@supabase/supabase-js");
        const url =
          process.env["SUPABASE_URL"] ??
          (import.meta.env["VITE_SUPABASE_URL"] as string | undefined);
        const key =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ??
          (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined);
        const serviceToken = process.env["PIX_SERVER_TOKEN"];
        if (!url || !key || !serviceToken) {
          console.error("pix_db_config_missing");
          return new Response(null, { status: 500 });
        }

        const db = createClient(url, key, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const { error } = await db.rpc("pix_apply_webhook", {
          p_token: serviceToken,
          p_event: event,
          p_transaction_id: data.transaction_id,
          p_order_id: data.metadata?.order_id ?? null,
          p_status: data.status ?? null,
        });

        if (error) {
          console.error("pinpay_webhook_update_failed", error.message);
          return new Response(null, { status: 500 });
        }

        return new Response(null, { status: 200 });

      },
    },
  },
});
