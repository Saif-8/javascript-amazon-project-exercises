import { addToCart, cart, savetoStorage } from "../../data/cart.js";

describe('Cart functionality', () => {
    
    // Before each test, reset the cart to an empty array
    beforeEach(() => {
        localStorage.clear();
        cart.length = 0;  // Clear the cart array
        spyOn(localStorage, 'setItem');  // Spy on localStorage.setItem to prevent actual storage
    });

    it('should add a new item to the cart', () => {
        addToCart('123', 2);

        expect(cart.length).toBe(1);
        expect(cart[0].id).toBe('123');
        expect(cart[0].quantity).toBe(2);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));
    });

    it('should update the quantity of an existing item in the cart', () => {
        addToCart('123', 2);
        addToCart('123', 3);

        expect(cart.length).toBe(1);  // Should still be 1 item in the cart
        expect(cart[0].quantity).toBe(5);  // Quantity should be updated to 5
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));
    });

    it('should add multiple items to the cart', () => {
        addToCart('123', 2);
        addToCart('456', 3);

        expect(cart.length).toBe(2);
        expect(cart[0].id).toBe('123');
        expect(cart[0].quantity).toBe(2);
        expect(cart[1].id).toBe('456');
        expect(cart[1].quantity).toBe(3);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));
    });
});
