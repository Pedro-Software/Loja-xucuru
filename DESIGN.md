# Design system — Loja Xukuru

## Direção

A interface segue a proposta editorial em mosaico escolhida para a Home: composição em duas colunas no hero, título serifado, quatro destaques e uma faixa institucional verde. O projeto identifica itens e valores como demonstrativos e não afirma autoria, procedência, parceria ou operação comercial. A marca permanece provisoriamente “Loja Xukuru”.

O hero usa uma foto documental licenciada da placa da Aldeia Santana (`public/images/xukuru/territorio/aldeia-santana.webp`), com crédito e contexto visíveis. Nenhuma foto de produto foi autenticada e liberada para reutilização: o catálogo usa `public/images/xukuru/produtos/foto-autorizada-pendente.svg`, um marcador neutro. Créditos completos e pendências estão em `creditos-fotograficos.html` e `docs/FONTES_IMAGENS.md`.

## Tokens

| Uso | Token | Valor |
|---|---|---|
| Floresta / ações primárias | `--color-forest` | `#1F3E2B` |
| Terracota / ênfase e links | `--color-terracotta` | `#C45A35` |
| Areia / fundo | `--color-sand` | `#F9F6F0` |
| Branco / superfícies | `--color-card` | `#FFFFFF` |
| Castanho / texto | `--color-ink` | `#2B231F` |
| Ocre / detalhe | `--color-ochre` | `#D99B26` |

## Tipografia e composição

- Títulos de página e nomes de itens usam Georgia/serifas do sistema; parágrafos, formulários e controles usam a sans-serif padrão do sistema.
- A Home usa título grande em duas linhas, lede curto e texto factual. O fundo areia, as margens amplas e as regras finas mantêm o caráter editorial.
- A ação principal da Home usa fundo floresta, conforme o mockup selecionado; terracota destaca palavras, links e estados ativos.
- Cards usam superfície branca e contorno fino sem elevação. Layouts passam de quatro colunas para duas e depois uma conforme o espaço disponível.
- O cabeçalho compartilha marca, links principais, busca para `catalogo.html?q=...`, carrinho com contador e menu recolhível no celular.

## Estados e acessibilidade

- O foco usa contorno visível de alto contraste; no rodapé escuro, o contorno muda para areia.
- O link “Pular para o conteúdo” aparece ao receber foco. O menu móvel expõe `aria-expanded`, fecha com Escape e continua navegável sem JavaScript.
- Busca e quantidade têm rótulos; contagem, carregamento, erros e inclusão no carrinho são anunciados por regiões acessíveis.
- O marcador de produto informa que a fotografia autorizada está pendente; o texto alternativo deixa claro que ele não representa uma peça real.
- Os controles principais têm área mínima aproximada de 44 px. As transições de botões e cards respeitam `prefers-reduced-motion`.

## Desempenho de mídia

- A foto territorial local WebP tem 960 × 720 px e cerca de 105 KB; recebe prioridade de carregamento. Os marcadores SVG dos cards são locais, sem dependência de serviços externos.
- O projeto usa Georgia e fontes sans-serif do sistema, sem requisições de fontes externas.
- Fotografias autorizadas de produtos ainda não foram fornecidas; o marcador é intencional e não representa uma peça real.

## Superfícies

`index.html` importa `src/css/home.css`; o cabeçalho e o rodapé compartilhados são estilizados por `src/css/styles.css` e `src/css/content-pages.css`. Catálogo, detalhe/carrinho e checkout mantêm folhas específicas (`catalogo.css`, `product-cart.css`, `checkout.css`) e os mesmos tokens, foco e linguagem tipográfica.
