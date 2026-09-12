CREATE OR REPLACE FUNCTION public.get_card_application_status(p_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status
  FROM public.card_applications
  WHERE id = p_id
$$;

REVOKE ALL ON FUNCTION public.get_card_application_status(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_card_application_status(uuid) TO anon, authenticated, service_role;