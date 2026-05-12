import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyA1GjZD0_BMnDKllhY0zDAeRA53AhQh8lM",
  authDomain: "tracking-system-32753.firebaseapp.com",
  projectId: "tracking-system-32753",
  storageBucket: "tracking-system-32753.firebasestorage.app",
  messagingSenderId: "250991296722",
  appId: "1:250991296722:web:7b5f743a9ea55717102d0b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add influencer
window.addInfluencer = async function () {
  const input = document.getElementById("name");
  const name = input.value.trim();

  if (!name) {
    alert("Enter influencer name");
    return;
  }

  const refId = name.toLowerCase().replace(/\s+/g, "");

  try {
    // Check if influencer already exists
    const existing = await getDocs(collection(db, "influencers"));
    let exists = false;

    existing.forEach((doc) => {
      if (doc.data().ref === refId) {
        exists = true;
      }
    });

    if (exists) {
      alert("Influencer already exists");
      return;
    }

    // Add to database
    await addDoc(collection(db, "influencers"), {
      name: name,
      ref: refId,
      createdAt: new Date()
    });

    // Clear input
    input.value = "";

    // Reload list
    loadInfluencers();

  } catch (error) {
    console.error("Error adding influencer:", error);
    alert("Something went wrong");
  }
};

// Load influencers
async function loadInfluencers() {
  const influencerSnap = await getDocs(collection(db, "influencers"));
  const clicksSnap = await getDocs(collection(db, "clicks"));

  const list = document.getElementById("list");
  list.innerHTML = "";

  // Stats
  document.getElementById("totalInfluencers").innerText = influencerSnap.size;
  document.getElementById("totalClicks").innerText = clicksSnap.size;

  // Count clicks per ref
  const clickCounts = {};

  clicksSnap.forEach((doc) => {
    const data = doc.data();
    const ref = data.ref;

    if (!clickCounts[ref]) clickCounts[ref] = 0;
    clickCounts[ref]++;
  });

 const influencers = [];

influencerSnap.forEach((doc) => {
  const data = doc.data();
  const count = clickCounts[data.ref] || 0;

  influencers.push({ ...data, count });
});

// Sort highest first
influencers.sort((a, b) => b.count - a.count);

// Display
influencers.forEach((data) => {
  const link = `https://tracking-referral-app.vercel.app/?ref=${data.ref}`;

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${data.name}</strong> — ${data.count} clicks<br>
    <a href="${link}" target="_blank">${link}</a>
  `;

  list.appendChild(li);
});
}

loadInfluencers();