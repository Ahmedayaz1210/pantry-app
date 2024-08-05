// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ0Zk2pCXq4hxZKCRecHFjPusQlxvn8WE",
  authDomain: "pantrydatabase-ece0f.firebaseapp.com",
  projectId: "pantrydatabase-ece0f",
  storageBucket: "pantrydatabase-ece0f.appspot.com",
  messagingSenderId: "659459894177",
  appId: "1:659459894177:web:340e0c8f10cc6ad8c5b9e0"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
export {firestore, auth, app};