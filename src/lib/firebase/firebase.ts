import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
} from "firebase/firestore";
import { env } from "../env/env";
import { toast } from "sonner";

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const fbProvider = new GoogleAuthProvider();
const fbAuth = getAuth(app);

class Firebase {
  auth: ReturnType<typeof getAuth>;
  provider: GoogleAuthProvider;
  db: Firestore;

  constructor() {
    try {
      this.auth = fbAuth;
      this.provider = fbProvider;
      this.db = getFirestore(app);
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      throw new Error("Firebase initialization failed");
    }
  }

  async createUserWithCredential(credential: {
    email: string;
    password: string;
  }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credential.email,
        credential.password
      );

      const user = userCredential.user;

      await setDoc(doc(this.db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        createdAt: new Date(),
      });

      return userCredential;
    } catch (error: any) {
      console.error("Failed to create user with credentials:", error);

      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          throw new Error("Email is already registered");
        case "auth/weak-password":
          throw new Error("Password is too weak");
        case "auth/invalid-email":
          throw new Error("Invalid email address");
        default:
          throw new Error("Failed to create user account");
      }
    }
  }

  async signInWithCredential(credential: { email: string; password: string }) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credential.email,
        credential.password
      );
      return userCredential;
    } catch (error: any) {
      console.error("Failed to sign in with credentials:", error);

      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/wrong-password":
          throw new Error("Incorrect password");
        case "auth/invalid-email":
          throw new Error("Invalid email address");
        case "auth/user-disabled":
          throw new Error("This account has been disabled");
        default:
          throw new Error("Failed to sign in");
      }
    }
  }

  async googleAuth() {
    try {
      const userCredential = await signInWithPopup(this.auth, this.provider);

      const user = userCredential.user;

      const userRef = doc(this.db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
      }

      return userCredential;
    } catch (error: any) {
      console.error("Failed to authenticate with Google:", error);

      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/popup-closed-by-user":
          toast.error("Authentication cancelled by user");
          throw new Error("Authentication cancelled by user");
        case "auth/popup-blocked":
          toast.error("Popup was blocked by browser");
          throw new Error("Popup was blocked by browser");
        case "auth/cancelled-popup-request":
          toast.error("Authentication request cancelled");
          throw new Error("Authentication request cancelled");
        default:
          toast.error("Failed to authenticate with Google");
          throw new Error("Failed to authenticate with Google");
      }
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      console.error("Failed to sign out:", error);
      throw new Error("Failed to sign out");
    }
  }

  authStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}

// Create a single Firebase instance
const firebase = new Firebase();

// Export the bound methods and properties
export const auth = firebase.auth;
export const createUserWithCredential =
  firebase.createUserWithCredential.bind(firebase);
export const signInWithCredential =
  firebase.signInWithCredential.bind(firebase);
export const googleAuth = firebase.googleAuth.bind(firebase);
export const logout = firebase.logout.bind(firebase);
export const authStateChanged = firebase.authStateChanged.bind(firebase);
export const getCurrentUser = firebase.getCurrentUser.bind(firebase);
