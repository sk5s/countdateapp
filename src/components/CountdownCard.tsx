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

export default function CountdownCard(props: {
  date: string;
  event: string;
  editable: boolean;
  id: string;
}): JSX.Element {
  const [t] = useTranslation()
  const Completionist = () => <span>{t("between_words") + t("day_has_come")}</span>;
  const renderer = ({
    days,
    completed,
  }: {
    days: number;
    completed: boolean;
  }): any => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return <span>{days +" "+ capitalize(t("days"))}</span>;
    }
  };
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
  return (
    <IonCard>
      <IonItem>
        <IonCardSubtitle style={{fontSize: "1.5rem"}}>
          {t("event_prefix") + t("between_words") + props.event + t("event_suffix")}
        </IonCardSubtitle>
        {props.editable && (
          <IonButton
            color="primary"
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
        <IonCardTitle style={{fontSize: "3rem"}} color="primary">
          <Countdown date={props.date} renderer={renderer} />
        </IonCardTitle>
      </IonCardContent>
    </IonCard>
  );
}
