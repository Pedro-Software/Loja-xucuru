# Design system — Loja Xukuru

## Direção

A interface segue a proposta editorial em mosaico escolhida para a Home: composição em duas colunas no hero, título serifado, quatro destaques e uma faixa institucional verde. O projeto identifica itens e valores como demonstrativos e não afirma autoria, procedência, parceria ou operação comercial. A marca permanece provisoriamente “Loja Xukuru”.

Não há fotografias autorizadas no projeto. O único recurso visual de produto é `public/images/placeholder-demonstrativo.svg`, uma composição geométrica local que declara não representar um produto real. Não usar símbolos culturais inventados, retratos sem autorização nem imagens remotas sem licença confirmada.

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
- Imagens geométricas são decorativas quando o texto ao redor já identifica o item; falhas de imagem exibem alternativa local e compreensível.
- Os controles principais têm área mínima aproximada de 44 px. As transições de botões e cards respeitam `prefers-reduced-motion`.

## Desempenho de mídia

- A arte principal usa o SVG geométrico local existente e recebe prioridade de carregamento; miniaturas dos cards usam carregamento tardio e decodificação assíncrona.
- O projeto usa Georgia e fontes sans-serif do sistema, sem requisições de fontes externas.
- Fotografias autorizadas ainda não foram fornecidas; o placeholder é intencional e não representa uma peça real.

## Superfícies

`index.html` importa `src/css/home.css`; o cabeçalho e o rodapé compartilhados são estilizados por `src/css/styles.css` e `src/css/content-pages.css`. Catálogo, detalhe/carrinho e checkout mantêm folhas específicas (`catalogo.css`, `product-cart.css`, `checkout.css`) e os mesmos tokens, foco e linguagem tipográfica.
