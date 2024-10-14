// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "car-rental-sg.firebaseapp.com",
  projectId: "car-rental-sg",
  storageBucket: "car-rental-sg.appspot.com",
  messagingSenderId: "324432774105",
  appId: "1:324432774105:web:6ebb45e64f0fd0924a0fc8"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);