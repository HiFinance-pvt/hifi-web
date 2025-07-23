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

class Firebase {
  auth: ReturnType<typeof getAuth>;
  provider: GoogleAuthProvider;
  db: Firestore;

  constructor() {
    const app = initializeApp({
      apiKey: env.NEXT_PUBLIC_API_KEY,
      authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
      projectId: env.NEXT_PUBLIC_PROJECT_ID,
      storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: env.NEXT_PUBLIC_APP_ID,
    });
    this.provider = new GoogleAuthProvider();
    this.auth = getAuth(app);
    this.db = getFirestore(app);
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
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  authStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}

export const {
  auth,
  createUserWithCredential,
  signInWithCredential,
  googleAuth,
  logout,
  authStateChanged,
  getCurrentUser,
} = new Firebase();
