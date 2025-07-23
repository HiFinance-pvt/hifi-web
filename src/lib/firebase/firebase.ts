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
import { env } from "../env/env";

class Firebase {
	auth: ReturnType<typeof getAuth>;
	provider: GoogleAuthProvider;

	constructor() {
		this.auth = getAuth(
			initializeApp({
				apiKey: env.NEXT_PUBLIC_API_KEY,
				authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
				projectId: env.NEXT_PUBLIC_PROJECT_ID,
				storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
				messagingSenderId: env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
				appId: env.NEXT_PUBLIC_APP_ID,
			})
		);
		this.provider = new GoogleAuthProvider();
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
			return userCredential;
		} catch (error) {
			throw error;
		}
	}

	async signInWithCredential(credential: {
		email: string;
		password: string;
	}) {
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
			const userCredential = await signInWithPopup(
				this.auth,
				this.provider
			);
			return userCredential;
		} catch (error) {
			throw error;
		}
	}

	async signOut() {
		try {
			await signOut(this.auth);
		} catch (error) {
			throw error;
		}
	}

	onAuthStateChanged(callback: (user: User | null) => void) {
		return onAuthStateChanged(this.auth, callback);
	}

	getCurrentUser() {
		return this.auth.currentUser;
	}
}

export const firebase = new Firebase();