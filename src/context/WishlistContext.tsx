import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface WishlistContextType {
  savedItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalSaved: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lumina-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lumina-wishlist', JSON.stringify(savedItems));
  }, [savedItems]);

  const toggleWishlist = (product: Product) => {
    setSavedItems(prevItems => {
      const exists = prevItems.some(item => item.id === product.id);
      if (exists) {
        return prevItems.filter(item => item.id !== product.id);
      } else {
        return [...prevItems, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return savedItems.some(item => item.id === productId);
  };

  const clearWishlist = () => setSavedItems([]);

  const totalSaved = savedItems.length;

  return (
    <WishlistContext.Provider value={{
      savedItems,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      totalSaved
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
