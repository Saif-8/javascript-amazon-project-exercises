import { cart, savetoStorage, updateDeliveryDate } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../util/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export const renderCartItems = () => {
  document.querySelector('.js-order-summary').innerHTML = '';

  let totalQuantity = 0;

  cart.forEach((cartItem, index) => {
    const productId = cartItem.id;
    const matchingProduct = products.find(product => productId === product.id);

    if (!matchingProduct) return;

    totalQuantity += cartItem.quantity;

    const selectedOption = cartItem.selectedDeliveryOption || deliveryOptions[0].deliveryOptionId;
    const deliveryOption = deliveryOptions.find(option => option.deliveryOptionId === selectedOption);
    const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

    const cartItemHTML = `
      <div class="cart-item-container" data-index="${index}">
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

  document.querySelector('.js-header').innerHTML = `Checkout (${totalQuantity} items)`;

  document.querySelectorAll('.delivery-option-input').forEach(input => {
    input.addEventListener('change', (event) => {
      const productId = event.target.getAttribute('data-product-id');
      const deliveryOptionId = event.target.value;
      updateDeliveryDate(productId, deliveryOptionId);
      renderCartItems();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.delete-quantity-link').forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.closest('.cart-item-container').getAttribute('data-index');
      cart.splice(index, 1);
      savetoStorage(cart);
      renderCartItems();
      renderPaymentSummary();
    });
  });

  // Add event listeners to handle the Update/Save button behavior
  document.querySelectorAll('.update-quantity-link').forEach(button => {
    button.addEventListener('click', (event) => {
      const container = event.target.closest('.cart-item-details');
      const quantityLabel = container.querySelector('.quantity-label');
      const quantityInput = container.querySelector('.quantity-input');
      const updateButton = container.querySelector('.update-quantity-link');
      const saveButton = container.querySelector('.save-quantity-link');

      // Show the input box and the Save button, hide the Update button
      quantityLabel.style.display = 'none';
      quantityInput.style.display = 'inline-block';
      updateButton.style.display = 'none';
      saveButton.style.display = 'inline-block';
    });
  });

  document.querySelectorAll('.save-quantity-link').forEach(button => {
    button.addEventListener('click', (event) => {
      const container = event.target.closest('.cart-item-details');
      const quantityLabel = container.querySelector('.quantity-label');
      const quantityInput = container.querySelector('.quantity-input');
      const updateButton = container.querySelector('.update-quantity-link');
      const saveButton = container.querySelector('.save-quantity-link');
      const index = event.target.closest('.cart-item-container').getAttribute('data-index');

      // Update the cart item quantity with the value from the input
      const newQuantity = parseInt(quantityInput.value);
      cart[index].quantity = newQuantity;
      savetoStorage(cart);

      // Update the quantity display and toggle buttons
      quantityLabel.textContent = newQuantity;
      quantityLabel.style.display = 'inline';
      quantityInput.style.display = 'none';
      updateButton.style.display = 'inline-block';
      saveButton.style.display = 'none';

      renderCartItems(); // Re-render cart items
      renderPaymentSummary(); // Re-render payment summary
    });
  });

  renderPaymentSummary();
};


  // Add event listeners to other elements (update quantity, save, delete)
  // These will be similar to the ones you already have implemented.



  const generateDeliveryOptions = (matchingProduct, selectedOption) => {
    return deliveryOptions.map(option => {
      let deliveryDate = dayjs().add(option.deliveryDays, 'days');
  
      // Check if the delivery date falls on a weekend
      if (deliveryDate.day() === 6) {
        // If it's Saturday, add 2 days to move to Monday
        deliveryDate = deliveryDate.add(2, 'days');
      } else if (deliveryDate.day() === 0) {
        // If it's Sunday, add 1 day to move to Monday
        deliveryDate = deliveryDate.add(1, 'days');
      }
  
      const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');
  
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
              ${formattedDeliveryDate}
            </div>
            <div class="delivery-option-price">
              ${option.priceCents === 0 ? 'FREE Shipping' : `${formatCurrency(option.priceCents)} - Shipping`}
            </div>
          </div>
        </div>
      `;
    }).join('');
  };
  
