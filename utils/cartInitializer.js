// components/CartInitializer.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartFromServer, mergeLocalCartOnServer } from "@/redux/cartSlice";
import { getLocalCart, clearLocalCart } from "@/utils/localCart";

export default function CartInitializer() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.access.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      // If logged in, check if there's a local cart to merge.
      const localCart = getLocalCart();
      if (localCart.length > 0) {
        dispatch(mergeLocalCartOnServer(localCart))
          .unwrap()
          .then(() => {
            // Clear the local cart after a successful merge
            clearLocalCart();
            // Then fetch the cart from the server.
            dispatch(fetchCartFromServer());
          })
          .catch((error) => {
            console.error("Error merging local cart:", error);
          });
      } else {
        // If no local cart exists, simply fetch the current cart from the server.
        dispatch(fetchCartFromServer());
      }
    }
  }, [dispatch, isAuthenticated]);

  return null; // This component renders nothing
}
