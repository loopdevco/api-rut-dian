import puppeteer from "puppeteer";

let browser;
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
        "--single-process"
      ]
    });
  }
  return browser;
}

async function newPage() {
  const browser = await initBrowser();
  const page = await browser.newPage();

  // Bloquear recursos innecesarios
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  return page;
}

export async function scrapeNombreONIT(nit, dv) {
  // Revisa cache
  const cached = cache.get(nit);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const browser = await initBrowser();
  const page = await browser.newPage();

  try {
    // 1. Ir a la página
    await page.goto(
      "https://muisca.dian.gov.co/WebGestionmasiva/DefSelPublicacionesExterna.faces",
      { waitUntil: "domcontentloaded", timeout: 10000 }
    );

    // 2. Llenar formulario
    await page.type(
      "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:numNit",
      nit.toString()
    );
    await page.type(
      "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:dv",
      dv.toString()
    );

    // 3. Click en botón buscar
    await page.click(
      "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:btnBuscar"
    );

    // 3.1 Intentar cerrar popup si aparece
    try {
      await page.waitForSelector('img[name="ImagenCerrar"]', { timeout: 5000 });
      await page.click('img[name="ImagenCerrar"]');
      console.log("Popup cerrado con éxito ✅");
    } catch {
      console.log("No apareció el popup, seguimos...");
    } 

    // 4. Esperar a que carguen los resultados
    await page.waitForSelector(
      '#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:razonSocial, ' +
        '#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:primerApellido',
      { timeout: 10000 }
    );

    // 5. Extraer datos
    const result = await page.evaluate(() => {
      const razonSocialEl = document.querySelector(
        "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:razonSocial"
      );

      if (razonSocialEl) {
        return {
          tipo: "persona_juridica",
          razonSocial: razonSocialEl.innerText.trim(),
          primerNombre: null,
          segundoNombre: null,
          primerApellido: null,
          segundoApellido: null,
        };
      } else {
        const primerNombre =
          document.querySelector(
            "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:primerApellido"
          )?.innerText.trim() || "";

        const segundoNombre =
          document.querySelector(
            "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:segundoApellido"
          )?.innerText.trim() || "";

        const primerApellido =
          document.querySelector(
            "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:primerNombre"
          )?.innerText.trim() || "";

        const segundoApellido =
          document.querySelector(
            "#vistaSelPublicacionesExterna\\:formSelPublicacionesExterna\\:otrosNombres"
          )?.innerText.trim() || "";

        return {
          tipo: "persona_natural",
          razonSocial: null,
          primerNombre,
          segundoNombre,
          primerApellido,
          segundoApellido,
        };
      }
    });

    // Guardar en cache
    cache.set(nit, { data: result, timestamp: Date.now() });

    return result;
  } finally {
    await page.close();
  }
}
