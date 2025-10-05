import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonLabel,
  IonButton,
  IonItem,
  useIonToast,
  IonIcon,
  IonPopover,
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";

import { on, trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";

import key from "../lib/storageKey.json";
import { add, informationCircle } from "ionicons/icons";
import LocalizeBackButton from "../components/LocalizeBackButton";
import { EXTEND_YEARS } from '../constants/Constants'
import './Add.css'

const Add: React.FC<{ accent: string }> = ({ accent }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd") + "T23:59:00+08:00"
  );
  const [titleText, setTitleText] = useState<string | number>("");
  const [years,setYears] = useState(2);
  const [presentToast] = useIonToast();
  const history = useHistory();
  const location = useLocation()
  let countdate_events_data = [];
  const add_new_countdate_item = async (newItem: {
    event_name: any;
    date: string;
    description?: string;
  }) => {
    if (!newItem.event_name) return;
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
    } else {
      countdate_events_data = [];
    }
    countdate_events_data.push({
      id: uuid(),
      event_name: newItem.event_name,
      date: newItem.date,
    });
    history.push("/home");
    let content = JSON.stringify(countdate_events_data);
    await Preferences.set({
      key: key.data,
      value: content,
    });
    presentToast({
      message: t("p.add.toast"),
      duration: 1500,
      position: "bottom",
      icon: add,
      color: accent,
    });
    trigger("countdate_data:change");
  };
  // Listen the enter key
  const SearchF = (value: any) => {
    value = value.toLowerCase();
    if (value === "enter") {
      add_new_countdate_item({ event_name: titleText, date: selectedDate });
    }
  };
  const getExtendMode = async () => {
    const { value } = await Preferences.get({ key: key.extend });
    if (value === "true") {
      setYears(EXTEND_YEARS);
    } else {
      setYears(10);
    }
  };
  on("countdate_extend:change", () => {
    getExtendMode();
  });
  getExtendMode();
  useEffect(() => {
    console.log(location.search)
    const urlParams = new URLSearchParams(location.search)
    if (urlParams.get("title")){
      setTitleText(urlParams.get("title"))
    }
    if (urlParams.get("date")){
      if (urlParams.get("date").length === 10){
        setSelectedDate(urlParams.get("date") + "T23:59:00+08:00")
      }
    }
  },[location])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <LocalizeBackButton color={accent} />
          <IonTitle>{t("p.add.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem className="ion-no-padding">
                <IonLabel position="stacked">
                  {t("p.add.eventName.label")}
                </IonLabel>
                <IonInput
                  aria-label="name"
                  id="event-title"
                  onKeyDown={(e) => SearchF(e.key)}
                  clearInput={true}
                  value={titleText}
                  placeholder={
                    t("p.add.eventName.placeholder")
                  }
                  onIonChange={(e) => setTitleText(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{ textAlign: "end" }}>
              <IonButton
                size="small"
                id="click-trigger"
                color={accent}
                shape="round"
                fill="clear"
              >
                {" "}
                <IonIcon icon={informationCircle}></IonIcon>{" "}
              </IonButton>
              <IonPopover trigger="click-trigger" triggerAction="click" className="wide-popover-300">
                <IonContent class="ion-padding">
                  {t("p.add.tips")}
                  <br/>
                  {t("p.add.extend")}
                </IonContent>
              </IonPopover>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonDatetime
                mode="md"
                color={accent}
                size="cover"
                presentation="date"
                value={selectedDate}
                min={(parseInt(format(new Date(), "yyyy")) - years).toString()}
                max={(parseInt(format(new Date(), "yyyy")) + years).toString()}
                onIonChange={(e) =>
                  setSelectedDate(
                    format(new Date(`${e.detail.value}`), "yyyy-MM-dd") +
                      "T23:59:00+08:00"
                  )
                }
                showDefaultTitle={false}
              ></IonDatetime>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                shape="round"
                color={accent}
                disabled={titleText === ""}
                expand="full"
                onClick={() => {
                  add_new_countdate_item({
                    event_name: titleText,
                    date: selectedDate,
                  });
                }}
              >
                {t("p.add.add")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Add;
