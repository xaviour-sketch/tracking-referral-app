import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


// INITIALIZE
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

const provider = new GoogleAuthProvider();


// LOGIN
async function login() {

  try {

    const result = await signInWithPopup(auth, provider);

    const allowedEmails = [
      "yourcompany@gmail.com"
    ];

    const email = result.user.email;

    if (!allowedEmails.includes(email)) {

      alert("Unauthorized access");

      await signOut(auth);

      window.location.href = "/";

      return;
    }

    console.log("Authorized Login");

  } catch (err) {

    console.error(err);

    alert("Login failed");
  }
}

login();


// ADD INFLUENCER
window.addInfluencer = async function () {

  const nameInput =
    document.getElementById("name");

  const phoneInput =
    document.getElementById("phone");

  const name =
    nameInput.value.trim();

  const phone =
    phoneInput.value.trim();

  if (!name || !phone) {

    alert("Enter influencer name and phone");

    return;
  }

  // BETTER UNIQUE ID
  const refId =
    crypto.randomUUID().slice(0, 8);

  try {

    await addDoc(collection(db, "influencers"), {

      name,
      phone,
      ref: refId,
      createdAt: new Date()
    });

    const link =
      `https://tracking-referral-app.vercel.app/?ref=${refId}`;

    // AUTO WHATSAPP SEND
    const whatsappMessage =
      `Hello ${name}, here is your referral link: ${link}`;

    const whatsappURL =
      `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank");

    nameInput.value = "";
    phoneInput.value = "";

  } catch (error) {

    console.error(error);

    alert("Error adding influencer");
  }
};


// DELETE INFLUENCER
window.deleteInfluencer = async function (id) {

  const confirmDelete =
    confirm("Delete influencer permanently?");

  if (!confirmDelete) return;

  try {

    await deleteDoc(doc(db, "influencers", id));

    alert("Influencer deleted");

  } catch (error) {

    console.error(error);

    alert("Delete failed");
  }
};


// LIVE DASHBOARD
function loadInfluencers() {

  onSnapshot(
    collection(db, "influencers"),

    async (influencerSnap) => {

      const clicksSnap =
        await getDocs(collection(db, "clicks"));

      const list =
        document.getElementById("list");

      list.innerHTML = "";

      // STATS
      document.getElementById(
        "totalInfluencers"
      ).innerText = influencerSnap.size;

      document.getElementById(
        "totalClicks"
      ).innerText = clicksSnap.size;

      // CLICK COUNTS
      const clickCounts = {};

      clicksSnap.forEach((docSnap) => {

        const data = docSnap.data();

        const ref = data.ref;

        if (!clickCounts[ref]) {

          clickCounts[ref] = 0;
        }

        clickCounts[ref]++;
      });

      // BUILD ARRAY
      const influencers = [];

      influencerSnap.forEach((docSnap) => {

        const data = docSnap.data();

        influencers.push({

          id: docSnap.id,
          ...data,
          count: clickCounts[data.ref] || 0
        });
      });

      // SORT BY HIGHEST CLICKS
      influencers.sort(
        (a, b) => b.count - a.count
      );

      // RENDER
      influencers.forEach((data) => {

        const link =
          `https://tracking-referral-app.vercel.app/?ref=${data.ref}`;

        const li =
          document.createElement("li");

        li.style.marginBottom = "30px";

        li.innerHTML = `

          <strong style="
            font-size:22px;
          ">
            ${data.name}
          </strong>

          <br><br>

          <span style="
            font-size:18px;
            color:#22c55e;
            font-weight:bold;
          ">
            ${data.count} clicks
          </span>

          <br><br>

          <a href="${link}" target="_blank">
            ${link}
          </a>

          <br><br>

          <button
            onclick="deleteInfluencer('${data.id}')"
            style="
              background:red;
              color:white;
              border:none;
              padding:10px 14px;
              border-radius:8px;
              cursor:pointer;
            "
          >
            Delete Influencer
          </button>
        `;

        list.appendChild(li);
      });
    }
  );
}

loadInfluencers();