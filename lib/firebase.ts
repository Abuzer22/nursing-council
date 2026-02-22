// lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRQSku1rV6DLox4MaFa2CQcSyE2p8iWR0",
  authDomain: "nursing-council-d45ad.firebaseapp.com",
  projectId: "nursing-council-d45ad",
  storageBucket: "nursing-council-d45ad.firebasestorage.app",
  messagingSenderId: "669380806779",
  appId: "1:669380806779:web:b0a755046911cd6f69fade",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);   // 🔥 IMPORTANT LINE