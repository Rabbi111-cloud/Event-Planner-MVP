import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcmRWvBQJ8V9cESIY6CYAK8GU3SPglWrs",
  authDomain: "event-planner-app-af22f.firebaseapp.com",
  projectId: "event-planner-app-af22f",
  storageBucket: "event-planner-app-af22f.firebasestorage.app",
  messagingSenderId: "975805639738",
  appId: "1:975805639738:web:dd4cf508cb8e9c28649903"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
