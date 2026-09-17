# $haBuy Store – Web Front‑End

A simple, responsive e‑commerce front‑end built with plain HTML, CSS and JavaScript.  
It showcases a product catalog, cart, wishlist, checkout flow and a handful of informational pages (contact, terms, privacy, etc.). All pages are mobile‑first and include a hamburger navigation that works across phones, tablets and desktops.

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Demo](#demo)  
3. [Features](#features)  
4. [Tech Stack](#tech-stack)  
5. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Running the site locally](#running-the-site-locally)  
6. [Folder Structure](#folder-structure)  
7. [Scripts & Commands](#scripts--commands)  
8. [Testing](#testing)  
9. [Contributing](#contributing)  
10. [License](#license)  

## Project Overview
The repository contains the static front‑end of an online shop.  
It does **not** include a back‑end or database – the product data is hard‑coded for demo purposes. The focus is on:

* Clean, semantic HTML5 markup
* A modular CSS architecture (`css/styles.css`) with a large responsive‑design block
* Vanilla JavaScript modules (`js/*.js`) for cart management, wishlist handling, checkout validation and a shared mobile‑menu initializer (`js/common.js`)
* Mobile‑first responsive design that adapts at the following breakpoints:
  * ≤ 1340 px
  * ≤ 1024 px
  * ≤ 868 px (hamburger menu appears)
  * ≤ 640 px
  * ≤ 400 px

## Demo
Open any HTML file (e.g., `index.html`) in a browser after following the installation steps.  
The site works locally without a server; you can also host the `d:/Code/Shop` folder on any static‑file web server (GitHub Pages, Netlify, Vercel, etc.).

## Features
| Feature            | Description |
|--------------------|-------------|
| **Responsive Layout** | Fluid grid for product listings, promotional sections, and footers. |
| **Mobile Navigation** | Hamburger button (`.mobile-menu-btn`) with smooth slide‑down overlay. |
| **Cart Management**   | Add, remove, and adjust quantity of items; cart state persisted in `localStorage`. |
| **Wishlist**           | Save items for later; badge updates in the header. |
| **Checkout Validation**| Basic client‑side checks (required fields, email format, phone pattern). |
| **Separate Pages**    | `product.html`, `checkout.html`, `contact.html`, `wishlist.html`, `terms.html`, `privacypolicy.html`, `404.html`, `mailsuccess.html`. |
| **Common Script**     | `js/common.js` automatically invokes `initMobileMenu()` on every page. |
| **No Build Step**     | Pure static assets – just open the HTML files. |
| **Easy Customisation**| All UI styles live in `css/styles.css`; modify the responsive block to change breakpoints. |

## Tech Stack
| Layer | Technology |
|-------|------------|
| **Markup** | HTML5 |
| **Styling** | CSS (custom stylesheet + media queries) |
| **Logic** | Vanilla JavaScript (ES6) |
| **Assets** | SVG & PNG in `img/` |
| **Package Manager** | npm (optional for lint/format tools) |

## Getting Started

### Prerequisites
* **Node.js** (≥ 14) – only needed if you want to run linting/formatting scripts.  
* A modern browser (Chrome, Edge, Firefox, Safari) for testing.

### Installation
```bash
# Clone the repository (replace <repo-url> with the actual URL)
git clone <repo-url> d:/Code/Shop
cd d:/Code/Shop

# Optional: install dev dependencies (eslint, prettier, etc.)
npm install
```

### Running the site locally
Because the site is static you can simply open any HTML file:
```bash
# Open the index page in the default browser (Windows)
start index.html
```
If you prefer a local HTTP server (helps with `fetch` or future module imports):
```bash
# Using the built‑in npm http‑server package
npx http-server . -p 8080
# Then browse to http://localhost:8080
```

## Folder Structure
```
/d:/Code/Shop
│
├─ css/
│   └─ styles.css          # Global stylesheet (+ responsive block)
│
├─ img/
│   └─ …                   # Logo, icons, product images, etc.
│
├─ js/
│   ├─ cart.js
│   ├─ checkout.js
│   ├─ product.js
│   ├─ wishlist.js
│   ├─ common.js
│   └─ remove_comments.js  # utility script (generated, can be removed)
│
├─ *.html                  # HTML pages (index, product, checkout, …)
│
└─ README.md               # ← this file
```

## Scripts & Commands
| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint on the JavaScript files. |
| `npm run format` | Run Prettier to auto‑format the code. |
| `npm start` | Alias for `npx http-server . -p 8080`. |
| `node remove_comments.js` | **(Generated)** Removes all comments from the codebase – keep only for one‑off cleanup. |

## Testing
The front‑end currently has **no automated tests**, but you can manually verify critical functionality:

1. **Cart** – Add items, change quantities, remove items, and refresh the page (state should persist).  
2. **Wishlist** – Add/remove items; badge count updates.  
3. **Responsive breakpoints** – Resize the browser to 1024 px, 768 px, 600 px, 480 px, and 320 px. The hamburger menu should appear at ≤ 868 px and navigation should toggle correctly.  
4. **Checkout form** – Submit with missing/invalid fields; verify alerts appear.  

If you later add a testing framework (e.g., Jest + jsdom or Cypress), place the test scripts under a `tests/` folder.

## Contributing
Contributions are welcome! Follow these steps:

1. Fork the repository.  
2. Create a new branch for your feature or bug‑fix (`git checkout -b feature/awesome-feature`).  
3. Make your changes.  
4. Run the linter/formatter (`npm run lint && npm run format`).  
5. Commit with a clear message and push (`git push origin feature/awesome-feature`).  
6. Open a Pull Request describing the changes.

Please keep the codebase **comment‑free** unless a comment provides essential context (e.g., a TODO for a future enhancement). The project aims to stay clean and easy to read.

## License
This project is released under the **MIT License** – you are free to use, modify, and distribute it, provided you retain the license notice.
