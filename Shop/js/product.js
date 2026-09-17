let currentProductData = null; 

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id")) || 1;

    try {
        const response = await fetch("js/products.json"); 

        if (!response.ok) {
            throw new Error(`File not found at specified path. Status: ${response.status}`);
        }

        const productsDatabase = await response.json();
        const currentProduct = productsDatabase.find(product => product.id === productId);

        if (currentProduct) {
            currentProductData = currentProduct; 
            renderProductDetails(currentProduct);
            initQuantityPicker();
            initTabs(currentProduct);
            initAddToCartButton(); 
        } else {
            showError("Product with this ID was not found");
        }
    } catch (error) {
        console.error("Loading error:", error);
        showError("Failed to load product details. Please check the JSON file path.");
    }
});

function showError(message) {
    const mainContainer = document.querySelector(".product-page");
    if (mainContainer) {
        mainContainer.innerHTML = `<h2 style="text-align: center; padding: 60px 0; color: #d32f2f;">${message}</h2>`;
    }
}

function renderProductDetails(data) {
    const titleEl = document.getElementById("product-title");
    const currentPriceEl = document.getElementById("current-price");
    const oldPriceEl = document.getElementById("old-price");
    const badgeEl = document.getElementById("product-badge");
    const stockEl = document.getElementById("stock-status");
    const mainImgEl = document.getElementById("main-product-img");
    const thumbnailsContainer = document.getElementById("thumbnails-container");

    if (titleEl) titleEl.textContent = data.title;
    if (currentPriceEl) currentPriceEl.textContent = `$${data.price.toFixed(2)}`;
    
    if (oldPriceEl) {
        oldPriceEl.textContent = data.oldPrice ? `$${data.oldPrice.toFixed(2)}` : "";
    }

    if (badgeEl) {
        if (data.oldPrice && data.oldPrice > data.price) {
            const discountPercent = Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100);
            badgeEl.textContent = `-${discountPercent}%`;
            badgeEl.style.display = "inline-block";
        } else {
            badgeEl.style.display = "none";
        }
    }

    if (stockEl) {
        stockEl.textContent = data.inStock ? "In Stock" : "Out of Stock";
        stockEl.style.color = data.inStock ? "#2e7d32" : "#d32f2f";
        stockEl.style.backgroundColor = data.inStock ? "#e8f5e9" : "#ffebee";
    }

    if (mainImgEl && data.image) {
        mainImgEl.src = data.image;
        mainImgEl.alt = data.title;
    }

    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = "";
        if (data.image) {
            const img = document.createElement("img");
            img.src = data.image;
            img.alt = data.title;
            img.classList.add("thumbnail", "active");
            thumbnailsContainer.appendChild(img);
        }
    }
}

function initQuantityPicker() {
    const qtyInput = document.getElementById("qty-input");
    const minusBtn = document.getElementById("minus-btn");
    const plusBtn = document.getElementById("plus-btn");

    if (!qtyInput || !minusBtn || !plusBtn) return;

    minusBtn.addEventListener("click", () => {
        let currentValue = parseInt(qtyInput.value) || 1;
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener("click", () => {
        let currentValue = parseInt(qtyInput.value) || 1;
        qtyInput.value = currentValue + 1;
    });

    qtyInput.addEventListener("change", () => {
        let currentValue = parseInt(qtyInput.value);
        if (isNaN(currentValue) || currentValue < 1) {
            qtyInput.value = 1;
        }
    });
}


function initAddToCartButton() {
    const addBtn = document.getElementById("add-to-cart-btn");
    const qtyInput = document.getElementById("qty-input");

    if (!addBtn || !currentProductData) return;

    if (!currentProductData.inStock) {
        addBtn.disabled = true;
        addBtn.textContent = "Out of Stock";
        return;
    }

    addBtn.addEventListener("click", () => {
        const count = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

        
        if (typeof addToCart === "function") {
            for (let i = 0; i < count; i++) {
                addToCart(currentProductData);
            }
        } else {
            console.warn("Функция addToCart не найдена. Убедитесь, что js/cart.js подключен.");
        }
    });
}

function initTabs(product) {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const contentBox = document.getElementById("tab-content");

    if (!contentBox || tabButtons.length === 0) return;

    const specsHtml = `
        <p>${product.specification || ""}</p>
        <ul style="margin-top: 10px; list-style: none;">
            <li><strong>Brand:</strong> ${product.specs?.brand || "N/A"}</li>
            <li><strong>Color:</strong> ${product.specs?.color || "N/A"}</li>
            <li><strong>Category:</strong> ${product.categoryName || "N/A"}</li>
        </ul>
    `;

    const tabContents = {
        description: `<p>${product.description || "No description available."}</p>`,
        specs: specsHtml,
        reviews: `<p>Reviews count: ${product.reviewsCount || 0} (Rating: ${product.rating || 5}/5)</p>`
    };

    contentBox.innerHTML = tabContents.description;

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab");

            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (tabContents[targetTab]) {
                contentBox.innerHTML = tabContents[targetTab];
            }
        });
    });
}