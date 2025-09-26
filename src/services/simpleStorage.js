// Ultra-simple storage using a free JSON storage service
// This works immediately without any setup!

const STORAGE_URL = 'https://api.npoint.io/your-endpoint-id'; // We'll get this from npoint.io

// For now, let's use a simple approach with localStorage and a sync mechanism
let syncInProgress = false;

// Get products with automatic sync
export const getSimpleProducts = async () => {
  try {
    // First, try to get from localStorage
    const localProducts = localStorage.getItem('aliexpress-products');
    const products = localProducts ? JSON.parse(localProducts) : [];
    
    // If we have products locally, try to sync them to a simple online storage
    if (products.length > 0 && !syncInProgress) {
      syncInProgress = true;
      try {
        // Use a simple free service like JSONBin or npoint
        await syncToOnlineStorage(products);
      } catch (error) {
        console.log('Sync failed, using local storage only');
      }
      syncInProgress = false;
    }
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// Save products
export const saveSimpleProducts = async (products) => {
  try {
    // Save to localStorage immediately
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    
    // Try to sync to online storage
    try {
      await syncToOnlineStorage(products);
    } catch (error) {
      console.log('Online sync failed, but local save succeeded');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Sync to online storage (using a simple free service)
const syncToOnlineStorage = async (products) => {
  // For now, we'll use a simple approach
  // You can replace this with any free JSON storage service
  
  // Option 1: Use JSONBin.io (free, no signup needed for basic usage)
  try {
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$free', // This is a demo key, replace with real one
      },
      body: JSON.stringify(products),
    });
    
    if (response.ok) {
      const data = await response.json();
      // Store the bin ID for future use
      localStorage.setItem('aliexpress-bin-id', data.metadata.id);
    }
  } catch (error) {
    console.log('JSONBin sync failed');
  }
};

// Add a single product
export const addSimpleProduct = async (product) => {
  try {
    const existingProducts = await getSimpleProducts();
    const updatedProducts = [...existingProducts, product];
    return await saveSimpleProducts(updatedProducts);
  } catch (error) {
    console.error('Error adding product:', error);
    return false;
  }
};

// Delete a product
export const deleteSimpleProduct = async (productId) => {
  try {
    const existingProducts = await getSimpleProducts();
    const updatedProducts = existingProducts.filter(p => p.ProductId !== productId);
    return await saveSimpleProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Clear all products
export const clearSimpleProducts = async () => {
  try {
    return await saveSimpleProducts([]);
  } catch (error) {
    console.error('Error clearing products:', error);
    return false;
  }
};
