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
  IonButton
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { useState } from "react";
import { useHistory } from "react-router";
import "./Home.css";
import { v4 as uuid } from 'uuid'


const Add: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2022-07-08T13:47:00+08:00');
  const [titleText, setTitleText] = useState<string>();
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
    console.log(countdate_events_data)
    history.push("/home")
    let content = JSON.stringify(countdate_events_data)
    await Storage.set({
      key: "countdate_events_data",
      value: content
    });
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Add Countdate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add Countdate</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">事件日期</IonLabel>
              <IonDatetime size="cover" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}></IonDatetime>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">事件名稱</IonLabel>
              <IonInput clearInput={true} value={titleText} placeholder="輸入事件名稱" onIonChange={e => setTitleText(e.detail.value!)}></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={() => add_new_countdate_item({event_name: titleText,date:selectedDate})}>新增</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Add;
