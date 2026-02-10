# 📄 Documentación Técnica: SmartChoice - Asistente de IA para Laptops

**Versión:** 1.0.0  
**Fecha:** 10 de Febrero, 2026  
**Autor:** Winan03 (Desarrollador Full-Stack & Automation Specialist)

---

## 1. 🚀 Resumen Ejecutivo

**SmartChoice** es una aplicación web interactiva diseñada para simplificar el proceso de compra de laptops mediante un asistente inteligente. Utiliza un motor de recomendación híbrido que combina lógica de negocio automatizada (n8n) y una interfaz de usuario moderna y altamente interactiva (React).

El sistema permite a los usuarios recibir recomendaciones personalizadas basadas en su perfil (Gaming, Ingeniería, Oficina) en menos de 2 minutos, con datos actualizados en tiempo real desde una hoja de cálculo de Google Sheets.

---

## 2. 🛠️ Stack Tecnológico

### Frontend (Cliente)
*   **Framework:** React 18
*   **Lenguaje:** TypeScript 5.xx
*   **Build Tool:** Vite (para desarrollo rápido y optimizado)
*   **Estilos:** CSS3 Nativo (Variables CSS, Flexbox, Grid) + TailwindCSS (utilitario)
    *   *Tema:* Diseño Fluorescente "Cyberpunk/Neon" con soporte Dark/Light Mode.
*   **Animaciones:** Framer Motion (transiciones suaves, efectos 3D).
*   **Iconos:** Lucide React.
*   **Gestión de Estado:** React Context API (`ProductContext`, `ThemeContext`).

### Backend & Integración (Servidor & Lógica)
*   **Orquestación de Flujos:** n8n (Inteligencia de Negocio y Lógica de Recomendación).
*   **Base de Datos (CMS Headless):** Google Sheets (vía Public CSV Export).
*   **Hosting Frontend:** Vercel (CI/CD automático desde GitHub).
*   **Hosting n8n:** Render (Web Service).

---

## 3. 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura **Serverless / Microservicios** donde el frontend está desacoplado de la lógica de negocio.

### Flujo de Datos

1.  **Ingesta de Datos:**
    *   El administrador actualiza el inventario en **Google Sheets**.
    *   La hoja se publica en la web como **CSV**.
    *   El frontend consume este CSV directamente para mostrar el catálogo y el admin panel.

2.  **Motor de Recomendación:**
    *   El usuario interactúa con el **ChatModal**.
    *   Se envía un payload JSON al **Webhook de n8n** con las preferencias (e.g., `{ uso: "Gaming", presupuesto: 1500 }`).
    *   **n8n** procesa la lógica: filtra productos del Google Sheet, aplica algoritmos de puntuación y selecciona la mejor opción.
    *   **n8n** devuelve la recomendación estructurada al frontend.

---

## 4. 🔌 API & Rutas

### Webhook de Recomendación (n8n)
*   **Endpoint:** `POST` (Definido en variables de entorno)
*   **Propósito:** Recibir preferencias del usuario y devolver producto recomendado.
*   **Payload Request:**
    ```json
    {
      "uso": "Gaming",
      "prioridad": "Potencia",
      "presupuesto": 1500
    }
    ```
*   **Response:** JSON con detalles del producto (Nombre, Specs, Precio, Imagen).

### Google Sheets CSV
*   **Endpoint:** `GET` (URL pública de Google Cloud)
*   **Propósito:** Obtener la base de datos completa de productos en tiempo real.
*   **Formato:** CSV (Comma Separated Values).

---

## 5. 🔐 Configuración de Entorno (.env)

El proyecto utiliza variables de entorno para la seguridad y configuración. **NUNCA** se suben al repositorio.

| Variable | Descripción |
| :--- | :--- |
| `VITE_N8N_WEBHOOK_URL` | URL del webhook de producción en Render. |
| `VITE_ADMIN_PASSWORD` | Contraseña para acceder al Panel de Administración. |
| `VITE_GOOGLE_SHEET_CSV_URL` | Enlace público al CSV de inventario. |
| `VITE_GOOGLE_SHEET_ID` | ID de la hoja para generar enlaces de edición. |

---

## 6. 🛡️ Seguridad y Limitaciones Actuales

### Seguridad Implementada
*   **Variables de Entorno:** Credenciales fuera del código fuente.
*   **Git Security:** Historial limpio de secretos mediante `git commit --amend`.
*   **Rewrites:** Configuración de `vercel.json` para manejo seguro de rutas SPA.

### Limitaciones Conocidas
1.  **Google Sheets como DB:** Adecuado para inventarios pequeños (<1000 items), pero tiene latencia y límites de lectura pública.
2.  **Autenticación Admin:** Actualmente es una validación simple en frontend. No es seguro para datos críticos de usuario, solo para acceso al panel de visualización.
3.  **Cold Starts (n8n):** Al estar en Render (Free Tier), la primera petición puede tardar unos segundos en "despertar" el servicio.

---

## 7. 🚀 Hoja de Ruta (Futuras Mejoras)

Para llevar el proyecto al siguiente nivel (V2.0), se sugieren estas mejoras:

1.  **Migración a Base de Datos Real:** Integrar **Supabase (PostgreSQL)** o **Firebase** para reemplazar Google Sheets. Esto permitirá búsquedas más rápidas y escalabilidad.
2.  **Autenticación Robusta:** Implementar **Auth0** o **Clerk** para el login de administradores.
3.  **Backend API Propio:** Migrar la lógica de n8n a una API en **Node.js/NestJS** o **Python (FastAPI)** para tener control total sobre la latencia y la lógica de IA.
4.  **IA Generativa:** Conectar con **OpenAI API** para que el asistente no solo recomiende, sino que responda preguntas técnicas específicas sobre los productos ("¿Sirve esta laptop para AutoCAD?").

---

**© 2026 SmartChoice Development Team**
*Documentación generada automáticamente para propósitos técnicos y de entrega.*
