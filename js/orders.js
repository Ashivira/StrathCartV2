import { auth, db } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { clearCart } from './cart.js';


export async function createOrder(cartItems, userData) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = 50;
    const totalAmount = subtotal + serviceFee;

    const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 1000)}`;

    const orderTime = new Date();
    const collectionTime = new Date(orderTime.getTime() + 60 * 60 * 1000);

    const orderData = {
      orderNumber: orderNumber,
      admissionNumber: admissionNumber.uid,
      userEmail: user.email,
      items: cartItems.map(item => ({
        itemID: item.itemID,
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      subtotal: subtotal,
      total: total,
      orderTime: orderTime,
      collectionTime: collectionTime,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);

 
    await clearCart();

    
    await sendReceiptEmail(user.email, orderData);

    return { success: true, orderId: docRef.id, orderData: orderData };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}


export async function getUserOrders() {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("admissionNumber", "==", admissionNumber.uid),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}


async function sendReceiptEmail(email, orderData) {


  console.log("Sending receipt to:", email);
  // TODO: Implement EmailJS integration
}