import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { isPlatform } from "@ionic/core";
import {
  informationCircleSharp,
  settingsSharp,
  shareSocialSharp,
} from "ionicons/icons";
import logo from "../assets/countdateapp-logo-foreground.png";
import { formatDate } from "../lib/DateFormat";

export default function Share({ accent }) {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [event, setEvent] = useState({ title: "", date: "", dateRaw: "" });

  useEffect(() => {
    console.log(location.search);
    let title = "";
    let dateRaw = "";
    let date = "";
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("title")) {
      title = urlParams.get("title");
    }
    if (urlParams.get("date")) {
      dateRaw = urlParams.get("date");
      if (urlParams.get("date").length === 10) {
        date = urlParams.get("date") + "T23:59:00+08:00";
      }
    }
    setEvent({
      title: title,
      dateRaw: dateRaw,
      date: date,
    });
  }, []);
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              color={accent}
              onClick={() => {
                history.push("/settings");
              }}
            >
              <IonIcon icon={settingsSharp} />
            </IonButton>
            <IonButton
              color={accent}
              onClick={() => {
                history.push("/about");
              }}
            >
              <IonIcon icon={informationCircleSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            <IonIcon icon={shareSocialSharp} /> {t("p.share.title")}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {t("p.add.eventName.label")} : {event.title}
            </IonCardTitle>
            <IonCardSubtitle>
              {t("p.share.date")} : {formatDate(new Date(event.date))}
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            {isPlatform("mobileweb") ? (
              <>
                <IonButton
                  color={accent}
                  onClick={() => {
                    window.location.replace(
                      `countdate://app/add?title=${event.title}&date=${event.dateRaw}`
                    );
                  }}
                >
                  {t("p.share.openApp")}
                </IonButton>
              </>
            ) : (
              <></>
            )}
          </IonCardContent>
        </IonCard>
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img src={logo} alt="Logo" width="60" height="60" />
          {!isPlatform("ios") && (
            <div style={{ height: "60px", width: "150px" }}>
              <a
                rel="noreferrer"
                target="_blank"
                href="https://play.google.com/store/apps/details?id=cyou.sk5s.app.countdate"
              >
                <img
                  alt="Get it on Google Play"
                  src="https://sk5s.com/images/google-play.png"
                  width="150px"
                />
              </a>
            </div>
          )}
          <div style={{ height: "60px", width: "150px" }}>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://apps.apple.com/tw/app/Countdate/id6553989325"
            >
              <img
                alt="Download on the App Store"
                src="https://sk5s.com/images/app-store.png"
              />
            </a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
