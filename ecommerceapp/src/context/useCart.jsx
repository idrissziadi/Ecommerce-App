import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage if it exists, otherwise start with an empty array
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const handleAddToCart = (product) => {
        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
            setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleRemoveFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const handleQuantityChange = (id, quantity) => {
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    return (
        <CartContext.Provider value={{ cart, handleAddToCart, handleRemoveFromCart, handleQuantityChange, setCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
