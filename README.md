# Broadcast M-Pesa Integration

This repository contains a simple M-Pesa C2B setup project with a Node.js backend and a static frontend.

## Structure

- `backend/`: Express API for getting M-Pesa access tokens and registering C2B validation and confirmation URLs.
- `frontend/`: Static HTML/CSS/JavaScript UI for configuring the M-Pesa integration.

## Run locally

From the `backend/` folder:

```bash
npm install
set MPESA_ENV=production
node server.js
```

Then open `http://localhost:3000`.
