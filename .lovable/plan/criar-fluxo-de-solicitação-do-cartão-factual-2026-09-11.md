# Criar fluxo de solicitação do Cartão Factual

## Página inicial
- Fazer o botão “QUERO MEU CARTÃO” abrir a tela de transição da FACTUAL por aproximadamente 2 segundos.
- Ao terminar, direcionar para a nova rota `/cartao`.
- Não alterar o restante do card, os demais banners ou o formulário de empréstimo.

## Nova página `/cartao`
- Criar uma página curta, centralizada e responsiva com logo, título, aviso “Sujeito à análise” e progresso de 3 etapas.
- Etapa 1: nome, CPF, nascimento, e-mail e celular, com máscaras e validações brasileiras.
- Etapa 2: renda, profissão e endereço completo, mantendo complemento opcional e preenchimento manual.
- Etapa 3: limite pretendido de R$ 300 a R$ 10.000, em passos de R$ 100, com atalhos e avisos de que o valor não é garantido.
- Preservar todos os dados ao avançar e voltar.
- Após o envio, mostrar um carregamento curto e a confirmação solicitada, com retorno à página inicial.

## Salvamento seguro
- Criar uma tabela exclusiva para solicitações de cartão no banco do site.
- Permitir apenas o envio público validado; não expor consulta, alteração ou exclusão de dados pessoais ao visitante.
- Validar novamente todos os campos no servidor antes de salvar.
- Não incluir PIX, pagamento, cobrança ou qualquer integração do empréstimo.

## Verificação
- Testar o percurso completo no celular e no computador, incluindo máscaras, erros, avanço/retorno, salvamento e confirmação.
- Confirmar ausência de rolagem horizontal, erros no navegador e alterações no fluxo existente de empréstimo.
