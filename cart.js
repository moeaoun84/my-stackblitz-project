// Initialize cart from localStorage if it exists, otherwise default to an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update the cart count on all pages
function updateCartCount() {
  // Get the total count of items in the cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

// Function to update the cart items display on the cart page
function updateCartDisplay() {
  const cartItemsContainer = document.querySelector(".cart-items-container");
  cartItemsContainer.innerHTML = ""; // Clear current cart items
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
    <div class="item-image">
      <img src="img/${item.name}.png" alt="${item.name}">
    </div>
    <div class="item-details">
      <h3>${item.name}</h3>
      <p>$${item.price}</p>
      <div class="item-quantity-controls">
        <button class="quantity-decrease" data-id="${item.id}">-</button>
        <span class="item-quantity">${item.quantity}</span>
        <button class="quantity-increase" data-id="${item.id}">+</button>
      </div>
    </div>
    <div class="item-total">
      <p>Total: $${itemTotal.toFixed(2)}</p>
    </div>
    <button class="remove-item" data-id="${item.id}">Remove</button>
  `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Update total price
  document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;

  // Reattach event listeners for removing items
  const removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach(button => {
    button.addEventListener("click", removeItem);
  });

  // Reattach event listeners for updating item quantities
  const increaseButtons = document.querySelectorAll(".quantity-increase");
  const decreaseButtons = document.querySelectorAll(".quantity-decrease");

  increaseButtons.forEach(button => {
    button.addEventListener("click", increaseQuantity);
  });
  
  decreaseButtons.forEach(button => {
    button.addEventListener("click", decreaseQuantity);
  });
}

// Function to handle adding an item to the cart
function addToCart(event) {
  const button = event.target;
  const id = button.getAttribute("data-id");
  const name = button.getAttribute("data-name");
  const price = parseFloat(button.getAttribute("data-price"));

  const existingItem = cart.find(item => item.id == id);

  if (existingItem) {
    // If item already exists, increase quantity
    existingItem.quantity++;
  } else {
    // If item does not exist, add it to the cart
    cart.push({ id, name, price, quantity: 1 });
  }

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart count on all pages
  updateCartCount();
}

// Function to remove an item from the cart
function removeItem(event) {
  const id = event.target.getAttribute("data-id");
  cart = cart.filter(item => item.id != id);

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Re-render the cart display
  updateCartDisplay();

  // Update the cart count on all pages
  updateCartCount();
}

// Function to increase the quantity of an item
function increaseQuantity(event) {
  const id = event.target.getAttribute("data-id");
  const item = cart.find(item => item.id == id);

  if (item) {
    item.quantity++;
    localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart
    updateCartDisplay(); // Re-render the cart display
    updateCartCount(); // Update the cart count on all pages
  }
}

// Function to decrease the quantity of an item
function decreaseQuantity(event) {
  const id = event.target.getAttribute("data-id");
  const item = cart.find(item => item.id == id);

  if (item && item.quantity > 1) {
    item.quantity--;
    localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart
    updateCartDisplay(); // Re-render the cart display
    updateCartCount(); // Update the cart count on all pages
  }
}

// Set up event listeners for "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", addToCart);
});

// Ensure cart is updated when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Update cart display only on the cart page
  if (window.location.pathname.includes("cart.html")) {
    updateCartDisplay();
  }

  // Update the cart count on other pages (like homepage)
  updateCartCount();
});

// Listen for changes in localStorage (in case another tab modifies the cart)
window.addEventListener("storage", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (window.location.pathname.includes("cart.html")) {
    updateCartDisplay();
  } else {
    updateCartCount();
  }
});
