import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDe7Zilhu5ATSLOXKFx2Li0Hct_xxnYKw",
  authDomain: "fir-4aee4.firebaseapp.com",
  projectId: "fir-4aee4",
  storageBucket: "fir-4aee4.appspot.com",
  messagingSenderId: "58533189891",
  appId: "1:58533189891:web:d56eabccae92ccbffb7136",
  measurementId: "G-6BVDRJ6BJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
