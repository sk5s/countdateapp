import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  getPlatforms,
  IonChip,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
} from "@ionic/react";

import packageJson from "../../package.json";
import { useTranslation } from "react-i18next";
import logo from "../assets/countdateapp-logo-foreground.png";
import banner from "../assets/sk5s-project-bar.png";
import LocalizeBackButton from "../components/LocalizeBackButton";
import { isPlatform } from "@ionic/core";

const About: React.FC<{ accent: string }> = ({ accent }) => {
  const { t } = useTranslation();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <LocalizeBackButton color={accent} />
          <IonTitle>{t("p.about.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>{t("p.about.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ width: "100%", textAlign: "center" }}>
          <a href="https://github.com/sk5s/countdateapp" target="_blank" rel="noreferrer">
            <img src={logo} alt="Logo" width="80" height="80" />
          </a>
          <p>
            {t("p.about.version",{versionName: packageJson.version})}
            {" "}
            {isPlatform("mobileweb") ? <>
            <IonButton color={accent} size="small" onClick={() => {
              window.location.reload()
            }}>
              {t("p.about.reload")}
            </IonButton>
            </> : <></>}
          </p>
          <p>
            {t("p.about.platform")}{" "}
            {(() => {
              let platforms: any = [];
              getPlatforms().forEach((p, i) => {
                platforms.push(
                  <IonChip key={i} color={accent}>
                    {p}
                  </IonChip>
                );
              });
              return platforms;
            })()}
          </p>
        </div>
        <p style={{ fontSize: "25px", marginLeft: "20px" }}>
          {t("p.about.slogan")}
        </p>
        <div>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://play.google.com/store/apps/details?id=cyou.sk5s.app.countdate"
          >
            <img
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              width="150px"
            />
          </a>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://apt.izzysoft.de/fdroid/index/apk/cyou.sk5s.app.countdate"
          >
            <img
              alt="Get it on Google Play"
              src="https://sk5s.cyou/countdate-landing/assets/img/IzzyOnDroid.png"
              width="150px"
            />
          </a>
        </div>
        <ul style={{ fontSize: "25px" }}>
          <li>
            <a
              href="https://sk5s.cyou/countdate-landing/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("p.about.link.landing")}
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sk5s/countdateapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("p.about.link.github")}
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sk5s/countdateapp/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("p.about.link.bug")}
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sk5s/countdateapp/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("p.about.link.feature")}
            </a>
          </li>
        </ul>

        <p style={{ fontSize: "25px", marginLeft: "20px" }}>
          {t("p.about.more.title")}
        </p>

        <a href="https://play.google.com/store/apps/details?id=cyou.sk5s.app.weread" target="blank" rel="noopener noreferer">
          <div style={{marginBottom:"10px"}}>
            <IonItem>
              <IonThumbnail slot="start">
                <img alt="Silhouette of mountains" src="https://weread.sk5s.cyou/weread-logo.png" />
              </IonThumbnail>
              <IonLabel>{t("p.about.more.weread")}</IonLabel>
            </IonItem>
          </div>
        </a>
        <a href="https://play.google.com/store/apps/details?id=cyou.sk5s.app.onea4paperyourlife" target="blank" rel="noopener noreferer">
          <div style={{marginBottom:"10px"}}>
            <IonItem>
              <IonThumbnail slot="start">
                <img alt="Silhouette of mountains" src="https://play-lh.googleusercontent.com/ffMW4eI9K3Z5vT2tDYdat6N7nJ4TvN3k7B9SPRePKQ7G-I2RSI1slK_uPQZpSMISI4E=w480-h960-rw" />
              </IonThumbnail>
              <IonLabel>{t("p.about.more.onea4paperyourlife")}</IonLabel>
            </IonItem>
          </div>
        </a>

        <a href="https://sk5s.cyou" target="_blank" rel="noopener noreferrer">
          <img src={banner} alt="" />
        </a>
      </IonContent>
    </IonPage>
  );
};

export default About;
