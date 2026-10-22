# Prompts para Codex — Loja Xukuru

**Como usar:** abra `C:\projetos\lojaxucuru` no VS Code, extraia os arquivos deste kit nela, ative o Codex e cole **um prompt por vez**, na ordem. O Codex deve editar os arquivos da pasta. Revise e teste antes de passar ao próximo prompt.

## Prompt 1 — Analisar e preparar a infraestrutura

```text
Você está trabalhando em C:\projetos\lojaxucuru. Leia obrigatoriamente AGENTS.md e docs/BRIEFING.md antes de alterar arquivos. Quero implementar um MVP de loja virtual de artesanato do povo Xukuru do Ororubá. Nesta etapa, faça apenas a infraestrutura técnica.

1. Inspecione os arquivos existentes e preserve os documentos.
2. Verifique se Node.js/npm estão disponíveis; caso não estejam, informe os comandos e interrompa apenas as operações impossíveis.
3. Configure projeto Vite com HTML/CSS/JavaScript puro (ES modules), multipágina, sem frameworks JS.
4. Configure Tailwind CSS 4 por @tailwindcss/vite e CSS global `@import "tailwindcss"` com as cores de AGENTS.md.
5. Crie as entradas HTML index.html, catalogo.html, produto.html, carrinho.html, checkout.html, sobre.html, historia.html e configure build multipágina do Vite para gerar todas as páginas.
6. Crie arquitetura clara (`src/js`, `src/css`, `public/images`, `public/data`), `.gitignore`, scripts npm `dev`, `build`, `preview` e README inicial.
7. Crie navegação básica real entre páginas; placeholders claros são aceitáveis nesta etapa.
8. Execute instalação e `npm run build` e corrija problemas.

NÃO implemente checkout, API, pagamentos ou estética final nesta etapa. Ao concluir, mostre a árvore de arquivos, scripts, resultado do build e como abrir no navegador. Não encerre sem testar os comandos disponíveis.
```

**Verificação:** `npm run dev` abre o site e as sete páginas carregam sem erro.

## Prompt 2 — Design system, header, footer e Home (Impeccable)

```text
Leia AGENTS.md, docs/BRIEFING.md e a implementação atual. Se a skill estiver disponível, use $impeccable para orientar o design. Respeite PRODUCT.md e DESIGN.md, se existirem. Implemente SOMENTE design global e a Home.

Direção: e-commerce artesanal contemporâneo, editorial e premium, acolhedor, regional, sem estética genérica de template e sem símbolos culturais inventados. Cor primária #1F3E2B, CTA #C45A35, fundo #F9F6F0, texto #2B231F e acentos #D99B26. Prefira tipografia legível, imagens amplas e espaçamento consistente. Mobile-first.

Criar header fixo com marca provisória Loja Xukuru, Início, Catálogo, Sobre, História, busca funcional que encaminhe à página catálogo e carrinho com contador. Menu mobile acessível. Rodapé com propósito, navegação, link da Wikipédia (https://pt.wikipedia.org/wiki/Xucurus) e pagamentos previstos corretamente rotulados, sem selos inventados ou Instagram não confirmado.

Home: hero 'Arte Ancestral do Povo Xukuru', texto contextual com cautela factual, CTA 'Conhecer a Coleção', seção para 4 a 8 produtos demonstrativos, bloco Propósito & Identidade e informações de funcionamento do protótipo. Pode usar placeholders locais bonitos, mas não tratar fotografias genéricas como produtos realmente Xukuru.

Crie componentes JS reaproveitáveis para header, footer e cards; cuide de semântica, acessibilidade, responsividade, estados hover/foco e desempenho. Execute npm run build e descreva os arquivos alterados. Não implemente nesta etapa lógica de catálogo/checkout.
```

**Verificação:** página inicial agradável em desktop e mobile, links e menu funcionando.

## Prompt 3 — Dados de demonstração e catálogo funcional

```text
Leia AGENTS.md e docs/BRIEFING.md, preserve o design e implemente exclusivamente o catálogo.

Crie 8 produtos de EXEMPLO em public/data/produtos.json com IDs únicos, nome não atribuído a artesão real, categoria entre cerâmica/trançados/biojoias/esculturas, descrição claramente demonstrativa, preço numérico em reais, materiais apenas se forem ilustrativos e sinalizados, imagem placeholder local, destaque e disponibilidade de demonstração. Nenhuma afirmação falsa sobre procedência, comunidade ou autoria.

Na página catalogo.html implemente: grade responsiva de cards, busca textual (aceita query string q), filtros por categoria, faixa de preço, ordenação menor preço/maior preço e destaques; botão limpar filtros; estado sem resultados; loading/error e indicação de produto demonstrativo. O card deve abrir produto.html?id=ID. Não criar 'mais vendidos' sem dados reais.

Centralize carregamento e formatação BRL em módulos reutilizáveis, trate erro do JSON. Reutilize header/footer e paleta. Garanta inputs com labels, navegação por teclado e layout utilizável no celular. Execute build e descreva roteiro de testes.
```

**Verificação:** buscas, filtro, ordenação, abertura de detalhe e limpeza funcionam.

## Prompt 4 — Detalhes do produto e carrinho

```text
Leia documentos e código atual. Implemente somente detalhes de produto e carrinho, sem backend ainda.

Produto: produto.html?id=..., carregar por ID a partir do catálogo demonstrativo, layout com imagem e informações da peça, materiais com aviso de demonstração, quantidade 1 a limite razoável, preço BRL, botão Adicionar ao Carrinho e mensagem acessível. Mostrar erro amigável se ID inexistente; não deixar a página quebrar.

Carrinho: guardar somente {id, quantidade} no localStorage, validar dados recuperados, derivar preços do catálogo, adicionar, aumentar/diminuir quantidades, remover, limpar, mostrar subtotal e quantidade no ícone do header, inclusive após atualizar/navegar. Tratar carrinho vazio com CTA Catálogo. Mostrar campo CEP com máscara/validação para 8 dígitos; sem contrato de frete não mostrar preço inventado: exibir 'Cotação de frete ainda não disponível'.

Inclua botões, mensagens e estados de foco acessíveis. Teste manualmente as sequências de compra e use build para conferir. Não crie QR PIX, formulários de cartão ou compra real.
```

**Verificação:** adicionou 2 itens, atualizou quantidade, recarregou e os valores permaneceram corretos.

## Prompt 5 — Sobre, História e contextualização cultural

```text
Leia AGENTS.md, docs/BRIEFING.md e os componentes existentes. Implemente somente sobre.html, historia.html e revisão editorial do rodapé.

Página Sobre: descrever o PROPÓSITO do projeto, intenção de apoiar comércio justo e valorização de artesãos; não afirmar que há parceria, distribuição de receita ou projeto oficial ainda sem comprovação. Explique que a loja está em MVP de demonstração.

Página História: conteúdo respeitoso, factual e objetivo sobre o povo Xukuru do Ororubá e o território na região de Pesqueira, Pernambuco, sem romantização nem invenção de costumes, cifras, falas ou imagens. Inclua card ao final: 'Deseja aprofundar seu conhecimento sobre o Povo Xukuru do Ororubá? Leia o artigo completo na Wikipédia', link https://pt.wikipedia.org/wiki/Xucurus abrindo em nova aba com rel seguro. Link também em 'Cultura & Leitura' no rodapé.

Não use falsos depoimentos, selos, dados de vendas ou fotos sem direito de uso. Reutilize o design system, inclua hierarquia de cabeçalhos, legibilidade e mobile. Execute build e teste os links.
```

**Verificação:** Sobre/História têm conteúdo prudente e links reais.

## Prompt 6 — Backend Express e checkout demonstrativo

```text
Leia integralmente AGENTS.md, docs/BRIEFING.md, PRODUCT.md/DESIGN.md se existirem e a estrutura atual. Nesta etapa, implemente backend mínimo Node.js + Express e checkout SOMENTE DEMONSTRATIVO.

1. Crie `server/` com API Express em localhost:3001, `GET /api/health`, `GET /api/produtos`, `GET /api/produtos/:id`, `GET /api/frete?cep=...` e `POST /api/pedidos/demo`. Use public/data/produtos.json como fonte única.
2. /api/frete deve VALIDAR CEP e responder explicitamente que cotação PAC/SEDEX não está integrada, sem qualquer valor fictício. Não consultar transportadora sem credenciais.
3. /api/pedidos/demo recebe somente IDs/quantidades e forma de pagamento ilustrativa (pix|cartao), valida tudo e calcula no servidor subtotal, desconto ilustrativo PIX 5% ou 6 parcelas ilustrativas no cartão; deve devolver resumo e identificador com prefixo DEMO. Não cobrar, não salvar pedido permanente, não coletar dados pessoais e não armazenar cartão.
4. Em checkout.html renderize itens, subtotal, descontos/parcelas demonstrativas, alerta visível 'Ambiente demonstrativo: nenhum pagamento será realizado', botão 'Gerar resumo demonstrativo' e página/estado final sem 'pagamento confirmado'. Não criar QR PIX real.
5. Implemente conexão Vite proxy /api -> localhost:3001, ajuste comandos npm para iniciar frontend e API juntos no desenvolvimento; garanta que o build estático continue funcional e documente que API necessita host próprio para produção.
6. Implemente tratamento de indisponibilidade da API, estados de envio, validações e status HTTP; nunca confie nos preços enviados pelo navegador. Adicione testes Node de validação do servidor, total e desconto, sem ferramentas nativas complicadas no Windows.
7. Execute testes e build, descreva claramente o que NÃO é funcional comercialmente.

Não instale banco de dados nem gateway de pagamento real nesta etapa.
```

**Verificação:** endpoint de saúde responde, checkout simula um pedido, valores do servidor batem com carrinho e nenhuma cobrança é feita.

## Prompt 7 — Auditoria visual com Impeccable

```text
Revise o MVP existente sem mudar escopo nem stack. Se disponível, use $impeccable para critique/audit/polish. Priorize Home, cards, catálogo, detalhe, carrinho e checkout. Leia PRODUCT.md, DESIGN.md, AGENTS.md e docs/BRIEFING.md.

Faça avaliação de hierarquia visual, grids, ritmo vertical, consistência de botões e cards, tipografia, contraste, legibilidade, espaçamento e estados de interação. Remova estética genérica e excessos decorativos. Preserve a paleta oficial do briefing. Faça uma revisão mobile-first em 360px, 390px, 768px e desktop, evitando rolagem horizontal. Garanta menu/carrinho acessíveis, alt apropriado, labels, foco visível, navegação teclado, aria-live e prefers-reduced-motion para animações.

Corrija problemas de UX identificados, sem substituir conteúdos prudentes por invenções. Otimize imagens e fontes. Depois execute npm run build, testes existentes e entregue uma lista objetiva das alterações e riscos restantes.
```

**Verificação:** experiência consistente e utilizável no celular, nenhum elemento importante cortado.

## Prompt 8 — Teste final e entrega

```text
Atue como QA e revisor de código. Não reescreva tudo. Leia AGENTS.md e docs/BRIEFING.md. Execute revisão funcional ponta a ponta: navegação entre as sete páginas, busca, filtros, ordenação, detalhe por ID válido/inválido, adicionar/remover/alterar carrinho, persistência após F5, CEP inválido/válido, checkout demonstrativo com PIX 5% ou cartão 6x, falhas de API e links externos.

Crie/execute testes automatizados mínimos para cálculos e validação do servidor com Node test runner e testes que forem práticos sem exigir serviços pagos. Rode npm run build e npm test, corrija todos os erros reproduzíveis. Confira ausência de segredos hardcoded, dados pessoais desnecessários, link falso e falsa promessa de pagamento/frete. Confirme que o bundle não depende de Tailwind CDN.

Finalize o README.md com comandos exatos para instalar, executar web/API, testar, gerar build, arquitetura, fluxo de compra demonstrativa, limitações e etapas futuras: cadastro real, frete Correios/Melhor Envio, gateway de pagamento homologado, banco de dados e validação cultural/comercial junto aos artesãos. Informe quais arquivos mudaram e resultados objetivos, sem alegar execução de testes que não fez.
```

**Verificação:** build e testes passam e README descreve fielmente o que foi entregue.

## Comandos úteis

```powershell
cd C:\projetos\lojaxucuru
node -v
npm -v
code .
npm run dev
npm run build
npm test
```

**Observação:** `npm run dev`, `build` e `test` só estarão disponíveis quando as etapas correspondentes criarem os scripts. Se o Codex não puder executar comandos, solicite que informe com precisão o que você precisa rodar no terminal e forneça a saída ao Codex.

### Utilizando Impeccable no Codex

No chat do Codex, após confirmar que a skill está reconhecida, execute `$impeccable init` para gerar/atualizar `PRODUCT.md` e revise as informações. Quando a interface estiver implementada, peça `$impeccable critique` ou `$impeccable polish` acompanhados do escopo, por exemplo: `$impeccable polish a página inicial preservando as cores do briefing e sem alterar as regras do carrinho`. Se o comando não for reconhecido, confirme instalação e recarregue o VS Code. Consulte https://impeccable.style/docs/.
