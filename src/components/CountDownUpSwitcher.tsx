import { IonLabel, IonSegment, IonSegmentButton, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";

export default function CountDownUpSwitcher({
  accent,
  count,
  setCount
}) {
  const { t } = useTranslation();
  return (
    <>
      {/* Countdown countup switcher */}
      <IonToolbar style={{paddingTop: "0px"}}>
        <IonSegment
          color={accent}
          value={count}
          onIonChange={(e) => {
            setCount(`${e.detail.value}`)
            if (e.detail.value === "countup"){
              localStorage.setItem("countdownOrUp", "up")
            } else {
              localStorage.removeItem("countdownOrUp")
            }
          }}
        >
          <IonSegmentButton value="countdown">
            <IonLabel>{t("p.home.countdown")}</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="countup">
            <IonLabel>{t("p.home.countup")}</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
    </>
  );
}
