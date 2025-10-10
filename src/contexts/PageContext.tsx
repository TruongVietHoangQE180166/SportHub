"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextType {
  isNotFoundPage: boolean;
  setIsNotFoundPage: (value: boolean) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  return (
    <PageContext.Provider value={{ isNotFoundPage, setIsNotFoundPage }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};