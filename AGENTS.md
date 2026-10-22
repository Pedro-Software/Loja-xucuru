# AGENTS.md — Loja Xukuru

## Objetivo
Construir um MVP demonstrativo de loja virtual de artesanato Xukuru do Ororubá (Pesqueira, Pernambuco). O documento principal é `docs/BRIEFING.md`, transcrito do DOCX original em `docs/briefing-original.docx`. Antes de implementar qualquer etapa, leia ambos se possível e siga esta especificação.

## Stack obrigatória
- HTML5, CSS3, JavaScript moderno com módulos ES; sem React/Vue/Angular/TypeScript.
- Vite para desenvolvimento e build multipágina, Tailwind CSS 4 com plugin `@tailwindcss/vite`, sem CDN em produção.
- Node.js + Express APENAS a partir da etapa de API e checkout demonstrativo.
- Dados de produtos demonstrativos em `public/data/produtos.json` como fonte única; carrinho persistido no `localStorage` e validado no servidor quando houver backend.
- Páginas: `/index.html`, `/catalogo.html`, `/produto.html?id=...`, `/carrinho.html`, `/checkout.html`, `/sobre.html`, `/historia.html`.

## Direção visual
- Usar Impeccable **quando disponível** para decisões e revisão de frontend; inicializar o contexto em `PRODUCT.md` e registrar regras de design em `DESIGN.md`.
- Verde #1F3E2B; terracota #C45A35; fundo #F9F6F0; cards #FFFFFF; texto #2B231F; ocre #D99B26.
- Identidade editorial elegante: destaque à fotografia, boa hierarquia tipográfica, espaços generosos, alto contraste, responsividade e performance.
- Nunca usar símbolos sagrados, adornos supostamente tradicionais ou fotografias de pessoas indígenas sem comprovação/autorização.
- Não alegar parceria, endosso comunitário, receitas destinadas a famílias, origem ou autoria de uma peça sem verificação.
- O nome 'Arte Xukuru' aparece como sugestão no briefing; manter marca provisória 'Loja Xukuru' até confirmação.

## Conteúdo e funcionalidade
- 8 produtos **claramente marcados como demonstrativos**. Não atribuir nomes reais de artesãos, comunidades ou procedência a dados fictícios.
- Placeholder local para imagens sem fotografias autorizadas; nunca imagens quebradas nem download de imagens com licenças desconhecidas.
- Início: hero 'Arte Ancestral do Povo Xukuru', CTA 'Conhecer a Coleção', destaques, propósito.
- Catálogo: busca textual, categoria, preço e ordenação por preço. 'Mais vendidos' apenas se houver informação real; se não, usar 'Destaques'.
- Produto: imagens, contexto, materiais (se verificados; caso contrário 'Informação a confirmar'), quantidade e CTA.
- Carrinho: atualizar/remover itens, calcular subtotal, persistir recarga e exibir contagem no header.
- História: usar texto factual prudente e um link para https://pt.wikipedia.org/wiki/Xucurus tanto na página quanto no rodapé; não tratar Wikipédia como aprovação do povo.
- Links sociais sem URL oficial confirmada: não exibir destino fictício.

## Pagamentos/frete do protótipo
- Não receber nem solicitar dados de cartão, CPF, endereço completo ou telefone no checkout de demonstração.
- Nunca afirmar que há pagamento real, pedido confirmado, selo de segurança certificado ou envio nacional efetivamente disponível.
- Exibir 'Demonstração — nenhum pagamento será cobrado' em checkout e finalização. Não gerar QR Code PIX funcional nem promessa de parcelamento.
- Simular no resumo a preferência Pix (desconto ilustrativo de 5%) ou cartão (6x ilustrativas), com rótulos claros e cálculo correto; não aplicar frete fictício.
- Para CEP, validar formato e retornar 'cotação de frete indisponível até integração com transportadora'; se implementada consulta de endereço, não confundir CEP reconhecido com frete calculado.
- Após Node, validar IDs, quantidades e preço final no servidor a partir da fonte de dados; pedido de demonstração não é venda e não deve armazenar PII.

## Critérios de qualidade
- Acessibilidade: HTML semântico, labels visíveis, navegação teclado, indicador de foco, alt apropriado, contraste, mensagens anunciadas via `aria-live`.
- Estados de carregamento, sem resultados, produto não encontrado, API indisponível e carrinho vazio.
- Não usar `innerHTML` com conteúdo controlado por usuário. Validar parâmetros de URL e todas as entradas no backend.
- `npm run build` deve passar e todos os links internos devem funcionar.
- Criar README com setup, scripts, arquitetura, limitações e próximos passos para produção.
- Completar apenas a etapa solicitada por prompt, sem reescrever componentes estáveis nem introduzir tecnologias fora da stack.
- No fim de cada etapa, mostrar: arquivos criados/alterados, comandos executados, testes realizados, pendências e como testar no navegador.
