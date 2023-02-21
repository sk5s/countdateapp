import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton
} from "@ionic/react";

import { add } from 'ionicons/icons'
import packageJson from '../../package.json'
import { capitalize } from "../lib/Capitalize";
import { useTranslation } from "react-i18next";

const About: React.FC<{accent:string}> = ({accent}) => {
  const { t, i18n } = useTranslation()
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" color={accent} />
          </IonButtons>
          <IonTitle>{capitalize(t("about"))} Countdate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" style={{marginTop:"10px"}}>
          <IonToolbar>
            <IonTitle size="large">{capitalize(t("about"))} Countdate</IonTitle>
          </IonToolbar>
        </IonHeader>
        <a href="https://github.com/sk5s/countdateapp" target="_blank">
          <img src="https://sk5s.cyou/countdate-landing/assets/img/icon-foreground.png" alt="Logo" width="80" height="80"/>
        </a> <span>Version: {packageJson.version}</span><br/>
        <span>Date Countdown: Know How Many Days Left To a Specific Date.</span>
        <ul style={{fontSize:"20px"}}>
          <li><a href="https://sk5s.cyou/countdate-landing/" target="_blank" rel="noopener noreferrer">Landing page</a></li>
          <li><a href="https://bit.ly/countdateapp" target="_blank" rel="noopener noreferrer">Project Github</a></li>
          <li><a href="https://github.com/sk5s/countdateapp/issues" target="_blank" rel="noopener noreferrer">Report Bug</a></li>
          <li><a href="https://github.com/sk5s/countdateapp/issues" target="_blank" rel="noopener noreferrer">Request feature</a></li>
        </ul>
        <img src="https://sk5s.cyou/sk5s/img/sk5s-project-bar.png" alt="" />
      </IonContent>
    </IonPage>
  );
};

export default About;