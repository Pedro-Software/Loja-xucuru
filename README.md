# Loja Xukuru

MVP de uma proposta de loja virtual cultural. O catálogo reúne oito referências visuais com nomes e valores de exemplo; o site não realiza vendas.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Instalação

Na pasta do projeto, instale as dependências:

```powershell
npm install
```

## Executar

Inicie a interface e a API demonstrativa juntas:

```powershell
npm run dev
```

Abra `http://127.0.0.1:5173/`. A API local escuta em `http://127.0.0.1:3001`; o Vite encaminha `/api` para ela durante o desenvolvimento.

Para iniciar os processos separadamente, use dois terminais:

```powershell
npm run dev:web
npm run dev:api
```

O checkout demonstrativo está em `http://127.0.0.1:5173/checkout.html`.

## Páginas

- `/index.html` — início, destaques e exploração por categoria.
- `/catalogo.html` — busca, categoria, faixa de preço e ordenação.
- `/produto.html?id=demo-peca-01` — detalhe, galeria local e referências relacionadas.
- `/carrinho.html` — quantidades, subtotal e validação de formato do CEP.
- `/checkout.html` — resumo de pagamento demonstrativo.
- `/sobre.html` e `/historia.html` — propósito e contextualização editorial.

## Testes e build

```powershell
npm test
npm run build
npm run preview
```

`npm test` usa o test runner nativo do Node.js. Os testes cobrem a fonte única de produtos, filtros e ordenação, persistência e cálculos do carrinho, validação e cálculos da API, conteúdo prudente e links internos. `npm run build` gera as sete páginas em `dist/`; `npm run preview` serve esse build localmente.

## Arquitetura

- `index.html`, `catalogo.html`, `produto.html`, `carrinho.html`, `checkout.html`, `sobre.html` e `historia.html`: entradas HTML multipágina.
- `src/js/`: módulos ES do catálogo, detalhe, carrinho, checkout e layout compartilhado.
- `src/css/`: estilos compartilhados e específicos de cada superfície; Tailwind CSS 4 é processado pelo plugin `@tailwindcss/vite`, sem CDN.
- `public/data/produtos.json`: fonte única dos oito itens demonstrativos, usada pela interface e pela API.
- `public/images/products/` e `public/images/editorial/`: fotografias locais de referência para catálogo, Home, Sobre e História.
- `docs/IMAGENS.md`: fontes, créditos e licenças das fotografias utilizadas.
- `public/images/placeholder-demonstrativo.svg`: arquivo legado preservado; não é exibido no site.
- `server/`: endpoints Express, validação de CEP e validação/cálculo do resumo no servidor.
- `scripts/dev.js`: inicializa e encerra os servidores de desenvolvimento.
- `vite.config.js`: entradas do build multipágina e proxy local `/api` → `http://127.0.0.1:3001`.
- `tests/`: testes Node para API, catálogo, carrinho e páginas editoriais.

## Fluxo demonstrativo

O catálogo e a interface leem os itens de `public/data/produtos.json`. O carrinho persiste somente IDs e quantidades no `localStorage`; os preços do resumo são obtidos do catálogo e recalculados pela API. A opção Pix simula desconto de 5%; cartão mostra seis parcelas ilustrativas. A resposta recebe um identificador temporário `DEMO-` e não registra um pedido. O CEP é validado por formato, mas nenhuma cotação ou valor de frete é calculado.

### API de desenvolvimento

- `GET /api/health` — estado da API demonstrativa.
- `GET /api/produtos` e `GET /api/produtos/:id` — catálogo e item pela fonte JSON única.
- `GET /api/frete?cep=12345-678` — valida o CEP e informa que PAC/SEDEX não está integrado; não retorna preço.
- `POST /api/pedidos/demo` — recebe apenas IDs, quantidades e `paymentMethod` (`pix` ou `cartao`); valida os dados e calcula o resumo a partir do catálogo do servidor.

## Limitações e próximos passos

O protótipo não solicita CPF, telefone, endereço completo nem dados de cartão; não cobra, não gera QR Code Pix, não confirma compra e não persiste pedidos. Não há integração de frete, gateway de pagamento, cadastro ou banco de dados. O build e o preview estáticos não incluem a API. Em produção, a API exigirá um host próprio e encaminhamento de `/api` por proxy ou configuração equivalente.

Antes de qualquer operação comercial, será necessário implementar e revisar:

1. Cadastro real de usuários e tratamento de dados com segurança e requisitos legais definidos.
2. Cotação de frete integrada a Correios, Melhor Envio ou outra transportadora contratada.
3. Gateway de pagamento homologado e fluxo de checkout apropriado.
4. Banco de dados e gestão de pedidos.
5. Validação cultural e comercial do conteúdo, catálogo e operação junto aos artesãos e organizações pertinentes.

O projeto não afirma parceria, endosso comunitário, autoria, procedência, destino de receitas ou operação comercial sem verificação.
