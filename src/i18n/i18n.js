import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Device } from "@capacitor/device";

// Languages codes: https://developers.google.com/admin-sdk/directory/v1/languages

import de from "./data/de.json";
import en from "./data/en.json";
import tw from "./data/zh-TW.json";
import th from "./data/th.json";
import cn from "./data/zh-CN.json";

let device_language_code = "";
const getDeviceLanguageCode = async () => {
  device_language_code = await Device.getLanguageCode();
  if (device_language_code === "zh") device_language_code = "zh-TW";
};
getDeviceLanguageCode();

const resources = {
  "en": {
    translation: en,
  },
  "zh-TW": {
    translation: tw,
  },
  "zh-CN": {
    translation: cn,
  },
  "th": {
    translation: th,
  },
  "de": {
    translation: de,
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: device_language_code, // Default lan
    fallbackLng: "en", // Fall back
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;