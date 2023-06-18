import express from "express"
const app = express();
import ProductManager from '../ProductManager.js'; // Importa el archivo de ProductManager

const productManager = new ProductManager('.productos.json'); // Crea una instancia de ProductManager con el archivo de productos

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    await productManager.loadProductsAsync(); // Carga los productos desde el archivo
    const limit = req.query.limit; // Obtiene el valor del parámetro de límite (si existe)

    if (limit) {
      const limitedProducts = productManager.getProducts().slice(0, limit); // Obtiene el número de productos solicitados
      res.json(limitedProducts);
    } else {
      res.json(productManager.getProducts()); // Devuelve todos los productos
    }
  } catch (error) {
    res.status(500).json({ error: 'Error loading products' });
  }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  try {
    await productManager.loadProductsAsync(); // Carga los productos desde el archivo
    const productId = parseInt(req.params.pid); // Obtiene el ID del producto como entero

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
