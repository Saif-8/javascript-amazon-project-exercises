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
        $${(product.priceCents / 100).toFixed(2)}
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
    </div>`
});

document.querySelector('.js-product-grid').innerHTML = productHTML;

// Function to handle adding items to the cart
function addToCart(id, quantity) {
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

// Function to update the cart quantity displayed on the page
function updateCartQuantity() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.js-cart-quantity').textContent = totalQuantity;
}

// Initialize the cart quantity display when the page loads
updateCartQuantity();

// Add event listeners to all 'Add to Cart' buttons
document.querySelectorAll('.add-to-cart-button').forEach(button => {
  button.addEventListener('click', (event) => {
      const id = parseInt(button.getAttribute('data-id'), 10);
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
