import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("neuron.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE,
    focus REAL,
    sleep REAL,
    energy REAL,
    stress REAL,
    checklist TEXT,
    intention TEXT,
    amazing TEXT,
    affirmation TEXT,
    priority TEXT,
    gratitude TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS brain_dump (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    analysis TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    language TEXT DEFAULT 'pt',
    display_name TEXT DEFAULT 'Usuário',
    is_pro INTEGER DEFAULT 0,
    theme TEXT DEFAULT 'dark',
    font_size TEXT DEFAULT 'medium'
  );

  INSERT OR IGNORE INTO settings (id, language, display_name, is_pro, theme, font_size) VALUES (1, 'pt', 'Usuário', 0, 'dark', 'medium');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings WHERE id = 1").get();
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const { language, display_name, is_pro, theme, font_size } = req.body;
    db.prepare("UPDATE settings SET language = ?, display_name = ?, is_pro = ?, theme = ?, font_size = ? WHERE id = 1")
      .run(language, display_name, is_pro ? 1 : 0, theme, font_size);
    res.json({ success: true });
  });

  app.get("/api/logs", (req, res) => {
    const logs = db.prepare("SELECT * FROM logs ORDER BY date DESC").all();
    res.json(logs);
  });

  app.post("/api/logs", (req, res) => {
    const { date, focus, sleep, energy, stress, checklist, intention, amazing, affirmation, priority, gratitude } = req.body;
    try {
      db.prepare(`
        INSERT INTO logs (date, focus, sleep, energy, stress, checklist, intention, amazing, affirmation, priority, gratitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(date, focus, sleep, energy, stress, JSON.stringify(checklist), intention, amazing, affirmation, priority, gratitude);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Log already exists for today" });
    }
  });

  app.delete("/api/logs/:id", (req, res) => {
    db.prepare("DELETE FROM logs WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/brain-dump", (req, res) => {
    const notes = db.prepare("SELECT * FROM brain_dump ORDER BY timestamp DESC").all();
    res.json(notes);
  });

  app.post("/api/brain-dump", (req, res) => {
    const { text, analysis } = req.body;
    db.prepare("INSERT INTO brain_dump (text, analysis) VALUES (?, ?)").run(text, analysis);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
