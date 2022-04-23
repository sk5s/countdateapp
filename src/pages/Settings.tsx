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

const Settings: React.FC = () => {
  const testLocalNotification = async () => {
    console.log("clicked")
    await Schedule({
      title: "Countdate",
      body: "Local Notification Test",
      id: 1
    })
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
        <IonButton shape='round' onClick={testLocalNotification} expand="block">
          Test Local Notification
        </IonButton> : ''
        }
      </IonContent>
    </IonPage>
  );
};

export default Settings;
