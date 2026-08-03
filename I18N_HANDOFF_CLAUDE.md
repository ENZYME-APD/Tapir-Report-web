# Handoff for i18n Implementation (For French Colleague & Claude)

Hello! Welcome to the Tapir Dashboard project. You are tasked with implementing multi-language (i18n) support for the front page (specifically English and French). 

As you start refactoring `src/App.jsx` and installing your i18n libraries (like `react-i18next`), please carefully respect the following architectural constraints so that the existing data automations and UI features do not break.

## 🚨 1. The Automated Data Pipeline (CRITICAL)
This website is completely self-maintaining. Every Sunday, a GitHub Action runs background scripts to scrape the Discord and GitHub communities, outputting the results into:
- `src/data/discord_data.json`
- `src/data/github_data.json`
- `src/data/commits_data.json`

**Rules to prevent breaking the pipeline:**
- **DO NOT** modify, rename, or move anything inside the `.github/workflows/` folder.
- **DO NOT** modify, rename, or move anything inside the `scripts/` folder.
- **DO NOT** delete or rename the `src/data/*.json` files. 
- Ensure that `src/App.jsx` still correctly imports these three JSON files at the top of the file.

## 📈 2. Dynamic Charts & Analytics
The top of `src/App.jsx` contains a complex data-processing algorithm (using `processGrowthData`) that merges the 3 JSON files into a unified timeline for the `Recharts` graph. 
- **Rule:** Do not break the `processGrowthData` function. It relies on the exact JSON structures currently provided. 
- You can translate the *labels* of the Recharts tooltip and legend, but be careful not to alter the underlying data keys (`commits`, `discord`, `github`).

## ✍️ 3. Handling Hardcoded Content
Currently, `src/App.jsx` contains several hardcoded arrays:
- `const useCases = [...]`
- `const roadmap = [...]`

**i18n Strategy:**
- Move all string values from `useCases`, `roadmap`, and standard HTML headers/paragraphs into your i18n JSON files (e.g., `public/locales/en/translation.json` and `public/locales/fr/translation.json`).
- Replace the hardcoded strings in `App.jsx` with the `t('key')` function.
- Be careful with the `Architecture & History` section, as it relies on CSS classes (`timeline-item`, `arch-layer`) to render the custom diagrams correctly. Ensure the CSS classes remain fully intact on the HTML tags when translating the text inside them.

## 🎨 4. CSS and Styling
The project uses vanilla CSS (`src/index.css`) rather than Tailwind. It features specific glassmorphism effects for the sticky header and CSS grids for the layout.
- **Rule:** Do not convert the project to Tailwind. If you need new styles for a language switcher (e.g., a dropdown in the navbar), add them directly to `src/index.css`.

Bon courage pour l'intégration de la traduction ! 🥖🍷
