import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';

interface CompareContextType {
  comparedItems: Product[];
  toggleCompare: (product: Product) => boolean; // returns true if operation succeeded, false if limit exceeded
  isInCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  compareError: string | null;
  setCompareError: (error: string | null) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [comparedItems, setComparedItems] = useState<Product[]>([]);
  const [compareError, setCompareError] = useState<string | null>(null);

  const toggleCompare = (product: Product): boolean => {
    const exists = comparedItems.some(item => item.id === product.id);

    if (exists) {
      setComparedItems(prev => prev.filter(item => item.id !== product.id));
      setCompareError(null);
      return true;
    } else {
      if (comparedItems.length >= 3) {
        setCompareError('You can compare a maximum of 3 products side-by-side.');
        return false;
      }
      setComparedItems(prev => [...prev, product]);
      setCompareError(null);
      return true;
    }
  };

  const isInCompare = (productId: string) => {
    return comparedItems.some(item => item.id === productId);
  };

  const removeFromCompare = (productId: string) => {
    setComparedItems(prev => prev.filter(item => item.id !== productId));
    setCompareError(null);
  };

  const clearCompare = () => {
    setComparedItems([]);
    setCompareError(null);
  };

  return (
    <CompareContext.Provider value={{
      comparedItems,
      toggleCompare,
      isInCompare,
      removeFromCompare,
      clearCompare,
      compareError,
      setCompareError
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
