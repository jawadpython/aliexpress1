import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import ProductCard from './ProductCard';
import Notification from './Notification';

const AdminPanel = ({ products, onProductsUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const parseXLSXFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const deduplicateProducts = (newProducts, existingProducts) => {
    const existingIds = new Set(existingProducts.map(p => p.ProductId));
    const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.ProductId));
    return uniqueNewProducts;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      showNotification('Please upload a valid Excel file (.xlsx or .xls)', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const parsedData = await parseXLSXFile(file);
      
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        showNotification('No valid data found in the Excel file', 'error');
        return;
      }

      // Check if required columns exist
      const requiredColumns = ['ProductId', 'Image Url', 'Product Desc', 'Promotion Url'];
      const firstRow = parsedData[0];
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length > 0) {
        showNotification(`Missing required columns: ${missingColumns.join(', ')}`, 'error');
        return;
      }

      // Deduplicate products
      const uniqueProducts = deduplicateProducts(parsedData, products);
      
      if (uniqueProducts.length === 0) {
        showNotification('No new products found. All products already exist.', 'warning');
        return;
      }

      // Add new products to existing list
      const updatedProducts = [...products, ...uniqueProducts];
      onProductsUpdate(updatedProducts);
      
      showNotification(`Successfully added ${uniqueProducts.length} new products!`, 'success');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      showNotification('Error parsing Excel file. Please check the file format.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.ProductId !== productId);
    onProductsUpdate(updatedProducts);
    showNotification('Product deleted successfully!', 'success');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fakeEvent = {
        target: { files: [file] }
      };
      handleFileUpload(fakeEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">Manage your AliExpress affiliate products</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Products</h2>
          
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">Upload AliExpress XLSX File</p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop your Excel file here, or click to browse
                </p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                >
                  {isUploading ? 'Processing...' : 'Choose File'}
                </label>
              </div>
            </div>
          </div>

          {/* File Requirements */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Required Columns:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ProductId (unique identifier)</li>
              <li>• Image Url (product image)</li>
              <li>• Product Desc (product description)</li>
              <li>• Promotion Url (affiliate link)</li>
              <li>• Origin Price (optional)</li>
              <li>• Discount Price (optional)</li>
              <li>• Commission Rate (optional)</li>
              <li>• Positive Feedback (optional)</li>
              <li>• Coupon Info (optional)</li>
              <li>• Video Url (optional)</li>
            </ul>
          </div>
        </div>

        {/* Products Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Products ({products.length})
            </h2>
            {products.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all products?')) {
                    onProductsUpdate([]);
                    showNotification('All products deleted!', 'success');
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete All Products
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500">Upload an Excel file to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.ProductId}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default AdminPanel;
