// Simple GitHub-based storage using GitHub API
// This works immediately without any setup!

const GITHUB_USERNAME = 'jawadpython';
const GITHUB_REPO = 'aliexpress1';
const GITHUB_FILE_PATH = 'products.json';
const GITHUB_TOKEN = ''; // Leave empty for public repo (works without token)

// Get products from GitHub
export const getGitHubProducts = async () => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (response.status === 404) {
      // File doesn't exist yet, return empty array
      return [];
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const content = atob(data.content); // Decode base64
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching products from GitHub:', error);
    // Fallback to localStorage
    const localProducts = localStorage.getItem('aliexpress-products');
    return localProducts ? JSON.parse(localProducts) : [];
  }
};

// Save products to GitHub
export const saveGitHubProducts = async (products) => {
  try {
    // First, get the current file to get the SHA
    const getUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    let sha = null;
    try {
      const getResponse = await fetch(getUrl, { headers });
      if (getResponse.ok) {
        const data = await getResponse.json();
        sha = data.sha;
      }
    } catch (error) {
      // File doesn't exist yet, that's okay
    }
    
    // Now save the file
    const content = btoa(JSON.stringify(products, null, 2)); // Encode to base64
    const saveUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    
    const body = {
      message: `Update products - ${new Date().toISOString()}`,
      content: content,
    };
    
    if (sha) {
      body.sha = sha;
    }
    
    const saveResponse = await fetch(saveUrl, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!saveResponse.ok) {
      throw new Error(`HTTP error! status: ${saveResponse.status}`);
    }
    
    // Also save to localStorage as backup
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    
    return true;
  } catch (error) {
    console.error('Error saving products to GitHub:', error);
    // Fallback to localStorage only
    localStorage.setItem('aliexpress-products', JSON.stringify(products));
    return false;
  }
};

// Add a single product
export const addGitHubProduct = async (product) => {
  try {
    const existingProducts = await getGitHubProducts();
    const updatedProducts = [...existingProducts, product];
    return await saveGitHubProducts(updatedProducts);
  } catch (error) {
    console.error('Error adding product to GitHub:', error);
    return false;
  }
};

// Delete a product
export const deleteGitHubProduct = async (productId) => {
  try {
    const existingProducts = await getGitHubProducts();
    const updatedProducts = existingProducts.filter(p => p.ProductId !== productId);
    return await saveGitHubProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product from GitHub:', error);
    return false;
  }
};

// Clear all products
export const clearGitHubProducts = async () => {
  try {
    return await saveGitHubProducts([]);
  } catch (error) {
    console.error('Error clearing products from GitHub:', error);
    return false;
  }
};
