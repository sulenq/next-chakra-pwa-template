const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { ROUTE_PATHS } = require("../constants/routePaths.js");

// load .env biar process.env keisi
dotenv.config();

// ambil dari .env
const baseUrl = process.env.VITE_BASE_URL;

// Cek apakah path dinamis (mengandung ":")
function isDynamicPath(p) {
  return typeof p === "string" && p.includes(":");
}

// Gabungkan semua path statis (filter dinamis & undefined/null)
const staticPaths = ROUTE_PATHS.filter(
  (p) => typeof p === "string" && !isDynamicPath(p)
);

function generateSitemap() {
  const xmlEntries = staticPaths
    .map((p) => `<url><loc>${baseUrl}${p}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  const outputPath = path.resolve(__dirname, "../../public/sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf8");
  console.log("✅ Sitemap generated!");
}

generateSitemap();
