// Simple file-based storage using public/products.json
// This works immediately without any external services!

const PRODUCTS_FILE_URL = '/products.json';

// Get products from the public file
export const getFileProducts = async () => {
  try {
    const response = await fetch(PRODUCTS_FILE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products from file:', error);
    // Fallback to localStorage
    const localProducts = localStorage.getItem('aliexpress-products');
    return localProducts ? JSON.parse(localProducts) : [];
  }
};

// Save products to localStorage (since we can't write to public folder from browser)
export const saveFileProducts = async (products) => {
  try {
    // Save to localStorage
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    
    // Also try to update the public file (this won't work from browser, but we try anyway)
    // In a real app, you'd need a backend API to update the file
    console.log('Products saved to localStorage. To sync across devices, you need to manually update public/products.json');
    
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Add a single product
export const addFileProduct = async (product) => {
  try {
    const existingProducts = await getFileProducts();
    const updatedProducts = [...existingProducts, product];
    return await saveFileProducts(updatedProducts);
  } catch (error) {
    console.error('Error adding product:', error);
    return false;
  }
};

// Delete a product
export const deleteFileProduct = async (productId) => {
  try {
    const existingProducts = await getFileProducts();
    const updatedProducts = existingProducts.filter(p => p.ProductId !== productId);
    return await saveFileProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Clear all products
export const clearFileProducts = async () => {
  try {
    return await saveFileProducts([]);
  } catch (error) {
    console.error('Error clearing products:', error);
    return false;
  }
};
