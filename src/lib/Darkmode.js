import { Preferences as Storage } from "@capacitor/preferences";
import key from "./storageKey.json";
import { trigger } from "./Events";

const matchMedia = window.matchMedia(
  "(prefers-color-scheme: dark)"
)
export const prefersDark = matchMedia.matches;
const preferDarkChange = () => {
  console.log("Prefer dark change", matchMedia.matches)
  get_user_theme_preference()
}

matchMedia.addEventListener("change", () => preferDarkChange());

get_user_theme_preference();
// trigger("countdate_darkmode:toggle");
let darkmodeEnable;
function dark_enable(value) {
  if (value === "dark") {
    darkmodeEnable = true;
    document.body.classList.add("dark");
  } else if (value === "light") {
    darkmodeEnable = false;
    document.body.classList.remove("dark")
  } else if (matchMedia.matches) {
    darkmodeEnable = matchMedia.matches;
    document.body.classList.add("dark");
  } else {
    darkmodeEnable = matchMedia.matches;
    document.body.classList.remove("dark")
  }
}
export function set_dark_mode_toggle_to() {
  get_user_theme_preference();
  return darkmodeEnable;
}

async function get_user_theme_preference() {
  const { value } = await Storage.get({
    key: key.theme,
  });
  console.log(value);
  dark_enable(value);
}
