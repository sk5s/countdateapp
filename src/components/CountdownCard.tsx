import {
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { Preferences as Storage } from "@capacitor/preferences";

import { removeCircleOutline } from "ionicons/icons";
import { on, trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";
import { useEffect, useState } from "react";
import EventDetailModal from "./EventDetailModal";
import { countDownFromTime } from "../lib/Countdate";

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
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [contentEditable, setContentEditable] = useState(false);
  let countdate_events_data = [];
  const remove_this_countdate_item = async () => {
    const { value } = await Storage.get({ key: "countdate_events_data" });
    if (value) {
      countdate_events_data = JSON.parse(value);
      countdate_events_data = countdate_events_data.filter((item: any) => {
        console.log(item.id);
        console.log(String(item.id) !== String(props.id));
        return String(item.id) !== String(props.id);
      });
      let content = JSON.stringify(countdate_events_data);
      await Storage.set({
        key: "countdate_events_data",
        value: content,
      });
      trigger("countdate_data:change");
    }
  };
  useEffect(() => {
    on("countdate_data:change", (data: any) => {
      if (data.detail === "delete") setIsOpen(false);
    });
  }, []);
  if (countDownFromTime(props.date) < 0) return <></>;
  return (
    <>
      <IonCard onClick={() => setIsOpen(true)} style={{ cursor: "pointer" }}>
        <IonItem>
          <IonCardSubtitle style={{ fontSize: "1.5rem" }}>
            {t("event_countdown_prefix") +
              t("between_words") +
              props.event +
              t("event_countdown_suffix")}
          </IonCardSubtitle>
          {props.editable && (
            <IonButton
              color={props.accent}
              onClick={remove_this_countdate_item}
              slot="end"
            >
              <IonIcon slot="icon-only" icon={removeCircleOutline} />
            </IonButton>
          )}
        </IonItem>
        <IonCardContent>
          <IonCardTitle
            style={{ fontSize: "3rem", color: props.textColor }}
            color={props.accent}
          >
            {props.view === "days" ? (
              <span>
                {countDownFromTime(props.date) + " " + capitalize(t("days"))}
              </span>
            ) : (
              <span>
                {(
                  Math.round(
                    (countDownFromTime(props.date) / 7 + Number.EPSILON) * 10
                  ) / 10
                ).toString() +
                  " " +
                  capitalize(t("weeks"))}
              </span>
            )}
          </IonCardTitle>
        </IonCardContent>
      </IonCard>
      <EventDetailModal
        detailStr={
          props.view === "days"
            ? countDownFromTime(props.date) + " " + capitalize(t("days"))
            : (
                Math.round(
                  (countDownFromTime(props.date) / 7 + Number.EPSILON) * 10
                ) / 10
              ).toString() +
              " " +
              capitalize(t("weeks"))
        }
        contentEditable={contentEditable}
        setContentEditable={setContentEditable}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        myprops={props}
      />
    </>
  );
}
