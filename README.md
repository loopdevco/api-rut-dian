# 🌐 ConsulRut — Verificador Automatizado de NITs de la DIAN

> *Una API y scraper que consulta directamente la página oficial de la DIAN cuando el sistema RUT está caído.*

![LoopDev](./public/logoloop.png)

*Desarrollado por [LoopDev - José Fermín Espinosa Rodríguez](https://github.com/loopdevco)*

---

## 💡 ¿Qué es ConsulRut?

**ConsulRut** es una herramienta de software que escrapea la página pública de consulta de NITs de la **DIAN** — `muisca.dian.gov.co` — para extraer información de contribuyentes cuando el portal oficial del RUT no responde.

No depende de APIs oficiales y funciona incluso cuando la DIAN tiene caídas técnicas o limitaciones de acceso.

Ideal para:
- Desarrolladores que integran verificación de NIT en sistemas internos.
- Empresas que realizan auditorías o validación de terceros.
- Aplicaciones internas que requieren confiabilidad 24/7.

---

## ✅ Funcionalidades

| Característica | Descripción |
|----------------|-------------|
| 🔍 Scraping Inteligente | Extrae datos reales desde la página oficial de la DIAN, con manejo dinámico de elementos. |
| ⚙️ Cálculo Automático de DV | Implementa el algoritmo oficial de la DIAN para generar el dígito de verificación correcto. |
| 🧠 Cache con TTL | Almacena resultados por 1 hora para reducir carga y evitar bloqueos por consultas repetidas. |
| 🌐 API RESTful | Endpoint: `GET /api/search/:nit` — devuelve JSON con tipo, razón social o nombres completos. |
| 🛡️ Optimizado para rendimiento | Bloquea imágenes, hojas de estilo y fuentes innecesarias durante el scraping. |
| 🔄 Manejo de Errores | Detecta popups, timeouts y respuestas vacías con mensajes claros. |

---

## 📦 Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/loopdevco/api-rut-dian.git
cd consulrut
````

### 2. Instalar dependencias

```bash
npm install
```

> Requiere Node.js 18+ y npm.

### 3. Iniciar el servidor

```bash
npm start
```

El servidor se inicia en: 👉 [http://localhost:3000](http://localhost:3000)

### 4. Probar la API

```bash
curl "http://localhost:3000/api/search/901012345"
```

✅ Respuesta exitosa (Persona Jurídica):

```json
{
  "success": true,
  "nit": "901012345",
  "dv": "7",
  "data": {
    "tipo": "persona_juridica",
    "razonSocial": "EMPRESA DE SERVICIOS S.A.",
    "primerNombre": null,
    "segundoNombre": null,
    "primerApellido": null,
    "segundoApellido": null
  }
}
```

✅ Respuesta exitosa (Persona Natural):

```json
{
  "success": true,
  "nit": "1020304050",
  "dv": "3",
  "data": {
    "tipo": "persona_natural",
    "razonSocial": null,
    "primerNombre": "JUAN",
    "segundoNombre": "CARLOS",
    "primerApellido": "PEREZ",
    "segundoApellido": "RODRIGUEZ"
  }
}
```

❌ Si no se encuentra:

```json
{
  "success": false,
  "error": "No se encontró información para el NIT proporcionado"
}
```

---

## 🌐 Versión en Producción (En Línea)

🔹 Live Demo: [https://consulrut.onrender.com/](https://consulrut.onrender.com/)
(Disponible públicamente — prueba sin instalar nada)

⚠️ Nota: Este servicio público está alojado en un entorno gratuito. Para uso empresarial o masivo, despliega tu propia instancia.

---

## 🖼️ Captura de Interfaz

![ConsulRut Interface](/public/image.png)

> Interfaz web simple para ingresar NIT y ver resultados en tiempo real. Puedes reemplazar este placeholder por una captura real de tu aplicación.

---

## 🔧 Tecnologías Usadas

**Backend:** Node.js + Express.js
**Scraping:** Puppeteer (Headless Chrome)
**Cálculo DV:** Algoritmo oficial DIAN (Vpri)
**Cache:** Map en memoria (TTL 1h)
**Frontend:** HTML/CSS/JS (opcional)
**Hosting:** Vercel / Railway / Render / Local
**Gestión de Código:** Git + GitHub

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT — libre para uso personal, comercial, educativo o empresarial.
Incluye crédito al autor original.

© 2025 LoopDev - José Fermín Espinosa Rodríguez
Una solución de software desarrollada por LoopDev.

---

## 💬 Cómo Contribuir

1. Haz un fork del repositorio.
2. Crea tu rama (`feat/add-docker`).
3. Realiza tus cambios.
4. Envía un Pull Request.

Ideas de contribución:

* Soporte para cédulas de ciudadanía
* Exportación CSV/Excel
* Dockerfile para despliegue fácil
* UI moderna con React/Vue

---

## 🤝 Soporte y Contacto

¿Problemas? ¿Sugerencias?
📩 Contáctame: [josefermin.esp@gmail.com](mailto:loopde.co@gmail.com)
🔗 GitHub Profile: [LoopDev](https://github.com/loopdev)

```
```
