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
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";

import { add } from "ionicons/icons";

import CountCards from "../components/CountCards";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { trigger } from "../lib/Events";
import "./Home.css"

const Home: React.FC<{ accent: string; textColor: string }> = ({
  accent,
  textColor,
}) => {
  const { t } = useTranslation();
  const [view, setView] = useState("days");
  const [count, setCount] = useState("countdown");

  const handlers = useSwipeable({
    onSwipedLeft: () => left(),
    onSwipedRight: () => left(),
  });
  const left = () => {
    if (count === "countdown") {
      setCount("countup");
    } else {
      setCount("countdown");
    }
  };
  const handleRefresh = (event: any) => {
    trigger("countdate_data:change");
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("p.home.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Refresher */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader>
          {/* Countdown countup switcher */}
          <IonToolbar>
            <IonSegment
              color={accent}
              value={count}
              onIonChange={(e) => setCount(`${e.detail.value}`)}
            >
              <IonSegmentButton value="countdown">
                <IonLabel>{t("p.home.countdown")}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="countup">
                <IonLabel>{t("p.home.countup")}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>

        <div {...handlers} style={{minHeight: "80%"}}>
          {/* Countcards */}
          <CountCards
            count={count}
            view={view}
            accent={accent}
            textColor={textColor}
            changeCount={setCount}
          />
        </div>

        {/* New countdate action button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/add" color={accent} id="home-add-fab">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
      <IonFooter translucent={false}>
        {/* Days and weeks switcher */}
        <IonToolbar>
          <IonSegment
            color={accent}
            value={view}
            onIonChange={(e) => setView(`${e.detail.value}`)}
          >
            <IonSegmentButton value="days">
              <IonLabel>{t("p.home.daysView")}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="weeks">
              <IonLabel>{t("p.home.weeksView")}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="months">
              <IonLabel>{t("p.home.monthsView")}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
