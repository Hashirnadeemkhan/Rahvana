'use client';

import { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Function to hide Google Translate top bar
    const hideGoogleBar = () => {
      // Wait for the translate element to load
      const interval = setInterval(() => {
        const iframe = document.querySelector('iframe.goog-te-banner-frame');
        const skipDiv = document.querySelector('div.skiptranslate');

        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
          clearInterval(interval);
        }

        if (skipDiv) {
          skipDiv.setAttribute('style', 'display: none !important;');
        }
      }, 1000);

      // Clear interval after 10 seconds to prevent infinite loop
      setTimeout(() => clearInterval(interval), 10000);
    };

    // Create the Google Translate script
    const addGoogleTranslateScript = () => {
      // Create the script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ur,en',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false // Disable auto display of the banner
      }, 'google_translate_element');

      // Hide the top bar after initialization
      setTimeout(hideGoogleBar, 1000);
    };

    // Check if Google Translate script is already loaded
    if (window.google && window.google.translate) {
      // If already loaded, initialize immediately
      window.googleTranslateElementInit();
    } else {
      // If not loaded, add the script
      addGoogleTranslateScript();
    }

    // Also run hide function on initial load
    setTimeout(hideGoogleBar, 2000);
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 10000,
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default GoogleTranslate;