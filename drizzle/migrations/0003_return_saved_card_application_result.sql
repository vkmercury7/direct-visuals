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
    'annualFee', annual_fee,
    'applicant', jsonb_build_object(
      'nome', nome,
      'cpf', cpf,
      'dataNascimento', data_nascimento,
      'email', email,
      'telefone', telefone,
      'rendaMensal', renda_mensal,
      'profissao', profissao,
      'cep', cep,
      'endereco', endereco,
      'numero', numero,
      'complemento', COALESCE(complemento, ''),
      'bairro', bairro,
      'cidade', cidade,
      'estado', estado
    )
  )
  FROM public.card_applications
  WHERE id = p_id
$$;