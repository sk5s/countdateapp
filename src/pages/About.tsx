import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  getPlatforms,
  IonChip
} from "@ionic/react";

import packageJson from '../../package.json'
import { capitalize } from "../lib/Capitalize";
import { useTranslation } from "react-i18next";
import logo from '../assets/countdateapp-logo-foreground.png'
import banner from '../assets/sk5s-project-bar.png'

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
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>{capitalize(t("about"))} Countdate</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{width:"100%",textAlign:"center"}}>
          <a href="https://github.com/sk5s/countdateapp" target="_blank">
            <img src={logo} alt="Logo" width="80" height="80"/>
          </a>
          <p>Version: {packageJson.version}</p>
          <p>
            Platform: {(() => {
              let platforms:any = []
              getPlatforms().map((p,i) => {
                platforms.push(
                  <IonChip key={i} color={accent}>{p}</IonChip>
                )
              })
              return platforms
            })()}
          </p>
        </div>
        <p style={{fontSize:"25px", marginLeft:"20px"}}>
          Date Countdown: Know How Many Days Left To a Specific Date.
        </p>
        <div>
          <a target="_blank" href='https://play.google.com/store/apps/details?id=cyou.sk5s.app.countdate&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' width="150px"/></a>
          <a target="_blank" href='https://apt.izzysoft.de/fdroid/index/apk/cyou.sk5s.app.countdate'><img alt='Get it on Google Play' src='https://sk5s.cyou/countdate-landing/assets/img/IzzyOnDroid.png' width="150px"/></a>
        </div>
        <ul style={{fontSize:"25px"}}>
          <li><a href="https://sk5s.cyou/countdate-landing/" target="_blank" rel="noopener noreferrer">Landing page</a></li>
          <li><a href="https://bit.ly/countdateapp" target="_blank" rel="noopener noreferrer">Project Github</a></li>
          <li><a href="https://github.com/sk5s/countdateapp/issues" target="_blank" rel="noopener noreferrer">Report Bug</a></li>
          <li><a href="https://github.com/sk5s/countdateapp/issues" target="_blank" rel="noopener noreferrer">Request feature</a></li>
        </ul>
        <a href="https://sk5s.cyou" target="_blank" rel="noopener noreferrer">
          <img src={banner} alt="" />
        </a>
      </IonContent>
    </IonPage>
  );
};

export default About;