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
  IonToggle,
  IonItem
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { useState } from "react";
import { useHistory } from "react-router";
import { v4 as uuid } from 'uuid'

import { trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";

const Add: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [advanceSettingsEnable,setAdvanceSettingsEnable] = useState(false)
  const [UTC,setUTC] = useState('+08:00')
  const [selectedDate, setSelectedDate] = useState('2022-05-01T23:59:00'+UTC);
  const [titleText, setTitleText] = useState<string>("");
  const history = useHistory()
  let countdate_events_data = []
  const add_new_countdate_item = async (newItem:{event_name:any,date:string}) => {
    if (!newItem.event_name) return
    const { value } = await Storage.get({ key: "countdate_events_data" });
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
      key: "countdate_events_data",
      value: content
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
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{t("add")}{t("between_words")}Countdate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("add")}{t("between_words")}Countdate</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">????????????</IonLabel>
                <IonInput onKeyDown={e=> SearchF(e.key)} clearInput={true} value={titleText} placeholder="??????????????????" onIonChange={e => setTitleText(e.detail.value!)}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">????????????</IonLabel>
              <IonDatetime size="cover" presentation="date" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}></IonDatetime>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>UTC offset</IonLabel>
                <IonInput clearInput={true} value={UTC} disabled={!advanceSettingsEnable} onIonChange={e => setUTC(e.detail.value!)}></IonInput>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Advance Setting</IonLabel>
                <IonToggle checked={advanceSettingsEnable} onIonChange={e => setAdvanceSettingsEnable(e.detail.checked)} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton disabled={titleText === ""} expand="full" onClick={() => {add_new_countdate_item({event_name: titleText,date:selectedDate});}}>??????</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Add;
