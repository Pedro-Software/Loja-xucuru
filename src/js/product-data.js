const allowedCategories = new Set(['Cerâmica', 'Trançados', 'Biojoias', 'Esculturas']);
const localImagePattern = /^\/images\/[a-zA-Z0-9/_-]+\.(svg|png|webp|jpe?g)$/i;

export function validateProducts(payload) {
  if (!Array.isArray(payload)) {
    throw new TypeError('A lista de produtos demonstrativos está inválida.');
  }

  const seenIds = new Set();
  return payload.map((product) => {
    if (!product || typeof product !== 'object') {
      throw new TypeError('Há um item inválido no catálogo demonstrativo.');
    }

    const validId = typeof product.id === 'string' && /^[a-z0-9-]+$/i.test(product.id);
    const validName = typeof product.name === 'string' && product.name.trim().length > 0;
    const validCategory = allowedCategories.has(product.category);
    const validDescription =
      typeof product.description === 'string' &&
      /demonstrativ|ilustrativ/i.test(product.description);
    const validPrice =
      typeof product.price === 'number' && Number.isFinite(product.price) && product.price >= 0;
    const validMaterials =
      Array.isArray(product.materials) &&
      product.materials.every((material) => typeof material === 'string');
    const validMaterialsStatus =
      typeof product.materialsStatus === 'string' && product.materialsStatus.trim().length > 0;
    const validImage =
      typeof product.image === 'string' &&
      localImagePattern.test(product.image) &&
      !product.image.includes('..');

    if (
      !validId ||
      !validName ||
      !validCategory ||
      !validDescription ||
      !validPrice ||
      !validMaterials ||
      !validMaterialsStatus ||
      !validImage ||
      typeof product.featured !== 'boolean' ||
      product.demonstrative !== true ||
      product.availableForDemo !== true ||
      product.availability !== 'demonstração'
    ) {
      throw new TypeError('Um item do catálogo não atende ao formato demonstrativo esperado.');
    }

    if (seenIds.has(product.id)) {
      throw new TypeError('O catálogo contém IDs repetidos.');
    }
    seenIds.add(product.id);

    return Object.freeze({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      materials: [...product.materials],
      materialsStatus: product.materialsStatus,
      image: product.image,
      featured: product.featured,
      demonstrative: product.demonstrative,
      availableForDemo: product.availableForDemo,
      availability: product.availability,
    });
  });
}

export async function loadProducts({
  url = '/data/produtos.json',
  fetcher = globalThis.fetch,
  signal,
} = {}) {
  if (typeof fetcher !== 'function') {
    throw new Error('O navegador não disponibiliza a função de carregamento necessária.');
  }

  const response = await fetcher(url, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar os produtos demonstrativos.');
  }

  return validateProducts(await response.json());
}
