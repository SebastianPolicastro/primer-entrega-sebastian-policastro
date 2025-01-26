const fs = require('fs').promises;

class ProductManager {
constructor(filePath) {
    this.filePath = filePath;
}

async getAllProducts() {
    try {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
    } catch {
    return [];
    }
}

async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find(product => product.id === id);
}

async addProduct(product) {
    const { title, description, code, price, status, stock, category, thumbnails } = product;

    
    if (!title || !description || !code || !price || typeof status !== 'boolean' || !stock || !category || !Array.isArray(thumbnails)) {
    throw new Error('Todos los campos son obligatorios y deben tener el formato correcto.');
    }

    const products = await this.getAllProducts();

    
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
    id: newId,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
    };

    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
}

async updateProduct(id, updatedFields) {
    const products = await this.getAllProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    const updatedProduct = { ...products[productIndex], ...updatedFields, id };
    products[productIndex] = updatedProduct;
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return updatedProduct;
}

async deleteProduct(id) {
    let products = await this.getAllProducts();
    products = products.filter(product => product.id !== id);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
}
}

module.exports = ProductManager;