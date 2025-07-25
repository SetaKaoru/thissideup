// File: src/contexts/ProductContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
    fetchProducts, 
    searchProductsAPI, 
    fetchProductById as fetchProductByIdAPI,
    addProductAPI,
    updateProductAPI,
    deleteProductAPI,
    productCategories
} from '../DataPack/Data';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentCategory, setCurrentCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');

  const loadAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      const initialFiltered = await searchProductsAPI('', 'All', 'name_asc'); 
      setFilteredProducts(initialFiltered);
    } catch (err) {
      setError(err.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  const filterAndSortProducts = useCallback(async (category = currentCategory, newSortBy = sortBy, term = '') => {
    setLoading(true);
    setError(null);
    setCurrentCategory(category);
    setSortBy(newSortBy);
    try {
      const results = await searchProductsAPI(term, category, newSortBy);
      setFilteredProducts(results);
    } catch (err) {
      setError(err.message || "Failed to filter/sort products.");
    } finally {
      setLoading(false);
    }
  }, [currentCategory, sortBy]);

  const getProductById = useCallback(async (id) => {
    const productFromState = products.find(p => p._id === id);
    if (productFromState) return productFromState;
    try {
      return await fetchProductByIdAPI(id);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [products]);

  const addProduct = async (productData) => {
    setLoading(true);
    try {
        const newProduct = await addProductAPI(productData);
        setProducts(prev => [newProduct, ...prev]);
        setFilteredProducts(prev => [newProduct, ...prev]);
        setLoading(false);
        return newProduct;
    } catch (err) {
        setError(err.message || "Failed to add product.");
        setLoading(false);
        throw err;
    }
  };

  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    try {
      const returnedProduct = await updateProductAPI(productId, updatedData);
      setProducts(prev => prev.map(p => (p._id === productId ? returnedProduct : p)));
      setFilteredProducts(prev => prev.map(p => (p._id === productId ? returnedProduct : p)));
      setLoading(false);
      return returnedProduct;
    } catch (err) {
      setError(err.message || "Failed to update product.");
      setLoading(false);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
        await deleteProductAPI(productId);
        setProducts(prev => prev.filter(p => p._id !== productId));
        setFilteredProducts(prev => prev.filter(p => p._id !== productId));
        setLoading(false);
    } catch (err) {
        setError(err.message || "Failed to delete product.");
        setLoading(false);
        throw err;
    }
  };

  // --- NEW: Centralized function to handle stock updates on purchase ---
  const purchaseItems = async (orderItems) => {
      // Create a map for quick lookups
      const orderItemsMap = new Map(orderItems.map(item => [item.productId, item.quantity]));

      // Update the products state
      setProducts(prevProducts => {
          return prevProducts.map(product => {
              if (orderItemsMap.has(product._id)) {
                  const orderedQuantity = orderItemsMap.get(product._id);
                  const newStock = Math.max(0, product.stock - orderedQuantity);
                  // Return a new product object to ensure React detects the change
                  return { ...product, stock: newStock };
              }
              return product;
          });
      });

      // Also update filteredProducts to reflect the change immediately
      setFilteredProducts(prevFiltered => {
          return prevFiltered.map(product => {
              if (orderItemsMap.has(product._id)) {
                  const orderedQuantity = orderItemsMap.get(product._id);
                  const newStock = Math.max(0, product.stock - orderedQuantity);
                  return { ...product, stock: newStock };
              }
              return product;
          });
      });
  };


  const value = {
    filteredProducts,
    loading,
    error,
    currentCategory,
    categories: productCategories,
    filterAndSortProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    purchaseItems, // <-- Expose the new function
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};