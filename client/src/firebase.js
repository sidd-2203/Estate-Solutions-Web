import { initializeApp } from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "estatesolutionsweb.firebaseapp.com",
    projectId: "estatesolutionsweb",
    storageBucket: "estatesolutionsweb.appspot.com",
    messagingSenderId: "877736995916",
    appId: "1:877736995916:web:a126abf3640df05ecc18e9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);