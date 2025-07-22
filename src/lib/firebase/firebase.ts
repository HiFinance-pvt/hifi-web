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

export class Firebase {
	auth: any;
	provider: GoogleAuthProvider;

	constructor() {
		this.auth = getAuth(
			initializeApp({
				apiKey: env.API_KEY,
				authDomain: env.AUTH_DOMAIN,
				projectId: env.PROJECT_ID,
				storageBucket: env.STORAGE_BUCKET,
				messagingSenderId: env.MESSAGING_SENDER_ID,
				appId: env.APP_ID,
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
