import { initializeApp } from "firebase/app";

// IMPORTANT: For better security in a production app, you should store these
// values in environment variables (e.g., in a .env file).
// For now, we will place them here to get it working.

// --- PASTE YOUR WEB APP'S FIREBASE CONFIGURATION HERE ---
// You can find this in your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyD6p1RR_MyHImgF5iVmRdw3ZUC12XWYdvo", // Replace with your actual API Key
  authDomain: "hack-b2700.firebaseapp.com",
  databaseURL: "https://hack-b2700-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hack-b2700",
  storageBucket: "hack-b2700.appspot.com",
  messagingSenderId: "239193892169", // Replace with your actual Sender ID
  appId: "1:239193892169:web:a52202baeaff752500e698" // Replace with your actual App ID
};
// ---------------------------------------------------------

// Initialize Firebase
initializeApp(firebaseConfig);