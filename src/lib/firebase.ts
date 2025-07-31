
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "biblionext-n06xi",
  "appId": "1:759288937373:web:a4e10282c3f593bf6d8d74",
  "storageBucket": "biblionext-n06xi.firebasestorage.app",
  "apiKey": "AIzaSyCrbqkT-SVR2j7UjFgvLNjotTiRPWvArZ4",
  "authDomain": "biblionext-n06xi.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "759288937373"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
