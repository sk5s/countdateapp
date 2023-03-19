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
  IonAccordionGroup,
  IonAccordion,
  useIonToast,
} from "@ionic/react";
import { Preferences as Storage } from "@capacitor/preferences";
import { useState } from "react";
import { useHistory } from "react-router";
import { v4 as uuid } from 'uuid'
import { format } from 'date-fns'

import { trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";

import { capitalize } from "../lib/Capitalize";
import key from '../lib/storageKey.json'
import { add } from "ionicons/icons";

const Add: React.FC<{accent:string}> = ({accent}) => {
  const { t, i18n } = useTranslation()
  const [UTC,setUTC] = useState('+08:00')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd')+'T23:59:00'+UTC);
  const [titleText, setTitleText] = useState<string>("");
  const [presentToast] = useIonToast();
  const history = useHistory()
  let countdate_events_data = []
  const add_new_countdate_item = async (newItem:{event_name:any,date:string}) => {
    if (!newItem.event_name) return
    const { value } = await Storage.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
    } else {
      countdate_events_data = [];
    }
    countdate_events_data.push({id:uuid(),event_name:newItem.event_name,date:newItem.date})
    // console.log(countdate_events_data)
    history.push("/home")
    let content = JSON.stringify(countdate_events_data)
    await Storage.set({
      key: key.data,
      value: content
    });
    presentToast({
      message: capitalize(t("added"))+t("exclamation_mark"),
      duration: 1500,
      position: "bottom",
      icon: add,
      color: accent
    });
    trigger("countdate_data:change")
  };
  const SearchF= (value:any) =>{
    value = value.toLowerCase()
    if(value === "enter"){
      add_new_countdate_item({event_name: titleText,date:selectedDate})
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" color={accent} />
          </IonButtons>
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
                <IonLabel position="stacked">{capitalize(t("event"))}{t("between_words")}{t("name")}</IonLabel>
                <IonInput id="event-title" onKeyDown={e=> SearchF(e.key)} clearInput={true} value={titleText} placeholder={capitalize(t("input"))+t("between_words")+t("event")+t("between_words")+t("name")} onIonChange={e => setTitleText(e.detail.value!)}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {/* <IonLabel position="stacked"></IonLabel> */}
              <IonDatetime mode="md" color={accent} size="cover" presentation="date" value={selectedDate} min={(parseInt(format(new Date(), 'yyyy'))-2).toString()} max={(parseInt(format(new Date(), 'yyyy'))+2).toString()} onIonChange={e => setSelectedDate(format(new Date(`${e.detail.value}`),'yyyy-MM-dd')+"T23:59:00"+UTC)} showDefaultTitle={false}>
                {/* <span slot="title">{t("select")+t("between_words")+t("event")+t("between_words")+t("date")}</span> */}
              </IonDatetime>
            </IonCol>
          </IonRow>
          {/* <IonRow>
            <IonCol>
              <IonAccordionGroup>
                <IonAccordion value="first">
                  <IonItem slot="header" color="light">
                    <IonLabel>Advance settings</IonLabel>
                  </IonItem>
                  <div slot="content">
                    <IonItem className="ion-no-padding">
                      <IonLabel>UTC offset</IonLabel>
                      <IonInput clearInput={true} value={UTC} onIonChange={e => setUTC(e.detail.value!)}></IonInput>
                    </IonItem>
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            </IonCol>
          </IonRow> */}
          <IonRow>
            <IonCol>
              <IonButton shape="round" color={accent} disabled={titleText === ""} expand="full" onClick={() => {add_new_countdate_item({event_name: titleText,date:selectedDate});}}>{capitalize(t("add"))}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Add;
