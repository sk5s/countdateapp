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
  IonSearchbar,
  IonButtons,
  IonButton,
} from "@ionic/react";

import { add, search } from "ionicons/icons";

import CountCards from "../components/CountCards";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { trigger, on } from "../lib/Events";
import "./Home.css"
import CountDownUpSwitcher from "../components/CountDownUpSwitcher";
import { Device } from "@capacitor/device";

const Home: React.FC<{ accent: string; textColor: string;count:any;setCount:any;view:string;setView:any;relative:boolean; }> = ({
  accent,
  textColor,
  count,
  setCount,
  view,
  setView,
  relative
}) => {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>("android")
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => left(),
    onSwipedRight: () => left(),
  });
  const left = () => {
    if (count === "countdown") {
      setCount("countup");
      localStorage.setItem("countdownOrUp", "up")
    } else {
      setCount("countdown");
      localStorage.removeItem("countdownOrUp")
    }
  };
  const handleRefresh = (event: any) => {
    trigger("countdate_data:change");
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  useEffect(() => {
    // Translation not updating workaround
    on("countdate_data:change", () => {
      setView("weeks")
      setTimeout(() => {
        setView("days")
      }, 100);
    })
    const getDevicePlatform = async () => {
      const info = await Device.getInfo()
      setPlatform(info.platform)
    }
    getDevicePlatform()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("p.home.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) {
                setSearchQuery("");
              }
            }}>
              <IonIcon icon={search} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {showSearch && (
          <IonToolbar>
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => setSearchQuery(e.detail.value!)}
              placeholder={t("p.home.searchPlaceholder")}
              debounce={300}
            />
          </IonToolbar>
        )}
      </IonHeader>
      <IonContent>
        {/* Refresher */}
        {platform === "ios" ? null : (
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        )}

        <IonHeader>
          <CountDownUpSwitcher accent={accent} count={count} setCount={setCount} />
        </IonHeader>

        <div {...handlers} style={{minHeight: "80%"}}>
          {/* Countcards */}
          <CountCards
            count={count}
            view={view}
            accent={accent}
            textColor={textColor}
            changeCount={setCount}
            relative={relative}
            searchQuery={searchQuery}
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
        <IonToolbar style={{paddingBottom: "16px"}}>
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
