// Basic storage with export/import functionality
// This works immediately and provides a way to sync between devices

// Get products from localStorage
export const getBasicProducts = async () => {
  try {
    const localProducts = localStorage.getItem('aliexpress-products');
    return localProducts ? JSON.parse(localProducts) : [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// Save products to localStorage
export const saveBasicProducts = async (products) => {
  try {
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Add a single product
export const addBasicProduct = async (product) => {
  try {
    const existingProducts = await getBasicProducts();
    const updatedProducts = [...existingProducts, product];
    return await saveBasicProducts(updatedProducts);
  } catch (error) {
    console.error('Error adding product:', error);
    return false;
  }
};

// Delete a product
export const deleteBasicProduct = async (productId) => {
  try {
    const existingProducts = await getBasicProducts();
    const updatedProducts = existingProducts.filter(p => p.ProductId !== productId);
    return await saveBasicProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Clear all products
export const clearBasicProducts = async () => {
  try {
    return await saveBasicProducts([]);
  } catch (error) {
    console.error('Error clearing products:', error);
    return false;
  }
};

// Export products as JSON (for manual sync)
export const exportProducts = async () => {
  try {
    const products = await getBasicProducts();
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aliexpress-products.json';
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting products:', error);
    return false;
  }
};

// Import products from JSON file
export const importProducts = async (file) => {
  try {
    const text = await file.text();
    const products = JSON.parse(text);
    if (Array.isArray(products)) {
      return await saveBasicProducts(products);
    }
    return false;
  } catch (error) {
    console.error('Error importing products:', error);
    return false;
  }
};
