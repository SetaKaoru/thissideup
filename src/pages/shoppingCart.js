import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const CartItem = ({ cartEntry, onQuantityChange, onSelect, onRemove, isSelected }) => {
    const itemData = cartEntry.product || cartEntry.board;

    if (!itemData) return null;

    const itemId = itemData.id;

    return (
        <div className="cart-item-card">
            <div className="item-header">
                <input
                    type="checkbox"
                    id={`select-${itemId}`}
                    checked={isSelected}
                    onChange={() => onSelect(itemId)}
                    className="custom-checkbox-input"
                    aria-labelledby={`item-name-${itemId}`}
                />
                <label htmlFor={`select-${itemId}`} className="custom-checkbox-label" aria-hidden="true"></label>
                <p id={`item-name-${itemId}`} className="item-name" title={itemData.name}>
                    {itemData.name}
                </p>
            </div>
            <div className="item-body">
                <div className="item-visuals-and-price">
                    <img
                        src={itemData.image || '/images/placeholder-product.png'}
                        alt={itemData.name || 'Cart item image'}
                        className="item-image"
                    />
                    <p className="item-price">${itemData.price?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="quantity-selector">
                    <button
                        onClick={() => onQuantityChange(itemId, Math.max(1, cartEntry.quantity - 1))}
                        disabled={cartEntry.quantity <= 1}
                    >-</button>
                    <span>{cartEntry.quantity}</span>
                    <button
                        onClick={() => onQuantityChange(itemId, cartEntry.quantity + 1)}
                    >+</button>
                </div>
            </div>
            <div className="item-actions">
                <button onClick={() => onRemove(itemId)} className="item-remove-button">
                    Remove
                </button>
            </div>
        </div>
    );
};

const ActualShoppingCartPage = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [selectedItemsMap, setSelectedItemsMap] = useState({});
    const [totalPriceOfSelected, setTotalPriceOfSelected] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                // const res = await fetch('http://localhost:4000/getcart', {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/getcart`,{
                    headers: {
                        'auth-token': localStorage.getItem('auth-token'),
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch cart");

                const data = await res.json();
                setCartItems(data);

                // Select all items by default
                const initialSelected = {};
                data.forEach(entry => {
                    const id = entry.product?.id || entry.board?.id;
                    if (id) initialSelected[id] = true;
                });
                setSelectedItemsMap(initialSelected);
            } catch (err) {
                console.error("Error loading cart:", err);
                alert("Failed to load cart. Please log in.");
            }
        };

        fetchCart();
    }, []);

    // Recalculate total when selection/cart changes
    useEffect(() => {
        const newTotal = cartItems.reduce((sum, cartEntry) => {
            const itemData = cartEntry.product || cartEntry.board;
            const itemId = itemData?.id;
            if (itemData?.price && selectedItemsMap[itemId]) {
                return sum + itemData.price * cartEntry.quantity;
            }
            return sum;
        }, 0);

        setTotalPriceOfSelected(newTotal);
    }, [cartItems, selectedItemsMap]);

    // Quantity update handler
    const updateItemQuantity = async (itemId, newQty) => {
        try {
            // const res = await fetch('http://localhost:4000/addtocart', {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/addtocart`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({ itemId, quantity: newQty }),
            });

            if (!res.ok) throw new Error("Update failed");

            setCartItems(prev =>
                prev.map(entry => {
                    const id = entry.product?.id || entry.board?.id;
                    return id === itemId ? { ...entry, quantity: newQty } : entry;
                })
            );
        } catch (err) {
            console.error("Failed to update quantity:", err);
        }
    };

    // Remove handler
    const removeItemFromCart = async (itemId) => {
        try {
            // const res = await fetch('http://localhost:4000/removefromcart', {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/removefromcart`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({ itemId }),
            });

            if (!res.ok) throw new Error("Remove failed");

            setCartItems(prev =>
                prev.map(entry => {
                    const id = entry.product?.id || entry.board?.id;
                    return id === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry;
                }).filter(entry => entry.quantity > 0)
            );
        } catch (err) {
            console.error("Failed to remove item:", err);
        }
    };

    // Clear cart handler
    const clearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your cart?")) return;

        try {
            // const res = await fetch('http://localhost:4000/clearcart', {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/clearcart`,{
                
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                },
            });

            if (!res.ok) throw new Error("Clear failed");

            setCartItems([]);
            setSelectedItemsMap({});
        } catch (err) {
            console.error("Failed to clear cart:", err);
        }
    };

    const handleToggleSelectItem = (itemId) => {
        setSelectedItemsMap(prev => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const handleActualCheckout = () => {
        const itemsToPass = cartItems.filter(entry => {
            const id = entry.product?.id || entry.board?.id;
            return selectedItemsMap[id];
        });

        if (itemsToPass.length === 0) {
            alert("Please select items to checkout.");
            return;
        }

        navigate('/checkout', {
            state: {
                itemsForCheckout: itemsToPass,
                total: totalPriceOfSelected,
                selectedItems: selectedItemsMap,
            },
        });
    };

    return (
        <div className="shopping-cart-page">
            <div className="shopping-cart-page-container">
                <main className="shopping-cart-main-content">
                    <div className="cart-title-section">
                        <h1 className="cart-main-title">Shopping Cart</h1>
                        <p className="total-price-display">Total price: ${totalPriceOfSelected.toFixed(2)}</p>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="cart-items-grid">
                            {cartItems.map(cartEntry => {
                                const itemData = cartEntry.product || cartEntry.board;
                                if (!itemData) return null;
                                const itemId = itemData.id;
                                return (
                                    <CartItem
                                        key={itemId}
                                        cartEntry={cartEntry}
                                        onQuantityChange={updateItemQuantity}
                                        onSelect={handleToggleSelectItem}
                                        onRemove={removeItemFromCart}
                                        isSelected={!!selectedItemsMap[itemId]}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p className="empty-cart-message">
                            Your shopping cart is empty. <a href="/products">Continue Shopping</a>
                        </p>
                    )}

                    <div className="checkout-actions-container">
                        <button
                            className="clear-cart-button"
                            onClick={clearCart}
                            disabled={cartItems.length === 0}
                        >
                            Clear Cart
                        </button>
                        <button
                            className="checkout-button"
                            onClick={handleActualCheckout}
                            disabled={
                                cartItems.length === 0 ||
                                Object.values(selectedItemsMap).every(val => !val)
                            }
                        >
                            Check Out
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ActualShoppingCartPage;