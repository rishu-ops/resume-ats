import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAx1xPwHpKgVYxVtcjsl46jxMG3ixDZp8",
  authDomain: "spotify-aa878.firebaseapp.com",
  projectId: "spotify-aa878",
  storageBucket: "spotify-aa878.appspot.com",
  messagingSenderId: "658810990087",
  appId: "1:658810990087:web:4b362610462bc488b204a2",
  measurementId: "G-JG1MGNSBZS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
