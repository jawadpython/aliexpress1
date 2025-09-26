// Simple cloud storage using JSONBin.io
const BIN_ID = 'aliexpress-products'; // This will be your unique storage ID
const API_URL = 'https://api.jsonbin.io/v3/b';

// You'll get this API key from JSONBin.io (free)
const API_KEY = 'your-jsonbin-api-key';

// Get products from cloud storage
export const getCloudProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Bin doesn't exist yet, return empty array
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error('Error fetching products from cloud:', error);
    // Fallback to localStorage
    const localProducts = localStorage.getItem('aliexpress-products');
    return localProducts ? JSON.parse(localProducts) : [];
  }
};

// Save products to cloud storage
export const saveCloudProducts = async (products) => {
  try {
    const response = await fetch(`${API_URL}/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Also save to localStorage as backup
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    
    return true;
  } catch (error) {
    console.error('Error saving products to cloud:', error);
    // Fallback to localStorage only
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    return false;
  }
};

// Add a single product to cloud storage
export const addCloudProduct = async (product) => {
  try {
    const existingProducts = await getCloudProducts();
    const updatedProducts = [...existingProducts, product];
    return await saveCloudProducts(updatedProducts);
  } catch (error) {
    console.error('Error adding product to cloud:', error);
    return false;
  }
};

// Delete a product from cloud storage
export const deleteCloudProduct = async (productId) => {
  try {
    const existingProducts = await getCloudProducts();
    const updatedProducts = existingProducts.filter(p => p.ProductId !== productId);
    return await saveCloudProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product from cloud:', error);
    return false;
  }
};

// Clear all products from cloud storage
export const clearCloudProducts = async () => {
  try {
    return await saveCloudProducts([]);
  } catch (error) {
    console.error('Error clearing products from cloud:', error);
    return false;
  }
};
