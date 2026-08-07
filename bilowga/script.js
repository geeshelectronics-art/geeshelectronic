document.addEventListener("DOMContentLoaded", () => {
    const whatsappPhoneNumber = "252634548636"; // Geli lambarkaaga WhatsApp halkan

    let cart = [];

    // UI Elements
    const cartBtn = document.getElementById("cart-btn");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartModalOverlay = document.getElementById("cart-modal-overlay");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCountSpan = document.getElementById("cart-count");
    const totalPriceSpan = document.getElementById("total-price");
    const whatsappCheckoutBtn = document.getElementById("whatsapp-checkout-btn");
    const searchInput = document.getElementById("search-input");
    const productsGrid = document.getElementById("products-grid");

    // Open / Close Cart Modal
    cartBtn.addEventListener("click", () => {
        cartModal.classList.add("open");
        cartModalOverlay.classList.add("active");
    });

    closeCartBtn.addEventListener("click", closeCart);
    cartModalOverlay.addEventListener("click", closeCart);

    function closeCart() {
        cartModal.classList.remove("open");
        cartModalOverlay.classList.remove("active");
    }

    // Add Item To Cart + FLY ANIMATION (Event Delegation for 30 products)
    productsGrid.addEventListener("click", (e) => {
        const buyBtn = e.target.closest(".btn-buy");
        if (!buyBtn) return;

        const card = buyBtn.closest(".product-card");
        const title = card.getAttribute("data-title");
        const price = parseFloat(card.getAttribute("data-price"));
        const imgElement = card.querySelector(".img-box img");

        // Flying Image Animation
        if (imgElement) {
            animateFlyToCart(imgElement);
        }

        setTimeout(() => {
            addToCart(title, price);
            triggerCartBounce();
            showToast(`${title} waxaa lagu daray Sanduuqa!`);
        }, 700);
    });

    // Flying Image Function
    function animateFlyToCart(img) {
        const imgRect = img.getBoundingClientRect();
        const cartRect = cartBtn.getBoundingClientRect();

        const flyImg = img.cloneNode();
        flyImg.classList.add("flying-img");

        flyImg.style.left = `${imgRect.left}px`;
        flyImg.style.top = `${imgRect.top}px`;
        flyImg.style.width = `${imgRect.width}px`;
        flyImg.style.height = `${imgRect.height}px`;

        document.body.appendChild(flyImg);

        requestAnimationFrame(() => {
            flyImg.style.left = `${cartRect.left + 10}px`;
            flyImg.style.top = `${cartRect.top + 10}px`;
            flyImg.style.width = "25px";
            flyImg.style.height = "25px";
            flyImg.style.opacity = "0.4";
            flyImg.style.transform = "rotate(360deg)";
        });

        setTimeout(() => {
            flyImg.remove();
        }, 800);
    }

    // Trigger Cart Icon Bounce Effect
    function triggerCartBounce() {
        cartBtn.classList.add("cart-bounce");
        setTimeout(() => {
            cartBtn.classList.remove("cart-bounce");
        }, 500);
    }

    function addToCart(title, price) {
        cart.push({ title, price });
        updateCartUI();
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    function updateCartUI() {
        cartCountSpan.textContent = cart.length;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Sanduuqa waa madhan yahay xilligan.</p>';
            totalPriceSpan.textContent = "$0";
            return;
        }

        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>$${item.price}</p>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})">saar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        totalPriceSpan.textContent = `$${total}`;
    }

    // WhatsApp Checkout
    whatsappCheckoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Sanduuqa waa madhan yahay! Fadlan marka hore alaab ku dar.");
            return;
        }

        let message = "Asc Geesh Electronics, waxaan rabaa inaan dalbado alaabtan:\n\n";
        let total = 0;

        cart.forEach((item, i) => {
            message += `${i + 1}. ${item.title} - $${item.price}\n`;
            total += item.price;
        });

        message += `\n*Isku-geynta (Total): $${total}*`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${whatsappPhoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");
    });

    // Live Search Logic (Works dynamically for all 30 products)
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const productCards = document.querySelectorAll(".product-card");

        productCards.forEach((card) => {
            const title = card.getAttribute("data-title").toLowerCase();
            if (title.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    // Category Filtering Logic
    const filterButtons = document.querySelectorAll(".filter-btn");

    function applyCategoryFilter(selectedCategory) {
        const productCards = document.querySelectorAll(".product-card");
        productCards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category");

            if (selectedCategory === "all" || cardCategory === selectedCategory) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            applyCategoryFilter(btn.getAttribute("data-category"));
        });
    });

    // Footer Category Links -> filter products + scroll ilaa qaybta alaabta
    const footerCategoryLinks = document.querySelectorAll(".footer-col ul li a[data-category]");
    footerCategoryLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const category = link.getAttribute("data-category");

            filterButtons.forEach((b) => {
                b.classList.toggle("active", b.getAttribute("data-category") === category);
            });

            applyCategoryFilter(category);
            productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Toast Notification
    function showToast(message) {
        const existingToast = document.querySelector(".toast-notification");
        if (existingToast) existingToast.remove();

        const toast = document.createElement("div");
        toast.className = "toast-notification";
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 100);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});