import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonModal, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { App as NativeApp } from '@capacitor/app';
import { useTranslation } from "react-i18next";
import DescriptionEditor from "./DescriptionEditor";
import { create } from "ionicons/icons";
import { capitalize } from "../lib/Capitalize";
import CountdateItem from "./CountdownItem";
import { Preferences } from "@capacitor/preferences";
import key from '../lib/storageKey.json';
import { trigger } from "../lib/Events";

export default function EventDetailModal(
  {
    detailStr,
    contentEditable,
    setContentEditable,
    isOpen,
    setIsOpen,
    myprops
  }:{
    detailStr: string;
    contentEditable: boolean;
    setContentEditable: any;
    isOpen: boolean;
    setIsOpen: any;
    myprops: any;
  }
){
  const {t} = useTranslation()
  let countdate_events_data = [];
  const [presentAlert] = useIonAlert();
  NativeApp.addListener("backButton", () => {
    setIsOpen(false);
  })
  const addOneMonthHandler = () => {
    presentAlert({
      header: t("quickEdit.confirm"),
      buttons: [
        capitalize(t("cancel")),
        {
          text: capitalize(t("confirm")),
          role: 'confirm',
          handler: () => {
            addOneMonth()
          },
        },
      ],
      onDidDismiss: (e: CustomEvent) => console.log(e.detail.role),
    })
  }
  const addOneMonth = () => {
    let oldDate = myprops.date
    console.log(oldDate.split("-"))
    console.log(parseInt(oldDate.split("-")[1]))
    let year = parseInt(oldDate.split("-")[0])
    let yearStr = oldDate.split("-")[0]
    let month = parseInt(oldDate.split("-")[1])
    let monthStr = ""
    month += 1
    if (month <= 9){
      monthStr = "0" + month.toString()
    } else if (month <= 12) {
      monthStr = month.toString()
    } else {
      monthStr = "01"
      year += 1
      yearStr = year.toString()
    }
    let newDate = `${yearStr}-${monthStr}-${oldDate.split("-")[2]}`
    console.log(newDate)
    editDateData(newDate)
  }
  const minusOneDayHandler = () => {
    let oldDate = myprops.date
    let day = parseInt(oldDate.split("-")[2].split("T")[0])
    let dayStr = ""
    day -= 1
    if (day <= 9 && day > 0){
      dayStr = "0" + day.toString()
    } else if (day <= 31 && day > 0) {
      dayStr = day.toString()
    } else {
      dayStr = "27"
    }
    let newDate = `${oldDate.split("-")[0]}-${oldDate.split("-")[1]}-${dayStr}T${oldDate.split("-")[2].split("T")[1]}`
    console.log(newDate)
    editDateData(newDate)
  }
  const addOneDayHandler = () => {
    let oldDate = myprops.date
    let day = parseInt(oldDate.split("-")[2].split("T")[0])
    let dayStr = ""
    day += 1
    if (day <= 9 && day > 0){
      dayStr = "0" + day.toString()
    } else if (day <= 31 && day > 0) {
      dayStr = day.toString()
    } else {
      dayStr = "01"
    }
    let newDate = `${oldDate.split("-")[0]}-${oldDate.split("-")[1]}-${dayStr}T${oldDate.split("-")[2].split("T")[1]}`
    console.log(newDate)
    editDateData(newDate)
  }
  const editDateData = async (newDate:string|undefined|null) => {
    if (newDate == undefined || newDate == null) return
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      for (const i of countdate_events_data) {
        if (String(i.id) == String(myprops.id)) {
          i.date = newDate
        }
      }
      let content = JSON.stringify(countdate_events_data);
      await Preferences.set({
        key: key.data,
        value: content,
      });
      trigger("countdate_data:change");
    }
  };
  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{myprops.event}</IonTitle>
            <IonButtons slot="end">
              <IonButton color={myprops.accent} onClick={() => setIsOpen(false)}>{t("close")}</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h1>{detailStr}</h1>
          {contentEditable ? 
          <>
            <span>{t("click_on_title_or_date_to_edit")}</span>
            <CountdateItem
              key={myprops.id}
              id={myprops.id}
              event={myprops.event}
              date={myprops.date}
              editable={true}
              accent={myprops.accent}
              textColor={myprops.textColor}
            />
            <IonItem>
              {t("quickEdit.title")}
              <IonButton onClick={() => addOneMonthHandler()} size="small" color={myprops.accent} shape="round">{t("quickEdit.addOneMonth")}</IonButton>
              <IonButton onClick={() => minusOneDayHandler()} size="small" color={myprops.accent} shape="round">{t("quickEdit.minusOneDay")}</IonButton>
              <IonButton onClick={() => addOneDayHandler()} size="small" color={myprops.accent} shape="round">{t("quickEdit.addOneDay")}</IonButton>
            </IonItem>
          </> : <></>}
          <DescriptionEditor id={myprops.id} description={myprops.description ? myprops.description : ""} editable={contentEditable}  accent={myprops.accent} />
          
        </IonContent>
        <IonFooter>
          <IonButton color={myprops.accent} shape="round" onClick={(e) => setContentEditable(!contentEditable)}>
            <IonIcon icon={create} /> {!contentEditable ? capitalize(t("edit")) : capitalize(t("complete"))+t("between_words")+t("edit")}
          </IonButton>
        </IonFooter>
      </IonModal>
  )
}