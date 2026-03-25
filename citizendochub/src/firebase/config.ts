import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSQE93wKclU8IqliJBpOwQTP7kHnBtXXw",
  authDomain: "citizendochub-f2249.firebaseapp.com",
  projectId: "citizendochub-f2249",
  storageBucket: "citizendochub-f2249.firebasestorage.app",
  messagingSenderId: "1063158441337",
  appId: "1:1063158441337:web:1b0a0e86fc17c29b35fba8",
  measurementId: "G-4HDCQLS4V7"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Set persistence on auth instance
setPersistence(auth, browserLocalPersistence).catch(console.error);

export default app;