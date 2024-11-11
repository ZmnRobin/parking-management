// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK28pjgEYyufG-ZQD53Sdq8KkAfyFoZaI",
  authDomain: "parking-management-adcd1.firebaseapp.com",
  projectId: "parking-management-adcd1",
  storageBucket: "parking-management-adcd1.firebasestorage.app",
  messagingSenderId: "305087550486",
  appId: "1:305087550486:web:cb379c34b500c116cb5137"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };