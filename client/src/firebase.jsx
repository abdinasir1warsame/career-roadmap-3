// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAmo-4nVWWepdoJn2aAIlN_JHIMAsdEtfo',
  authDomain: 'career-roadmap-7ee4f.firebaseapp.com',
  projectId: 'career-roadmap-7ee4f',
  storageBucket: 'career-roadmap-7ee4f.firebasestorage.app',
  messagingSenderId: '392812206840',
  appId: '1:392812206840:web:111d2bcd9c3bbcc485790d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
