import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const pages = ['index.html', 'catalogo.html', 'produto.html', 'carrinho.html', 'checkout.html', 'sobre.html', 'historia.html', 'creditos-fotograficos.html'];
const wikiUrl = 'https://pt.wikipedia.org/wiki/Xucurus';

function readPage(file) {
  return readFileSync(resolve(projectRoot, file), 'utf8');
}

test('as páginas incluem o rodapé editorial, créditos fotográficos e link da Wikipédia protegido', () => {
  for (const file of pages) {
    const html = readPage(file);
    assert.match(html, /<footer class="site-footer">/, `${file} precisa do rodapé compartilhado`);
    assert.match(html, /Cultura &amp; Leitura/);
    assert.match(html, /href="https:\/\/pt\.wikipedia\.org\/wiki\/Xucurus" target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /href="\.\/creditos-fotograficos\.html"/);
    assert.match(html, /Loja Xukuru · proposta digital/);
    assert.doesNotMatch(html, /site-footer__notice/);
  }
});

test('os links internos nos documentos HTML apontam para entradas existentes', () => {
  for (const file of pages) {
    const html = readPage(file);
    for (const [, href] of html.matchAll(/href="(\.\/[^\"]+)"/g)) {
      const localPath = href.split(/[?#]/, 1)[0];
      assert.ok(existsSync(resolve(projectRoot, localPath)), `${file} aponta para ${href}`);
    }
  }
});

test('Sobre descreve o propósito como intenção e esclarece que não há operação ou parceria confirmada', () => {
  const html = readPage('sobre.html');
  assert.match(html, /uma direção desejada, não uma atividade comercial em curso/);
  assert.match(html, /não há parceria, endosso comunitário/);
  assert.match(html, /nem pagamento ou cotação de frete integrados/i);
});

test('História contém a contextualização cautelosa, referências e o card solicitado', () => {
  const html = readPage('historia.html');
  assert.match(html, /municípios de Pesqueira e Poção/);
  assert.match(html, /não\s+pretende resumir a diversidade/);
  assert.match(html, /pesquisa de Edson Silva publicada pela Funai/);
  assert.match(html, /Museu Nacional dos Povos Indígenas/);
  assert.match(html, /Deseja aprofundar seu conhecimento sobre o Povo Xukuru do Ororubá\? Leia o artigo completo na Wikipédia\./);
  assert.ok(html.includes(`href="${wikiUrl}" target="_blank" rel="noopener noreferrer"`));
});

test('Home e História usam a foto licenciada da Aldeia Santana; catálogo aguarda fotos de produto', () => {
  for (const file of ['index.html', 'historia.html', 'creditos-fotograficos.html']) {
    const html = readPage(file);
    const images = [...html.matchAll(/<img[^>]+src="(\/images\/[^"]+)"/g)].map((match) => match[1]);
    assert.ok(images.length > 0, `${file} precisa de ao menos uma fotografia local`);
    for (const image of images) {
      assert.ok(existsSync(resolve(projectRoot, 'public', image.slice(1))), `${file} aponta para ${image}`);
      assert.match(image, /xukuru\/territorio\/aldeia-santana\.webp/);
    }
  }
  assert.doesNotMatch(readPage('sobre.html'), /<img[^>]+src="\/images\//);
  assert.match(readPage('index.html'), /A\. Duarte/);
  assert.match(readPage('historia.html'), /CC BY-SA 2\.0/);
  assert.match(readPage('creditos-fotograficos.html'), /creativecommons\.org\/licenses\/by-sa\/2\.0/);
});

test('todas as imagens declaradas nas páginas e no catálogo existem localmente', () => {
  for (const file of pages) {
    const html = readPage(file);
    for (const [, image] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      assert.match(image, /^\/images\//, `${file} não deve carregar imagem remota`);
      assert.ok(existsSync(resolve(projectRoot, 'public', image.slice(1))), `${file} aponta para ${image}`);
    }
  }

  const products = JSON.parse(readFileSync(resolve(projectRoot, 'public', 'data', 'produtos.json'), 'utf8'));
  for (const product of products) {
    for (const image of [product.image, ...product.gallery.map((item) => item.src)]) {
      assert.ok(existsSync(resolve(projectRoot, 'public', image.slice(1))), `${product.id} aponta para ${image}`);
      assert.match(image, /^\/images\//, `${product.id} não deve carregar imagem remota`);
    }
  }
});

test('checkout deixa claro que não há pagamento e não solicita dados pessoais', () => {
  const html = readPage('checkout.html');
  assert.match(html, /nenhum pagamento será cobrado/i);
  assert.match(html, /nenhum pedido comercial será registrado/i);
  assert.match(html, /Não pedimos dados pessoais, endereço ou cartão/);
  assert.doesNotMatch(html, /name="(?:cpf|address|cardNumber|phone)"/i);
});
