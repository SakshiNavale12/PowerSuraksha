import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);