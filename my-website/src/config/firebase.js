import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfm59O8A3t8gcxr5GOmZ7PuKgci_E1K_g",
  authDomain: "digital-core-11082.firebaseapp.com",
  projectId: "digital-core-11082",
  storageBucket: "digital-core-11082.firebasestorage.app",
  messagingSenderId: "200613440811",
  appId: "1:200613440811:web:1e6997cd8cb3adc3dd296e",
  measurementId: "G-YJBML0P6LB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics = null;

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {
      analytics = null;
    });
}

export { app, analytics, auth };
