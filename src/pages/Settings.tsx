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
  IonToggle
} from "@ionic/react";
import LanguageSelectAction from "../components/LanguageSelectAction";
import { Schedule } from "../lib/LocalNotification";
import { set_dark_mode_toggle_to, prefersDark } from '../lib/Darkmode'
import { Storage } from "@capacitor/storage";
import key from '../lib/storageKey.json'
import { useEffect, useState } from "react";
import { on } from "../lib/Events";

const Settings: React.FC = () => {
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
    setDarkChecked(prefersDark)
    if (prefersDark) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
    await Storage.set({
      key: key.theme,
      value: ""
    })
  }
  
  const [darkChecked, setDarkChecked] = useState<boolean>()
  on("countdate_darkmode:toggle", () => {
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
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonListHeader lines="none" color="primary">
            <IonLabel>General</IonLabel>
          </IonListHeader>
          <IonItem>
            <LanguageSelectAction />
          </IonItem>
          {isPlatform("android") || isPlatform("ios") ? 
          <IonItem>
            <IonLabel onClick={testLocalNotification}>
              Test Local Notification
            </IonLabel>
          </IonItem>
           : ''
          }
          <IonListHeader lines="none" color="primary">
            <IonLabel>Dark Mode</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel onClick={toggleDarkModeHandler}>Toggle Dark Mode</IonLabel>
            <IonToggle checked={darkChecked} onClick={toggleDarkModeHandler} />
          </IonItem>
          <IonItem>
            <IonLabel onClick={darkmodeToSystem}>Follow System Dark Mode</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
