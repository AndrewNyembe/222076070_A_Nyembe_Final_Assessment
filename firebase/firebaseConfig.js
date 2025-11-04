
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 


const firebaseConfig = {
  apiKey: "AIzaSyCtc7ytil8ABzrq46XIVtMcNbOUCfn9P9o",
  authDomain: "hotel-booking-app-ae791.firebaseapp.com",
  projectId: "hotel-booking-app-ae791",
  storageBucket: "hotel-booking-app-ae791.firebasestorage.app",
  messagingSenderId: "535187808859",
  appId: "1:535187808859:web:d4bdf1d1f221b62bd7957e",
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export default app;
