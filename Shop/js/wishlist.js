function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistIcon();
    renderWishlistPage();
}

function isInWishlist(id) {
    if (!id) return false;
    const wishlist = getWishlist();
    return wishlist.some(item => String(item.id) === String(id));
}

function updateWishlistIcon() {
    const wishlist = getWishlist();
    const badge = document.getElementById('wishlist-badge') || 
                  document.querySelector('.header-actions .badge-wrapper img[src*="favorite"]')?.parentElement.querySelector('.counter-badge');
    
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

function toggleWishlist(product) {
    if (!product || !product.id) return;

    let wishlist = getWishlist();
    const index = wishlist.findIndex(item => String(item.id) === String(product.id));

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(product);
    }

    saveWishlist(wishlist);
}

function removeFromWishlist(id) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => String(item.id) !== String(id));
    saveWishlist(wishlist);
}

function handleAddToCartFromWishlist(id) {
    const wishlist = getWishlist();
    const product = wishlist.find(item => String(item.id) === String(id));
    
    if (product) {
        if (typeof addToCart === 'function') {
            addToCart(product);
        } else if (typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
            cart.addItem(product);
        }
        removeFromWishlist(id);
    }
}

function updateWishlistBtnState(btn, id) {
    const svgIcon = btn.querySelector('svg');
    const path = btn.querySelector('svg path');

    if (isInWishlist(id)) {
        btn.style.color = 'white';
        btn.style.borderColor = '#e63946';
        btn.style.background = '#e63946';

        if (svgIcon) {
            svgIcon.style.fill = 'white';
            svgIcon.style.stroke = 'white';
        }
        if (path) {
            path.style.fill = 'white';
            path.style.stroke = 'white';
        }
    } else {
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.background = 'white';

        if (svgIcon) {
            svgIcon.style.fill = 'none';
            svgIcon.style.stroke = 'currentColor';
        }
        if (path) {
            path.style.fill = 'none';
            path.style.stroke = 'currentColor';
        }
    }
}

function getProductDataFromPage() {
    if (window.currentProduct && window.currentProduct.id) {
        return window.currentProduct;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1';

    const titleEl = document.getElementById('product-title');
    const priceEl = document.getElementById('current-price');
    const imgEl = document.getElementById('main-product-img');

    const title = titleEl ? titleEl.textContent.trim() : 'Product';
    const priceRaw = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
    const price = parseFloat(priceRaw) || 0;
    const image = imgEl ? imgEl.getAttribute('src') : '';

    return {
        id: productId,
        title: title,
        price: price,
        image: image
    };
}

function renderWishlistPage() {
    const tableBody = document.getElementById('wishlist-table-body');
    const emptyState = document.getElementById('wishlist-empty-state');
    const contentCard = document.getElementById('wishlist-content-card');

    if (!tableBody) return;

    const wishlist = getWishlist();

    if (wishlist.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (contentCard) contentCard.style.display = 'none';
        tableBody.innerHTML = '';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (contentCard) contentCard.style.display = 'block';

    tableBody.innerHTML = wishlist.map(item => `
        <div class="wishlist-row" data-id="${item.id}">
            <div class="wishlist-product-info">
                <img src="${item.image || 'img/placeholder.png'}" alt="${item.title}" class="wishlist-product-img">
                <span>${item.title}</span>
            </div>
            <div>$${Number(item.price).toFixed(2)}</div>
            <div><span class="stock-badge">In Stock</span></div>
            <div>
                <button class="btn-add-cart-table" onclick="handleAddToCartFromWishlist('${item.id}')">Add To Cart</button>
            </div>
            <div>
                <button class="action-remove-btn" onclick="removeFromWishlist('${item.id}')">&times;</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    updateWishlistIcon();
    renderWishlistPage();

    const headerWishlistBtn = document.querySelector('.header-actions .badge-wrapper img[src*="favorite"]')?.parentElement;
    if (headerWishlistBtn) {
        headerWishlistBtn.style.cursor = 'pointer';
        headerWishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'wishlist.html';
        });
    }

    const clearBtn = document.getElementById('clear-wishlist-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            saveWishlist([]);
        });
    }

    const wishlistBtn = document.querySelector('.btn-wishlist');
    if (wishlistBtn) {
        setTimeout(() => {
            const product = getProductDataFromPage();
            updateWishlistBtnState(wishlistBtn, product.id);

            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentProd = getProductDataFromPage();
                toggleWishlist(currentProd);
                updateWishlistBtnState(wishlistBtn, currentProd.id);
            });
        }, 200);
    }
});