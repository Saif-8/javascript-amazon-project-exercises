import { updateCartQuantity } from "../scripts/amazon.js";

export const cart = [{
    id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2
}, {
    id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1
}];

// Function to handle adding items to the cart
 export function addToCart(id, quantity) {
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

  console.log(cart); // For debugging, to see the cart contents in the console
}
