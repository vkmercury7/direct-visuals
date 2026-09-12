# Corrigir o resultado final da solicitação do cartão

## Fluxo final
- Manter intactas as três etapas e o salvamento atual em `card_applications`.
- Após salvar, manter a análise visível por aproximadamente 7 segundos.
- Ao terminar, consultar o status real do registro recém-criado e abrir diretamente o resultado correspondente.
- Mostrar a tela aprovada somente para `status = aprovada`; manter “Solicitação recebida” como fallback, sem passagem intermediária no caminho aprovado.

## Consulta segura
- Usar o identificador retornado no salvamento para consultar somente os dados de decisão necessários no servidor.
- Não expor dados pessoais nem liberar leitura pública da tabela.
- Para uma aprovação real, apresentar o produto Factual Simple, limite de R$ 800,00 e anuidade de R$ 29,90 conforme solicitado.

## Escopo preservado
- Não alterar formulário, etapas, página inicial, empréstimo, PIX, PinPay, webhooks, tokens, cabeçalho ou rodapé.
- Não recriar a tabela, apagar ou modificar registros existentes.

## Verificação
- Testar que `aprovada` abre diretamente a tela de aprovação e que os demais status nunca exibem mensagem de aprovação.
- Confirmar o carregamento de 7 segundos e a preservação dos dados preenchidos.
