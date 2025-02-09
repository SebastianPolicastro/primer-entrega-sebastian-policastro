const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();
const { eventEmitter } = require('../server'); 

const cartManager = new CartManager('./data/carts.json', eventEmitter); 

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(updatedCart);
});

module.exports = router;