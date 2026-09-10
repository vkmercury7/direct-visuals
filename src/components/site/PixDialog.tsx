import { useEffect, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/loan-flow";
import type { PixChargeResult } from "@/lib/pix.functions";

type PixDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  pix: PixChargeResult | null;
  valor: number;
  onPago: () => void;
};

function useContagemRegressiva(expiresAt: string | null | undefined) {
  const [restante, setRestante] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) {
      setRestante(null);
      return;
    }
    const alvo = new Date(expiresAt).getTime();
    const atualizar = () => setRestante(Math.max(0, Math.floor((alvo - Date.now()) / 1000)));
    atualizar();
    const id = setInterval(atualizar, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (restante === null) return null;
  const min = String(Math.floor(restante / 60)).padStart(2, "0");
  const seg = String(restante % 60).padStart(2, "0");
  return `${min}:${seg}`;
}

export function PixDialog({ aberto, onOpenChange, pix, valor, onPago }: PixDialogProps) {
  const [copiado, setCopiado] = useState(false);
  const [qrImagem, setQrImagem] = useState<string | null>(null);
  const contagem = useContagemRegressiva(pix?.expires_at);

  useEffect(() => {
    let ativo = true;
    setQrImagem(null);
    if (!pix?.qr_code) return;
    void import("qrcode").then(async (mod) => {
      const url = await mod.default.toDataURL(pix.qr_code as string, { margin: 1, width: 480 });
      if (ativo) setQrImagem(url);
    });
    return () => {
      ativo = false;
    };
  }, [pix?.qr_code]);

  useEffect(() => {
    if (!aberto || !pix?.order_id) return;

    const channel = supabase
      .channel(`order-${pix.order_id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${pix.order_id}`,
        },
        (payload) => {
          const status = (payload.new as { status?: string }).status;
          if (status === "paid") onPago();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [aberto, pix?.order_id, onPago]);

  async function copiar() {
    if (!pix?.qr_code) return;
    await navigator.clipboard.writeText(pix.qr_code);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[20px] font-bold italic uppercase text-brand-blue-dark">
            Pague {formatBRL(valor)} via PIX
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center">
          {pix?.qr_code_url ? (
            <img
              src={pix.qr_code_url}
              alt="QR Code para pagamento PIX"
              width={240}
              height={240}
              className="h-60 w-60 rounded-lg border border-border bg-card object-contain p-2"
            />
          ) : (
            <div className="flex h-60 w-60 items-center justify-center rounded-lg border border-border bg-secondary">
              <Loader2 className="h-6 w-6 animate-spin text-brand-blue" aria-hidden="true" />
            </div>
          )}

          {pix?.qr_code ? (
            <>
              <p className="mt-5 w-full break-all rounded-md border border-border bg-secondary p-3 text-left text-[12px] leading-[1.4] text-brand-blue-dark">
                {pix.qr_code}
              </p>
              <Button
                type="button"
                onClick={copiar}
                className="mt-3 h-11 w-full rounded-md bg-brand-orange text-sm font-bold uppercase italic tracking-wide text-brand-orange-foreground hover:bg-brand-orange/90"
              >
                {copiado ? (
                  <>
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" /> Código copiado
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" /> Copiar código PIX
                  </>
                )}
              </Button>
            </>
          ) : null}

          {contagem ? (
            <p className="mt-4 text-[13px] italic text-muted-foreground">
              Este código expira em <span className="font-bold text-brand-blue">{contagem}</span>
            </p>
          ) : null}

          <p className="mt-4 flex items-center gap-2 text-[13px] italic text-brand-blue">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Aguardando confirmação do pagamento
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
