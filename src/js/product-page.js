import '../css/product-cart.css';
import { addToCart } from './cart-store.js';
import { formatBRL } from './formatters.js';
import { loadProducts } from './product-data.js';

const page = document.querySelector('[data-product-page]');

if (page) {
  const state = page.querySelector('[data-product-state]');
  const view = page.querySelector('[data-product-view]');
  const form = page.querySelector('[data-product-form]');
  const message = page.querySelector('[data-product-message]');
  const quantityInput = page.querySelector('#product-quantity');
  let selectedProduct;
  let products = [];

  function showState(text, isError = false) {
    state.hidden = false;
    state.replaceChildren(document.createTextNode(text));
    if (isError) {
      const link = document.createElement('a');
      link.className = 'shop-text-button';
      link.href = './catalogo.html';
      link.textContent = 'Ver catálogo';
      state.append(' ', link);
    }
    state.classList.toggle('shop-status--error', isError);
    view.hidden = true;
    form.hidden = true;
  }

  function showProduct(product) {
    selectedProduct = product;
    page.querySelector('[data-product-category]').textContent = product.category;
    page.querySelector('[data-product-name]').textContent = product.name;
    page.querySelector('[data-product-description]').textContent = product.description;
    page.querySelector('[data-product-price]').textContent = formatBRL(product.price);
    const materials = page.querySelector('[data-product-materials]');
    materials.replaceChildren();
    if (product.materials.length > 0) {
      for (const material of product.materials) {
        const item = document.createElement('li');
        item.textContent = material;
        materials.append(item);
      }
    } else {
      const item = document.createElement('li');
      item.textContent = 'Informação a confirmar.';
      materials.append(item);
    }

    const image = page.querySelector('[data-product-image]');
    image.src = product.image;
    image.alt = '';
    image.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'shop-image-fallback';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', 'Imagem demonstrativa indisponível');
      fallback.textContent = 'Imagem demonstrativa';
      image.replaceWith(fallback);
    }, { once: true });

    state.hidden = true;
    view.hidden = false;
    form.hidden = false;
  }

  async function initialize() {
    const id = new URLSearchParams(window.location.search).get('id') || '';
    if (!/^[a-z0-9-]{1,80}$/i.test(id)) {
      showState('Não encontramos esse item. Volte ao catálogo para explorar os exemplos.', true);
      return;
    }

    try {
      products = await loadProducts();
      const product = products.find((item) => item.id === id);
      if (!product) {
        showState('Este item não está no catálogo demonstrativo. Confira os exemplos disponíveis.', true);
        return;
      }
      showProduct(product);
    } catch {
      showState('Não foi possível carregar os detalhes agora. Tente novamente mais tarde.', true);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = '';
    const quantity = Number(quantityInput.value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      quantityInput.setAttribute('aria-invalid', 'true');
      message.textContent = 'Escolha uma quantidade entre 1 e 10.';
      quantityInput.focus();
      return;
    }

    quantityInput.removeAttribute('aria-invalid');
    try {
      addToCart(selectedProduct.id, quantity, products);
      message.textContent = 'Item demonstrativo adicionado ao carrinho.';
    } catch {
      message.textContent = 'Não foi possível salvar o carrinho neste navegador. Verifique as permissões de armazenamento.';
    }
  });

  initialize();
}
