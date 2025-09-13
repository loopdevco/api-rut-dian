import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import searchRouter from "./src/routes/search.js";

const app = express();

// Config para ES Modules y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración CORS dinámica
const allowedOrigins = [
  "http://localhost:5500",          // local
  process.env.FRONTEND_URL          // producción
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}));

// Middleware para JSON
app.use(express.json());

// --- Logging de requests ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Ruta raíz para index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint de salud
app.get("/ping", (req, res) => {
  res.status(200).json({ success: true, message: "API is alive" });
});

// Rutas principales de API
app.use("/api", searchRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Error handler central
app.use((err, req, res, next) => {
  console.error("Error en servidor:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Servidor con puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
