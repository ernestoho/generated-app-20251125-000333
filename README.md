# El Cucharón JR — Plato del Día

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ernestoho/generated-app-20251125-000333)

A mobile-first, single-page restaurant web application that displays the daily "Plato del Día" menu for El Cucharón JR (Monday to Saturday), allows customers to select from today's available dishes, choose included and optional guarniciones (side dishes), preview their order, and send it directly via WhatsApp. The app loads menu data from `menu.json`, detects the current weekday, and ensures a simple, intuitive experience optimized for mobile devices.

## Overview

This application is designed for quick and easy ordering at El Cucharón JR, a Dominican restaurant. It focuses on the daily special (Plato del Día) with default included guarniciones (Arroz Blanco, Habichuelas Rojas, Ensalada Verde) and options for additional sides. Orders are sent as pre-formatted messages to WhatsApp at +1 (809) 789-1080, including the selected dish, guarniciones, date, and restaurant name.

Key goals:
- Mobile-first design for on-the-go access.
- No frameworks or build tools required for core functionality.
- Static deployment-ready for Cloudflare Pages.
- Fallback handling for menu loading and error states.

## Features

- **Daily Menu Detection**: Automatically detects the current weekday (Mon–Sat) and displays only available Plato del Día options from `menu.json`.
- **Dish Selection**: Radio buttons for selecting one main dish from today's options, with prices displayed.
- **Guarniciones Selection**: Default included sides shown as non-removable chips; optional guarniciones via checkboxes.
- **Live Order Preview**: Real-time update of selected items, total preview, and order timestamp.
- **WhatsApp Integration**: Sticky green "Enviar pedido por WhatsApp" button that opens WhatsApp with a pre-filled order message (dish, guarniciones, date, restaurant details).
- **Error Handling**: Fallback to embedded JSON if `menu.json` fails to load; friendly messages for no selection or closed days (Sunday).
- **Mobile-Optimized UI**: Large tappable elements (≥44px), card-based layout, generous whitespace, and subtle interactions.
- **Accessibility**: Keyboard-navigable controls, high contrast, and ARIA labels.

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, ES2020 JavaScript (no frameworks).
- **Data**: Static JSON (`menu.json`) loaded via Fetch API.
- **Styling**: Plain CSS with mobile-first responsive design.
- **Utilities**: Native browser APIs (Date, URL, encodeURIComponent) for date formatting and WhatsApp URL generation.
- **Optional**: date-fns for advanced date handling (if needed beyond inline formatting).
- **Build/Deployment**: Vite for development preview (template only); direct static file deployment for production.
- **Deployment**: Cloudflare Pages for hosting static assets.

The project leverages a modern React/Vite template for development convenience, but the core app is implemented in vanilla JS to meet requirements. shadcn/ui and Tailwind CSS are available in the template for optional polish if extending beyond vanilla.

## Installation

1. **Prerequisites**:
   - Node.js (v18+) or Bun.
   - Git.

2. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd el-cucharón-jr
   ```

3. **Install Dependencies** (using Bun):
   ```
   bun install
   ```

   This installs all template dependencies (React, Tailwind, etc.) for development. Core app uses vanilla JS subset.

4. **Verify Setup**:
   - Ensure `menu.json` is in the project root (exact JSON from requirements).
   - Run `bun run dev` to start the local server.

## Usage

The app is a single-page application (`index.html`). Open `index.html` in a browser or serve via the dev server.

### Running the App
- **Development Server**:
  ```
  bun run dev
  ```
  Access at `http://localhost:3000`. The app detects the day, loads `menu.json`, and renders the menu.

- **Static Preview**:
  ```
  bun run preview
  ```
  Serves the built static files at `http://localhost:4173`.

### Key Interactions
1. **View Daily Menu**: On load, today's platos appear in the first card (e.g., Monday: "Cerdo Guisado Criollo", "Pollo Guisado Casero").
2. **Select Dish**: Choose one via radio button; price updates in preview.
3. **Customize Guarniciones**: Defaults are shown; toggle extras via checkboxes.
4. **Preview Order**: Live card shows selection and date (YYYY-MM-DD format).
5. **Send Order**: Tap the bottom WhatsApp button to open WhatsApp with encoded message:
   ```
   Hola, quiero pedir en El Cucharón JR:
   Plato: [Selected Dish] - RD$[Price]
   Guarniciones: Arroz Blanco, Habichuelas Rojas, Ensalada Verde, [Extras]
   Fecha: [YYYY-MM-DD]
   ```

If no dish selected, a shake animation and error message appear. Sunday shows a "Closed" notice.

### Files
- `index.html`: Main entry point.
- `style.css`: Mobile-first styles (card layout, green WhatsApp button).
- `script.js`: Logic for day detection, JSON fetch/fallback, state management, preview updates, and WhatsApp URL.
- `menu.json`: Menu data (exact structure required).

## Development

- **Editing the Core App**:
  - Modify `script.js` for logic (e.g., dailyMenus mapping).
  - Update `style.css` for UI tweaks (e.g., card shadows, transitions).
  - Test WhatsApp flow: Ensure phone `18097891080` and encoding work.

- **Template Features** (Optional for Extensions):
  - Use React Router for multi-page if needed (edit `src/main.tsx`).
  - shadcn/ui components: Import from `@/components/ui/*` (e.g., `<Button />`).
  - Tailwind: Extend in `tailwind.config.js`; classes in `src/index.css`.
  - State: Zustand stores for complex state (follow primitive selector rules).
  - Animations: Framer Motion for interactions.

- **Linting and TypeScript**:
  ```
  bun run lint
  ```
  Fix issues with ESLint. TypeScript is configured for the template; vanilla JS files are untyped.

- **Testing**:
  - Manual: Test on mobile (Chrome DevTools), different days (mock Date), WhatsApp on device.
  - Edge Cases: Network failure (fallback JSON), no selection, Sunday.

Avoid modifying forbidden files (e.g., `worker/index.ts`, config files) to prevent build breaks.

## Deployment

Deploy as static files to Cloudflare Pages for global CDN hosting.

1. **Build Static Assets**:
   ```
   bun run build
   ```
   Outputs to `dist/` (HTML, CSS, JS, JSON).

2. **Cloudflare Pages**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
   - Go to Pages > Create a project > Connect to Git (or Upload assets).
   - For Git: Push to repo; set build command `bun run build`, output dir `dist`.
   - For manual: Upload `dist/` contents.
   - Custom domain optional.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ernestoho/generated-app-20251125-000333)

3. **Verify Deployment**:
   - Access the live URL.
   - Test menu loading, selections, and WhatsApp link.
   - `menu.json` must be in the root for fetch to work.

For API extensions (e.g., dynamic menus), add routes in `worker/userRoutes.ts` and deploy via Wrangler:
```
bun run deploy
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Follow vanilla JS best practices: No external libs beyond natives; keep it lightweight.

## License

This project is open-source under the MIT License. See [LICENSE](LICENSE) for details (add if not present).

## Contact

For issues: Open a GitHub issue. Restaurant inquiries: +1 (809) 789-1080 via WhatsApp.

Built with ❤️ for El Cucharón JR.