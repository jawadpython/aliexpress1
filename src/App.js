import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';

// Custom hook for managing products state
const useProducts = () => {
  const [products, setProducts] = useState(() => {
    // Initialize state with data from localStorage
    try {
      const savedProducts = localStorage.getItem('aliexpress-products');
      return savedProducts ? JSON.parse(savedProducts) : [];
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return [];
    }
  });

  // Save products to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem('aliexpress-products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }, [products]);

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };

  const addProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.ProductId !== productId));
  };

  const clearAllProducts = () => {
    setProducts([]);
  };

  return {
    products,
    updateProducts,
    addProduct,
    deleteProduct,
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
  const { products, updateProducts } = useProducts();

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
