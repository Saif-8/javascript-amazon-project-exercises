import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../util/money.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

export function renderPaymentSummary() {
    // Calculate total items and total price of items
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(cartItem => {
        const product = products.find(product => product.id === cartItem.id);
        if (product) {
            totalItems += cartItem.quantity;
            totalPrice += cartItem.quantity * product.priceCents;
        }
    });

    // Convert totalPrice from cents to dollars
    const totalPriceFormatted = formatCurrency(totalPrice);

    // Calculate shipping cost based on selected delivery options
    let shippingCost = 0;

    cart.forEach(cartItem => {
        const selectedOption = cartItem.selectedDeliveryOption || deliveryOptions[0].deliveryOptionId;
        const deliveryOption = deliveryOptions.find(option => option.deliveryOptionId === selectedOption);
        if (deliveryOption) {
            shippingCost += deliveryOption.priceCents;
        }
    });

    // Convert shippingCost from cents to dollars
    const shippingCostFormatted = formatCurrency(shippingCost);

    // Calculate subtotal (total price + shipping)
    const subtotal = totalPrice + shippingCost;
    const subtotalFormatted = formatCurrency(subtotal);

    // Calculate estimated tax (assuming 10%)
    const taxRate = 0.1;
    const estimatedTax = subtotal * taxRate;
    const estimatedTaxFormatted = formatCurrency(estimatedTax);

    // Calculate order total (subtotal + estimated tax)
    const orderTotal = subtotal + estimatedTax;
    const orderTotalFormatted = formatCurrency(orderTotal);

    // Generate HTML for payment summary
    const paymentSummaryHTML = `
        <div class="payment-summary js-payment-summary">
            <div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${totalItems}):</div>
                <div class="payment-summary-money">${totalPriceFormatted}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">${shippingCostFormatted}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">${subtotalFormatted}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">${estimatedTaxFormatted}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">${orderTotalFormatted}</div>
            </div>

            <button class="place-order-button button-primary">
                Place your order
            </button>
        </div>
    `;

    // Insert the generated HTML into the page
    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}
