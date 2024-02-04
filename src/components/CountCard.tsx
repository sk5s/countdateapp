import {
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
} from "@ionic/react";

import { on } from "../lib/Events";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import EventDetailModal from "./EventDetailModal";
import { countDownFromTime, countUpFromTime, countFromTime } from "../lib/Countdate";

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
  relative: boolean;
}): JSX.Element {
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [contentEditable, setContentEditable] = useState(false);
  const [days, setDays] = useState(countFromTime(props.date))
  const convertDays = (days) => {
    // Convert days into total years, months, and days
    const years = Math.floor(days / 365);
    days -= years * 365;
    const months = Math.floor(days / 30);
    days -= months * 30;
    return [years, months, days];
  }
  const getTimeStr = (ndays:number) => {
    // console.log(props.relative)
    if (props.view === "days"){
      return ndays.toString() + " " + t("c.card.days")
    } else if (props.view === "months") {
      let relative = convertDays(ndays)
      if (props.relative){
        let mystr = ""
        if (relative[0]){
          mystr += (relative[0]).toString() + " " + t("c.card.years") + " "
        }
        if (relative[1]){
          mystr += (relative[1]).toString() + " " + t("c.card.months") + " "
        }
        if (relative[2]){
          mystr += (relative[2]).toString() + " " + t("c.card.days")
        }
        return mystr
      }
      return (Math.round((ndays / 30 + Number.EPSILON) * 100 ) / 100).toString() + " " + t("c.card.months")
    } else {
      if (props.relative){
        return Math.floor(ndays / 7).toString() + " " + t("c.card.weeks")  + " " + (ndays % 7).toString() + " " + t("c.card.days")
      }
      return (Math.round((ndays / 7 + Number.EPSILON) * 10 ) / 10).toString() + " " + t("c.card.weeks")
    }
  }
  const [timeStr, setTimeStr] = useState(() => getTimeStr(days))
  useEffect(() => {
    on("countdate_data:change", (data: any) => {
      if (data.detail === "delete") setIsOpen(false);
      // setDays(countFromTime(props.date))
      // setTimeStr(() => getTimeStr(countFromTime(props.date)))
    });
  }, []);
  useEffect(() => {
    setTimeStr(() => getTimeStr(days))
    setDays(countFromTime(props.date))
    setTimeStr(() => getTimeStr(countFromTime(props.date)))
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
            t("c.card.countdownEvent",{eventName: props.event}):
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