import { cart, savetoStorage, updateDeliveryDate } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../util/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

export const renderCartItems = () => {
  document.querySelector('.js-order-summary').innerHTML = '';

  let totalQuantity = 0; // Initialize total quantity

  cart.forEach((cartItem) => {
    const productId = cartItem.id;
    const matchingProduct = products.find(product => productId === product.id);

    if (!matchingProduct) return;

    totalQuantity += cartItem.quantity; // Add the quantity of the current item to the total quantity

    const selectedOption = cartItem.selectedDeliveryOption || deliveryOptions[0].deliveryOptionId;
    const deliveryOption = deliveryOptions.find(option => option.deliveryOptionId === selectedOption);
    const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

    const cartItemHTML = `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: ${deliveryDate}
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
            ${generateDeliveryOptions(matchingProduct, selectedOption)}
          </div>
        </div>
      </div>
    `;
    
    document.querySelector('.js-order-summary').innerHTML += cartItemHTML;
  });

  // Update the checkout header with the total quantity
  document.querySelector('.js-header').innerHTML = `Checkout (${totalQuantity} items)`;

  // Add event listeners to delivery option radio buttons
  document.querySelectorAll('.delivery-option-input').forEach(input => {
    input.addEventListener('change', (event) => {
      const productId = event.target.getAttribute('data-product-id');
      const deliveryOptionId = event.target.value;
      updateDeliveryDate(productId, deliveryOptionId);
      renderCartItems();  // Re-render cart items to update the delivery date and quantity
    });
  });

  // Add event listeners to other elements (update quantity, save, delete)
  // These will be similar to the ones you already have implemented.
};


const generateDeliveryOptions = (matchingProduct, selectedOption) => {
  return deliveryOptions.map(option => {
    const deliveryDate = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');

    return `
      <div class="delivery-option">
        <input type="radio" 
          class="delivery-option-input" 
          name="delivery-option-${matchingProduct.id}" 
          value="${option.deliveryOptionId}" 
          data-product-id="${matchingProduct.id}"
          ${option.deliveryOptionId === selectedOption ? 'checked' : ''}
        >
        <div>
          <div class="delivery-option-date">
            ${deliveryDate}
          </div>
          <div class="delivery-option-price">
            ${option.priceCents === 0 ? 'FREE Shipping' : `${formatCurrency(option.priceCents)} - Shipping`}
          </div>
        </div>
      </div>
    `;
  }).join('');
};

