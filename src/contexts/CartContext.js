// File: src/contexts/CartContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { getProductById } = useProducts();
    
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            return [];
        }
    });

    const [hydratedCart, setHydratedCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // --- MODIFIED: Self-healing logic now fully removes deleted products ---
    useEffect(() => {
        const hydrateAndValidateCart = async () => {
            setLoading(true);
            const detailedCart = [];
            const validItems = [];

            if (typeof getProductById !== 'function') {
                setLoading(false);
                return;
            }

            for (const item of cartItems) {
                if (item.productId) {
                    const product = await getProductById(item.productId);
                    if (product) { // Only process items that still exist
                        detailedCart.push({ ...item, product, isAvailable: true });
                        validItems.push(item);
                    }
                    // If product is null (deleted), we simply do nothing, effectively removing it.
                }
                else if (item.type === 'custom') {
                    detailedCart.push({ ...item, isAvailable: true });
                    validItems.push(item);
                }
            }
            setHydratedCart(detailedCart);

            if (validItems.length < cartItems.length) {
                console.log("Cart self-healed: Removed unavailable products.");
                setCartItems(validItems); // This syncs the persistent state
            }
            setLoading(false);
        };

        hydrateAndValidateCart();
    }, [cartItems, getProductById]);

    // --- MODIFIED: addItemToCart now SETS the quantity for standard products ---
    const addItemToCart = useCallback((itemData, quantity = 1) => {
        if (itemData.isCustom) {
            // Custom skimboard logic remains unchanged. It creates a new unique item each time.
            setCartItems(prevItems => {
                const maxNumberInCart = prevItems.reduce((max, item) => {
                    if (item.type === 'custom' && item.customDesign?.name) {
                        const match = item.customDesign.name.match(/Custom Skimboard (\d+)/);
                        if (match && match[1]) {
                            const num = parseInt(match[1], 10);
                            return Math.max(max, num);
                        }
                    }
                    return max;
                }, 0);

                const newNumber = maxNumberInCart + 1;
                const newName = `Custom Skimboard ${newNumber}`;
                
                const finalItemData = { ...itemData, name: newName };
                const newItem = { 
                    customDesign: finalItemData, 
                    quantity, 
                    type: 'custom', 
                    _id: finalItemData._id 
                };
                return [...prevItems, newItem];
            });
        } else {
            // Standard product logic now SETS the quantity.
            const productId = itemData; // itemData is the product ID string
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.productId === productId);
                if (existingItem) {
                    // If item exists, update its quantity to the new value.
                    return prevItems.map(item =>
                        item.productId === productId
                            ? { ...item, quantity: quantity }
                            : item
                    );
                }
                // If it's a new item, add it to the cart.
                return [...prevItems, { productId, quantity }];
            });
        }
    }, []);

    // --- The rest of the functions are correct and unchanged ---
    const removeItemFromCart = useCallback((itemIdToRemove) => {
        setCartItems(prevItems => prevItems.filter(item => {
            const currentItemId = item.productId || item._id; 
            return currentItemId !== itemIdToRemove;
        }));
    }, []);
    
    const updateItemQuantity = useCallback((itemIdToUpdate, newQuantity) => {
        const finalQuantity = Math.max(1, newQuantity); 

        setCartItems(prevItems => 
            prevItems.map(item => {
                const currentItemId = item.productId || item._id;
                if (currentItemId === itemIdToUpdate) {
                    return { ...item, quantity: finalQuantity };
                }
                return item;
            })
        );
    }, []);

    const getQuantityById = useCallback((idToFind) => {
        const item = cartItems.find(item => {
            const currentItemId = item.productId || item._id;
            return currentItemId === idToFind;
        });
        return item ? item.quantity : 0;
    }, [cartItems]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const value = {
        cartItems: hydratedCart,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        getQuantityById,
        clearCart,
        loading,
        cartCount: cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};