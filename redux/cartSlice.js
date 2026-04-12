import customFetch from '@/utils/customFetch';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch the current cart state from the server

export const mergeLocalCartOnServer = createAsyncThunk(
    'cart/mergeLocalCartOnServer',
    async (localCart, { rejectWithValue }) => {
      try {
        const response = await customFetch('cart/api/cart/merge/', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Send the local cart items in an object (adjust based on your backend)
          body: JSON.stringify({ items: localCart }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to merge local cart');
        }
        return await response.json(); // Return the merged cart from backend
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchCartFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customFetch('cart/api/cart/', {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cart');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to send new cart data to the server (for adding an item)
export const sendCartToServer = createAsyncThunk(
  'cart/sendCartToServer',
  async (cartItem, { rejectWithValue }) => {
    try {
      const response = await customFetch('cart/api/cart/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update an existing cart item on the server
export const updateCartItemOnServer = createAsyncThunk(
  'cart/updateCartItemOnServer',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await customFetch('cart/api/cart/update/', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart item');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove a cart item from the server
export const removeCartItemOnServer = createAsyncThunk(
  'cart/removeCartItemOnServer',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await customFetch('cart/api/cart/', {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove cart item');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const normalize = (value) => (value === undefined ? null : value);

const isSameCartLine = (item, target) => {
  if (!item || !target) return false;

  if (target.cart_item_id != null && item.id != null) {
    return Number(item.id) === Number(target.cart_item_id);
  }

  const sameProduct = String(item.product_id) === String(target.product_id);
  const sameColor = normalize(item.selected_color_id ?? item.color) === normalize(target.selected_color_id ?? target.color);
  const sameVariantId = normalize(item.selected_variant_id ?? item.variant_id) === normalize(target.selected_variant_id ?? target.variant_id);
  const sameAuctionMode = Boolean(item.isAuctionPrice) === Boolean(target.isAuctionPrice);
  const sameVariantText = normalize(item.variant) === normalize(target.variant);

  return sameProduct && sameColor && sameVariantId && sameAuctionMode && sameVariantText;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Adds a product to the cart. If it already exists, increases its quantity.
    // Exception: First auction item is separate, subsequent full-price items merge.
    addToCart: (state, action) => {
      const { quantity } = action.payload;
      
      // For auction items at auction price, always create new entry (don't merge)
      if (action.payload.isAuctionPrice) {
        state.items.push({ ...action.payload, quantity: quantity || 1 });
        return;
      }
      
      // For regular items, merge only exact same line (product + color + variant)
      const existingItem = state.items.find(
        item => isSameCartLine(item, action.payload) && !item.isAuctionPrice
      );
      if (existingItem) {
        existingItem.quantity += (quantity || 1);
      } else {
        state.items.push({ ...action.payload, quantity: quantity || 1 });
      }
    },
    // Updates the quantity in Redux state (local update)
    updateQuantity: (state, action) => {
      const { change, ...identity } = action.payload;
      const item = state.items.find(item => isSameCartLine(item, identity));
      if (item) {
        item.quantity = Math.max(1, item.quantity + change);
      }
    },
    // Removes a product from the local cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => !isSameCartLine(item, action.payload)
      );
    },
    // Sets the cart state from a payload (for rehydrating from local storage)
    setCart: (state, action) => {
      state.items = action.payload;
    },
    // Clears the entire cart
    clearCart: (state) => {
      state.items = [];
    }
    
  },

  extraReducers: (builder) => {
    builder
      // Handle fetch-cart async thunk
      .addCase(fetchCartFromServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update cart items with the fetched data
        state.items = action.payload;
      })
      .addCase(fetchCartFromServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Error fetching cart:', action.payload);
      })
      // Handle add-to-cart async thunk
      .addCase(sendCartToServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendCartToServer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Cart successfully updated on the server:', action.payload);
      })
      .addCase(sendCartToServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Error adding to cart:', action.payload);
      })
      // Handle update-cart-item async thunk
      .addCase(updateCartItemOnServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemOnServer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Cart item successfully updated on the server:', action.payload);
      })
      .addCase(updateCartItemOnServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Error updating cart item:', action.payload);
      })
      // Handle remove-cart-item async thunk
      .addCase(removeCartItemOnServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeCartItemOnServer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Cart item successfully removed on the server:', action.payload);
      })
      .addCase(removeCartItemOnServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Error removing cart item:', action.payload);
      });
  }
});

export const { addToCart, updateQuantity, removeFromCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
