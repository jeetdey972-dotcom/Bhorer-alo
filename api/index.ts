import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Configuration
// Use Service Role Key on backend to bypass RLS for admin tasks
const SUPABASE_URL = process.env.SUPABASE_URL || "https://nnqglyatzbuuxibxqhdl.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucWdseWF0emJ1dXhpYnhxaGRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYwNDExNCwiZXhwIjoyMDg3MTgwMTE0fQ.DBwQu6WtEFutQMsay4_JujN1t6pBZscoFovmJwaKlog";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Seed Admin (One-time check)
const NEW_ADMIN_USER = "info.gopalapll@gmail.com";
const NEW_ADMIN_PASS = "gopalbiswas/2026";

async function seedAdmin() {
  try {
    console.log("Checking for admin user...");
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', NEW_ADMIN_USER)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin existence:", error.message);
      console.error("This might be due to RLS. Please ensure you are using the service_role key.");
      return;
    }

    if (!admin) {
      console.log("Admin user not found. Seeding...");
      const { error: insertError } = await supabase
        .from('admins')
        .insert([{ username: NEW_ADMIN_USER, password: NEW_ADMIN_PASS }]);
      
      if (insertError) {
        console.error("Error seeding admin:", insertError.message);
      } else {
        console.log("Admin seeded successfully.");
      }
    } else {
      console.log("Admin user already exists.");
    }
  } catch (err) {
    console.error("Unexpected error during seeding:", err);
  }
}

const app = express();
app.use(express.json({ limit: '50mb' }));

// Helper to generate Client ID
function generateClientID() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// --- API ROUTES ---

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Try to login
    let { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error) {
      console.error("Login query error:", error.message);
      return res.status(500).json({ success: false, message: "Database error: " + error.message });
    }

    // If no admin found, check if we should seed it now
    if (!admin && username === NEW_ADMIN_USER && password === NEW_ADMIN_PASS) {
      console.log("Admin not found during login, attempting emergency seed...");
      const { data: seededAdmin, error: seedError } = await supabase
        .from('admins')
        .insert([{ username: NEW_ADMIN_USER, password: NEW_ADMIN_PASS }])
        .select()
        .maybeSingle();
      
      if (!seedError && seededAdmin) {
        admin = seededAdmin;
      } else if (seedError) {
        console.error("Emergency seed failed:", seedError.message);
      }
    }

    if (admin) {
      res.json({ success: true, user: { username: admin.username, role: 'admin' } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials. Please ensure the admin user exists in the database." });
    }
  } catch (err) {
    console.error("Unexpected login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Client Login / Register
app.post("/api/client/login", async (req, res) => {
  const { clientId, mobile } = req.body;
  
  if (clientId) {
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .eq('mobile', mobile)
      .single();

    if (client) {
      return res.json({ success: true, client });
    }
    return res.status(401).json({ success: false, message: "Invalid Client ID or Mobile Number" });
  }
  
  const { name } = req.body;
  if (name && mobile) {
    let { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('mobile', mobile)
      .single();

    if (!client) {
      const newClientId = generateClientID();
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert([{ client_id: newClientId, name, mobile }])
        .select()
        .single();
      client = newClient;
    }
    return res.json({ success: true, client });
  }

  res.status(400).json({ success: false, message: "Missing required fields" });
});

// Submit Intake Form
app.post("/api/intake/submit", async (req, res) => {
  const { client_id, ...formData } = req.body;
  
  try {
    const { data: existing } = await supabase
      .from('intake_forms')
      .select('id')
      .eq('client_id', client_id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('intake_forms')
        .update(formData)
        .eq('client_id', client_id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('intake_forms')
        .insert([{ client_id, ...formData }]);
      if (error) throw error;
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Supabase error" });
  }
});

// Admin: Get All Clients with Form Status
app.get("/api/admin/clients", async (req, res) => {
  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      *,
      intake_forms (
        id,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Flatten the structure to match previous API
  const flattened = clients.map(c => ({
    ...c,
    form_id: c.intake_forms?.[0]?.id,
    form_date: c.intake_forms?.[0]?.created_at
  }));

  res.json(flattened);
});

// Admin: Get Client Details & Form
app.get("/api/admin/client/:clientId", async (req, res) => {
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('client_id', req.params.clientId)
    .single();

  const { data: form } = await supabase
    .from('intake_forms')
    .select('*')
    .eq('client_id', req.params.clientId)
    .single();
  
  res.json({ client, form });
});

// Admin: Update Admin Signature
app.post("/api/admin/sign", async (req, res) => {
  const { client_id, admin_signature } = req.body;
  const { error } = await supabase
    .from('intake_forms')
    .update({ admin_signature })
    .eq('client_id', client_id);
  
  if (error) return res.status(500).json({ success: false });
  res.json({ success: true });
});

// Admin: Update Intake Form
app.post("/api/admin/intake/update", async (req, res) => {
  const { form_id, ...formData } = req.body;
  
  if (!form_id) {
    return res.status(400).json({ success: false, message: "Form ID is required" });
  }

  // Remove fields that should not be updated manually
  const { id, created_at, updated_at, client_id, ...cleanData } = formData;
  
  try {
    const { data: updatedForm, error } = await supabase
      .from('intake_forms')
      .update({ 
        ...cleanData, 
        updated_at: new Date().toISOString(),
        status: 'submitted' 
      })
      .eq('id', form_id)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }
    
    res.json({ 
      success: true, 
      form: updatedForm 
    });
  } catch (err: any) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: err.message || "Database error" });
  }
});

// --- VITE MIDDLEWARE / STATIC SERVING ---
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "..", "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
    });
  }
}

// Export for Vercel
export default app;

// Start server if not in Vercel environment
if (!process.env.VERCEL) {
  const PORT = 3000;
  setupVite().then(() => {
    seedAdmin();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // In Vercel, we still need to run seeding
  seedAdmin();
}

