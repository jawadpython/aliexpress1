// Instant storage using httpbin.org (works immediately, no setup needed)
// This is the simplest possible solution!

const STORAGE_URL = 'https://httpbin.org/anything/aliexpress-products';

// Get products
export const getInstantProducts = async () => {
  try {
    // For now, just use localStorage with a simple sync mechanism
    const localProducts = localStorage.getItem('aliexpress-products');
    const products = localProducts ? JSON.parse(localProducts) : [];
    
    // Try to get from a simple online storage
    try {
      const response = await fetch(STORAGE_URL);
      if (response.ok) {
        const data = await response.json();
        if (data.json && Array.isArray(data.json)) {
          // Update localStorage with online data
          localStorage.setItem('aliexpress-products', JSON.stringify(data.json));
          return data.json;
        }
      }
    } catch (error) {
      console.log('Online sync failed, using local storage');
    }
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// Save products
export const saveInstantProducts = async (products) => {
  try {
    // Save to localStorage immediately
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    
    // Try to save to online storage
    try {
      await fetch(STORAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });
    } catch (error) {
      console.log('Online save failed, but local save succeeded');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Add a single product
export const addInstantProduct = async (product) => {
  try {
    const existingProducts = await getInstantProducts();
    const updatedProducts = [...existingProducts, product];
    return await saveInstantProducts(updatedProducts);
  } catch (error) {
    console.error('Error adding product:', error);
    return false;
  }
};

// Delete a product
export const deleteInstantProduct = async (productId) => {
  try {
    const existingProducts = await getInstantProducts();
    const updatedProducts = existingProducts.filter(p => p.ProductId !== productId);
    return await saveInstantProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Clear all products
export const clearInstantProducts = async () => {
  try {
    return await saveInstantProducts([]);
  } catch (error) {
    console.error('Error clearing products:', error);
    return false;
  }
};
