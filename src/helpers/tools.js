import { localStorageBasicData } from "./";
import { required, minLength, maxLength, numeric } from "@vuelidate/validators";
import { helpers } from "@vuelidate/validators";
import { useGlobalStore } from "@/store/Modules/global";
import i18n from "@/plugins/i18n";
const {
  global: { t },
} = i18n;

const lowerString = (txt) =>
  typeof txt === "string"
    ? txt.toLowerCase()
    : typeof txt === "number"
    ? txt
    : "";

const generateRandomId = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
};

const VALIDATIONS = {
  requiredInput: {
    required: helpers.withMessage(() => t("validation_msg.required"), required),
  },
  name: {
    required: helpers.withMessage(() => t("validation_msg.required"), required),
    minLength: helpers.withMessage(
      ($params) => `${t("validation_msg.min")}${$params.$params.min}`,
      minLength(2)
    ),
  },
  description: {
    required: helpers.withMessage(() => t("validation_msg.required"), required),
    minLength: helpers.withMessage(
      ($params) => `${t("validation_msg.min")}${$params.$params.min}`,
      minLength(10)
    ),
    maxLength: helpers.withMessage(
      ($params) => `${t("validation_msg.max")}${$params.$params.max}`,
      maxLength(300)
    ),
  },
  order: {
    numeric: helpers.withMessage(() => t("validation_msg.number"), numeric),
    minLength: helpers.withMessage(
      () => `${t("validation_msg.phone")}`,
      minLength(1)
    ),
  },
};

const useLocalStorage = ({ type, key, value, callBack }) => {
  const localStorageAppKey = "namaa";
  const global = useGlobalStore();
  switch (lowerString(type)) {
    case "set": {
      if (!key) {
        return;
      }
      const storageCopy = useLocalStorage({ type: "get" });
      const newLocStorageArr = { ...storageCopy, [key]: value };
      Object.keys(localStorageBasicData || {}).forEach((key) => {
        if (!Object.hasOwn(newLocStorageArr, key)) {
          newLocStorageArr[key] = localStorageBasicData[key];
        }
      });
      localStorage.setItem(
        localStorageAppKey,
        JSON.stringify(newLocStorageArr)
      );
      window.dispatchEvent(new Event("storage")); // triggers the localstorage event listener(s)
      // updates data in the store
      global?.updateLocalStorageCopy(newLocStorageArr);
      return;
    }
    case "get": {
      const localCopy = JSON.parse(localStorage.getItem(localStorageAppKey));
      let getLocalStorageData = "";
      if (key) {
        getLocalStorageData = Object.hasOwn(localCopy, key)
          ? localCopy[key]
          : null;
      } else {
        getLocalStorageData = localCopy;
      }
      return getLocalStorageData;
    }
    case "delete": {
      let loc = JSON.parse(localStorage.getItem(localStorageAppKey));
      if (loc && key in loc) {
        delete loc[key];
        localStorage.setItem(localStorageAppKey, JSON.stringify({ ...loc }));
      }
      break;
    }
    case "reset": {
      localStorage.setItem(
        localStorageAppKey,
        JSON.stringify(localStorageBasicData)
      );
      window.dispatchEvent(new Event("storage"));
      // updates data in the store
      global?.updateLocalStorageCopy(localStorageBasicData);
      return;
    }
    case "listener": {
      if (typeof callBack !== "function") {
        return;
      }
      window?.addEventListener("storage", () => {
        return callBack(useLocalStorage({ type: "get" }));
      });
      break;
    }
    case "clear": {
      localStorage.setItem(localStorageAppKey, JSON.stringify({}));
      window.dispatchEvent(new Event("storage"));
      // updates data in the store
      global?.updateLocalStorageCopy({});
      return;
    }
    default:
      () => {};
  }
};

export { useLocalStorage, lowerString, VALIDATIONS, generateRandomId };
