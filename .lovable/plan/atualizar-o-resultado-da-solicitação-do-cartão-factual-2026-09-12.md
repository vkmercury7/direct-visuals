# Atualizar o resultado da solicitação do Cartão Factual

## Fluxo após o envio
- Manter as três etapas atuais intactas e continuar salvando o lead na tabela `card_applications` antes de qualquer resultado.
- Após o salvamento bem-sucedido, mostrar por 7 segundos a tela FACTUAL FINANCEIRA com logo, spinner e os textos de análise solicitados.
- Encerrar o carregamento automaticamente e decidir a tela seguinte por um estado explícito de aprovação.

## Resultado seguro
- Como hoje não existe regra real de aprovação, usar o status real atual `recebida` e mostrar somente “SOLICITAÇÃO RECEBIDA”, sem limite aprovado, cartão aprovado ou cobrança.
- Deixar o código preparado para reconhecer futuramente o status `aprovada`, sem alterar ou inventar uma regra de decisão.
- Quando esse status real existir, exibir a área premium solicitada com cartão Factual Simple, limite e anuidade, dados do titular, endereço, condições, termos em janela e aceite obrigatório antes de “CONTINUAR CONTRATAÇÃO”.
- O botão de continuidade não será ligado ao PIX do empréstimo nem a qualquer cobrança até existir uma integração própria do cartão.

## Escopo preservado
- Não alterar a página inicial, etapas 1 e 2, aparência da etapa 3, campos, navegação de volta, fluxo de empréstimo, PinPay, webhooks, tokens, cabeçalho ou rodapé.
- Não recriar a tabela nem apagar registros; os campos existentes já permitem registrar a solicitação com status `recebida`.

## Verificação
- Testar salvamento, carregamento temporizado, resultado recebido e preservação dos dados.
- Verificar celular e computador, janela de termos no estado aprovado e ausência de ligação com o PIX do empréstimo.
