import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import { getCloudProducts, saveCloudProducts, addCloudProduct, deleteCloudProduct, clearCloudProducts } from './services/cloudStorage';

// Custom hook for managing products state with cloud storage
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from cloud storage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const cloudProducts = await getCloudProducts();
        setProducts(cloudProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to localStorage
        try {
          const savedProducts = localStorage.getItem('aliexpress-products');
          const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
          setProducts(parsedProducts);
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
          setProducts([]);
        }
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const updateProducts = async (newProducts) => {
    try {
      await saveCloudProducts(newProducts);
      setProducts(newProducts);
    } catch (error) {
      console.error('Error updating products:', error);
      throw error;
    }
  };

  const addProduct = async (product) => {
    try {
      await addCloudProduct(product);
      const updatedProducts = [...products, product];
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const deleteProductById = async (productId) => {
    try {
      await deleteCloudProduct(productId);
      const updatedProducts = products.filter(p => p.ProductId !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const clearAllProducts = async () => {
    try {
      await clearCloudProducts();
      setProducts([]);
    } catch (error) {
      console.error('Error clearing all products:', error);
      throw error;
    }
  };

  return {
    products,
    loading,
    updateProducts,
    addProduct,
    deleteProduct: deleteProductById,
    clearAllProducts
  };
};


// Navigation component
const Navigation = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors duration-200"
            >
              AliExpress Store
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                !isAdmin
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Home
            </Link>
            {/* Admin link - only visible when on admin page */}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-md text-sm font-medium bg-primary-100 text-primary-700"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App component
const App = () => {
  const { products, loading, updateProducts } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={<HomePage products={products} />}
          />
          <Route
            path="/admin"
            element={
              <AdminPanel
                products={products}
                onProductsUpdate={updateProducts}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
