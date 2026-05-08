import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdmrI3cL7IambIqqVdHuQR8p4mvSAV8UY",
  authDomain: "fluencia-e2fae.firebaseapp.com",
  projectId: "fluencia-e2fae",
  storageBucket: "fluencia-e2fae.firebasestorage.app",
  messagingSenderId: "962400655748",
  appId: "1:962400655748:web:148e1e7c9f5c368c8ca5d1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function savePhrase(uid, phrase) {
  const col = collection(db, 'users', uid, 'phrases');
  return addDoc(col, { ...phrase, createdAt: new Date().toISOString() });
}

export async function getPhrases(uid) {
  const col = collection(db, 'users', uid, 'phrases');
  const q = query(col, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deletePhrase(uid, phraseId) {
  const d = doc(db, 'users', uid, 'phrases', phraseId);
  return deleteDoc(d);
}