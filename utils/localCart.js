// utils/localCart.js
export function getLocalCart() {
    // if (typeof window !== 'undefined') {
      const cart = localStorage.getItem('localCart');
      return cart ? JSON.parse(cart) : [];
    // }
    return [];
  }
  
  export function setLocalCart(cart) {
    // if (typeof window !== 'undefined') {
      localStorage.setItem('localCart', JSON.stringify(cart));
    // }
  }
  
  export function clearLocalCart() {
    // if (typeof window !== 'undefined') {
      localStorage.removeItem('localCart');
    // }
  }
  