// Import Firebase from CDN (IMPORTANT)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config (PUT YOUR REAL API KEY BACK)
const firebaseConfig = {
  apiKey: "AIzaSyA1GjZD0_BMnDKllhY0zDAeRA53AhQh8lM",
  authDomain: "tracking-system-32753.firebaseapp.com",
  projectId: "tracking-system-32753",
  storageBucket: "tracking-system-32753.firebasestorage.app",
  messagingSenderId: "250991296722",
  appId: "1:250991296722:web:7b5f743a9ea55717102d0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get referral from URL
const params = new URLSearchParams(window.location.search);
const ref = params.get("ref");

// Save click to Firestore
async function saveClick() {
  try {
    await addDoc(collection(db, "clicks"), {
      ref: ref || "unknown",
      timestamp: new Date()
    });
    console.log("Click saved!");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run then redirect
if (!localStorage.getItem("clicked")) {
  saveClick().then(() => {
    localStorage.setItem("clicked", "true");

    setTimeout(() => {
      const safeRef = ref || "your page";
      const message = `Hi, I found you through ${safeRef}`;
      window.location.href = `https://wa.me/254701266490?text=${encodeURIComponent(message)}`;
    }, 1500);
  });
} else {
  setTimeout(() => {
    const safeRef = ref || "your page";
    const message = `Hi, I found you through ${safeRef}`;
    window.location.href = `https://wa.me/254118043671?text=${encodeURIComponent(message)}`;
  }, 1500);
}






