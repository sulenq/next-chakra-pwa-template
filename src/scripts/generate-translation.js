const fs = require("fs");
const path = require("path");
const { LANGUAGES } = require("../locales/_languages.js");

// Absolute path to _master.js
const MASTER_PATH = path.resolve("src/locales/_master.js");

// Load _master.js as CommonJS
const MASTER = require(MASTER_PATH);

if (!Object.keys(MASTER).length) {
  console.error("❌ No objects found in _master.js");
  process.exit(1);
}

const languages = LANGUAGES.map(({ key }) => key);

/**
 * Recursively extract translations for a given language.
 * Works for infinite nested objects.
 */
function extractTranslations(obj, lang) {
  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }

  // If this object has all language keys, return the value for current lang
  if (lang in obj) {
    return obj[lang];
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const extracted = extractTranslations(value, lang);
    if (extracted !== undefined) {
      result[key] = extracted;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Recursively validate that each "leaf" has all languages defined.
 * Will traverse infinite nested objects.
 */
function validateTranslations(obj, languages, pathArr = []) {
  if (typeof obj !== "object" || obj === null) return [];

  const keys = Object.keys(obj);
  const errors = [];

  const hasAllLangs = languages.every((lang) => keys.includes(lang));
  if (hasAllLangs) {
    // ✅ Leaf object contains all languages
    return [];
  }

  const hasSomeLangs = languages.some((lang) => keys.includes(lang));
  if (hasSomeLangs && !hasAllLangs) {
    errors.push(
      `❌ Incomplete langs at ${
        pathArr.join(".") || "(root)"
      } → found [${keys.join(", ")}], expected all [${languages.join(", ")}]`
    );
  }

  // Recurse into children
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      errors.push(...validateTranslations(value, languages, [...pathArr, key]));
    }
  }

  return errors;
}

// Run validation first
const errors = validateTranslations(MASTER, languages);

if (errors.length > 0) {
  console.error("❌ Validation failed!");
  errors.forEach((e) => console.error(e));
  process.exit(1);
}

console.log("✅ All translations are valid!");

// Generate files for each language
languages.forEach((lang) => {
  const translations = extractTranslations(MASTER, lang) || {};

  const content = `const translations = ${JSON.stringify(
    translations,
    null,
    2
  )};\n\nexport default translations;\n`;

  fs.writeFileSync(path.join(path.dirname(MASTER_PATH), `${lang}.ts`), content);
  console.log(`✅ Generated ${lang}.ts`);
});

console.log("✅ All translations generated!");
