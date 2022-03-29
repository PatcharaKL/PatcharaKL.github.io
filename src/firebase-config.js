import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDu_JHUlPdgx_9IweFDRMkLTkxOeBxDOkA",
  authDomain: "test-387bd.firebaseapp.com",
  databaseURL: "https://test-387bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-387bd",
  storageBucket: "test-387bd.appspot.com",
  messagingSenderId: "553939266178",
  appId: "1:553939266178:web:ae59559946b470db5f629b",
  measurementId: "G-4DTNGLYSY8"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
