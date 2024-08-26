import { updateCartQuantity } from "../scripts/amazon.js";

// Initialize cart from localStorage or as an empty array
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save the cart to localStorage
export function savetoStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to handle adding items to the cart
export function addToCart(id, quantity) {
  // Convert id to string to ensure consistency
  id = id.toString();

  // Check if the item already exists in the cart
  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex === -1) {
      // Item not in the cart, add it with the selected quantity
      cart.push({ id: id, quantity: quantity });
  } else {
      // Item is already in the cart, increase the quantity
      cart[itemIndex].quantity += quantity;
  }

  // Update the cart quantity displayed on the page
  updateCartQuantity();

  // Save the updated cart to localStorage
  savetoStorage();

  console.log(cart); // For debugging, to see the cart contents in the console
}
