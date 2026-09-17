function getCart() {
    const raw = JSON.parse(localStorage.getItem('cart')) || [];
    return raw.map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0 : Number(item.price) || 0,
        quantity: parseInt(item.quantity, 10) || 1
    }));
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}

function addToCart(product) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => String(item.id) === String(product.id));

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        const rawPrice = product.price;
        const cleanPrice = typeof rawPrice === 'string'
            ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0
            : Number(rawPrice) || 0;

        cart.push({
            id: product.id,
            title: product.title,
            price: cleanPrice,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
    openCartModal();
}

function removeFromCart(id) {
    let cart = getCart().filter(item => String(item.id) !== String(id));
    saveCart(cart);
    renderCartModal();
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
}

function updateQuantity(id, change) {
    let cart = getCart();
    const index = cart.findIndex(item => String(item.id) === String(id));

    if (index > -1) {
        const currentQty = parseInt(cart[index].quantity, 10) || 1;
        const newQty = currentQty + change;
        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
        }
        saveCart(cart);
        if (typeof renderCartPage === 'function') {
            renderCartPage();
        }
        renderCartModal();
    }
}

function setCartItemQuantity(id, newQty) {
    let cart = getCart();
    const index = cart.findIndex(item => String(item.id) === String(id));

    if (index > -1) {
        const parsed = parseInt(newQty, 10);
        if (isNaN(parsed) || parsed <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = parsed;
        }
        saveCart(cart);
        if (typeof renderCartPage === 'function') {
            renderCartPage();
        }
        renderCartModal();
    }
}

function clearCart() {
    saveCart([]);
    renderCartModal();
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
}

function updateCartIcon() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');

    if (badge) {
        badge.textContent = totalCount;
    }
}

function renderCartModal() {
    const cartList = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');
    
    if (!cartList || !totalPriceEl) return;

    const cart = getCart();
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<li style="text-align: center; color: #64748b; padding: 40px 0;">Your cart is empty</li>';
        totalPriceEl.textContent = '$0';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemPrice = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
            : Number(item.price) || 0;
        const itemQty = parseInt(item.quantity, 10) || 1;
        const itemTotal = itemPrice * itemQty;
        total += itemTotal;

        const safeId = String(item.id).replace(/'/g, "\\'");

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title} (${itemQty})</h4>
                <div class="cart-item-price">Price: $${itemPrice.toFixed(2)}</div>
            </div>
            <button class="cart-remove-btn" onclick="removeFromCart('${safeId}')" title="Remove item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        cartList.appendChild(li);
    });

    totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        renderCartModal();
        cartModal.classList.add('open');
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('open');
    }
}

function initMobileMenu() {
    const container = document.querySelector('.site-header .container');
    const mainNav = document.querySelector('.main-nav');
    if (!container || !mainNav) return;

    let toggleBtn = document.getElementById('mobile-menu-btn');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'mobile-menu-btn';
        toggleBtn.className = 'mobile-menu-btn';
        toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
        toggleBtn.innerHTML = '<span></span><span></span><span></span>';

        const headerActions = container.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(toggleBtn);
        } else {
            container.appendChild(toggleBtn);
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mainNav.classList.toggle('mobile-active');
        toggleBtn.classList.toggle('active', isActive);
    });

    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !toggleBtn.contains(e.target)) {
            mainNav.classList.remove('mobile-active');
            toggleBtn.classList.remove('active');
        }
    });

    const dropdownLink = mainNav.querySelector('.dropdown-link');
    const dropdown = mainNav.querySelector('.dropdown');
    if (dropdownLink && dropdown) {
        dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 868) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    initMobileMenu();

    const cartBtn = document.getElementById('cart-icon-btn');
    const closeBtn = document.getElementById('close-cart-btn');
    const cartModal = document.getElementById('cart-modal');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartModal);
    }

    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
});