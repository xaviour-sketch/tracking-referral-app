import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

let allInfluencers = [];
let dashboardLoaded = false;

// INITIALIZE
const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

const auth =
  getAuth();

const provider =
  new GoogleAuthProvider();


// LOGIN
async function login() {

  try {

    const result =
      await signInWithPopup(
        auth,
        provider
      );

    const email =
      result.user.email;

    const allowedEmails = [
      "xaviourmuthee24@gmail.com",
      "johnnjuguna79001@gmail.com"
    ];

    if (
      !allowedEmails.includes(email)
    ) {

      alert("Unauthorized");

      await signOut(auth);

      return;
    }

    console.log(
      "Authorized login"
    );

  } catch (err) {

    console.error(err);

    alert(
      "Please allow popups and try again."
    );
  }
}




// ADD INFLUENCER
window.addInfluencer =
  async function () {

    const nameInput =
      document.getElementById("name");

    const phoneInput =
      document.getElementById("phone");

    const name =
      nameInput.value.trim();

    const phone =
      phoneInput.value.trim();

    if (!name || !phone) {

      alert(
        "Enter name and phone"
      );

      return;
    }

    // UNIQUE REF
    const refId =
      crypto.randomUUID()
      .slice(0, 8);

    try {

      await addDoc(
        collection(db, "influencers"),
        {

          name,
          phone,

          ref: refId,

          createdAt:
            new Date()
        }
      );

      const link =
        `https://tracking-referral-app.vercel.app/?ref=${refId}`;

      // AUTO WHATSAPP SEND
      const message =
        `Hello ${name}, here is your referral link:\n\n${link}`;

      const whatsappURL =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(
        whatsappURL,
        "_blank"
      );

      nameInput.value = "";
      phoneInput.value = "";

    } catch (error) {

      console.error(error);

      alert(
        "Error adding influencer"
      );
    }
  };


// DELETE INFLUENCER
window.deleteInfluencer =
  async function (id) {

    const confirmDelete =
      confirm(
        "Delete influencer permanently?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "influencers",
          id
        )
      );

      alert(
        "Influencer deleted"
      );

    } catch (error) {

      console.error(error);

      alert("Delete failed");
    }
  };

    function renderInfluencers(dataArray) {

  const list =
    document.getElementById("list");

  list.innerHTML = "";

  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  const filtered =
    dataArray.filter(
      (inf) =>
        inf.name
          .toLowerCase()
          .includes(search)
    );

  filtered.forEach((data) => {

    const link =
      `https://tracking-referral-app.vercel.app/?ref=${data.ref}`;

    const li =
      document.createElement("li");

      li.onclick = () =>
        openPopup(
          data.name,
          data.phone,
          link
        );

    li.innerHTML = `

      <div class="top-row">

        <strong class="name">
          ${data.name}
        </strong>

        <span class="clicks">
          ${data.count} clicks
        </span>

      </div>

      <br>

      <a href="${link}" target="_blank">
        ${link}
      </a>

      <br><br>

      <div class="btn-row">

        <button
          class="copy-btn"
          onclick="event.stopPropagation(); navigator.clipboard.writeText('${link}')"
        >
          Copy Link
        </button>

        <button
          class="delete-btn"
          onclick="event.stopPropagation(); deleteInfluencer('${data.id}')"
        >
          Delete
        </button>

      </div>
    `;

    list.appendChild(li);
  });
}

// OPEN POPUP
window.openPopup = function (
  name,
  phone,
  link
) {

  document
    .getElementById("popup")
    .classList
    .remove("hidden");

  document
    .getElementById("popupName")
    .innerText = name;

  document
    .getElementById("popupPhone")
    .innerText = phone;

  const popupLink =
    document.getElementById("popupLink");

  popupLink.href = link;

  popupLink.innerText = link;
};

// CLOSE POPUP
document
  .getElementById("closePopup")
  .addEventListener("click", () => {

    document
      .getElementById("popup")
      .classList
      .add("hidden");
  });


// LOAD LIVE
function loadInfluencers() {

  onSnapshot(

    collection(db, "influencers"),

    async (
      influencerSnap
    ) => {

      const clicksSnap =
        await getDocs(
          collection(db, "clicks")
        );

      

      document.getElementById(
        "totalInfluencers"
      ).innerText =
        influencerSnap.size;

      document.getElementById(
        "totalClicks"
      ).innerText =
        clicksSnap.size;

      // CLICK COUNTS
      const clickCounts = {};

      clicksSnap.forEach(
        (docSnap) => {

          const data =
            docSnap.data();

          const ref =
            data.ref;

          if (
            !clickCounts[ref]
          ) {

            clickCounts[ref] = 0;
          }

          clickCounts[ref]++;
        }
      );

      // ARRAY
      allInfluencers = [];

      influencerSnap.forEach(
        (docSnap) => {

          const data =
            docSnap.data();

          allInfluencers.push({
            id: docSnap.id,

            ...data,

            count:
              clickCounts[data.ref] || 0
          });
        }
      );

           // SORT
      allInfluencers.sort(
        (a, b) =>
          b.count - a.count
      );

      renderInfluencers(allInfluencers);

    }
  );
}

// PRESS ENTER TO ADD INFLUENCER

document
  .getElementById("name")
  .addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

      addInfluencer();
    }
});

document
  .getElementById("phone")
  .addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

      addInfluencer();
    }
});

document
  .getElementById("loginBtn")
  .addEventListener("click", login);

document
  .getElementById("search")
  .addEventListener("input", () => {

    renderInfluencers(allInfluencers);
});

onAuthStateChanged(auth, (user) => {

  const formCard =
    document.querySelector(".form-card");

  if (user) {

    console.log("User authenticated");

    formCard.style.display = "block";



      if (!dashboardLoaded) {

    loadInfluencers();

    dashboardLoaded = true;
    }

  } else {

    console.log("No user signed in");

    formCard.style.display = "none";
  }
});

document
  .getElementById("popup")
  .addEventListener("click", (e) => {

    if (e.target.id === "popup") {

      document
        .getElementById("popup")
        .classList
        .add("hidden");
    }
});
