import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function signUp(email, password, admissionNumber, fullName, phoneNumber) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    await setDoc(doc(db, "Users", user.uid), {
      admissionNumber: admissionNumber,
      email: email,
      fullName: fullName,
      role: "student",
    });

    return { success: true, user: user };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: error.message };
  }
}


export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "Users", user.uid), {
      lastLogin: new Date()
    }, { merge: true });

    return { success: true, user: user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// 
export async function getCurrentUserData() {
  const user = auth.currentUser;
  if (user) {
    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
  }
  return null;
}

//User authentication check -23.11.2025
export function checkAuth(redirectTo = "login.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user && window.location.pathname !== "/login.html" && window.location.pathname !== "/setup.html") {
      window.location.href = redirectTo;
    }
  });
}