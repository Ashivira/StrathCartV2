import { db } from './firebase-config.js';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function getMenuItems() {
  try {
    const menuRef = collection(db, "Menuitems");
    const q = query(menuRef, where("isavailable", "==", true), orderBy("category"));
    const querySnapshot = await getDocs(q);
    
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      menuItems.push({
        id: doc.id,
        itemname: data.itemname,
        description: data.description,
        category: data.category,
        price: data.price,
        quantavailable: data.quantavailable,
        isavailable: data.isavailable,
        imageurl: data.imageurl
      });
    });
    
    return menuItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

export async function getMenuItem(itemId) {
  try {
    const docRef = doc(db, "Menuitems", itemId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        itemname: data.itemname,
        description: data.description,
        category: data.category,
        price: data.price,
        quantavailable: data.quantavailable,
        isavailable: data.isavailable,
        imageurl: data.imageurl
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return null;
  }
}