import { Storage } from "@capacitor/storage";
import key from './storageKey.json'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log(prefersDark)

get_user_theme_preference()
let darkmodeEnable
function dark_enable(value){
  if (value == "dark" || prefersDark){
    darkmodeEnable = true
    document.body.classList.add('dark')
  } else {
    darkmodeEnable = false
  }
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