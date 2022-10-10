import { useState, useEffect } from "react";
import CountdownCard from "./CountdownCard";
import TitleCard from "./TitleCard";
import { Preferences as Storage } from "@capacitor/preferences";
import { isPlatform, useIonAlert, IonButton, IonModal, IonContent, useIonLoading, IonGrid, IonRow, IonCol, IonTextarea, IonLabel } from "@ionic/react";
import { useHistory } from "react-router";
import { on } from '../lib/Events'
import { useTranslation } from "react-i18next";
import { Device } from '@capacitor/device';
import { copy } from '../lib/Clipboard'
import Toast from "../lib/Toast";
import key from '../lib/storageKey.json'

export default function CountdownCards(): JSX.Element {
  const history = useHistory()
  const { t, i18n } = useTranslation()
  const [languageCode, setLanguageCode] = useState("")
  const [presentAlert] = useIonAlert();
  let countdate_events_data: {
    id: string;
    event_name: string;
    date: string;
  }[] = [
    // {id: "1", event_name: "111會考", date: "2022-05-21"},
    // {id: "2", event_name: "112學測", date: "2023-01-13"}
  ];
  const check_countdate_events_storage_data = async () => {
    presentLoading({
      duration: 100,
      showBackdrop: false
    });
    const { value } = await Storage.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      // console.log(countdate_events_data);
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
    // console.log(countdate_events_data);
    on("countdate_data:change", () => {
      check_countdate_events_storage_data()
    })
    const getLanguage = async () => {
      const data =  await Device.getLanguageCode()
      setLanguageCode(data.value)
    }
    getLanguage()
  }, []);
  const [countdate_events_data_list, set_countdate_events_data_list] = useState(countdate_events_data);
  const [popover_oepn, set_popover_oepn] = useState<boolean>(false);
  const [popover_content, set_popover_content] = useState<string>();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [editable, setEditable] = useState<boolean>(false)
  return (
    <div>
      {(() => {
        let row = [];
        if (countdate_events_data_list.length) {
          countdate_events_data_list.map((event) => {
            row.push(
              <CountdownCard
                key={event.id}
                id={event.id}
                event={event.event_name}
                date={event.date}
                editable={editable}
              />
            );
          });
        } else {
          row.push(
            <div key="div">
              <TitleCard
                key="title"
                title={t("add") + "Countdate" +t("exclamation_mark")}
                subtitle={t("no_data")}
              />
              <IonButton key="add" routerLink="/add" color="primary" shape="round">
                {t("add")}{t("between_words")}Countdate
              </IonButton>
            </div>
          );
        }
        return row;
      })()}

      <IonGrid>
        <IonRow>
          <IonCol>
            {/* <IonButton expand="full" shape="round" onClick={check_countdate_events_storage_data} color="primary">
              {t("refresh")}
            </IonButton> */}
            <IonButton expand="full" shape="round" onClick={(e) => setEditable(!editable)} disabled={countdate_events_data_list.length === 0}>
              {t("edit")}
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton expand="full" shape="round" routerLink="/settings" color="primary">
              {t("settings")}
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              fill="outline"
              shape="round"
              expand="full"
              onClick={() => {
                check_countdate_events_storage_data();
                set_popover_oepn(true);
              }}
              color="primary"
            >
              {`${t("check")}${t("between_words")}${t("data")}`}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonModal
        isOpen={popover_oepn}
        onDidDismiss={() => set_popover_oepn(false)}
      >
        <IonButton shape="round" onClick={() => set_popover_oepn(false)}>
          {t("close")}
        </IonButton>
        <IonButton
          shape="round"
          onClick={() => {
            presentAlert({
              header: t("delete")+t("question_mark"),
              message: '確認刪除所有資料？',
              buttons: [
                '取消',
                { text: '確認', handler: (d) => {
                  delete_countdate_events_storage_data();
                  presentLoading({
                    duration: 100,
                    showBackdrop: false
                  });
                  check_countdate_events_storage_data()
                }},
              ]
            })
          }}
          color="danger"
        >
          刪除所有資料
        </IonButton>
        {(isPlatform("android") && isPlatform("hybrid")) || (isPlatform("ios") && isPlatform("hybrid")) ? 
        <IonButton shape="round" onClick={() => {
          copy(popover_content)
            Toast(t("copied")+t("exclamation_mark"))
          }}
        >
          複製原始資料
        </IonButton> : ''
        }
        <IonContent>
          <IonTextarea autoGrow={true} value={popover_content} readonly={true}></IonTextarea>
          <IonLabel>{languageCode}</IonLabel>
        </IonContent>
      </IonModal>
    </div>
  );
}
