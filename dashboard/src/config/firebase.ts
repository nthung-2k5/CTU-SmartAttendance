import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdNnrgBGmAnuCZ3ZK-hJ2M8k-suFrG47c",
  authDomain: "ctu-smartattendance.firebaseapp.com",
  projectId: "ctu-smartattendance",
  storageBucket: "ctu-smartattendance.firebasestorage.app",
  messagingSenderId: "482817229475",
  appId: "1:482817229475:web:fbe7193e4742d453b8b516",
  measurementId: "G-18J5JHMB2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
