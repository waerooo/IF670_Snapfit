import {
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import type { User } from '@react-native-firebase/auth';

type AuthModule = ReturnType<typeof getAuth>;

let authInstance: AuthModule | null = null;

function getAuthSafe(): AuthModule | null {
  if (!authInstance) {
    try {
      authInstance = getAuth();
    } catch (e) {
      console.warn('[authService] Firebase Auth native module not ready:', e);
      return null;
    }
  }
  return authInstance;
}

export function observeAuthState(
  onUserChanged: (user: User | null) => void,
): () => void {
  try {
    const auth = getAuthSafe();
    if (!auth) {
      onUserChanged(null);
      return () => {};
    }
    return onAuthStateChanged(auth, onUserChanged);
  } catch (err) {
    console.warn('[authService] observeAuthState error:', err);
    onUserChanged(null);
    return () => {};
  }
}

export function signInWithEmailAndPassword(email: string, password: string) {
  const auth = getAuthSafe();
  if (!auth) {
    throw new Error('Firebase Auth native module is not ready. Please rebuild the app.');
  }
  return firebaseSignInWithEmailAndPassword(auth, email, password);
}

export function createUserWithEmailAndPassword(email: string, password: string) {
  const auth = getAuthSafe();
  if (!auth) {
    throw new Error('Firebase Auth native module is not ready. Please rebuild the app.');
  }
  return firebaseCreateUserWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  const auth = getAuthSafe();
  if (!auth) {
    return Promise.resolve();
  }
  return firebaseSignOut(auth);
}
