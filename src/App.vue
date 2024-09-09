<template>
  <!-- header place -->
  <!-- main place -->
  <main class="bg-light-background dark:bg-dark-background min-h-[100vh]">
    <router-view />
  </main>
  <!-- footer place -->
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useLocalStorage, lowerString } from "@/helpers";
import { useGlobalStore } from "@/store/Modules/global";
import { useI18n } from 'vue-i18n';

// handle language change
const { locale } = useI18n();

const changeDirectionLayout = (name, lang) => {
  const body = document.querySelector("body");
  body.setAttribute("direction", name);
  let html = document.querySelector("html");
  html.setAttribute("dir", name);
  html.setAttribute("lang", lang);
  html.style.fontFamily =
    lang === "ar"
      ? `Almarai', Helvetica, sans-serif`
      : `'Roboto', Helvetica, sans-serif`;
  html.className = name;
};

const changeLanguage = (lang) => {
  lang = lowerString(lang);
  const locales = require.context(
    "@/locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const availableLanguages =
    locales?.keys()?.length > 0
      ? locales.keys().map((key) => {
          const matched = key.match(/([A-Za-z0-9-_]+)\./i);
          return matched && matched.length > 1 ? matched[1] : "";
        })
      : [];
  if (!lang || !availableLanguages.some((lng) => lowerString(lng) === lang)) {
    return;
  }

  locale.value = lang;
  
  if (lang === "ar") {
    changeDirectionLayout("rtl", lang);
  } else {
    changeDirectionLayout("ltr", lang);
  }
};
// xxxx handle language change xxxx

// handle the theme change
const changeTheme = (isDarkMode) => {
  const htmlElement = document.documentElement;
  if (isDarkMode) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
};

// xxxx handle the theme change xxxx

onBeforeMount(() => {
  // update the Pinia state with the localStorage data
  const globalStore = useGlobalStore();
  const localStorageData = useLocalStorage({ type: "get" });
  if (!localStorageData) {
    useLocalStorage({ type: "reset" });
  } else {
    globalStore.updateLocalStorageCopy(localStorageData);
  }
  // on init
  let { language = "en", isDarkMode = false } = localStorageData || {};
  changeLanguage(language);
  changeTheme(isDarkMode);

  // on localStorage change - once a language or theme update occurs in the localStorage, make an action
  useLocalStorage({
    type: "listener",
    callBack: (data) => {
      let { language = "en", isDarkMode } = data || {};
      language = lowerString(language);
      changeLanguage(language);
      changeTheme(isDarkMode);
    },
  });
});
</script>
