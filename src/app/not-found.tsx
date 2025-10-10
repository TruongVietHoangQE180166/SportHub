'use client';

import { usePageContext } from '../contexts/PageContext';
import { useEffect } from 'react';
import NotFound from '@/components/ui/not-found';

export default function CustomNotFound() {
  const { setIsNotFoundPage } = usePageContext();

  useEffect(() => {
    // Set the context to indicate we're on the not-found page
    setIsNotFoundPage(true);
    
    // Add a data attribute to the body for CSS-based detection
    document.body.setAttribute('data-not-found', 'true');
    
    // Cleanup function to reset when component unmounts
    return () => {
      setIsNotFoundPage(false);
      document.body.removeAttribute('data-not-found');
    };
  }, [setIsNotFoundPage]);

  // Define props explicitly to ensure consistency between server and client
  const notFoundProps = {
    particleCount: 10000,
    particleSize: 4,
    animate: true,
    buttonText: "Go Back",
    buttonHref: "/",  // Changed from "/dashboard" to "/" for home page
    className: "custom-shadow"
  };

  return <NotFound {...notFoundProps} />;
}