import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const pages = ['index.html', 'catalogo.html', 'produto.html', 'carrinho.html', 'checkout.html', 'sobre.html', 'historia.html'];
const wikiUrl = 'https://pt.wikipedia.org/wiki/Xucurus';

function readPage(file) {
  return readFileSync(resolve(projectRoot, file), 'utf8');
}

test('as sete páginas incluem o rodapé editorial e o link da Wikipédia com proteção de nova aba', () => {
  for (const file of pages) {
    const html = readPage(file);
    assert.match(html, /<footer class="site-footer">/, `${file} precisa do rodapé compartilhado`);
    assert.match(html, /Cultura &amp; Leitura/);
    assert.match(html, /href="https:\/\/pt\.wikipedia\.org\/wiki\/Xucurus" target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /Sem venda real\. Pagamentos e frete não estão integrados\./);
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
  assert.match(html, /objetivo do projeto/);
  assert.match(html, /não há parceria, endosso comunitário/);
  assert.match(html, /Não há venda real/);
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
