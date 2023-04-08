import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonTextarea,
} from "@ionic/react";
import {Preferences as Storage } from "@capacitor/preferences";

import { removeCircleOutline } from "ionicons/icons";
import { on, trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";
import { useEffect, useState } from "react";
import CountdateItem from "./CountdownItem";

export default function CountdownCard(props: {
  date: string;
  event: string;
  editable: boolean;
  id: string;
  view: string;
  accent: string;
  textColor: string;
  description?: string;
}): JSX.Element {
  const [t] = useTranslation()
  const [isOpen, setIsOpen] = useState(false);
  const [description,setDescription] = useState(props.description);
  let countdate_events_data = [];
  const remove_this_countdate_item = async () => {
    const { value } = await Storage.get({ key: "countdate_events_data" });
    if (value) {
      countdate_events_data = JSON.parse(value);
      countdate_events_data = countdate_events_data.filter((item: any) => {
        console.log(item.id);
        console.log(String(item.id) != String(props.id));
        return String(item.id) != String(props.id);
      });
      let content = JSON.stringify(countdate_events_data);
      await Storage.set({
        key: "countdate_events_data",
        value: content,
      });
      trigger("countdate_data:change");
    }
  };
  const countDownFromTime = (date:any) => {
    // countFrom = new Date(countFrom).getTime();
    let now = new Date()
    let countFrom = new Date(date)
    let timeDifference = countFrom.getTime() - now.getTime()
      
    let secondsInADay = 60 * 60 * 1000 * 24
    let days = Math.floor(timeDifference / (secondsInADay) * 1);
    // let years = Math.floor(days / 365);
    // if (years > 1){ days = days - (years * 365) }
    // let hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
    // let mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
    // let secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);
    return days
  }
  useEffect(() => {
    on("countdate_data:change", (data:any) => {
      if (data.detail == "delete") setIsOpen(false)
    })
  }, []);
  if (countDownFromTime(props.date) < 0) return (
    <></>
  )
  return (
    <>
      <IonCard onClick={() => setIsOpen(true)}>
        <IonItem>
          <IonCardSubtitle style={{fontSize: "1.5rem"}}>
            {t("event_countdown_prefix") + t("between_words") + props.event + t("event_countdown_suffix")}
          </IonCardSubtitle>
          {props.editable && (
            <IonButton
              color={props.accent}
              onClick={remove_this_countdate_item}
              slot="end"
            >
              <IonIcon
                slot="icon-only"
                icon={removeCircleOutline}
              />
            </IonButton>
          )}
        </IonItem>
        <IonCardContent>
          <IonCardTitle style={{fontSize: "3rem", color: props.textColor}} color={props.accent}>
            {props.view == "days"
              ? <span>{countDownFromTime(props.date) + " " + capitalize(t("days"))}</span>
              : <span>{(Math.round((countDownFromTime(props.date)/7 + Number.EPSILON) * 10) / 10).toString() + " " + capitalize(t("weeks"))}</span>
            }
          </IonCardTitle>
        </IonCardContent>
      </IonCard>
      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{props.event}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {t("event_countdown_prefix") + t("between_words") + props.event + t("event_countdown_suffix")}
          {props.view == "days"
            ? <h1>{countDownFromTime(props.date) + " " + capitalize(t("days"))}</h1>
            : <h1>{(Math.round((countDownFromTime(props.date)/7 + Number.EPSILON) * 10) / 10).toString() + " " + capitalize(t("weeks"))}</h1>
          }
          <hr/>
          <span>{t("click_on_title_or_date_to_edit")}</span>
          <CountdateItem
            key={props.id}
            id={props.id}
            event={props.event}
            date={props.date}
            editable={true}
            accent={props.accent}
            textColor={props.textColor}
          />
          {description ? 
          <IonItem>
            <IonTextarea
              placeholder="Description"
              autoGrow={true}
              value={description}
            ></IonTextarea>
          </IonItem>
          : <></>}
        </IonContent>
      </IonModal>
    </>
  );
}
