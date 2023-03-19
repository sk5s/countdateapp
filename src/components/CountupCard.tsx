import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { Preferences as Storage } from "@capacitor/preferences";

import { removeCircleOutline } from "ionicons/icons";
import Countdown from "react-countdown";
import { trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";

export default function CountupCard(props: {
  date: string;
  event: string;
  editable: boolean;
  id: string;
  view: string;
  accent: string;
  textColor: string;
}): JSX.Element {
  const [t] = useTranslation()
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
  const countUpFromTime = (date:any) => {
    // countFrom = new Date(countFrom).getTime();
    let now = new Date()
    let countFrom = new Date(date)
    let timeDifference = now.getTime() - countFrom.getTime()
      
    let secondsInADay = 60 * 60 * 1000 * 24
    let secondsInAHour = 60 * 60 * 1000
    let days = Math.floor(timeDifference / (secondsInADay) * 1);
    // let years = Math.floor(days / 365);
    // if (years > 1){ days = days - (years * 365) }
    // let hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
    // let mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
    // let secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);
    return days
  }
  if (countUpFromTime(props.date) < 0) return (
    <></>
  )
  return (
    <IonCard>
      <IonItem>
        <IonCardSubtitle style={{fontSize: "1.5rem"}}>
          {props.event}
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
            ? <span>{countUpFromTime(props.date) + " " + capitalize(t("days"))}</span>
            : <span>{(Math.round((countUpFromTime(props.date)/7 + Number.EPSILON) * 10) / 10).toString() + " " + capitalize(t("weeks"))}</span>
          }
        </IonCardTitle>
      </IonCardContent>
    </IonCard>
  );
}
