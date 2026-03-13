import { initializeApp } from "firebase/app";

// IMPORTANT: For better security in a production app, you should store these
// values in environment variables (e.g., in a .env file).
// For now, we will place them here to get it working.

// --- PASTE YOUR WEB APP'S FIREBASE CONFIGURATION HERE ---
// You can find this in your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyCztFtDtbOmcXojRvc6ZijjYZMTl7y-plc",
  authDomain: "megahack-ee214.firebaseapp.com",
  databaseURL: "https://megahack-ee214-default-rtdb.firebaseio.com",
  projectId: "megahack-ee214",
  storageBucket: "megahack-ee214.firebasestorage.app",
  messagingSenderId: "1001742119207",
  appId: "1:1001742119207:web:16160ba86690ef52437902",
  measurementId: "G-8E4LLZZEGX"
};
// ---------------------------------------------------------

// Initialize Firebase
initializeApp(firebaseConfig);