 **WHATSAPP INFLUENCER TRACKING SYSTEM**

**LIVE DEMO**

 https://tracking-referral-app.vercel.app


A simple web-based tool that helps businesses track which influencers bring them customers via WhatsApp.

---

   **FEATURES**

a)  Unique referral links for each influencer  
b)  Tracks clicks using Firebase  
c)  Redirects users to WhatsApp  
d)  Pre-filled message shows influencer source  
e)  Dashboard with:
      * Total clicks
      * Total influencers
      * Clicks per influencer
      * Top-performing influencers

---

   **HOW IT WORKS**

1. Add influencers in the dashboard  
2. Each influencer gets a unique link:

      https://tracking-referral-app.vercel.app

3. When a customer clicks:
- The system logs the click
- Redirects to WhatsApp
- Sends message like:
  ```
  Hi, I found you through kibunjah
  ```

4. Dashboard updates automatically with stats

---

**TECK STACK**

- HTML  
- CSS  
- JavaScript  
- Firebase (Firestore)  

---

**PROJECT STRUCTURE**

referral-app/
│
├── index.html # Redirect page
├── dashboard.html # Admin dashboard
├── script.js # Click tracking logic
├── dashboard.js # Dashboard logic
├── style.css # Styling


---

**SETUP INSTRUCTIONS**

1. Clone the repository:

    https://github.com/xaviour-sketch/tracking-referral-app


2. Open the project folder

3. Replace Firebase config in:
- `script.js`
- `dashboard.js`

4. Run using Live Server or open in browser

---

**DEPLOYMENT**

This project can be deployed easily using:

- Vercel
- Netlify

---

**USE CASE**

Perfect for:
- Small businesses using WhatsApp  
- Instagram brands  
- Influencer marketing campaigns  

---

**NOTES**

- Firebase API key is safe to expose in frontend apps  
- Firestore rules should be secured before production use  

---

**FUTURE IMPROVEMENTS**

- User authentication  
- Multi-business support  
- Conversion tracking  
- Better UI/UX  

---

**AUTHOR**

Built by Alvin Muthee

---

**LICENSE**

This project is open for learning and customization.
