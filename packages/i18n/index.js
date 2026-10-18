/**
 * AegisPath Bilingual Internationalization Module
 * Platform-neutral, isomorphic translation helpers
 */
const en = require('./en.json');
const zh = require('./zh.json');

let currentLocale = 'en';

function setLocale(locale) {
  if (locale === 'zh' || locale === 'en') {
    currentLocale = locale;
  }
}

function getLocale() {
  return currentLocale;
}

function t(key, locale = currentLocale) {
  const dict = locale === 'zh' ? zh : en;
  return dict[key] || en[key] || key;
}

/**
 * Returns bilingual display: Primary language in full text, secondary in subtext
 */
function b(primaryKey, subKey, locale = currentLocale) {
  const pText = t(primaryKey, locale);
  const sText = subKey ? t(subKey, locale === 'zh' ? 'en' : 'zh') : '';
  if (!sText) return pText;
  return `${pText} <span class="text-bilingual-sub">${sText}</span>`;
}

module.exports = {
  en,
  zh,
  setLocale,
  getLocale,
  t,
  b
};
