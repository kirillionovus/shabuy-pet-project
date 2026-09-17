let productsData = [];
let filteredProducts = [];
let currentPageP = 1;
const itemsPerPage = 8;
let activeCategoryId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('id');

    if (urlId) {
        activeCategoryId = decodeURIComponent(urlId).trim().toLowerCase();
    }

    fetchProducts();

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
});

function fetchProducts() {
    fetch('js/products.json')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data => {
            productsData = data;
            applyCategoryFilter();
        })
        .catch(error => console.error('Failed to load products:', error));
}

function applyCategoryFilter() {
    if (activeCategoryId) {
        filteredProducts = productsData.filter(product => {
            const cat = product.category ? product.category.toLowerCase() : '';
            const catName = product.categoryName ? product.categoryName.toLowerCase() : '';
            return cat === activeCategoryId || catName === activeCategoryId;
        });
    } else {
        filteredProducts = [...productsData];
    }

    currentPageP = 1;
    renderCatalog();
}

function renderCatalog() {
    const grid = document.getElementById('products-gridP');
    const countText = document.getElementById('products-count');

    if (!grid) return;

    const totalItems = filteredProducts.length;
    const startIndex = (currentPageP - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const pageProducts = filteredProducts.slice(startIndex, endIndex);

    if (countText) {
        countText.textContent = `Showing ${pageProducts.length} of ${totalItems} Products`;
    }

    grid.innerHTML = '';

    if (pageProducts.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px 0;">No products found in this category.</p>`;
        renderPagination(0);
        return;
    }

    pageProducts.forEach(product => {
        let badgeHTML = '';

        if (!product.inStock) {
            badgeHTML = `<span class="badge badge-out">Out of Stock</span>`;
        } else if (product.oldPrice && product.oldPrice > product.price) {
            const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
            badgeHTML = `<span class="badge badge-discount">${discount}% OFF</span>`;
        }

        const cardP = document.createElement('article');
        cardP.className = 'product-card';

        const productUrl = `product.html?id=${product.id}`;

        cardP.innerHTML = `
            <div class="product-image-background">
                ${badgeHTML}
                <a href="${productUrl}" class="product-link">
                    <div class="product-image-wrap">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                </a>
            </div>
            <a href="${productUrl}" class="product-link">
                <h3 class="product-title" title="${product.title}">${product.title}</h3>
            </a>
            <div class="product-price-box">
                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
                <span class="current-price">$${product.price}</span>
            </div>
        `;

        grid.appendChild(cardP);
    });

    renderPagination(totalItems);
}

function renderPagination(totalItems) {
    const pageNumbersContainer = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (!pageNumbersContainer) return;

    pageNumbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btnP = document.createElement('button');
        btnP.className = `page-btn ${i === currentPageP ? 'active' : ''}`;
        btnP.textContent = i;
        btnP.addEventListener('click', () => {
            currentPageP = i;
            renderCatalog();
        });
        pageNumbersContainer.appendChild(btnP);
    }

    if (prevBtn) {
        prevBtn.disabled = currentPageP === 1 || totalPages === 0;
        prevBtn.onclick = () => {
            if (currentPageP > 1) {
                currentPageP--;
                renderCatalog();
            }
        };
    }

    if (nextBtn) {
        nextBtn.disabled = currentPageP === totalPages || totalPages === 0;
        nextBtn.onclick = () => {
            if (currentPageP < totalPages) {
                currentPageP++;
                renderCatalog();
            }
        };
    }
}

function sortProducts(type) {
    if (type === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (type === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else {
        applyCategoryFilter();
        return;
    }

    currentPageP = 1;
    renderCatalog();
}