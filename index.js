const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
let visitCount = 0;
app.use((req, res, next) => { visitCount++; next(); });

// const MPESA_ENV = process.env.MPESA_ENV === "production" ? "production" : "sandbox";
const MPESA_ENV = "production"; // Change to "production" when ready
const MPESA_BASE_URL = MPESA_ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";
console.log(`Using M-Pesa environment: ${MPESA_ENV}`);

// 🔹 Serve frontend automatically on /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/index.html"));
});

// 🔹 Serve static assets (CSS/JS)
app.use(express.static(path.join(__dirname, "./frontend")));

// 🔹 API: Get Access Token
app.post("/get-token", async (req, res) => {
  const { key, secret } = req.body;
  if (!key || !secret) {
    return res.status(400).json({ success: false, error: "Missing key or secret" });
  }

  try {
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        auth: { username: key, password: secret }
      }
    );
    res.json({ success: true, access_token: response.data.access_token });

  } catch (e) {
    res.json({ success: false, error: e.response?.data || e.message });
  }
});

// 🔹 API: Register URLs
app.post("/register-url", async (req, res) => {
  const { shortcode, confirmation, validation } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!shortcode || !confirmation || !validation) {
    return res.status(400).json({ success: false, error: "Missing shortcode, confirmation, or validation URL" });
  }
  if (!token) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }

  try {
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v1/registerurl`,
      { ShortCode: shortcode, ResponseType: "Completed", ConfirmationURL: confirmation, ValidationURL: validation },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json({ success: true, data: response.data });
  } catch (e) {
    res.json({ success: false, error: e.response?.data || e.message });
  }
});

// 🔹 Hidden visitor counter
app.get("/visits", (req, res) => res.json({ visits: visitCount }));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));