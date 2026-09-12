# Aprovação temporária do Cartão Factual

## Objetivo
Ativar um modo de teste centralizado que aprove todas as novas solicitações do Cartão Factual, sem alterar o empréstimo, PIX, PinPay ou o visual.

## Alterações
- Adicionar à tabela existente `card_applications` os campos de resultado do cartão: limite aprovado, produto e anuidade, sem recriar a tabela nem remover registros.
- Centralizar no banco a constante temporária `CARTAO_TEST_MODE = true` dentro da rotina de envio. Enquanto ativa, cada novo lead será salvo com `status = 'aprovada'`, limite de R$ 800,00, produto `Factual Simple` e anuidade de R$ 29,90.
- Ampliar a consulta segura do resultado para retornar o status e os dados da própria solicitação salva, sem expor a tabela diretamente.
- Manter o loading existente por 7000 ms e, após a consulta, abrir diretamente a tela já criada de aprovação. A tela “Solicitação recebida” continuará disponível apenas para quando o modo de teste for desativado ou houver outro status real.
- Fazer a tela aprovada usar os dados retornados do registro salvo, preservando termos, aceite obrigatório e botão de continuação sem conexão com o PIX.

## Validação
- Confirmar que uma nova solicitação é gravada como aprovada com os valores temporários definidos.
- Testar o fluxo completo no celular: três etapas, salvamento, loading de 7 segundos e tela de aprovação com os dados preenchidos.
- Confirmar que nenhum arquivo de empréstimo, PIX, PinPay, webhook ou infraestrutura relacionada foi alterado.
