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
        renderCartPage();
        if (typeof renderCartModal === 'function') {
            renderCartModal();
        }
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
        renderCartPage();
        if (typeof renderCartModal === 'function') {
            renderCartModal();
        }
    }
}

function clearCart() {
    saveCart([]);
    renderCartPage();
    if (typeof renderCartModal === 'function') {
        renderCartModal();
    }
}

function renderCartPage() {
    const cart = getCart();
    const emptyState = document.getElementById('cart-empty-state');
    const contentGrid = document.getElementById('cart-content-grid');
    const clearBtn = document.getElementById('clear-cart-btn');

    if (!emptyState || !contentGrid) return;

    if (cart.length === 0) {
        emptyState.style.display = 'block';
        contentGrid.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    contentGrid.style.display = 'grid';
    if (clearBtn) clearBtn.style.display = 'block';

    const tableBody = document.getElementById('cart-table-body');
    const summaryList = document.getElementById('summary-items-list');
    const summaryTotal = document.getElementById('summary-total-price');

    tableBody.innerHTML = '';
    summaryList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemPrice = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
            : Number(item.price) || 0;
        const itemQty = parseInt(item.quantity, 10) || 1;
        const itemSubtotal = itemPrice * itemQty;
        total += itemSubtotal;

        const safeId = String(item.id).replace(/'/g, "\\'");

        const row = document.createElement('div');
        row.className = 'cart-row';
        row.innerHTML = `
            <div class="cart-product-info">
                <img src="${item.image}" alt="${item.title}" class="cart-product-img">
                <span>${item.title}</span>
            </div>
            <div>$${itemPrice.toFixed(2)}</div>
            <div class="quantity-control">
                <button type="button" class="quantity-btn" onclick="updateQuantity('${safeId}', -1)" aria-label="Decrease quantity">-</button>
                <input type="number" min="1" class="quantity-value" value="${itemQty}" onchange="setCartItemQuantity('${safeId}', this.value)" aria-label="Product quantity">
                <button type="button" class="quantity-btn" onclick="updateQuantity('${safeId}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <div>$${itemSubtotal.toFixed(2)}</div>
            <div>
                <button type="button" class="action-remove-btn" onclick="removeFromCart('${safeId}')" title="Remove item" aria-label="Remove item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        tableBody.appendChild(row);

        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item-row';
        summaryItem.innerHTML = `
            <span>${item.title}</span>
            <span>$${itemSubtotal.toFixed(2)}</span>
        `;
        summaryList.appendChild(summaryItem);
    });

    summaryTotal.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();

    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }
});