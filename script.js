import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// FIREBASE CONFIG
const firebaseConfig = {

  apiKey: "AIzaSyA1GjZD0_BMnDKllhY0zDAeRA53AhQh8lM",

  authDomain:
    "tracking-system-32753.firebaseapp.com",

  projectId:
    "tracking-system-32753",

  storageBucket:
    "tracking-system-32753.firebasestorage.app",

  messagingSenderId:
    "250991296722",

  appId:
    "1:250991296722:web:7b5f743a9ea55717102d0b"
};


// INITIALIZE
const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);


// GET REF
const params =
  new URLSearchParams(
    window.location.search
  );

const ref =
  params.get("ref");


// TRACK CLICK
async function trackClick() {

  if (!ref) {

    window.location.href =
      "https://yourwebsite.com";

    return;
  }

  // CHECK VALID REF
  const influencerSnap =
    await getDocs(
      collection(db, "influencers")
    );

  let validRef = false;

  influencerSnap.forEach(
    (docSnap) => {

      const data =
        docSnap.data();

      if (data.ref === ref) {

        validRef = true;
      }
    }
  );

  // INVALID LINK
  if (!validRef) {

    alert(
      "Invalid or expired referral link"
    );

    window.location.href =
      "https://yourwebsite.com";

    return;
  }

  // ANTI SPAM
  const clickKey =
    `clicked_${ref}`;

  if (
    !localStorage.getItem(clickKey)
  ) {

    try {

      await addDoc(
        collection(db, "clicks"),
        {

          ref,

          clickedAt:
            new Date(),

          userAgent:
            navigator.userAgent
        }
      );

      localStorage.setItem(
        clickKey,
        "true"
      );

    } catch (error) {

      console.error(error);
    }
  }

  // REDIRECT
  setTimeout(() => {

    const message =
      `Hi, I found you through ${ref}`;

    window.location.href =
      `https://wa.me/254701266490?text=${encodeURIComponent(message)}`;

  }, 300);
}

trackClick();