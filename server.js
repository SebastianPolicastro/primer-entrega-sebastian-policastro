const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const EventEmitter = require('events');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const eventEmitter = new EventEmitter();

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.engine('handlebars', engine({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


app.get('/home', async (req, res) => {
    const productManager = new (require('./managers/ProductManager'))('./data/products.json', eventEmitter);
    const products = await productManager.getAllProducts();
    res.render('home', { products });
});


app.get('/realtimeproducts', async (req, res) => {
    const productManager = new (require('./managers/ProductManager'))('./data/products.json', eventEmitter);
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { products });
});


io.on('connection', async (socket) => {
    console.log('a user connected');
    const productManager = new (require('./managers/ProductManager'))('./data/products.json', eventEmitter);
    socket.emit('updateProducts', await productManager.getAllProducts());

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { eventEmitter };