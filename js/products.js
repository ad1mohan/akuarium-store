const WHATSAPP_NUMBER = '919999999999';

function buildWhatsAppLink(name, price) {
  const message = encodeURIComponent(
    'Hi, I want to order:\nProduct: ' + name + '\nPrice: \u20B9' + price + '\nQuantity: 1'
  );
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message;
}

(function () {
  const grid = document.getElementById('product-grid');
  const filterBar = document.getElementById('filter-bar');

  if (!grid || !filterBar) {
    return;
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('en-IN').format(price);
  }

  function renderProducts(products, selectedCategory) {
    const filteredProducts = selectedCategory === 'All'
      ? products
      : products.filter(function (product) {
          return product.category === selectedCategory;
        });

    if (!filteredProducts.length) {
      grid.innerHTML = '<p class="empty-state">No products found in this category.</p>';
      return;
    }

    grid.innerHTML = filteredProducts.map(function (product) {
      const image = product.images && product.images.length ? product.images[0] : 'assets/products/product-1/img1.jpg';

      return `
        <article class="product-card fade-in" data-category="${product.category}" data-product-id="${product.id}">
          <div class="product-card-image">
            <img src="${image}" alt="${product.name}">
          </div>
          <div class="product-card-body">
            <div class="product-meta">
              <div>
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
              </div>
              <span class="product-price">&#8377;${formatPrice(product.price)}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <div class="card-actions">
              <span class="product-category">Fast response</span>
              <a class="btn-whatsapp" href="${buildWhatsAppLink(product.name, product.price)}" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.product-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const productId = card.getAttribute('data-product-id');
        window.location.href = 'product-detail.html?id=' + productId;
      });
    });

    grid.querySelectorAll('.btn-whatsapp').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    });
  }

  function renderFilters(categories, selectedCategory, onFilterClick) {
    const allCategories = ['All'].concat(categories);

    filterBar.innerHTML = allCategories.map(function (category) {
      const activeClass = category === selectedCategory ? ' active' : '';
      return '<button type="button" class="filter-button' + activeClass + '" data-category="' + category + '">' + category + '</button>';
    }).join('');

    filterBar.querySelectorAll('.filter-button').forEach(function (button) {
      button.addEventListener('click', function () {
        onFilterClick(button.getAttribute('data-category'));
      });
    });
  }

  fetch('./data/products.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      return response.json();
    })
    .then(function (products) {
      const categories = Array.from(new Set(products.map(function (product) {
        return product.category;
      })));
      let selectedCategory = 'All';

      function update(category) {
        selectedCategory = category;
        renderFilters(categories, selectedCategory, update);
        renderProducts(products, selectedCategory);
      }

      update(selectedCategory);
    })
    .catch(function () {
      filterBar.innerHTML = '<p class="empty-state">Unable to load categories right now.</p>';
      grid.innerHTML = '<p class="empty-state">Unable to load products right now.</p>';
    });
}());
