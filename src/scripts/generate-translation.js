const fs = require("fs");
const path = require("path");
const { LANGUAGES } = require("../locales/_languages.js");

// Path absolute ke _master.js
const MASTER_PATH = path.resolve("src/locales/_master.js");

// Load _master.js sebagai CJS
const MASTER = require(MASTER_PATH);

if (!Object.keys(MASTER).length) {
  console.error("❌ No objects found in _master.js");
  process.exit(1);
}

const languages = LANGUAGES.map(({ key }) => key);

languages.forEach((lang) => {
  const translations = {};

  Object.entries(MASTER).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      translations[key] = {};
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (
          typeof subValue === "object" &&
          subValue !== null &&
          lang in subValue
        ) {
          translations[key][subKey] = subValue[lang];
        }
      });

      if (Object.keys(translations[key]).length === 0 && lang in value) {
        translations[key] = value[lang];
      }
    }
  });

  const content = `const translations = ${JSON.stringify(
    translations,
    null,
    2
  )};\n\nexport default translations;\n`;

  fs.writeFileSync(path.join(path.dirname(MASTER_PATH), `${lang}.ts`), content);
  console.log(`✅ Generated ${lang}.ts`);
});

console.log("✅ All translations generated!");
