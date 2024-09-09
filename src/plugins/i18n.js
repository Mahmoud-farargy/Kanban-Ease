import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  // gets all JSON files from the locales folder
  const locales = require.context(
    "../locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

const i18n = createI18n({
  legacy: false,
  fallbackLocale: "en",
  locale: "en",
  globalInjection: true,
  fallbackLng: "en",
  messages: loadLocaleMessages(),
  silentTranslationWarn: process.env.NODE_ENV === "production",
});
export default i18n;
