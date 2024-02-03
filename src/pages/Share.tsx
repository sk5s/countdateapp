import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { isPlatform } from "@ionic/core";

export default function Share({
  accent
}) {
  const {t} = useTranslation()
  const location = useLocation()
  const [event,setEvent] = useState({title:"",date:"",dateRaw:""})
  const formatDate = (date) => {
    let formatted_date = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
    return formatted_date;
  }
  useEffect(() => {
    console.log(location.search)
    let title = ""
    let dateRaw = ""
    let date = ""
    const urlParams = new URLSearchParams(location.search)
    if (urlParams.get("title")){
      title = urlParams.get("title")
    }
    if (urlParams.get("date")){
      dateRaw = urlParams.get("date")
      if (urlParams.get("date").length === 10){
        date = urlParams.get("date") + "T23:59:00+08:00"
      }
    }
    setEvent({
      title: title,
      dateRaw: dateRaw,
      date: date
    })
  },[])
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>{t("p.share.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <h5>{t("p.add.eventName.label")}: {event.title}</h5>
        <h5>{t("p.share.date")}: {formatDate(new Date(event.date))}</h5>
        {isPlatform("mobileweb") ? <>
        <IonButton onClick={() => {
          window.location.replace(`countdate://app/add?title=${event.title}&date=${event.dateRaw}`)
          setTimeout(() => {
            window.location.replace("https://play.google.com/store/apps/details?id=cyou.sk5s.app.countdate")
          }, 700);
        }}>
          {t("p.share.openApp")}
        </IonButton>
        </> : <></>}
      </IonContent>
    </IonPage>
  )
}
