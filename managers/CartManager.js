const fs = require('fs').promises;

class CartManager {
constructor(filePath) {
    this.filePath = filePath;
}

async getAllCarts() {
    try {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
    } catch {
    return [];
    }
}

async getCartById(id) {
    const carts = await this.getAllCarts();
    return carts.find(cart => cart.id === id);
}

async createCart() {
    const carts = await this.getAllCarts();
    const newCart = { id: carts.length + 1, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
}

async addProductToCart(cartId, productId) {
    const carts = await this.getAllCarts();
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(prod => prod.product === productId);
    if (productIndex !== -1) {
    cart.products[productIndex].quantity++;
    } else {
    cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return cart;
}
}

module.exports = CartManager;