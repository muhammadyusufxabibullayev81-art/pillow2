
let cart = [];
let wishlist = [];

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

function addToCart(name, price) {
    let item = cart.find(p => p.name === name);
    if (item) item.quantity++;
    else cart.push({ name, price, quantity: 1 });
    updateCart();
    showToast(name + " added to bag!");
}

function updateCart() {
    const container = document.getElementById("cart-items");
    let total = 0;
    let count = 0;
    container.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-controls">
                    <button onclick="changeQuantity(${index},-1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index},1)">+</button>
                    <button onclick="removeItem(${index})">×</button>
                </div>
            </div>`;
    });

    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("cart-count").textContent = count;
    if (!cart.length) container.innerHTML = "<p>Your bag is empty.</p>";
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function togglePanel(id) {
    closePanels();
    document.getElementById("overlay").classList.add("active");
    document.getElementById(id).classList.add("active");
}

function toggleCart() {
    togglePanel("cart-panel");
}

function toggleWishlist() {
    renderWishlist();
    togglePanel("wishlist-panel");
}

function closePanels() {
    document.querySelectorAll(".side-panel").forEach(p => p.classList.remove("active"));
    document.getElementById("overlay").classList.remove("active");
}

function addWishlist(button, name) {
    if (wishlist.includes(name)) {
        wishlist = wishlist.filter(item => item !== name);
        button.classList.remove("liked");
        button.textContent = "♡";
        showToast("Removed from wishlist");
    } else {
        wishlist.push(name);
        button.classList.add("liked");
        button.textContent = "♥";
        showToast("Added to wishlist!");
    }
    renderWishlist();
}

function renderWishlist() {
    const container = document.getElementById("wishlist-items");
    container.innerHTML = "";
    if (!wishlist.length) container.innerHTML = "<p>Your wishlist is empty.</p>";

    wishlist.forEach(name => {
        container.innerHTML += `<div class="cart-item"><strong>${name}</strong><span>♥</span></div>`;
    });
}

function filterProducts(category, button) {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".product-card").forEach(card => {
        card.style.display = category === "all" || card.dataset.category === category ? "" : "none";
    });
    document.getElementById("no-results").style.display = "none";
}

function searchProducts() {
    let query = document.getElementById("search").value.toLowerCase();
    let visible = 0;

    document.querySelectorAll(".product-card").forEach(card => {
        let match = card.dataset.name.toLowerCase().includes(query);
        card.style.display = match ? "" : "none";
        if (match) visible++;
    });

    document.getElementById("no-results").style.display = visible ? "none" : "block";
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
}

function focusSearch() {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("search").focus(), 500);
}

function checkout() {
    if (!cart.length) {
        showToast("Your shopping bag is empty!");
        return;
    }

    let order = cart.map(item => `${item.name} x${item.quantity}`).join("\n");
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    alert("Your order:\n" + order + "\nTotal: $" + total.toFixed(2));
    cart = [];
    updateCart();
    closePanels();
    showToast("Thank you for shopping with PILLOW!");
}

function subscribe(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    showToast("Welcome to PILLOW, " + email + "!");
    event.target.reset();
}
