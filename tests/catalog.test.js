import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { filterProducts, normalizeSearchText } from '../src/js/catalog-filters.js';
import { formatBRL } from '../src/js/formatters.js';
import { validateProducts } from '../src/js/product-data.js';

const dataPath = new URL('../public/data/produtos.json', import.meta.url);
const productData = JSON.parse(readFileSync(dataPath, 'utf8'));
const products = validateProducts(productData);
const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const imageCreditsPath = resolve(projectRoot, 'docs', 'FONTES_IMAGENS.md');

test('o JSON tem oito itens de referência válidos e galerias locais', () => {
  assert.equal(products.length, 8);
  assert.equal(new Set(products.map((product) => product.id)).size, 8);
  assert.ok(products.every((product) => product.demonstrative && product.availableForDemo));
  assert.ok(products.every((product) => product.materials.length === 0));
  assert.ok(products.every((product) => product.imageAlt && product.visualNote && product.gallery.length === 1));
  assert.ok(products.every((product) => product.name.startsWith('Referência demonstrativa')));
  assert.ok(products.every((product) => product.image === '/images/xukuru/produtos/foto-autorizada-pendente.svg'));
  assert.ok(existsSync(imageCreditsPath), 'a documentação de fontes e licenças precisa existir');
  const imageCredits = readFileSync(imageCreditsPath, 'utf8');
  assert.ok(
    products.every((product) =>
      [product.image, ...product.gallery.map((image) => image.src)].every((src) =>
        existsSync(resolve(projectRoot, 'public', src.slice(1))) && imageCredits.includes(`public${src}`),
      ),
    ),
  );
});

test('normaliza acentos para busca textual', () => {
  assert.equal(normalizeSearchText('Cerâmica Xukuru'), 'ceramica xukuru');
  assert.equal(filterProducts(products, { query: 'ceramica' }).length, 2);
  assert.equal(filterProducts(products, { query: 'TRANÇADOS' }).length, 2);
});

test('filtra categoria, faixa de preço e destaques', () => {
  assert.equal(filterProducts(products, { category: 'adornos' }).length, 2);
  assert.deepEqual(
    filterProducts(products, { minPrice: '70', maxPrice: '120' }).map((product) => product.id),
    ['demo-peca-02', 'demo-peca-03', 'demo-peca-04', 'demo-peca-06', 'demo-peca-08'],
  );
  assert.deepEqual(
    filterProducts(products, { featuredOnly: true }).map((product) => product.id),
    ['demo-peca-01', 'demo-peca-03', 'demo-peca-05', 'demo-peca-08'],
  );
});

test('ordena valores crescentes e decrescentes sem mutar a lista original', () => {
  const idsBefore = products.map((product) => product.id);
  const ascending = filterProducts(products, { sort: 'price-asc' });
  const descending = filterProducts(products, { sort: 'price-desc' });

  assert.equal(ascending[0].price, 49);
  assert.equal(ascending.at(-1).price, 145);
  assert.equal(descending[0].price, 145);
  assert.equal(descending.at(-1).price, 49);
  assert.deepEqual(products.map((product) => product.id), idsBefore);
});

test('rejeita intervalo inválido e formata valores em reais', () => {
  assert.throws(
    () => filterProducts(products, { minPrice: '120', maxPrice: '40' }),
    /preço mínimo não pode ser maior/,
  );
  assert.match(formatBRL(94.5), /^R\$\s?94,50$/);
});
