CREATE TABLE public.card_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cpf text NOT NULL,
  data_nascimento date NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  renda_mensal integer NOT NULL,
  profissao text NOT NULL,
  cep text NOT NULL,
  endereco text NOT NULL,
  numero text NOT NULL,
  complemento text,
  bairro text NOT NULL,
  cidade text NOT NULL,
  estado text NOT NULL,
  limite_pretendido integer NOT NULL,
  status text NOT NULL DEFAULT 'recebida',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT card_applications_renda_positive CHECK (renda_mensal > 0),
  CONSTRAINT card_applications_limite_range CHECK (limite_pretendido BETWEEN 30000 AND 1000000 AND limite_pretendido % 10000 = 0),
  CONSTRAINT card_applications_estado_format CHECK (estado ~ '^[A-Z]{2}$')
);

GRANT ALL ON public.card_applications TO service_role;

ALTER TABLE public.card_applications ENABLE ROW LEVEL SECURITY;

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
    cep, endereco, numero, complemento, bairro, cidade, estado, limite_pretendido
  ) VALUES (
    trim(p_nome), p_cpf, p_data_nascimento, lower(trim(p_email)), p_telefone,
    p_renda_mensal, trim(p_profissao), p_cep, trim(p_endereco), trim(p_numero),
    NULLIF(trim(p_complemento), ''), trim(p_bairro), trim(p_cidade),
    upper(trim(p_estado)), p_limite_pretendido
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_card_application(text, text, date, text, text, integer, text, text, text, text, text, text, text, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_card_application(text, text, date, text, text, integer, text, text, text, text, text, text, text, text, integer) TO anon, authenticated, service_role;