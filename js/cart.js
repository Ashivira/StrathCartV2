import { auth, db } from './firebase-config.js';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function addToCart(menuItem) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const cartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(cartRef);

    let cartData;
    if (cartSnap.exists()) {
      cartData = cartSnap.data();
      const existingItemIndex = cartData.items.findIndex(item => item.menuItemId === menuItem.id);
      
      if (existingItemIndex >= 0) {
        cartData.items[existingItemIndex].quantity += 1;
      } else {
        cartData.items.push({
          menuItemId: menuItem.id,
          itemName: menuItem.itemName,
          price: menuItem.price,
          quantity: 1,
          imageUrl: menuItem.imageUrl
        });
      }
    } else {
      cartData = {
        userId: user.uid,
        items: [{
          menuItemId: menuItem.id,
          itemName: menuItem.itemName,
          price: menuItem.price,
          quantity: 1,
          imageUrl: menuItem.imageUrl
        }],
        updatedAt: new Date()
      };
    }

    await setDoc(cartRef, cartData);
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: error.message };
  }
}


export async function getCart() {
  try {
    const user = auth.currentUser;
    if (!user) return { items: [] };

    const cartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      return cartSnap.data();
    }
    return { items: [] };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { items: [] };
  }
}

export async function updateCartItemQuantity(menuItemId, quantity) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const cartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      const itemIndex = cartData.items.findIndex(item => item.menuItemId === menuItemId);
      
      if (itemIndex >= 0) {
        if (quantity > 0) {
          cartData.items[itemIndex].quantity = quantity;
        } else {
          cartData.items.splice(itemIndex, 1);
        }
        
        cartData.updatedAt = new Date();
        await setDoc(cartRef, cartData);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, error: error.message };
  }
}


export async function clearCart() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "carts", user.uid));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
}