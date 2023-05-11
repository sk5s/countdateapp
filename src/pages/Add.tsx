import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
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
import { Preferences as Storage } from "@capacitor/preferences";
import { useState } from "react";
import { useHistory } from "react-router";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";

import { trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";

import { capitalize } from "../lib/Capitalize";
import key from "../lib/storageKey.json";
import { add, informationCircle } from "ionicons/icons";
import LocalizeBackButton from "../components/LocalizeBackButton";

const Add: React.FC<{ accent: string }> = ({ accent }) => {
  const { t, i18n } = useTranslation();
  const [UTC, setUTC] = useState("+08:00");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd") + "T23:59:00" + UTC
  );
  const [titleText, setTitleText] = useState<string | number>("");
  const [presentToast] = useIonToast();
  const history = useHistory();
  let countdate_events_data = [];
  const add_new_countdate_item = async (newItem: {
    event_name: any;
    date: string;
    description?: string;
  }) => {
    if (!newItem.event_name) return;
    const { value } = await Storage.get({ key: key.data });
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
    await Storage.set({
      key: key.data,
      value: content,
    });
    presentToast({
      message: capitalize(t("added")) + t("exclamation_mark"),
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
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot="start">
            <IonBackButton defaultHref="/" color={accent} />
          </IonButtons> */}
          <LocalizeBackButton color={accent} />
          <IonTitle>{capitalize(t("add"))} Countdate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>{capitalize(t("add"))} Countdate</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem className="ion-no-padding">
                <IonLabel position="stacked">
                  {capitalize(t("event"))}
                  {t("between_words")}
                  {t("name")}
                </IonLabel>
                <IonInput
                  aria-label="name"
                  id="event-title"
                  onKeyDown={(e) => SearchF(e.key)}
                  clearInput={true}
                  value={titleText}
                  placeholder={
                    capitalize(t("input")) +
                    t("between_words") +
                    t("event") +
                    t("between_words") +
                    t("name")
                  }
                  onIonChange={(e) => setTitleText(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                size="small"
                id="click-trigger"
                color={accent}
                shape="round"
              >
                {" "}
                <IonIcon icon={informationCircle}></IonIcon>{" "}
              </IonButton>
              <IonPopover trigger="click-trigger" triggerAction="click">
                <IonContent class="ion-padding">{t("add_tips")}</IonContent>
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
                min={(parseInt(format(new Date(), "yyyy")) - 2).toString()}
                max={(parseInt(format(new Date(), "yyyy")) + 2).toString()}
                onIonChange={(e) =>
                  setSelectedDate(
                    format(new Date(`${e.detail.value}`), "yyyy-MM-dd") +
                      "T23:59:00" +
                      UTC
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
                {capitalize(t("add"))}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Add;
