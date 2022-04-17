import { useState, useEffect } from "react";
import CountdownCard from "./CountdownCard";
import TitleCard from "./TitleCard";
import { Storage } from "@capacitor/storage";
import { IonButton, IonPopover, IonContent, useIonLoading, IonGrid, IonRow, IonCol } from "@ionic/react";
import { useHistory } from "react-router";

export default function CountdownCards(): JSX.Element {
  const history = useHistory()
  let countdate_events_data: {
    id: string;
    event_name: string;
    date: string;
  }[] = [
    // {id: "1", event_name: "111會考", date: "2022-05-21"},
    // {id: "2", event_name: "112學測", date: "2023-01-13"}
  ];
  const check_countdate_events_storage_data = async () => {
    present({
      duration: 100,
    });
    const { value } = await Storage.get({ key: "countdate_events_data" });
    if (value) {
      countdate_events_data = JSON.parse(value);
      console.log(countdate_events_data);
    } else {
      countdate_events_data = [];
    }
    set_popover_content(`${value}`);
    set_countdate_events_data_list(countdate_events_data);
  };
  const delete_countdate_events_storage_data = async () => {
    await Storage.remove({ key: 'countdate_events_data' });
  }
  useEffect(() => {
    check_countdate_events_storage_data();
    console.log(countdate_events_data);
  }, []);
  const [countdate_events_data_list, set_countdate_events_data_list] = useState(
    countdate_events_data
  );
  const [popover_oepn, set_popover_oepn] = useState(false);
  const [popover_content, set_popover_content] = useState("");
  const [present, dismiss] = useIonLoading();
  return (
    <div>
      {(() => {
        let row = [];
        if (countdate_events_data_list.length) {
          countdate_events_data_list.map((event) => {
            row.push(
              <CountdownCard
                key={event.id}
                event={event.event_name}
                date={event.date}
              />
            );
          });
        } else {
          row.push(
            <div key="div">
              <TitleCard
                key="title"
                title="新增 Countdate 吧！"
                subtitle="沒有資料"
              />
            </div>
          );
        }
        return row;
      })()}

      <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton expand="full" shape="round" routerLink="/add" color="primary">
              新增 Countdate
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton expand="full" shape="round" onClick={check_countdate_events_storage_data} color="primary">
              重新整理
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              fill="outline"
              shape="round"
              expand="full"
              onClick={() => {
                check_countdate_events_storage_data();
                present({
                  duration: 100,
                });
                set_popover_oepn(true);
              }}
              color="primary"
            >
              檢查資料
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonPopover
        isOpen={popover_oepn}
        onDidDismiss={() => set_popover_oepn(false)}
      >
        <IonContent>
          Raw Data: {popover_content}
          <IonButton
            onClick={() => {
              delete_countdate_events_storage_data();
              present({
                duration: 100,
              });
              history.push('/')
              check_countdate_events_storage_data()
            }}
            color="danger"
            expand="full"
          >
            刪除所有資料
          </IonButton>
        </IonContent>
      </IonPopover>
    </div>
  );
}
