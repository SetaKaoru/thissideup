// File: src/App.js

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext'; 
import { DesignProvider } from './contexts/DesignContext';
import { AuthProvider } from './contexts/AuthContext'; 
import { CartProvider } from './contexts/CartContext'; 

import Navbar from './components/Navbar'; 
import Footer from './components/layout/Footer'; 
import ProtectedRoute from './components/ProtectedRoute.js'; // Ensure this path is correct

const HomePage = lazy(() => import('./pages/Home'));
const ProductsPage = lazy(() => import('./pages/Products'));
const AboutPage = lazy(() => import('./pages/About'));
const FAQPage = lazy(() => import('./pages/FAQ'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const DesignSkimboardPage = lazy(() => import('./pages/DesignSkimboard'));
const ActualShoppingCartPage = lazy(() => import('./pages/shoppingCart'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const SignUpPage = lazy (() => import ('./pages/auth/SignUpPage'));
const SignInPage = lazy (() => import ('./pages/auth/LoginPage'));
const UserProfilePage = lazy(() => import('./pages/auth/UserProfile'));
const Search = lazy(() => import('./pages/Search'));
const AddProductPage = lazy(() => import('./pages/AddAndEdit/Add'));
const EditProductPage = lazy(() => import('./pages/AddAndEdit/Edit'));
const OrdersPage = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrdersDetails'));
const UsersList = lazy(() => import('./pages/Users'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditionsPage = lazy(() => import('./pages/Terms&Conditions'));

function ScrollToTop(){
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function App() {
  

  return (    
    
    <AuthProvider> 
      <ProductProvider>
        <CartProvider> 
          <DesignProvider>
            <Navbar />
            <Suspense fallback={<div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Loading Page...</div>}>
             <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/products/category/:categoryName" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
                <Route path="/termsconditions" element={<TermsConditionsPage />} />
                {/* <Route path="/orders" element={<OrdersPage />} /> */}
                

                {/* --- CUSTOMER-ONLY ROUTE --- */}
                <Route 
                  path="/design-skimboard" 
                  element={
                    <ProtectedRoute allowedRoles={['Customer']}>
                      <DesignSkimboardPage />
                    </ProtectedRoute>
                  } 
                />

                {/* --- ROUTES FOR ANY LOGGED-IN USER (Admin or Customer) --- */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Customer']}>
                      <UserProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Customer']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Customer']}>
                      <OrderDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/shoppingCart" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Customer']}>
                      <ActualShoppingCartPage />
                    </ProtectedRoute>
                  } 
                /> 
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Customer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />

                {/* --- ADMIN-ONLY ROUTES --- */}
                <Route path="/add" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AddProductPage />
                    </ProtectedRoute>
                } />
                <Route path="/edit/:id" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <EditProductPage />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <UsersList />
                    </ProtectedRoute>
                } />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Page Not Found</div>} />
              </Routes>
            </Suspense>
            <Footer />
          </DesignProvider>
        </CartProvider> 
      </ProductProvider> 
    </AuthProvider>
  );
}

export default App;