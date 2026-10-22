import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { once } from 'node:events';
import { createApp } from '../server/app.js';
import { loadProducts } from '../server/catalog.js';

const products = loadProducts();
let server;
let baseUrl;

before(async () => {
  server = createApp(products).listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (!server) return;
  server.close();
  await once(server, 'close');
});

test('health e catálogo demonstrativo respondem a partir da fonte única', async () => {
  const healthResponse = await fetch(`${baseUrl}/api/health`);
  assert.equal(healthResponse.status, 200);
  assert.deepEqual(await healthResponse.json(), { status: 'ok', mode: 'demonstration' });

  const listResponse = await fetch(`${baseUrl}/api/produtos`);
  const catalog = await listResponse.json();
  assert.equal(listResponse.status, 200);
  assert.equal(catalog.length, 8);
  assert.deepEqual(catalog, products);

  const productResponse = await fetch(`${baseUrl}/api/produtos/${products[0].id}`);
  assert.equal(productResponse.status, 200);
  assert.equal((await productResponse.json()).id, products[0].id);
  assert.equal((await fetch(`${baseUrl}/api/produtos/inexistente`)).status, 404);
});

test('frete valida CEP e nunca retorna preço ou promessa de cotação', async () => {
  const validResponse = await fetch(`${baseUrl}/api/frete?cep=12345-678`);
  const valid = await validResponse.json();
  assert.equal(validResponse.status, 200);
  assert.equal(valid.cep, '12345678');
  assert.equal(valid.available, false);
  assert.match(valid.message, /nenhum valor de frete foi calculado/i);
  assert.equal(Object.hasOwn(valid, 'price'), false);

  const invalid = await fetch(`${baseUrl}/api/frete?cep=1234`);
  assert.equal(invalid.status, 400);
});

test('resumo Pix calcula subtotal e desconto ilustrativo de 5% no servidor', async () => {
  const response = await fetch(`${baseUrl}/api/pedidos/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ id: products[0].id, quantidade: 2 }], paymentMethod: 'pix' }),
  });
  const summary = await response.json();
  assert.equal(response.status, 200);
  assert.match(summary.demoId, /^DEMO-[A-F0-9]{12}$/);
  assert.equal(summary.subtotalCents, 13600);
  assert.equal(summary.discountCents, 680);
  assert.equal(summary.totalCents, 12920);
  assert.equal(summary.items[0].unitPriceCents, 6800);
  assert.deepEqual(summary.installmentsCents, []);
  assert.match(summary.message, /nenhum pedido foi registrado/i);
  assert.equal(JSON.stringify(summary).includes('cpf'), false);
  assert.equal(JSON.stringify(summary).includes('endereco'), false);
});

test('resumo no cartão divide o total em seis parcelas cuja soma é exata', async () => {
  const response = await fetch(`${baseUrl}/api/pedidos/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ id: products[0].id, quantidade: 2 }], paymentMethod: 'cartao' }),
  });
  const summary = await response.json();
  assert.equal(response.status, 200);
  assert.equal(summary.subtotalCents, 13600);
  assert.equal(summary.discountCents, 0);
  assert.equal(summary.totalCents, 13600);
  assert.equal(summary.installmentsCents.length, 6);
  assert.equal(summary.installmentsCents.reduce((sum, cents) => sum + cents, 0), summary.totalCents);
  assert.deepEqual(summary.installmentsCents, [2267, 2267, 2267, 2267, 2266, 2266]);
});

test('API rejeita valores do cliente, IDs desconhecidos, quantidades inválidas e PII', async () => {
  const invalidPayloads = [
    { items: [{ id: products[0].id, quantidade: 1, price: 0.01 }], paymentMethod: 'pix' },
    { items: [{ id: 'not-in-catalog', quantidade: 1 }], paymentMethod: 'pix' },
    { items: [{ id: products[0].id, quantidade: 11 }], paymentMethod: 'pix' },
    { items: [{ id: products[0].id, quantidade: 1 }], paymentMethod: 'cartao', cpf: '00000000000' },
  ];

  for (const payload of invalidPayloads) {
    const response = await fetch(`${baseUrl}/api/pedidos/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).error, 'string');
  }
});

test('resumos são transitórios e recebem IDs de demonstração distintos', async () => {
  const payload = { items: [{ id: products[0].id, quantidade: 1 }], paymentMethod: 'pix' };
  async function createSummary() {
    const response = await fetch(`${baseUrl}/api/pedidos/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  }
  const first = await createSummary();
  const second = await createSummary();
  assert.notEqual(first.demoId, second.demoId);
  assert.equal(first.demoId.startsWith('DEMO-'), true);
});
