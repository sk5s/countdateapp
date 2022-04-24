import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  isPlatform
} from "@ionic/react";
import LanguageSelectAction from "../components/LanguageSelectAction";
import { Schedule } from "../lib/LocalNotification";
import { set_dark_mode_toggle_to } from '../lib/Darkmode'
import { Storage } from "@capacitor/storage";
import key from '../lib/storageKey.json'

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
    console.log(set_dark_mode_toggle_to())
    if (set_dark_mode_toggle_to()){
      await Storage.set({
        key: key.theme,
        value: ""
      })
    } else {
      await Storage.set({
        key: key.theme,
        value: "dark"
      })
    }
    
  }
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
        <LanguageSelectAction />
        {isPlatform("android") || isPlatform("ios") ? 
        <IonButton onClick={testLocalNotification} expand="block">
          Test Local Notification
        </IonButton> : ''
        }
        <IonButton onClick={toggleDarkModeHandler} expand="block">Toggle Dark Mode</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
