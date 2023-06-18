import express from 'express';

const app = express();
app.use(express.json());
import { ProductManager } from './ProductManager.js';


const productManager = new ProductManager('../productos.json');



// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    await productManager.loadProductsAsync();
    const limit = req.query.limit;

    if (limit) {
      const limitedProducts = productManager.getProducts().slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(productManager.getProducts());
    }
  } catch (error) {
    res.status(500).json({ error: 'Error loading products' });
  }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  try {
    await productManager.loadProductsAsync();
    const productId = parseInt(req.params.pid);

    const product = productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error loading products' });
  }
});

// Inicia el servidor en el puerto 8080
app.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
