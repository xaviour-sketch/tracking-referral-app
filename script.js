import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyA1GjZD0_BMnDKllhY0zDAeRA53AhQh8lM",
  authDomain: "tracking-system-32753.firebaseapp.com",
  projectId: "tracking-system-32753",
  storageBucket: "tracking-system-32753.firebasestorage.app",
  messagingSenderId: "250991296722",
  appId: "1:250991296722:web:7b5f743a9ea55717102d0b"
};


// INITIALIZE
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// GET REF PARAM
const params =
  new URLSearchParams(window.location.search);

const ref = params.get("ref");
const influencerName =
  params.get("name") || "Unknown Influencer";




// TRACK CLICK
async function trackClick() {

  // INVALID LINK
  if (!ref) {

    document.body.innerHTML = 
      `<div class="redirect-box">
        <h1>Invalid Referral Link</h1>
      </div>`;

    return;
  }

  // PREVENT MULTIPLE CLICKS
  const clickKey =
    `clicked_${ref}`;

  if (!localStorage.getItem(clickKey)) {

    try {

      await addDoc(collection(db, "clicks"), {

        ref,
        clickedAt: new Date(),
        userAgent: navigator.userAgent
      });

      localStorage.setItem(
        clickKey,
        "true"
      );

    } catch (error) {

      console.error(error);
    }
  }



  // WHATSAPP MESSAGE
  const message =
    `Hi, I found you through ${influencerName}`;

  // AGENCY NUMBER
  const whatsappURL =
    `https://wa.me/254701266490?text=${encodeURIComponent(message)}`;

  // REDIRECT
  setTimeout(() => {

    window.location.href =
      whatsappURL;

  }, 1500);
}

trackClick();

