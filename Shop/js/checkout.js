

document.addEventListener('DOMContentLoaded', () => {
    initOrderSummary();
    initPaymentMethodToggle();
    initCardInputFormatters();
    initFormValidation();
});


function initOrderSummary() {
    const itemsContainer = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total-price');
    const emptyState = document.getElementById('checkout-empty-state');
    const contentGrid = document.getElementById('checkout-grid');
    const placeOrderBtn = document.getElementById('place-order-btn');

    if (!itemsContainer || !subtotalEl || !totalEl) return;

    const cart = typeof getCart === 'function' ? getCart() : [];

    if (cart.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (contentGrid) contentGrid.style.display = 'none';
        if (placeOrderBtn) placeOrderBtn.disabled = true;
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (contentGrid) contentGrid.style.display = 'grid';
    if (placeOrderBtn) placeOrderBtn.disabled = false;

    itemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemPrice = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
            : Number(item.price) || 0;
        const itemQty = parseInt(item.quantity, 10) || 1;
        const itemTotal = itemPrice * itemQty;
        subtotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'checkout-item-row';
        row.innerHTML = `
            <div class="checkout-item-info">
                <img src="${item.image || 'img/placeholder.png'}" alt="${item.title}" class="checkout-item-img">
                <div class="checkout-item-details">
                    <span class="checkout-item-title">${item.title}</span>
                    <span class="checkout-item-qty">Qty: ${itemQty} × $${itemPrice.toFixed(2)}</span>
                </div>
            </div>
            <strong class="checkout-item-total">$${itemTotal.toFixed(2)}</strong>
        `;
        itemsContainer.appendChild(row);
    });

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
}


function initPaymentMethodToggle() {
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    const cardFields = document.getElementById('credit-card-fields');

    if (!paymentRadios.length || !cardFields) return;

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'card' && radio.checked) {
                cardFields.style.display = 'block';
            } else {
                cardFields.style.display = 'none';
                
                clearCardErrors();
            }
        });
    });
}

function clearCardErrors() {
    const cardInputs = document.querySelectorAll('#credit-card-fields input');
    cardInputs.forEach(input => clearFieldError(input));
}


function initCardInputFormatters() {
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 19);
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted;
        });
    }

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 2) {
                e.target.value = val.substring(0, 2) + '/' + val.substring(2);
            } else {
                e.target.value = val;
            }
        });
    }

    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}


function initFormValidation() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    const fieldsToValidate = [
        'first-name',
        'last-name',
        'email',
        'phone',
        'country',
        'address',
        'city',
        'state',
        'zip'
    ];

    
    fieldsToValidate.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateField(input);
            }
        });
    });

    
    const cardFieldIds = ['card-name', 'card-number', 'card-expiry', 'card-cvv'];
    cardFieldIds.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('blur', () => {
            const selectedMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
            if (selectedMethod === 'card') {
                validateField(input);
            }
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateField(input);
            }
        });
    });

    
    form.addEventListener('submit', handleCheckoutSubmit);
}


function validateField(input) {
    const id = input.id;
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (id) {
        case 'first-name':
            if (!value) {
                isValid = false;
                errorMessage = 'First name is required.';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'First name must be at least 2 characters.';
            } else if (!/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s'-]+$/.test(value)) {
                isValid = false;
                errorMessage = 'First name can only contain letters.';
            }
            break;

        case 'last-name':
            if (!value) {
                isValid = false;
                errorMessage = 'Last name is required.';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Last name must be at least 2 characters.';
            } else if (!/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s'-]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Last name can only contain letters.';
            }
            break;

        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email address is required.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address (e.g. name@example.com).';
            }
            break;

        case 'phone':
            const digits = value.replace(/\D/g, '');
            if (!value) {
                isValid = false;
                errorMessage = 'Phone number is required.';
            } else if (digits.length < 7 || digits.length > 15) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number (7 to 15 digits).';
            }
            break;

        case 'country':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a country.';
            }
            break;

        case 'address':
            if (!value) {
                isValid = false;
                errorMessage = 'Street address is required.';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Street address must be at least 5 characters.';
            }
            break;

        case 'city':
            if (!value) {
                isValid = false;
                errorMessage = 'City is required.';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'City must be at least 2 characters.';
            }
            break;

        case 'state':
            if (!value) {
                isValid = false;
                errorMessage = 'State / province is required.';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'State must be at least 2 characters.';
            }
            break;

        case 'zip':
            if (!value) {
                isValid = false;
                errorMessage = 'Postal / ZIP code is required.';
            } else if (!/^[0-9a-zA-Z\s-]{3,10}$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid ZIP / postal code.';
            }
            break;

        case 'card-name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name on card is required.';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters.';
            }
            break;

        case 'card-number':
            const cardDigits = value.replace(/\s/g, '');
            if (!cardDigits) {
                isValid = false;
                errorMessage = 'Card number is required.';
            } else if (!/^\d{13,19}$/.test(cardDigits)) {
                isValid = false;
                errorMessage = 'Card number must be 13 to 19 digits.';
            }
            break;

        case 'card-expiry':
            if (!value) {
                isValid = false;
                errorMessage = 'Expiry date is required.';
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                isValid = false;
                errorMessage = 'Enter date in MM/YY format.';
            } else {
                const parts = value.split('/');
                const month = parseInt(parts[0], 10);
                const year = parseInt('20' + parts[1], 10);
                const now = new Date();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear();

                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    isValid = false;
                    errorMessage = 'This card has expired.';
                }
            }
            break;

        case 'card-cvv':
            if (!value) {
                isValid = false;
                errorMessage = 'CVV is required.';
            } else if (!/^\d{3,4}$/.test(value)) {
                isValid = false;
                errorMessage = 'CVV must be 3 or 4 digits.';
            }
            break;
    }

    if (!isValid) {
        showFieldError(input, errorMessage);
    } else {
        clearFieldError(input);
    }

    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('input-error');
    input.classList.remove('input-valid');

    const group = input.closest('.form-group') || input.parentElement;
    let errorEl = group.querySelector('.field-error-msg');

    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error-msg';
        group.appendChild(errorEl);
    }

    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function clearFieldError(input) {
    input.classList.remove('input-error');
    input.classList.add('input-valid');

    const group = input.closest('.form-group') || input.parentElement;
    const errorEl = group.querySelector('.field-error-msg');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
}


function handleCheckoutSubmit(e) {
    e.preventDefault();

    const cart = typeof getCart === 'function' ? getCart() : [];
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before checking out.');
        window.location.href = 'shop.html';
        return;
    }

    const fieldsToValidate = [
        'first-name',
        'last-name',
        'email',
        'phone',
        'country',
        'address',
        'city',
        'state',
        'zip'
    ];

    const selectedPayment = document.querySelector('input[name="payment-method"]:checked')?.value;
    if (selectedPayment === 'card') {
        fieldsToValidate.push('card-name', 'card-number', 'card-expiry', 'card-cvv');
    }

    let isFormValid = true;
    let firstInvalidInput = null;

    fieldsToValidate.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const valid = validateField(input);
            if (!valid) {
                isFormValid = false;
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            }
        }
    });

    if (!isFormValid) {
        if (firstInvalidInput) {
            firstInvalidInput.focus();
            firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    
    const placeOrderBtn = document.getElementById('place-order-btn');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = `
        <span class="checkout-spinner"></span> Processing Order...
    `;

    setTimeout(() => {
        const orderNumber = 'SHABUY-' + Math.floor(100000 + Math.random() * 900000);
        const firstName = document.getElementById('first-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const totalAmount = document.getElementById('checkout-total-price').textContent;

        
        if (typeof clearCart === 'function') {
            clearCart();
        } else if (typeof saveCart === 'function') {
            saveCart([]);
        } else {
            localStorage.setItem('cart', JSON.stringify([]));
        }

        
        showOrderSuccessModal({
            orderNumber,
            customerName: firstName,
            email,
            total: totalAmount
        });

        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = originalText;
    }, 1200);
}


function showOrderSuccessModal(orderData) {
    const modal = document.getElementById('order-success-modal');
    if (!modal) return;

    const orderNumEl = document.getElementById('success-order-number');
    const customerEl = document.getElementById('success-customer-name');
    const emailEl = document.getElementById('success-customer-email');
    const totalEl = document.getElementById('success-order-total');

    if (orderNumEl) orderNumEl.textContent = orderData.orderNumber;
    if (customerEl) customerEl.textContent = orderData.customerName;
    if (emailEl) emailEl.textContent = orderData.email;
    if (totalEl) totalEl.textContent = orderData.total;

    modal.classList.add('open');
}
