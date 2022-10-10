import { Preferences as Storage } from '@capacitor/preferences';
import key from './storageKey.json'
import { trigger } from "./Events";

export const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log(prefersDark)

get_user_theme_preference()
let darkmodeEnable
function dark_enable(value){
  if (value == "dark"){
    darkmodeEnable = true
    document.body.classList.add('dark')
  } else if (value == "light") {
    darkmodeEnable = false
  } else if (prefersDark) {
    darkmodeEnable = prefersDark
    document.body.classList.add('dark')
  } else {
    darkmodeEnable = prefersDark
  }
  trigger("countdate_darkmode:toggle")
}
export function set_dark_mode_toggle_to(){
  return darkmodeEnable
}

async function get_user_theme_preference(){
  const { value } = await Storage.get({
    key: key.theme
  })
  console.log(value)
  dark_enable(value)
}