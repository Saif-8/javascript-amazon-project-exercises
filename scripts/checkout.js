import { cart, savetoStorage } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./util/money.js";

// Function to render cart items
const renderCartItems = () => {
  document.querySelector('.js-order-summary').innerHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.id;
    const matchingProduct = products.find(product => productId === product.id);

    if (!matchingProduct) return;

    const cartItemHTML = `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: 
                <span class="quantity-label">${cartItem.quantity}</span>
                <input type="number" class="quantity-input" value="${cartItem.quantity}" min="1" max="100" style="width: 30px; text-align: center; display: none;">
              </span>
              <span class="update-quantity-link link-primary" data-id="${cartItem.id}">
                Update
              </span>
              <span class="save-quantity-link link-primary" data-id="${cartItem.id}" style="display: none;">
                Save
              </span>
              <span class="delete-quantity-link link-primary" data-id="${cartItem.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.querySelector('.js-order-summary').innerHTML += cartItemHTML;
  });

  // Add event listeners to update buttons
  document.querySelectorAll('.update-quantity-link').forEach(button => {
    button.addEventListener('click', (event) => {
      const itemId = event.target.getAttribute('data-id');
      showQuantityInput(itemId);
    });
  });

  // Add event listeners to save buttons
  document.querySelectorAll('.save-quantity-link').forEach(button => {
    button.addEventListener('click', (event) => {
      const itemId = event.target.getAttribute('data-id');
      saveQuantity(itemId);
    });
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-quantity-link').forEach(button => {
    button.addEventListener('click', (event) => {
      const itemId = event.target.getAttribute('data-id');
      removeCartItem(itemId);
    });
  });

  // Add event listeners for keydown events on quantity input fields
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const itemId = input.parentNode.querySelector('.save-quantity-link').getAttribute('data-id');
        saveQuantity(itemId);
      }
    });
  });

  // Update the header with total quantity
  updateHeaderWithTotalQuantity();
};

// Function to show the quantity input and hide the quantity label and update button
const showQuantityInput = (id) => {
  const container = document.querySelector(`.update-quantity-link[data-id="${id}"]`).parentNode;
  const input = container.querySelector('.quantity-input');
  const label = container.querySelector('.quantity-label');
  const updateButton = container.querySelector('.update-quantity-link');
  const saveButton = container.querySelector('.save-quantity-link');

  input.style.display = 'inline';
  label.style.display = 'none';
  updateButton.style.display = 'none';
  saveButton.style.display = 'inline';
  input.focus();
};

// Function to save the new quantity
const saveQuantity = (id) => {
  const container = document.querySelector(`.save-quantity-link[data-id="${id}"]`).parentNode;
  const inputElement = container.querySelector('.quantity-input');
  const label = container.querySelector('.quantity-label');

  let newQuantity = parseInt(inputElement.value);

  // Validate the input
  if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 100) {
    alert("Please enter a quantity between 1 and 100.");
    inputElement.focus();
    inputElement.select();
    return;
  }

  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex !== -1) {
    // Update the cart with the new quantity
    cart[itemIndex].quantity = newQuantity;
    savetoStorage();
    renderCartItems();
  }
};

// Function to update the header with total quantity
const updateHeaderWithTotalQuantity = () => {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Select the header element using js-header class and update its content
  const headerElement = document.querySelector('.js-header');
  headerElement.innerHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${totalQuantity} items</a>)`;
};

// Function to remove item from cart
const removeCartItem = (id) => {
  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1); // Remove item from array
    renderCartItems(); // Re-render the cart items and update the header
  }
  savetoStorage();
};

// Initial render
renderCartItems();
