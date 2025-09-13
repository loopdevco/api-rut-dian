import express from "express";
import { calcularDV } from "../services/dvCalculator.js";
import { scrapeNombreONIT } from "../services/scraper.js";

const router = express.Router();

router.get("/search/:nit", async (req, res) => {
  const { nit } = req.params;

  try {
    // Validar que el NIT sea numérico
    if (!/^\d+$/.test(nit)) {
      return res.status(400).json({
        success: false,
        error: "El NIT debe contener solo números",
      });
    }

    // Calcular dígito de verificación
    const dv = calcularDV(nit);

    // Scraping
    const data = await scrapeNombreONIT(nit, dv);

    // Validar respuesta del scraper
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "No se encontró información para el NIT proporcionado",
      });
    }

    return res.json({
      success: true,
      nit,
      dv,
      data,
    });

  } catch (err) {
    console.error(`[ERROR][search/${nit}]:`, err.message);

    return res.status(500).json({
      success: false,
      error: "Error interno en el servidor",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;
