// components/CartInitializer.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartFromServer, mergeLocalCartOnServer, setCart } from "@/redux/cartSlice";
import { getLocalCart, clearLocalCart } from "@/utils/localCart";

export default function CartInitializer() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.access.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // If not logged in, load the cart from local storage
      const localCart = getLocalCart();
      if (localCart.length > 0) {
        dispatch(setCart(localCart));
      }
    } else {
      // If logged in, merge local cart (if any) and then fetch the current cart from the server
      const localCart = getLocalCart();
      if (localCart.length > 0) {
        dispatch(mergeLocalCartOnServer(localCart))
          .unwrap()
          .then(() => {
            clearLocalCart();
            dispatch(fetchCartFromServer());
          })
          .catch((error) => {
            console.error("Error merging local cart:", error);
          });
      } else {
        dispatch(fetchCartFromServer());
      }
    }
  }, [dispatch, isAuthenticated]);

  return null;
}
