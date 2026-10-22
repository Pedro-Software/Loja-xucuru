<!-- Transcrição do briefing DOCX enviado. Reproduz o conteúdo; decisões técnicas estão em AGENTS.md. -->

# Briefing e Especificações de Layout – MVP Loja Virtual Artesanato Xukuru

Objetivo do Documento: Servir de guia completo para a pessoa encarregada de desenvolver a primeira versão (MVP) do e-commerce de produtos artesanais produzidos pelo povo indígena Xukuru do Ororubá (Pesqueira - Pernambuco).

## 1. Visão Geral do Projeto (MVP)

- Público-alvo: Pessoas interessadas em artesanato, cultura indígena, decoração sustentável e apoio ao comércio justo.

- Foco do MVP: Simplicidade na navegação, valorização estética e cultural dos produtos, experiência de compra fluida e segura.

## 2. Arquitetura das Páginas e Estrutura de Layout

### 2.1 Cabeçalho (Navbar Fixo no Topo)

- Lado Esquerdo: Logotipo da loja (ex.: "Arte Xukuru").

- Centro (Links de Navegação):

- Início (Home)

- Catálogo (Loja)

- Sobre (O Projeto/Comércio Justo)

- História (Cultura e Resistência Xukuru)

- Lado Direito: Ícone de busca rápida e Ícone do Carrinho de Compras com indicador numérico de itens.

### 2.2 Página Inicial (Home)

- Hero Section (Destaque Principal): Banner com fotografia de alta qualidade da Serra do Ororubá e detalhes de peças manuais. Título: "Arte Ancestral do Povo Xukuru", subtítulo contextual e botão de ação principal (CTA) "Conhecer a Coleção".

- Destaques do Catálogo: Grade (Grid) com 4 a 8 produtos em destaque contendo foto, nome, categoria, valor e botão rápido "Adicionar ao Carrinho".

- Bloco Propósito & Identidade: Seção curta destacando o impacto do comércio justo para as famílias artesãs locais, com link direto para a página História.

- Faixa de Confiança: Selos informativos sobre envio nacional, ambiente seguro e pagamento facilitation via PIX e cartão.

### 2.3 Página Catálogo (Loja)

- Filtros e Ordenação: Filtro por categoria (ex.: Cerâmica, Trançados, Biojoias, Esculturas), faixa de preço e ordenação (mais vendidos, menor/maior preço).

- Grid de Produtos: Cards de produto limpos contendo foto, título, nome da comunidade/artesão (opcional) e valor.

- Página / Modal do Produto:

- Galeria de fotos detalhadas do artesanato.

- Descrição dos materiais utilizados e contextualização da peça.

- Calculadora de CEP/Frete integrada.

- Botão principal de compra.

### 2.4 Páginas Sobre & História + Inserção do Link da Wikipédia

- Página Sobre: Explicação sobre a loja virtual, o modelo de comércio justo, a destinação dos recursos para as famílias e o impacto comunitário.

- Página História: Narrativa sobre a trajetória, território e rica tradição cultural do Povo Indígena Xukuru de Pernambuco.

- Localização do Link da Wikipédia:

- Principal (Página História): Card destacado ao final da página com a chamada: "Deseja aprofundar seu conhecimento sobre o Povo Xukuru do Ororubá? Leia o artigo completo na Wikipédia ↗".

- Secundário (Rodapé): Incluído na seção de links úteis sob o menu "Cultura & Leitura".

### 2.5 Rodapé (Footer)

- Coluna 1: Marca e frase de propósito ("Fortalecendo a arte e a cultura do povo Xukuru do Ororubá").

- Coluna 2: Links rápidos (Início, Catálogo, Sobre, História).

- Coluna 3: Redes Sociais (Link do Instagram oficial) e Link para a Wikipédia.

- Coluna 4: Formas de Pagamento Aceitas (PIX, Visa, Mastercard) e Selos de Segurança.

## 3. Integrações de Pagamento e Frete

- Cálculo de Frete: Integração com Correios (PAC e SEDEX) ou plataformas agregadoras (como Melhor Envio ou Frenet). Campo de digitação de CEP disponível na página do produto e no carrinho.

- Checkout e Pagamento:

- PIX: Oferecer desconto de incentivo (ex.: 5% a 10%) para compras via PIX.

- Cartão de Crédito: Opção de parcelamento em até 6x.

## 4. Paleta de Cores e Identidade Visual

A paleta foi desenhada para refletir a natureza, a terra e o agreste de Pernambuco, combinando tons terrosos e naturais.

Instrução Final para o Desenvolvedor: Trata-se de um MVP. Priorize o design responsivo (focado em dispositivos móveis), boa velocidade de carregamento das imagens dos artesanatos e facilidade no fluxo de checkout.

### Tabela de cores (documento original)

| Função visual | Nome da cor | Código HEX | Aplicação |
|---|---|---|---|
| Primária | Verde Mata / Floresta | #1F3E2B | Cabeçalho (Navbar), Rodapé, títulos principais e fundos de blocos institucionais. |
| Secundária / CTA | Terracota Raiz | #C45A35 | Botões de ação principais (Comprar, Adicionar ao Carrinho), badges e links em destaque. |
| Fundo Principal | Bege Algodão / Areia | #F9F6F0 | Fundo geral das páginas (substitui o branco puro para trazer calor visual). |
| Fundo de Cards | Branco Suave | #FFFFFF | Fundo dos cards de produto e caixas modais para dar destaque às fotografias. |
| Texto Principal | Castanho Profundo | #2B231F | Textos de parágrafo e leitura contínua. |
| Detalhes / Destaques | Ocre Queimado | #D99B26 | Avaliações, estrelas, selos artesanais e detalhes decorativos. |
