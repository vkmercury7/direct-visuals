CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

UPDATE public.service_tokens
SET secret = '7c7b8fac1766c3b65c721866e42fd441272470b4e8c21910f81c72a50df400d3'
WHERE name = 'pix_server';

INSERT INTO public.service_tokens (name, secret)
SELECT 'pix_server', '7c7b8fac1766c3b65c721866e42fd441272470b4e8c21910f81c72a50df400d3'
WHERE NOT EXISTS (SELECT 1 FROM public.service_tokens WHERE name = 'pix_server');

CREATE OR REPLACE FUNCTION public.check_service_token(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE v_hash text;
BEGIN
  SELECT secret INTO v_hash FROM public.service_tokens WHERE name = 'pix_server';
  IF v_hash IS NULL
     OR p_token IS NULL
     OR length(p_token) < 32
     OR encode(extensions.digest(p_token, 'sha256'), 'hex') <> v_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.check_service_token(text) FROM public, anon, authenticated;