import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector';
import { Device } from '@capacitor/device';

import en from './data/en.json'
import tw from './data/zh-TW.json'
import cn from './data/zh-CN.json'

let device_language_code = ""
const getDeviceLanguageCode = async () => {
  device_language_code = await Device.getLanguageCode()
  if (device_language_code == "zh") device_language_code = "zh-TW"
}
getDeviceLanguageCode()

const resources = {
  'en-US': {
    translation: en,
  },
  'zh-TW': {
    translation: tw,
  },
  'zh-CN': {
    translation: cn,
  }
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  lng: device_language_code,             //預設語言
  fallbackLng: 'en-US',     //如果當前切換的語言沒有對應的翻譯則使用這個語言，
  interpolation: {
    escapeValue: false,
  },
})

export default i18n