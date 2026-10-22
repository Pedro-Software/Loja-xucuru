export function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function readPrice(value, label) {
  if (value === '' || value === null || value === undefined) return null;
  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    throw new RangeError(label + ' deve ser um valor igual ou maior que zero.');
  }

  return price;
}

export function filterProducts(products, filters = {}) {
  const query = normalizeSearchText(filters.query);
  const category = normalizeSearchText(filters.category);
  const minPrice = readPrice(filters.minPrice, 'O preço mínimo');
  const maxPrice = readPrice(filters.maxPrice, 'O preço máximo');
  const featuredOnly = Boolean(filters.featuredOnly);
  const sort = filters.sort || 'default';

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    throw new RangeError('O preço mínimo não pode ser maior que o preço máximo.');
  }

  if (!['default', 'price-asc', 'price-desc'].includes(sort)) {
    throw new TypeError('A ordenação selecionada não é válida.');
  }

  const originalOrder = new Map(products.map((product, index) => [product.id, index]));
  const result = products.filter((product) => {
    const searchableText = normalizeSearchText(
      [
        product.name,
        product.category,
        product.description,
        product.materialsStatus,
        ...product.materials,
      ].join(' '),
    );

    if (query && !searchableText.includes(query)) return false;
    if (category && normalizeSearchText(product.category) !== category) return false;
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    if (featuredOnly && !product.featured) return false;
    return true;
  });

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price || originalOrder.get(a.id) - originalOrder.get(b.id));
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price || originalOrder.get(a.id) - originalOrder.get(b.id));
  }

  return result;
}
