import { updateCartQuantity } from "../scripts/amazon.js";
import { deliveryOptions } from "./deliveryOptions.js";
import { renderPaymentSummary } from "../scripts/checkout/paymentSummary.js";

// Initialize cart from localStorage or as an empty array
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save the cart to localStorage
export function savetoStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the selected delivery date
export function updateDeliveryDate(productId, deliveryOptionId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].selectedDeliveryOption = deliveryOptionId;
    } else {
        cart.push({
            id: productId,
            selectedDeliveryOption: deliveryOptionId
        });
    }

    savetoStorage();
}

// Function to handle adding items to the cart
export function addToCart(id, quantity) {
  id = id.toString();
  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex === -1) {
      cart.push({ id: id, quantity: quantity });
  } else {
      cart[itemIndex].quantity += quantity;
  }

  updateCartQuantity();
  savetoStorage();
}
