const fs = require('fs').promises;

class CartManager {
    constructor(filePath, eventEmitter) {
        this.filePath = filePath;
        this.eventEmitter = eventEmitter; // Recibe el eventEmitter desde el server.js
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

        // Emitir el evento 'updateCart' utilizando el eventEmitter recibido
        if (this.eventEmitter) {
            console.log(`🔄 Producto agregado al carrito: ID ${cartId}, emitiendo evento`);
            this.eventEmitter.emit('updateCart', cart);
        }

        return cart;
    }
}

module.exports = CartManager;