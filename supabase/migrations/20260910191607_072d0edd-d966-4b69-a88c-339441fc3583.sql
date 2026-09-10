CREATE TABLE public.service_tokens (
  name text PRIMARY KEY,
  secret text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.service_tokens TO service_role;
ALTER TABLE public.service_tokens ENABLE ROW LEVEL SECURITY;

INSERT INTO public.service_tokens (name, secret)
VALUES ('pix_server', 'd831d5468c28f0443c07157c0af89513f276d8b2e96b1f0f66676f0097249df0');

CREATE OR REPLACE FUNCTION public.check_service_token(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_secret text;
BEGIN
  SELECT secret INTO v_secret FROM public.service_tokens WHERE name = 'pix_server';
  IF v_secret IS NULL OR p_token IS NULL OR length(p_token) < 32 OR p_token <> v_secret THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.check_service_token(text) FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.pix_create_order(p_token text, p_amount integer)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid;
BEGIN
  PERFORM public.check_service_token(p_token);
  INSERT INTO public.orders (amount, status) VALUES (p_amount, 'awaiting_payment')
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.pix_create_order(text, integer) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.pix_update_order(
  p_token text,
  p_order_id uuid,
  p_pinpay_id text DEFAULT NULL,
  p_qr_code text DEFAULT NULL,
  p_qr_code_url text DEFAULT NULL,
  p_expires_at timestamptz DEFAULT NULL,
  p_status text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.check_service_token(p_token);
  UPDATE public.orders SET
    pinpay_id = COALESCE(p_pinpay_id, pinpay_id),
    qr_code = COALESCE(p_qr_code, qr_code),
    qr_code_url = COALESCE(p_qr_code_url, qr_code_url),
    expires_at = COALESCE(p_expires_at, expires_at),
    status = COALESCE(p_status, status)
  WHERE id = p_order_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.pix_update_order(text, uuid, text, text, text, timestamptz, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.pix_apply_webhook(
  p_token text,
  p_event text,
  p_transaction_id text,
  p_order_id uuid,
  p_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_new_status text;
BEGIN
  PERFORM public.check_service_token(p_token);

  BEGIN
    INSERT INTO public.processed_webhooks (key) VALUES (p_transaction_id || ':' || p_event);
  EXCEPTION WHEN unique_violation THEN
    RETURN false;
  END;

  v_new_status := CASE
    WHEN p_event = 'payment_approved' THEN 'paid'
    WHEN p_event = 'payment_refunded' THEN 'refunded'
    WHEN p_event = 'payment_failed' THEN COALESCE(p_status, 'failed')
    ELSE NULL
  END;

  IF v_new_status IS NOT NULL THEN
    IF p_order_id IS NOT NULL THEN
      UPDATE public.orders SET status = v_new_status WHERE id = p_order_id;
    ELSE
      UPDATE public.orders SET status = v_new_status WHERE pinpay_id = p_transaction_id;
    END IF;
  END IF;

  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.pix_apply_webhook(text, text, text, uuid, text) TO anon, authenticated;