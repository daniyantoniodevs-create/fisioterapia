# Álvaro Picazo Fisioterapia — Web + Portal del Paciente

Web profesional estática (HTML, CSS y JavaScript puro, sin dependencias) para la
clínica de fisioterapia de Álvaro Picazo, con un **Portal del Paciente** para el
seguimiento de rehabilitaciones (especialmente recuperación de **ligamento cruzado**).

## 🚀 Cómo verla

Es 100% estática: basta con abrir `index.html` en el navegador.
Para que todo funcione perfecto (vídeos, portal, etc.) se recomienda servirla con
un pequeño servidor local:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node
npx serve .
```

Luego abre `http://localhost:8000`.

## 🔐 Accesos del Portal

Pulsa **"Portal del paciente"** en el menú o ve a `portal.html`:

| Perfil          | Usuario   | Contraseña |
|-----------------|-----------|------------|
| 👤 Paciente     | `cliente` | `123465`   |
| 🩺 Fisioterapeuta | `fisio`   | `123456`   |

- **Paciente:** panel con su progreso, fases de recuperación, ejercicios en vídeo,
  registro de dolor/movilidad y chat con el fisio.
- **Fisioterapeuta (admin):** panel con pacientes, KPIs y **subida de vídeos**
  (YouTube, archivo local o enlace directo). Los vídeos publicados aparecen
  automáticamente en el portal del paciente.

## 📁 Estructura

```
.
├── index.html          # Web principal (landing)
├── portal.html         # Login del portal
├── paciente.html       # Panel del paciente
├── admin.html          # Panel del fisioterapeuta
├── robots.txt          # SEO
├── sitemap.xml         # SEO
├── css/
│   ├── style.css       # Estilos de la web
│   └── portal.css      # Estilos del portal
├── js/
│   ├── main.js         # Animaciones de la web
│   ├── portal-data.js  # Datos, login y almacenamiento (localStorage)
│   ├── portal-ui.js    # Utilidades de interfaz del portal
│   ├── login.js        # Lógica del login
│   ├── paciente.js     # Lógica del panel del paciente
│   └── admin.js        # Lógica del panel del fisioterapeuta
└── img/                # Logos, ilustraciones e iconos (SVG)
```

## ✨ Características

- Diseño moderno y responsive con animaciones (scroll reveal, contadores,
  parallax suave, microinteracciones).
- SEO: meta tags, Open Graph, datos estructurados Schema.org (`Physician`),
  `sitemap.xml` y `robots.txt`.
- Portal funcional con dos roles, gestión de vídeos y seguimiento de progreso.
- Sin frameworks ni dependencias: carga rápida y fácil de mantener.

## 📝 Notas para producción

- Los datos del portal se guardan en `localStorage` (demo). Para producción se
  conectaría una base de datos / backend real y autenticación segura.
- Los vídeos subidos como **archivo** se guardan en el navegador (demo). En
  producción se usaría almacenamiento en la nube (YouTube, Vimeo, S3...).
- Sustituye los datos de contacto/redes y la imagen real de Álvaro cuando estén
  disponibles (carpeta `img/`).

---
© Álvaro Picazo Fisioterapia · Albacete
