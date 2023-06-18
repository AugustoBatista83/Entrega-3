import fs from 'fs';

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

export class ProductManager {
  constructor(path) {
    this.path = path; // Ruta del archivo de productos
    this.products = []; // Arreglo para almacenar los productos
    this.id = 0; // ID autoincrementable para asignar a cada producto
  }
    
  // Carga los productos desde el archivo al arreglo de productos (versión asíncrona)
  async loadProductsAsync() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8'); // Lee el contenido del archivo
      this.products = JSON.parse(data); // Convierte el contenido en un objeto JavaScript
      if (this.products.length > 0) {
        const lastProduct = this.products[this.products.length - 1];
        this.id = lastProduct.id; // Actualiza el ID autoincrementable con el último ID encontrado
      }
    } catch (error) {
      console.log('Error loading products:', error);
    }
  }

  // Guarda los productos del arreglo en el archivo (versión asíncrona)
  async saveProductsAsync() {
    try {
      const data = JSON.stringify(this.products); // Convierte el arreglo de productos en una cadena JSON
      await fs.promises.writeFile(this.path, data, 'utf8'); // Escribe la cadena JSON en el archivo
    } catch (error) {
      console.log('Error saving products:', error);
    }
  }

  // Agrega un nuevo producto al arreglo y lo guarda en el archivo
  async addProduct(product) {
    product.id = ++this.id; // Asigna un ID autoincrementable al producto
    this.products.push(product); // Agrega el producto al arreglo
    await this.saveProductsAsync(); // Guarda los productos en el archivo
    console.log('Producto agregado con éxito');
  }

  // Obtiene todos los productos del arreglo
  getProducts() {
    return this.products;
  }

  // Obtiene un producto por su ID
  getProductById(id) {
    const product = this.products.find((p) => p.id === id); // Busca el producto por su ID
    if (product) {
      return product;
    } else {
      console.log('Error: Producto no encontrado');
    }
  }

  // Actualiza un producto por su ID
  async updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === id); // Busca el índice del producto por su ID
    if (index !== -1) {
      this.products[index] = { ...updatedProduct, id }; // Actualiza el producto en el arreglo
      await this.saveProductsAsync(); // Guarda los productos en el archivo
      console.log('Producto actualizado con éxito');
    } else {
      console.log('Error: Producto no encontrado');
    }
  }

  // Elimina un producto por su ID
  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id); // Busca el índice del producto por su ID
    if (index !== -1) {
      this.products.splice(index, 1); // Elimina el producto del arreglo
      await this.saveProductsAsync(); // Guarda los productos en el archivo
      console.log('Producto eliminado con éxito');
    } else {
      console.log('Error: Producto no encontrado');
    }
  }
}

//***********************************PRUEBAS********************************************** */
// Ejemplo de uso de la clase ProductManager
const manager = new ProductManager("./productos.json");

(async function() {
  // Esperar a que los productos se carguen desde el archivo antes de continuar
  await manager.loadProductsAsync();

  // Agregar productos utilizando el método addProduct
  async function generateCafeteriaProducts() {
    const titles = ["Café Latte", "Cappuccino", "Espresso", "Mocha", "Americano", "Frappé", "Café con Leche", "Macchiato", "Café Molido", "Café Descafeinado"];
    const descriptions = ["Delicioso café con leche", "Cappuccino italiano con espuma de leche", "Café expreso concentrado", "Café con chocolate y leche", "Café negro diluido en agua caliente", "Café frío mezclado con hielo y jarabe", "Café negro con leche caliente", "Café con una pequeña cantidad de leche", "Café en polvo para preparar en casa", "Café sin cafeína"];
    const prices = [3.99, 4.49, 2.99, 4.99, 3.49, 5.99, 3.79, 4.29, 6.49, 3.99];
    const thumbnails = ["latte.jpg", "cappuccino.jpg", "espresso.jpg", "mocha.jpg", "americano.jpg", "frappe.jpg", "cafe-con-leche.jpg", "macchiato.jpg", "cafe-molido.jpg", "descafeinado.jpg"];
    const codes = ["LATTE001", "CAPPU001", "ESP001", "MOCHA001", "AMER001", "FRAPPE001", "CAFELE001", "MACCH001", "CAFEMO001", "CAFEDS001"];
    const stocks = [10, 15, 20, 12, 18, 8, 14, 9, 25, 16];

    const productPromises = [];

    for (let i = 0; i < 10; i++) {
      const product = new Product(
        titles[i],
        descriptions[i],
        prices[i],
        thumbnails[i],
        codes[i],
        stocks[i]
      );

      productPromises.push(manager.addProduct(product));
    }

    await Promise.all(productPromises);

    console.log('Productos de cafetería generados con éxito');
  }

  await generateCafeteriaProducts();

  // Obtener todos los productos utilizando el método getProducts
  console.log("Todos los productos:", manager.getProducts());

  // Obtener un producto por su ID utilizando el método getProductById
  console.log("Producto con ID 2:", manager.getProductById(2));

  // Buscar un producto que no existe
  console.log("Producto con ID 3:", manager.getProductById(3));

  // Eliminar un producto utilizando el método deleteProduct
  // await manager.deleteProduct(1);
})();
