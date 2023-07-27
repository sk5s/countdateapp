import {
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
} from "@ionic/react";

import { on } from "../lib/Events";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";
import { useEffect, useState } from "react";
import EventDetailModal from "./EventDetailModal";
import { countDownFromTime, countUpFromTime } from "../lib/Countdate";

export default function CountCard(props: {
  type: string;
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
  const [days, setDays] = useState(Math.abs(countUpFromTime(props.date)))
  const getTimeStr = (ndays:number) => {
    if (props.view === "days"){
      return ndays.toString() + " " + capitalize(t("days"))
    } else if (props.view === "months") {
      return (Math.round((ndays / 30 + Number.EPSILON) * 100 ) / 100).toString() + " " + capitalize(t("months"))
    } else {
      return (Math.round((ndays / 7 + Number.EPSILON) * 10 ) / 10).toString() + " " + capitalize(t("weeks"))
    }
  }
  const [timeStr, setTimeStr] = useState(() => getTimeStr(days))
  useEffect(() => {
    on("countdate_data:change", (data: any) => {
      if (data.detail === "delete") setIsOpen(false);
      setDays(Math.abs(countUpFromTime(props.date)))
      // console.log(props.date, Math.abs(countUpFromTime(props.date)))
      setTimeStr(() => getTimeStr(Math.abs(countUpFromTime(props.date))))
    });
  }, []);
  useEffect(() => {
    setTimeStr(() => getTimeStr(days))
    setDays(Math.abs(countUpFromTime(props.date)))
    // console.log(props.date, Math.abs(countUpFromTime(props.date)))
    setTimeStr(() => getTimeStr(Math.abs(countUpFromTime(props.date))))
  }, [props.date])
  useEffect(() => {
    setTimeStr(() => getTimeStr(days))
  }, [props.view])
  if (props.type === "countup") {
    if (countUpFromTime(props.date) < 0){
      return <></>
    }
  }
  if (props.type === "countdown") {
    if (countDownFromTime(props.date) < 0){
      return <></>
    }
  }
  return (
    <>
      <IonCard onClick={() => setIsOpen(true)} style={{ cursor: "pointer" }}>
        <IonItem>
          <IonCardSubtitle style={{ fontSize: "1.5rem" }}>
            {props.type === "countdown" ? 
            t("event_countdown_prefix") + t("between_words") +props.event +t("event_countdown_suffix"):
            props.event}
          </IonCardSubtitle>
        </IonItem>
        <IonCardContent>
          <IonCardTitle
            style={{ fontSize: "3rem", color: props.textColor }}
            color={props.accent}
          >
            {timeStr}
          </IonCardTitle>
        </IonCardContent>
      </IonCard>
      <EventDetailModal
        detailStr={timeStr}
        contentEditable={contentEditable}
        setContentEditable={setContentEditable}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        myprops={props}
      />
    </>
  );
}