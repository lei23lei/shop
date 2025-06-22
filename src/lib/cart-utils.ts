// LocalStorage Cart Types
export interface LocalCartItem {
  id: number;
  cart_item_id: string; // Use string for localStorage unique ID
  name: string;
  price: string;
  size: string;
  size_id: number;
  quantity: number;
  total_available: number;
  // image_url : images[].image_url  last index
  image_url: string | null;
  // categories: categories[0].name + ", " + categories[1].name
  categories: string | null;
}

export interface LocalCart {
  cart_id: string;
  items: LocalCartItem[];
  total_items: number;
}

const CART_STORAGE_KEY = "local_cart";

// Generate unique cart item ID
const generateCartItemId = (): string => {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate unique cart ID
const generateCartId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get cart from localStorage
export const getLocalCart = (): LocalCart => {
  if (typeof window === "undefined") {
    return {
      cart_id: generateCartId(),
      items: [],
      total_items: 0,
    };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
  }

  return {
    cart_id: generateCartId(),
    items: [],
    total_items: 0,
  };
};

// Save cart to localStorage
export const saveLocalCart = (cart: LocalCart): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Add item to local cart
export const addToLocalCart = (item: {
  id: number;
  name: string;
  price: string;
  size: string;
  size_id: number;
  quantity: number;
  total_available: number;
  image_url: string | null;
  categories: string | null;
}): LocalCart => {
  const cart = getLocalCart();

  // Check if item with same id and size already exists
  const existingItemIndex = cart.items.findIndex(
    (cartItem) => cartItem.id === item.id && cartItem.size_id === item.size_id
  );

  if (existingItemIndex !== -1) {
    // Update existing item quantity
    const existingItem = cart.items[existingItemIndex];
    const newQuantity = existingItem.quantity + item.quantity;

    // Don't exceed available quantity
    if (newQuantity <= item.total_available) {
      cart.items[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };
    } else {
      // Set to maximum available
      cart.items[existingItemIndex] = {
        ...existingItem,
        quantity: item.total_available,
      };
    }
  } else {
    // Add new item
    const newCartItem: LocalCartItem = {
      ...item,
      cart_item_id: generateCartItemId(),
    };
    cart.items.push(newCartItem);
  }

  // Update total items
  cart.total_items = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  saveLocalCart(cart);
  return cart;
};

// Remove item from local cart
export const removeFromLocalCart = (cartItemId: string): LocalCart => {
  const cart = getLocalCart();
  cart.items = cart.items.filter((item) => item.cart_item_id !== cartItemId);
  cart.total_items = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  saveLocalCart(cart);
  return cart;
};

// Update item quantity in local cart
export const updateLocalCartItemQuantity = (
  cartItemId: string,
  quantity: number
): LocalCart => {
  const cart = getLocalCart();
  const itemIndex = cart.items.findIndex(
    (item) => item.cart_item_id === cartItemId
  );

  if (itemIndex !== -1) {
    const item = cart.items[itemIndex];
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else if (quantity <= item.total_available) {
      // Update quantity
      cart.items[itemIndex] = {
        ...item,
        quantity,
      };
    }
  }

  cart.total_items = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  saveLocalCart(cart);
  return cart;
};

// Clear local cart
export const clearLocalCart = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
};

// backend response
// {
//   "id": 32,
//   "name": "ANSZKTN High Street Unisex Washed Denim Trousers",
//   "price": "30.00",
//   "description": "Elevate your streetwear game with the ANSZKTN Unisex Washed Denim Trousers—a perfect blend of 90s nostalgia and contemporary high-fashion silhouettes. Designed for effortless style, these loose straight-leg jeans feature a distressed wash, heavyweight cotton denim, and a relaxed fit that drapes flawlessly. Whether you're layering for autumn or chasing a gender-neutral wardrobe staple, these trousers deliver comfort and edge.",
//   "created_at": "2025-06-06T14:24:54.445933Z",
//   "updated_at": "2025-06-06T14:24:54.446050Z",
//   "categories": [
//       {
//           "id": 1,
//           "name": "men"
//       },
//       {
//           "id": 6,
//           "name": "bottom"
//       }
//   ],
//   "details": {
//       "color": "Blue",
//       "detail": "### **Fabric & Construction**  \n| **Material**  | 100% Cotton (12oz denim) |  \n|--------------|--------------------------|  \n| **Wash**     | Distressed (Light/Heavy options) |  \n| **Weight**   | Mid-weight (All-season) |  \n| **Hardware** | Rust-proof button fly + zip |  \n\n### **Fit & Design**  \n- **Cut:** Loose straight-leg (tapered below knee)  \n- **Rise:** Mid-rise (9.5\" front)  \n- **Pockets:** 5-pocket classic + coin slot  \n- **Hem:** Raw unfinished (custom length available) "
//   },
//   "sizes": [
//       {
//           "id": 78,
//           "size": "M",
//           "quantity": 10
//       },
//       {
//           "id": 79,
//           "size": "L",
//           "quantity": 10
//       },
//       {
//           "id": 80,
//           "size": "XL",
//           "quantity": 3
//       }
//   ],
//   "images": [
//       {
//           "id": 152,
//           "image_url": "https://res.cloudinary.com/dtob2ieig/image/upload/v1749219873/zhyehwtboflr96jplbgr.webp",
//           "is_primary": false
//       },
//       {
//           "id": 153,
//           "image_url": "https://res.cloudinary.com/dtob2ieig/image/upload/v1749219879/tgrkc20owryy3fjrjh45.webp",
//           "is_primary": false
//       }
//   ],
//   "detail_images": []
// }
