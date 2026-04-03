// App.js: Handles token retrieval, URL registration, and UI

document.addEventListener("DOMContentLoaded", () => {
  const tokenForm = document.getElementById("tokenForm");
  const tokenResult = document.getElementById("tokenResult");
  const nextStepBtn = document.getElementById("nextStep");

  const registerForm = document.getElementById("registerForm");
  const registerResult = document.getElementById("registerResult");

  let accessToken = "";

  // STEP 1: Get Access Token
  tokenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = document.getElementById("consumerKey").value.trim();
    const secret = document.getElementById("consumerSecret").value.trim();

    tokenResult.textContent = "Getting token...";
    tokenResult.classList.remove("hidden");

    try {
      const res = await fetch("/get-token", {   // Backend endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, secret })
      });
      const data = await res.json();
      if (data.success) {
        accessToken = data.access_token;
        tokenResult.textContent = `✅ Access Token: ${accessToken}`;
        tokenResult.classList.remove("error");
        tokenResult.classList.add("success");
        nextStepBtn.classList.remove("hidden");
      } else {
        tokenResult.textContent = `❌ Error: ${data.error}`;
        tokenResult.classList.remove("success");
        tokenResult.classList.add("error");
      }
    } catch (err) {
      tokenResult.textContent = `❌ Error: ${err.message}`;
      tokenResult.classList.remove("success");
      tokenResult.classList.add("error");
    }
  });

  // Move to Step 2
  nextStepBtn.addEventListener("click", () => {
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
  });

  // STEP 2: Register URLs
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const shortcode = document.getElementById("shortCode").value.trim();
    const confirmation = document.getElementById("confirmationUrl").value.trim();
    const validation = document.getElementById("validationUrl").value.trim();

    registerResult.textContent = "Registering URLs...";
    registerResult.classList.remove("hidden");

    try {
      const res = await fetch("/register-url", {   // Backend endpoint
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ shortcode, confirmation, validation })
      });
      const data = await res.json();
      if (data.success) {
        registerResult.textContent = `✅ URLs Registered Successfully!`;
        registerResult.classList.remove("error");
        registerResult.classList.add("success");
      } else {
        registerResult.textContent = `❌ Error: ${data.error}`;
        registerResult.classList.remove("success");
        registerResult.classList.add("error");
      }
    } catch (err) {
      registerResult.textContent = `❌ Error: ${err.message}`;
      registerResult.classList.remove("success");
      registerResult.classList.add("error");
    }
  });
});