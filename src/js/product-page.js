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
  const mainImage = page.querySelector('[data-product-image]');
  const mainImageFallback = page.querySelector('[data-product-image-fallback]');
  const caption = page.querySelector('[data-product-caption]');
  const thumbnails = page.querySelector('[data-product-thumbnails]');
  const relatedGrid = page.querySelector('[data-related-grid]');
  let selectedProduct;
  let products = [];

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function showState(text, isError = false) {
    state.hidden = false;
    state.replaceChildren(document.createTextNode(text));
    if (isError) {
      const link = makeElement('a', 'shop-text-button', 'Ver catálogo');
      link.href = './catalogo.html';
      state.append(' ', link);
    }
    state.classList.toggle('shop-status--error', isError);
    view.hidden = true;
    form.hidden = true;
  }

  function showImage(image) {
    mainImage.hidden = false;
    mainImageFallback.hidden = true;
    mainImage.src = image.src;
    mainImage.alt = image.alt;
    caption.textContent = image.caption;
    mainImage.onerror = () => {
      mainImage.hidden = true;
      mainImageFallback.hidden = false;
      mainImageFallback.textContent = 'Fotografia temporariamente indisponível';
    };
  }

  function renderGallery(product) {
    const gallery = product.gallery;
    showImage(gallery[0]);
    const buttons = gallery.map((image, index) => {
      const button = document.createElement('button');
      button.className = 'product-gallery__thumbnail';
      button.type = 'button';
      button.setAttribute('aria-label', `Ver imagem ${index + 1}: ${image.alt}`);
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      button.setAttribute('aria-controls', 'product-main-image');

      const preview = document.createElement('img');
      preview.src = image.src;
      preview.alt = '';
      preview.width = 160;
      preview.height = 160;
      preview.loading = 'lazy';
      preview.decoding = 'async';
      preview.addEventListener('error', () => button.remove(), { once: true });
      button.append(preview);
      button.addEventListener('click', () => {
        showImage(image);
        for (const otherButton of buttons) {
          otherButton.setAttribute('aria-pressed', otherButton === button ? 'true' : 'false');
        }
      });
      return button;
    });
    thumbnails.replaceChildren(...buttons);
    thumbnails.hidden = gallery.length < 2;
  }

  function makeRelatedCard(product) {
    const article = makeElement('article', 'related-card');
    const link = document.createElement('a');
    link.className = 'related-card__link';
    link.href = `./produto.html?id=${encodeURIComponent(product.id)}`;

    const image = document.createElement('img');
    image.className = 'related-card__image';
    image.src = product.image;
    image.alt = product.imageAlt;
    image.width = 600;
    image.height = 480;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      const fallback = makeElement('span', 'related-card__image-fallback', 'Fotografia indisponível');
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', `Fotografia de referência indisponível: ${product.name}`);
      image.replaceWith(fallback);
    }, { once: true });

    const copy = makeElement('div', 'related-card__copy');
    copy.append(
      makeElement('span', 'related-card__category', product.category),
      makeElement('strong', 'related-card__name', product.name),
      makeElement('span', 'related-card__price', `Valor de referência · ${formatBRL(product.price)}`),
      makeElement('span', 'related-card__credit', product.gallery[0]?.caption || 'Fotografia de referência'),
    );
    link.append(image, copy);
    article.append(link);
    return article;
  }

  function renderRelated(product) {
    const sameCategory = products.filter((item) => item.id !== product.id && item.category === product.category);
    const remaining = products.filter((item) => item.id !== product.id && item.category !== product.category);
    const related = [...sameCategory, ...remaining].slice(0, 3);
    relatedGrid.replaceChildren(...related.map(makeRelatedCard));
    page.querySelector('[data-product-related]').hidden = related.length === 0;
  }

  function showProduct(product) {
    selectedProduct = product;
    page.querySelector('[data-product-category]').textContent = `${product.category} · referência visual`;
    page.querySelector('[data-product-name]').textContent = product.name;
    page.querySelector('[data-product-description]').textContent = product.description;
    page.querySelector('[data-product-visual-note]').textContent = product.visualNote;
    page.querySelector('[data-product-price]').textContent = formatBRL(product.price);

    const materials = page.querySelector('[data-product-materials]');
    materials.replaceChildren();
    if (product.materials.length > 0) {
      for (const material of product.materials) {
        materials.append(makeElement('li', '', material));
      }
    } else {
      materials.append(makeElement('li', '', product.materialsStatus));
    }

    renderGallery(product);
    renderRelated(product);
    state.hidden = true;
    view.hidden = false;
    form.hidden = false;
  }

  async function initialize() {
    const id = new URLSearchParams(window.location.search).get('id') || '';
    if (!/^[a-z0-9-]{1,80}$/i.test(id)) {
      showState('Não encontramos esse item. Volte ao catálogo para explorar as referências.', true);
      return;
    }

    try {
      products = await loadProducts();
      const product = products.find((item) => item.id === id);
      if (!product) {
        showState('Este item não está no catálogo. Confira as referências disponíveis.', true);
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
      message.textContent = 'Item adicionado à sacola.';
    } catch {
      message.textContent = 'Não foi possível salvar a sacola neste navegador. Verifique as permissões de armazenamento.';
    }
  });

  initialize();
}
