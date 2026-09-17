let productsData = [];
let filteredProducts = [];
let currentPageP = 1;
const itemsPerPage = 9;
let activeCategoryId = null;

const PRICE_GAP = 10;
let PRICE_MIN = 0;
let PRICE_MAX = 999;
let priceMin = PRICE_MIN;
let priceMax = PRICE_MAX;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }

    const categoryItems = document.querySelectorAll('#category-filter-list li');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                activeCategoryId = null;
            } else {
                categoryItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                activeCategoryId = item.getAttribute('data-category');
            }
            applyFilters();
        });
    });

    const cleanBtn = document.getElementById('clean-filters-btn');
    if (cleanBtn) {
        cleanBtn.addEventListener('click', () => {
            activeCategoryId = null;
            categoryItems.forEach(el => el.classList.remove('active'));

            priceMin = PRICE_MIN;
            priceMax = PRICE_MAX;
            const rangeMinInput = document.getElementById('range-min');
            const rangeMaxInput = document.getElementById('range-max');
            if (rangeMinInput) rangeMinInput.value = PRICE_MIN;
            if (rangeMaxInput) rangeMaxInput.value = PRICE_MAX;
            
            updateSliderUI();
            applyFilters();
        });
    }

    initPriceSlider();
});

function fetchProducts() {
    fetch('js/products.json')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data => {
            productsData = data;

            if (productsData.length > 0) {
                const maxInJson = Math.max(...productsData.map(p => {
                    const cleanPrice = typeof p.price === 'string' 
                        ? p.price.replace(/[^0-9.]/g, '') 
                        : p.price;
                    return parseFloat(cleanPrice) || 0;
                }));

                PRICE_MAX = Math.ceil(maxInJson);
                priceMax = PRICE_MAX;
            }

            const rangeMinInput = document.getElementById('range-min');
            const rangeMaxInput = document.getElementById('range-max');

            if (rangeMinInput && rangeMaxInput) {
                rangeMinInput.min = PRICE_MIN;
                rangeMinInput.max = PRICE_MAX;
                rangeMinInput.value = PRICE_MIN;

                rangeMaxInput.min = PRICE_MIN;
                rangeMaxInput.max = PRICE_MAX;
                rangeMaxInput.value = PRICE_MAX;
            }

            updateSliderUI();
            applyFilters();
        })
        .catch(error => console.error('Failed to load products:', error));
}

function initPriceSlider() {
    const rangeMinInput = document.getElementById('range-min');
    const rangeMaxInput = document.getElementById('range-max');

    if (!rangeMinInput || !rangeMaxInput) return;

    rangeMinInput.addEventListener('input', () => {
        let minVal = parseInt(rangeMinInput.value, 10);
        let maxVal = parseInt(rangeMaxInput.value, 10);

        if (minVal > maxVal - PRICE_GAP) {
            minVal = maxVal - PRICE_GAP;
            rangeMinInput.value = minVal;
        }

        priceMin = minVal;
        updateSliderUI();
        applyFilters();
    });

    rangeMaxInput.addEventListener('input', () => {
        let minVal = parseInt(rangeMinInput.value, 10);
        let maxVal = parseInt(rangeMaxInput.value, 10);

        if (maxVal < minVal + PRICE_GAP) {
            maxVal = minVal + PRICE_GAP;
            rangeMaxInput.value = maxVal;
        }

        priceMax = maxVal;
        updateSliderUI();
        applyFilters();
    });

    updateSliderUI();
}

function updateSliderUI() {
    const rangeMinInput = document.getElementById('range-min');
    const rangeMaxInput = document.getElementById('range-max');
    const track = document.getElementById('slider-track');
    const minLabel = document.getElementById('price-min-label');
    const maxLabel = document.getElementById('price-max-label');

    if (!rangeMinInput || !rangeMaxInput) return;

    const minVal = parseInt(rangeMinInput.value, 10);
    const maxVal = parseInt(rangeMaxInput.value, 10);

    if (minLabel) minLabel.textContent = `$${minVal}`;
    if (maxLabel) maxLabel.textContent = `$${maxVal}`;

    if (track) {
        const range = PRICE_MAX - PRICE_MIN;
        if (range > 0) {
            const leftPct = ((minVal - PRICE_MIN) / range) * 100;
            const rightPct = 100 - ((maxVal - PRICE_MIN) / range) * 100;
            track.style.left = `${leftPct}%`;
            track.style.right = `${rightPct}%`;
        } else {
            track.style.left = '0%';
            track.style.right = '0%';
        }
    }
}

function applyFilters() {
    filteredProducts = productsData.filter(product => {
        const cat = product.category ? product.category.toString().toLowerCase() : '';
        const catName = product.categoryName ? product.categoryName.toString().toLowerCase() : '';
        const matchesCategory = !activeCategoryId || cat === activeCategoryId || catName === activeCategoryId;

        const rawPrice = typeof product.price === 'string' 
            ? product.price.replace(/[^0-9.]/g, '') 
            : product.price;
        const price = parseFloat(rawPrice) || 0;

        const matchesPrice = price >= priceMin && price <= priceMax;

        return matchesCategory && matchesPrice;
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect && sortSelect.value !== 'default') {
        sortProducts(sortSelect.value, false);
    } else {
        currentPageP = 1;
        renderCatalog();
    }
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
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px 0;">No products found.</p>`;
        renderPagination(0);
        return;
    }

    pageProducts.forEach(product => {
        let badgeHTML = '';

        if (!product.inStock) {
            badgeHTML = `<span class="badge out-of-stock">Out of Stock</span>`;
        } else if (product.oldPrice && product.oldPrice > product.price) {
            const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
            badgeHTML = `<span class="badge discount">${discount}% OFF</span>`;
        }

        const cardP = document.createElement('article');
        cardP.className = 'product-card';

        const productUrl = `product.html?id=${product.id}`;

        cardP.innerHTML = `
            <div class="product-image-backgroundS">
                ${badgeHTML}
                <a href="${productUrl}" class="product-link">
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                </a>
            </div>
            <a href="${productUrl}" class="product-link">
                <h3 class="product-title" title="${product.title}">${product.title}</h3>
            </a>
            <div class="product-price">
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

function sortProducts(type, reRender = true) {
    if (type === 'price-low') {
        filteredProducts.sort((a, b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceA - priceB;
        });
    } else if (type === 'price-high') {
        filteredProducts.sort((a, b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceB - priceA;
        });
    }

    if (reRender) {
        currentPageP = 1;
        renderCatalog();
    }
}