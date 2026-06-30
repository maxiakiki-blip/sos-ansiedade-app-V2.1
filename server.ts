import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // File to persist server-side buyers
  const BUYERS_FILE = path.join(process.cwd(), "server_buyers.json");

  // Helper to read buyers
  const readServerBuyers = (): any[] => {
    try {
      if (fs.existsSync(BUYERS_FILE)) {
        const data = fs.readFileSync(BUYERS_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error reading server buyers file:", e);
    }
    return [];
  };

  // Helper to write buyers
  const writeServerBuyers = (buyers: any[]) => {
    try {
      fs.writeFileSync(BUYERS_FILE, JSON.stringify(buyers, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing server buyers file:", e);
    }
  };

  // API: Get buyers list
  app.get("/api/buyers", (req, res) => {
    res.json(readServerBuyers());
  });

  // API: Create new buyer
  app.post("/api/buyers", (req, res) => {
    const { email, name, password, registrationDate } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const buyers = readServerBuyers();
    const cleanEmail = email.trim().toLowerCase();
    
    // Remove if already exists to update
    const filtered = buyers.filter(b => b.email.toLowerCase() !== cleanEmail);
    const newBuyer = {
      email: cleanEmail,
      name: (name || "Comprador").trim(),
      password: password || "sos123_mudar",
      registrationDate: registrationDate || new Date().toLocaleDateString("pt-BR")
    };
    filtered.push(newBuyer);
    writeServerBuyers(filtered);
    res.json({ success: true, buyer: newBuyer });
  });

  // API: Delete buyer
  app.delete("/api/buyers/:email", (req, res) => {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const buyers = readServerBuyers();
    const filtered = buyers.filter(b => b.email.toLowerCase() !== email.trim().toLowerCase());
    writeServerBuyers(filtered);
    res.json({ success: true });
  });

  // API: Update buyer password
  app.put("/api/buyers/:email/password", (req, res) => {
    const email = req.params.email;
    const { password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const buyers = readServerBuyers();
    let updated = false;
    const newBuyers = buyers.map(b => {
      if (b.email.toLowerCase() === email.trim().toLowerCase()) {
        updated = true;
        return { ...b, password };
      }
      return b;
    });
    if (updated) {
      writeServerBuyers(newBuyers);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Buyer not found" });
    }
  });

  // API: Hotmart Webhook Endpoint
  app.post("/api/webhooks/hotmart", (req, res) => {
    console.log("Hotmart Webhook Received:", JSON.stringify(req.body, null, 2));
    
    let email = "";
    let name = "";
    
    // Check for Hotmart API v2 structure
    if (req.body.data && req.body.data.buyer) {
      email = req.body.data.buyer.email;
      name = req.body.data.buyer.name;
    } 
    // Check for standard flat fields
    else if (req.body.email) {
      email = req.body.email;
      name = req.body.name || "Comprador Hotmart";
    }
    // Check for form-urlencoded or legacy Hotmart format (e.g. status: approved/approved, buyer_email, buyer_name)
    else if (req.body.buyer_email) {
      email = req.body.buyer_email;
      name = req.body.buyer_name || "Comprador Hotmart";
    }

    if (!email) {
      return res.status(400).json({ error: "No buyer email found in webhook body" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || "Comprador Hotmart").trim();

    // Only create access if buyer doesn't already exist
    const buyers = readServerBuyers();
    const exists = buyers.some(b => b.email.toLowerCase() === cleanEmail);

    if (exists) {
      console.log(`Buyer ${cleanEmail} already registered on server.`);
      return res.json({ status: "already_registered", message: "User already exists" });
    }

    // Generate random 8-character password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newBuyer = {
      email: cleanEmail,
      name: cleanName,
      password: password,
      registrationDate: new Date().toLocaleDateString("pt-BR")
    };

    buyers.push(newBuyer);
    writeServerBuyers(buyers);

    console.log(`Successfully created access via Webhook for: ${cleanEmail}`);

    res.json({
      status: "success",
      message: "Access granted and registered",
      buyer: {
        email: cleanEmail,
        name: cleanName,
        password: password
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
