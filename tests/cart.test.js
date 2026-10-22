import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { addToCart, CART_STORAGE_KEY, clearCart, getCartCount, normalizeCart, readCart, removeFromCart, setCartQuantity } from '../src/js/cart-store.js';
import { calculateCartTotals, formatCep, hasValidCep } from '../src/js/cart-utils.js';
import { validateProducts } from '../src/js/product-data.js';

const productData = JSON.parse(readFileSync(new URL('../public/data/produtos.json', import.meta.url), 'utf8'));
const products = validateProducts(productData);

function makeStorage(initial = null) {
  const values = new Map(initial === null ? [] : [[CART_STORAGE_KEY, initial]]);
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    read(key = CART_STORAGE_KEY) { return values.get(key) ?? null; },
  };
}

test('normaliza carrinho recuperado e guarda somente IDs e quantidades válidos', () => {
  const normalized = normalizeCart([
    { id: 'demo-peca-01', quantidade: 2, price: 1 },
    { id: 'demo-peca-01', quantidade: 12 },
    { id: 'missing-item', quantidade: 1 },
    { id: 'demo-peca-02', quantidade: 0 },
    { id: 'demo-peca-03', quantidade: 1.5 },
    null,
  ], products);

  assert.deepEqual(normalized, [
    { id: 'demo-peca-01', quantidade: 10 },
  ]);
  assert.deepEqual(Object.keys(normalized[0]).sort(), ['id', 'quantidade']);
});

test('adiciona, aumenta, substitui quantidade, remove e limpa itens persistidos', () => {
  const storage = makeStorage();
  addToCart('demo-peca-01', 2, products, storage);
  addToCart('demo-peca-01', 3, products, storage);
  assert.deepEqual(readCart(storage, products), [{ id: 'demo-peca-01', quantidade: 5 }]);
  assert.equal(getCartCount(readCart(storage, products)), 5);

  setCartQuantity('demo-peca-01', 4, products, storage);
  assert.deepEqual(readCart(storage, products), [{ id: 'demo-peca-01', quantidade: 4 }]);
  removeFromCart('demo-peca-01', products, storage);
  assert.deepEqual(readCart(storage, products), []);
  addToCart('demo-peca-02', 1, products, storage);
  clearCart(storage);
  assert.deepEqual(readCart(storage, products), []);
});

test('rejeita ID e quantidades impróprios e limita cada produto a 10 unidades', () => {
  const storage = makeStorage();
  assert.throws(() => addToCart('outro-item', 1, products, storage), /não está no catálogo/);
  assert.throws(() => addToCart('demo-peca-01', 0, products, storage), /inteiro/);
  addToCart('demo-peca-01', 8, products, storage);
  addToCart('demo-peca-01', 8, products, storage);
  assert.deepEqual(readCart(storage, products), [{ id: 'demo-peca-01', quantidade: 10 }]);
  assert.throws(() => setCartQuantity('demo-peca-01', 0, products, storage), /inteiro/);
});

test('remove JSON corrompido e descarta IDs que não existem no catálogo', () => {
  const malformed = makeStorage('{');
  assert.deepEqual(readCart(malformed, products), []);
  assert.equal(malformed.read(), null);

  const unknown = makeStorage(JSON.stringify([{ id: 'missing-item', quantidade: 3 }]));
  assert.deepEqual(readCart(unknown, products), []);
  assert.equal(unknown.read(), '[]');
});

test('persiste apenas id e quantidade, sem preço ou dados pessoais', () => {
  const storage = makeStorage();
  addToCart('demo-peca-01', 1, products, storage);
  const saved = JSON.parse(storage.read());
  assert.deepEqual(saved, [{ id: 'demo-peca-01', quantidade: 1 }]);
  assert.equal(JSON.stringify(saved).includes('price'), false);
  assert.equal(JSON.stringify(saved).includes('name'), false);
});

test('calcula subtotal usando os preços do catálogo, nunca valores do carrinho', () => {
  const cart = [
    { id: 'demo-peca-01', quantidade: 2, price: 0.01 },
    { id: 'demo-peca-02', quantidade: 1, price: 0.01 },
  ];
  const expected = products[0].price * 2 + products[1].price;
  assert.deepEqual(calculateCartTotals(cart, products), { quantity: 3, subtotal: expected });
});

test('aplica máscara de CEP e valida oito dígitos', () => {
  assert.equal(formatCep('12345-6789'), '12345-678');
  assert.equal(formatCep('12a34'), '1234');
  assert.equal(hasValidCep('12345-678'), true);
  assert.equal(hasValidCep('1234-567'), false);
});
