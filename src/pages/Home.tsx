import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon
} from "@ionic/react";

import { add } from 'ionicons/icons'
import ApkUpdater from 'cordova-plugin-apkupdater';
import { useEffect, useState } from "react";
import { isPlatform, useIonAlert } from "@ionic/react";

import CountdownCards from "../components/CountdownCards";

const Home: React.FC = () => {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [present] = useIonAlert()
  const checkUpdate = async () => {
    const remote_apk_root = 'https://github.com/sk5s/countdateapp/releases/download/'
    const remote_versions = "https://raw.githubusercontent.com/sk5s/countdateapp/main/versions.json"
    fetch(remote_versions).then(res => res.json())
    .then(
      (result) => {
        setIsLoaded(true)
        return result.newest
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setIsLoaded(true)
        setError(error)
      }
    ).then(async (newest) => {
      let installedVersion = await ApkUpdater.getInstalledVersion()
      let device = installedVersion.version.name.split(".")
      let internet = newest.split(".")
      if (parseInt(device[0]) >= parseInt(internet[0]) && parseInt(device[1]) >= parseInt(internet[1]) && parseInt(device[2]) > parseInt(internet[2])){
        present({
          header: 'New Version!',
          message: `Version ${newest} from github available.`,
          buttons: [
            'Cancel',
            { text: 'Download & Install', handler: async () => {
              await ApkUpdater.download(
                remote_apk_root + `v${newest}/Countdate_v${newest}.apk`,
                {
                  onDownloadProgress: console.log
                }
              )
              await ApkUpdater.install()
            }},
          ]
        })
      }
    })
  }
  useEffect(() => {
    if (isPlatform("android") && isPlatform("hybrid")) {
      checkUpdate()
    }
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Countdate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Countdate</IonTitle>
          </IonToolbar>
        </IonHeader>
        <CountdownCards />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
