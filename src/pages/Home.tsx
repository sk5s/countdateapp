import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonFooter,
} from "@ionic/react";

import { add, calendarClearOutline } from 'ionicons/icons'
// import { useEffect, useState } from "react";
// import { isPlatform, useIonAlert, useIonViewDidEnter } from "@ionic/react";
// import { AppVersion } from '@awesome-cordova-plugins/app-version';

import CountCards from "../components/CountCards";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { capitalize } from "../lib/Capitalize";

const Home: React.FC<{accent:string,textColor:string}> = ({accent,textColor}) => {
  // const [error, setError] = useState(null)
  // const [isLoaded, setIsLoaded] = useState(false)
  // const [present] = useIonAlert()
  // const checkUpdate = async () => {
  //   const remote_apk_root = 'https://github.com/sk5s/countdateapp/releases/download/'
  //   const remote_versions = "https://raw.githubusercontent.com/sk5s/countdateapp/main/versions.json"
  //   fetch(remote_versions).then(res => res.json())
  //   .then(
  //     (result) => {
  //       setIsLoaded(true)
  //       console.log(result)
  //       return result.newest
  //     },
  //     // Note: it's important to handle errors here
  //     // instead of a catch() block so that we don't swallow
  //     // exceptions from actual bugs in components.
  //     (error) => {
  //       setIsLoaded(true)
  //       setError(error)
  //     }
  //   ).then(async (newest) => {
  //     let installedVersion = await AppVersion.getVersionNumber()
  //     let device = installedVersion.split(".")
  //     console.log(device)
  //     let internet = newest.split(".")
  //     console.log(parseInt(device[1]),parseInt(internet[1]))
  //     if (parseInt(device[0]) <= parseInt(internet[0]) && parseInt(device[1]) <= parseInt(internet[1]) && parseInt(device[2]) < parseInt(internet[2])){
  //       console.log("Is Newer")
  //       present({
  //         header: 'New Version!',
  //         message: `Version ${newest} from github available.`,
  //         buttons: [
  //           'Cancel',
  //           { text: 'View Download Page', handler: async () => {
  //             console.log(`Open: ${remote_apk_root}v${newest}/Countdate_v${newest}.apk`)
  //             window.open(`${remote_apk_root}v${newest}`, '_system')
  //           }},
  //         ]
  //       })
  //     }
  //   })
  // }
  // useEffect(() => {
  //   console.log("Matching Platform")
  //   if (isPlatform("android") && isPlatform("hybrid")) {
  //     checkUpdate()
  //     console.log("Check updates begain")
  //   }
  // }, [])
  const {t} = useTranslation()
  const [view,setView] = useState("days")
  const [count,setCount] = useState("countdown")
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Countdate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            {/* <IonTitle>Countdate</IonTitle> */}
            <IonSegment color={accent} value={count} onIonChange={(e) => setCount(`${e.detail.value}`)}>
              <IonSegmentButton value="countdown">
                <IonLabel>{capitalize(t("countdown"))}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="countup">
                <IonLabel>{capitalize(t("countup"))}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>

        <CountCards count={count} view={view} accent={accent} textColor={textColor} />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/add" color={accent} id="home-add-fab">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

      </IonContent>
      <IonFooter translucent={true}>
        <IonToolbar>
          <IonSegment color={accent} value={view} onIonChange={(e) => setView(`${e.detail.value}`)}>
            <IonSegmentButton value="days">
              <IonLabel>{t("days_view")}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="weeks">
              <IonLabel>{t("weeks_view")}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
