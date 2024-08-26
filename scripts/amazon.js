import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./util/money.js";

// Check if the product grid container exists
const productGrid = document.querySelector('.js-product-grid');
if (productGrid) {
    let productHTML = '';

    products.forEach((product) => {
        productHTML += `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                src="images/ratings/rating-${product.rating.stars * 10}.png">
                <div class="product-rating-count link-primary">
                ${product.rating.count}
                </div>
            </div>

            <div class="product-price">
                $${formatCurrency(product.priceCents)}
            </div>

            <div class="product-quantity-container">
                <select class="product-quantity-select">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart js-add-to-cart">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary" data-id="${product.id}">
                Add to Cart
            </button>
        </div>`;
    });

    // Insert the generated product HTML into the grid
    productGrid.innerHTML = productHTML;

    // Add event listeners to all 'Add to Cart' buttons
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = button.getAttribute('data-id');  // Treat id as a string
            const quantitySelect = button.closest('.product-container').querySelector('.product-quantity-select');
            const quantity = parseInt(quantitySelect.value, 10);
            addToCart(id, quantity);

            // Show the "Added to cart" message
            const addedToCartMessage = button.closest('.product-container').querySelector('.js-add-to-cart');
            clearTimeout(addedToCartMessage.timeoutID); // Clear any previous timeout

            addedToCartMessage.style.opacity = '1';

            // Hide the "Added to cart" message after 2 seconds
            addedToCartMessage.timeoutID = setTimeout(() => {
                addedToCartMessage.style.opacity = '0';
            }, 2000);
        });
    });
}

// Check if the cart quantity element exists
const cartQuantityElement = document.querySelector('.js-cart-quantity');

// Function to update the cart quantity displayed on the page
export function updateCartQuantity() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartQuantityElement.textContent = totalQuantity;
}

if (cartQuantityElement) {
    // Initialize the cart quantity display when the page loads
    updateCartQuantity();
}
