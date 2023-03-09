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
import { code, contrast, help, information, logoAndroid, notifications } from 'ionicons/icons'
import { useTranslation } from "react-i18next";
import { Schedule } from "../lib/LocalNotification";
// import { set_dark_mode_toggle_to } from '../lib/Darkmode'
import { Preferences as Storage } from "@capacitor/preferences";
import key from '../lib/storageKey.json'
import { useEffect, useState } from "react";
import { on, trigger } from "../lib/Events";
import { capitalize } from "../lib/Capitalize";
import AccentColorSelectModal from '../components/AccentColorSelectModal'
import TextColorSelectModal from '../components/TextColorSelectModal'
import './Settings.css'
import { useHistory } from "react-router";

const Settings: React.FC<{accent:string}> = ({accent}) => {
  const { t, i18n } = useTranslation()
  const [darkChecked, setDarkChecked] = useState<boolean>()
  const [devChecked, setDevChecked] = useState<boolean>(false)
  const history = useHistory()

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
  const darkEnable = (value:any) => {
    let darkmodeEnable
    let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
    return darkmodeEnable
  }
  const getDarkMode = async () => {
    const { value } = await Storage.get({ key: key.theme });
    console.log(darkEnable(value))
    setDarkChecked(darkEnable(value))
  }
  getDarkMode()
  const toggleDarkModeHandler = async () => {
    console.log(!darkChecked)
    if (darkChecked){
      await Storage.set({
        key: key.theme,
        value: "light"
      })
      document.body.classList.remove('dark')
    } else {
      await Storage.set({
        key: key.theme,
        value: "dark"
      })
      document.body.classList.add('dark')
    }
    setDarkChecked(!darkChecked)
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

  const handleReviewTour = async () => {
    await Storage.remove({
      key: key.firstTime
    })
    history.push("/home")
    setTimeout(() => {
      trigger("countdate_first:change")
    }, 500);
  }
  
  // on("countdate_darkmode:toggle", async () => {
  //   setDarkChecked(set_dark_mode_toggle_to())
  // })
  // useEffect(() => {
  //   setDarkChecked(set_dark_mode_toggle_to())
  // }, [])
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
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>{capitalize(t("settings"))}</IonTitle>
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
            <IonLabel onClick={handleReviewTour}><IonIcon icon={help} /> {t("review_tour")}</IonLabel>
          </IonItem>
          <IonItem>
            <IonRouterLink routerLink="/about">
              <IonLabel color="dark"><IonIcon icon={information} /> {capitalize(t("about"))} Countdate</IonLabel>
            </IonRouterLink>
          </IonItem>
          <IonListHeader lines="none" color={accent}>
            <IonLabel>{capitalize(t("theme"))}</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel onClick={toggleDarkModeHandler}><IonIcon icon={contrast} /> {capitalize(t("toggle"))+t("between_words")+t("dark_mode")}</IonLabel>
            <IonToggle checked={darkChecked} onClick={toggleDarkModeHandler} color={accent} />
          </IonItem>
          <IonItem>
            <IonLabel onClick={darkmodeToSystem}><IonIcon icon={logoAndroid} /> {capitalize(t("follow"))+t("between_words")+t("system")+t("between_words")+t("dark_mode")}</IonLabel>
          </IonItem>
          <IonItem>
            <AccentColorSelectModal />
          </IonItem>
          <IonItem>
            <TextColorSelectModal accent={accent} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
