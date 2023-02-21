import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  isPlatform,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonToggle,
  IonIcon,
  IonRouterLink
} from "@ionic/react";
import LanguageSelectAction from "../components/LanguageSelectAction";
import { code, contrast, information, logoAndroid, notifications } from 'ionicons/icons'
import { useTranslation } from "react-i18next";
import { Schedule } from "../lib/LocalNotification";
import { set_dark_mode_toggle_to } from '../lib/Darkmode'
import { Preferences as Storage } from "@capacitor/preferences";
import key from '../lib/storageKey.json'
import { useEffect, useState } from "react";
import { on, trigger } from "../lib/Events";
import { capitalize } from "../lib/Capitalize";
import show from "../lib/Toast";
import AccentColorSelectAction from "../components/AccentColorSelectAction";

const Settings: React.FC<{accent:string}> = ({accent}) => {
  const { t, i18n } = useTranslation()
  const [darkChecked, setDarkChecked] = useState<boolean>()
  const [devChecked, setDevChecked] = useState<boolean>(false)

  const getDevMode = async () => {
    const { value } = await Storage.get({ key: key.dev });
    if (value == "true") setDevChecked(true)
  }
  getDevMode()
  const toggleDevModeHandler = async () => {
    console.log("toggle dev mode")
    let tovalue = !devChecked
    await Storage.set({
      key: key.dev,
      value: tovalue.toString(),
    });
    setDevChecked(tovalue)
    console.log(tovalue)
    trigger("countdate_dev:change")
  }
  const testLocalNotification = async () => {
    console.log("clicked")
    await Schedule({
      title: "Countdate",
      body: "Local Notification Test",
      id: 1
    })
  }
  const toggleDarkModeHandler = async () => {
    document.body.classList.toggle('dark')
    setDarkChecked(!darkChecked)
    console.log(set_dark_mode_toggle_to())
    if (darkChecked){
      await Storage.set({
        key: key.theme,
        value: "light"
      })
    } else {
      await Storage.set({
        key: key.theme,
        value: "dark"
      })
    }
    
  }
  const darkmodeToSystem = async () => {
    setDarkChecked(window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
    await Storage.set({
      key: key.theme,
      value: ""
    })
  }
  
  on("countdate_darkmode:toggle", async () => {
    setDarkChecked(set_dark_mode_toggle_to())
  })
  useEffect(() => {
    setDarkChecked(set_dark_mode_toggle_to())
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" color={accent} />
          </IonButtons>
          <IonTitle>{capitalize(t("settings"))}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" style={{marginTop:"10px"}}>
          <IonToolbar>
            <IonTitle size="large">{capitalize(t("settings"))}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonListHeader lines="none" color={accent}>
            <IonLabel>{capitalize(t("general"))}</IonLabel>
          </IonListHeader>
          <IonItem>
            <LanguageSelectAction />
          </IonItem>
          <IonItem>
            <AccentColorSelectAction />
          </IonItem>
          <IonItem>
            <IonLabel onClick={toggleDevModeHandler}><IonIcon icon={code} /> {capitalize(t("toggle"))+t("between_words")+t("dev_mode")}</IonLabel>
            <IonToggle checked={devChecked} onClick={toggleDevModeHandler} color={accent} />
          </IonItem>
          {(isPlatform("android") && isPlatform("hybrid")) && devChecked || (isPlatform("ios") && isPlatform("hybrid")) && devChecked ? 
          <IonItem>
            <IonLabel onClick={testLocalNotification}>
              <IonIcon icon={notifications} /> {capitalize(t("test"))+t("between_words")+t("local_notification")}
            </IonLabel>
          </IonItem>
           : ''
          }
          <IonItem>
            <IonRouterLink routerLink="/about">
              <IonLabel color="dark"><IonIcon icon={information} /> {capitalize(t("about"))} Countdate</IonLabel>
            </IonRouterLink>
          </IonItem>
          <IonListHeader lines="none" color={accent}>
            <IonLabel>{capitalize(t("dark_mode"))}</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel onClick={toggleDarkModeHandler}><IonIcon icon={contrast} /> {capitalize(t("toggle"))+t("between_words")+t("dark_mode")}</IonLabel>
            <IonToggle checked={darkChecked} onClick={toggleDarkModeHandler} color={accent} />
          </IonItem>
          <IonItem>
            <IonLabel onClick={darkmodeToSystem}><IonIcon icon={logoAndroid} /> {capitalize(t("follow"))+t("between_words")+t("system")+t("between_words")+t("dark_mode")}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
