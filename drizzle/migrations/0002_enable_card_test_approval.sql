ALTER TABLE public.card_applications
  ADD COLUMN IF NOT EXISTS approved_limit integer,
  ADD COLUMN IF NOT EXISTS card_product text,
  ADD COLUMN IF NOT EXISTS annual_fee integer;

CREATE OR REPLACE FUNCTION public.submit_card_application(
  p_nome text,
  p_cpf text,
  p_data_nascimento date,
  p_email text,
  p_telefone text,
  p_renda_mensal integer,
  p_profissao text,
  p_cep text,
  p_endereco text,
  p_numero text,
  p_complemento text,
  p_bairro text,
  p_cidade text,
  p_estado text,
  p_limite_pretendido integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  -- TEMPORARY TEST RULE: set this single flag to false to restore the normal decision flow.
  CARTAO_TEST_MODE constant boolean := true;
BEGIN
  IF length(trim(p_nome)) < 3 OR length(trim(p_nome)) > 120
    OR p_cpf !~ '^\d{11}$'
    OR p_data_nascimento > CURRENT_DATE
    OR length(trim(p_email)) > 255 OR trim(p_email) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    OR p_telefone !~ '^\d{11}$'
    OR p_renda_mensal <= 0
    OR length(trim(p_profissao)) < 2 OR length(trim(p_profissao)) > 100
    OR p_cep !~ '^\d{8}$'
    OR length(trim(p_endereco)) < 2 OR length(trim(p_endereco)) > 160
    OR length(trim(p_numero)) < 1 OR length(trim(p_numero)) > 20
    OR length(COALESCE(trim(p_complemento), '')) > 100
    OR length(trim(p_bairro)) < 2 OR length(trim(p_bairro)) > 100
    OR length(trim(p_cidade)) < 2 OR length(trim(p_cidade)) > 100
    OR upper(trim(p_estado)) !~ '^[A-Z]{2}$'
    OR p_limite_pretendido < 30000 OR p_limite_pretendido > 1000000 OR p_limite_pretendido % 10000 <> 0
  THEN
    RAISE EXCEPTION 'invalid card application';
  END IF;

  INSERT INTO public.card_applications (
    nome, cpf, data_nascimento, email, telefone, renda_mensal, profissao,
    cep, endereco, numero, complemento, bairro, cidade, estado, limite_pretendido,
    status, approved_limit, card_product, annual_fee
  ) VALUES (
    trim(p_nome), p_cpf, p_data_nascimento, lower(trim(p_email)), p_telefone,
    p_renda_mensal, trim(p_profissao), p_cep, trim(p_endereco), trim(p_numero),
    NULLIF(trim(p_complemento), ''), trim(p_bairro), trim(p_cidade),
    upper(trim(p_estado)), p_limite_pretendido,
    CASE WHEN CARTAO_TEST_MODE THEN 'aprovada' ELSE 'recebida' END,
    CASE WHEN CARTAO_TEST_MODE THEN 80000 ELSE NULL END,
    CASE WHEN CARTAO_TEST_MODE THEN 'Factual Simple' ELSE NULL END,
    CASE WHEN CARTAO_TEST_MODE THEN 2990 ELSE NULL END
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_card_application_result(p_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'status', status,
    'approvedLimit', approved_limit,
    'cardProduct', card_product,
    'annualFee', annual_fee
  )
  FROM public.card_applications
  WHERE id = p_id
$$;

REVOKE ALL ON FUNCTION public.get_card_application_result(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_card_application_result(uuid) TO anon, authenticated, service_role;