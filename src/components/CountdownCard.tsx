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
import { Storage } from "@capacitor/storage";

import { removeCircleOutline } from "ionicons/icons";
import Countdown from "react-countdown";
import { trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";

export default function CountdownCard(props: {
  date: string;
  event: string;
  editable: boolean;
  id: string;
}): JSX.Element {
  const [t] = useTranslation()
  const Completionist = () => <span>時辰已到</span>;
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
      return <span>{days}天</span>;
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
          離{t("between_words") + props.event + t("between_words")}剩下
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
