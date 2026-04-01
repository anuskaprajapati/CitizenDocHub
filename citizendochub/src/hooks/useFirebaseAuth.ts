import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';  // Added setDoc here

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Set persistence ONCE when hook initializes
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error setting persistence:', error);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          console.log('Fetching user document for UID:', firebaseUser.uid);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            console.log('User role from Firestore:', role);
            setUserRole(role);
          } else {
            console.log('User document not found in Firestore!');
            setUserRole('citizen');
          }
        } catch (error) {
          console.error('Error getting user role:', error);
          setUserRole('citizen');
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('signIn called with email:', email);
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('signIn successful:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Sign in error:', error.code, error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'citizen') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        role,
        createdAt: new Date().toISOString()
      });
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut
  };
};
