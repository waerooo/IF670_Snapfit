<<<<<<< Updated upstream
// TODO
=======
import {
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  deleteUser as firebaseDeleteUser,
} from '@react-native-firebase/auth';
import { deleteUserData } from './databaseService';
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

export async function deleteUser() {
  //dapatin user sama sekalian validasi yang didelete itu akun user diri sendiri
  const user = getAuthSafe()?.currentUser;
  if (!user) {
    throw new Error('No user is signed in.');
  }
  //hapus data user
  await deleteUserData(user.uid);
  return firebaseDeleteUser(user);
}

>>>>>>> Stashed changes
