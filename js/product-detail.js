const DETAIL_WHATSAPP_NUMBER = '919999999999';

function buildDetailWhatsAppLink(name, price) {
  const message = encodeURIComponent(
    'Hi, I want to order:\nProduct: ' + name + '\nPrice: \u20B9' + price + '\nQuantity: 1'
  );
  return 'https://wa.me/' + DETAIL_WHATSAPP_NUMBER + '?text=' + message;
}

(function () {
  const container = document.getElementById('product-detail');

  if (!container) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  let touchStartX = 0;
  let touchEndX = 0;

  function formatPrice(price) {
    return new Intl.NumberFormat('en-IN').format(price);
  }

  function renderNotFound() {
    container.innerHTML = '<p class="empty-state">Product not found.</p>';
  }

  function renderProduct(product) {
    const images = product.images && product.images.length ? product.images : ['assets/products/product-1/img1.jpg'];

    container.innerHTML = `
      <div class="detail-layout fade-in">
        <div class="detail-gallery">
          <div class="detail-main-image" id="detail-main-image">
            <img id="detail-main-photo" src="${images[0]}" alt="${product.name}">
            <span class="detail-swipe-hint">Swipe to browse</span>
          </div>
          <div class="thumbnail-row" id="thumbnail-row">
            ${images.map(function (image, index) {
              const activeClass = index === 0 ? ' active' : '';
              return `
                <button type="button" class="thumbnail-button${activeClass}" data-image-index="${index}" aria-label="View image ${index + 1}">
                  <img src="${image}" alt="${product.name} thumbnail ${index + 1}">
                </button>
              `;
            }).join('')}
          </div>
        </div>
        <article class="detail-card">
          <p class="product-category">${product.category}</p>
          <h2>${product.name}</h2>
          <span class="product-price">&#8377;${formatPrice(product.price)}</span>
          <p>${product.description}</p>
          <div class="detail-actions">
            <a class="btn-primary" href="${buildDetailWhatsAppLink(product.name, product.price)}" target="_blank" rel="noreferrer">Order on WhatsApp</a>
            <a class="btn-secondary" href="products.html">Back to Products</a>
          </div>
        </article>
      </div>
    `;

    const mainImage = document.getElementById('detail-main-photo');
    const mainImageFrame = document.getElementById('detail-main-image');
    const thumbnails = Array.from(document.querySelectorAll('.thumbnail-button'));
    let currentIndex = 0;

    function updateImage(index) {
      currentIndex = index;
      mainImage.src = images[currentIndex];
      mainImage.alt = product.name + ' image ' + (currentIndex + 1);

      thumbnails.forEach(function (thumbnail, thumbIndex) {
        thumbnail.classList.toggle('active', thumbIndex === currentIndex);
      });
    }

    thumbnails.forEach(function (thumbnail) {
      thumbnail.addEventListener('click', function () {
        updateImage(Number(thumbnail.getAttribute('data-image-index')));
      });
    });

    if (mainImageFrame) {
      mainImageFrame.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
      }, { passive: true });

      mainImageFrame.addEventListener('touchend', function (event) {
        touchEndX = event.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;

        if (Math.abs(delta) < 40) {
          return;
        }

        if (delta < 0) {
          updateImage((currentIndex + 1) % images.length);
        } else {
          updateImage((currentIndex - 1 + images.length) % images.length);
        }
      }, { passive: true });
    }
  }

  if (!productId) {
    renderNotFound();
    return;
  }

  fetch('./data/products.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load product data');
      }
      return response.json();
    })
    .then(function (products) {
      const product = products.find(function (item) {
        return Number(item.id) === productId;
      });

      if (!product) {
        renderNotFound();
        return;
      }

      renderProduct(product);
    })
    .catch(function () {
      container.innerHTML = '<p class="empty-state">Unable to load this product right now.</p>';
    });
}());
