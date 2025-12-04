import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyAAVMrLvIyitdeeYWdHXTtVmfOd9WqBcd4",
  authDomain: "strathcart-58800.firebaseapp.com",
  projectId: "strathcart-58800",
  storageBucket: "strathcart-58800.firebasestorage.app",
  messagingSenderId: "223736154998",
  appId: "1:223736154998:web:789b3952c11144ab8cc857",
  measurementId: "G-KGKNWES3Q9"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
