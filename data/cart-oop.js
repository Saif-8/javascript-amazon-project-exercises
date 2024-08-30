import { updateCartQuantity } from "../scripts/amazon.js";
import { deliveryOptions } from "./deliveryOptions.js";
import { renderPaymentSummary } from "../scripts/checkout/paymentSummary.js";

class Cart {
    constructor(cartKey = 'cart') {
        this.cartKey = cartKey;
        this.cart = JSON.parse(localStorage.getItem(this.cartKey)) || [];
    }

    // Method to save the cart to localStorage
    saveToStorage() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    }

    // Method to update the selected delivery date
    updateDeliveryDate(productId, deliveryOptionId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            this.cart[itemIndex].selectedDeliveryOption = deliveryOptionId;
        } else {
            this.cart.push({
                id: productId,
                selectedDeliveryOption: deliveryOptionId
            });
        }

        this.saveToStorage();
    }

    // Method to handle adding items to the cart
    addToCart(id, quantity) {
        id = id.toString();
        const itemIndex = this.cart.findIndex(item => item.id === id);

        if (itemIndex === -1) {
            this.cart.push({ id: id, quantity: quantity });
        } else {
            this.cart[itemIndex].quantity += quantity;
        }

        updateCartQuantity();
        this.saveToStorage();
    }

    // Method to get the current cart items
    getItems() {
        return this.cart;
    }

    // Method to clear the cart
    clearCart() {
        this.cart = [];
        this.saveToStorage();
    }
}

// Example usage:
// Create a cart instance with the default key
const cart1 = new Cart();

// Create another cart instance with a different key
const cart2 = new Cart('cart2');

// Add items to the carts
cart1.addToCart('123', 2);
cart2.addToCart('456', 3);

// Update delivery dates
cart1.updateDeliveryDate('123', 'option1');
cart2.updateDeliveryDate('456', 'option2');

// Retrieve cart items
console.log(cart1.getItems()); // Outputs items in cart1
console.log(cart2.getItems()); // Outputs items in cart2

export default Cart;
