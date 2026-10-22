import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateProducts } from '../src/js/product-data.js';

const catalogFile = fileURLToPath(new URL('../public/data/produtos.json', import.meta.url));

export function loadProducts() {
  const content = readFileSync(catalogFile, 'utf8');
  return validateProducts(JSON.parse(content));
}
