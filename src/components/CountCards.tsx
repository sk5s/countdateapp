import { useState, useEffect } from "react";
import CountdownCard from "./CountdownCard";
import CountupCard from "./CountupCard";
import TitleCard from "./TitleCard";
import { Preferences as Storage } from "@capacitor/preferences";
import { IonIcon, isPlatform, useIonAlert, IonButton, IonModal, IonContent, useIonLoading, IonGrid, IonRow, IonCol, IonTextarea, IonLabel, useIonToast, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from "@ionic/react";
import { settings, create, information, add, arrowBackCircle, arrowForwardCircle } from 'ionicons/icons'
import { useHistory } from "react-router";
import { on } from '../lib/Events'
import { useTranslation } from "react-i18next";
import { Device } from '@capacitor/device';
import { copy } from '../lib/Clipboard'
import key from '../lib/storageKey.json'
import changeViewImg from '../assets/countdate-count-tour.jpg'

import { capitalize } from "../lib/Capitalize";

export default function CountCards({view,accent,textColor,count,changeCount}:{view:string;accent:string;textColor:string;count:string;changeCount:any;}): JSX.Element {
  const history = useHistory()
  const { t, i18n } = useTranslation()
  const [languageCode, setLanguageCode] = useState("")
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
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
    if (value?.includes("null")) return
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
    await Storage.remove({ key: key.data });
  }
  const getDevMode = async () => {
    const { value } = await Storage.get({ key: key.dev });
    if (value == "true") {
      setDevChecked(true)
    } else {
      setDevChecked(false)
    }
  }
  on("countdate_dev:change", () => {
    getDevMode()
  })
  getDevMode()
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
  const [devChecked, setDevChecked] = useState<boolean>(false)

  return (
    <div>
      {(() => {
        let row = [];
        if (countdate_events_data_list.length) {
          countdate_events_data_list.map((event) => {
            let now = new Date()
            let countFrom = new Date(event.date)
            let timeDifference = now.getTime() - countFrom.getTime()
            if (timeDifference < 0 && count == "countdown"){//countdown
              row.push(
                <CountdownCard
                  key={event.id}
                  id={event.id}
                  event={event.event_name}
                  date={event.date}
                  editable={editable}
                  view={view}
                  accent={accent}
                  textColor={textColor}
                />
              );
            } else if (timeDifference >= 0 && count == "countup"){
              row.push(
                <CountupCard
                  key={event.id}
                  id={event.id}
                  event={event.event_name}
                  date={event.date}
                  editable={editable}
                  view={view}
                  accent={accent}
                  textColor={textColor}
                />
              );
            }
          });
        }
        console.log(row.length)
        if (row.length == 0 && countdate_events_data_list.length && count=="countdown") {
          row.push(
            <div key="div">
              <IonCard>
                <img src={changeViewImg} alt="Change view to countup" />
                <IonCardHeader>
                  <IonCardSubtitle>{t("no_data")}</IonCardSubtitle>
                  <IonCardTitle>
                    <IonButton onClick={() => {changeCount("countup")}} color={accent} shape="round">
                      <IonIcon icon={arrowForwardCircle} /> {capitalize(t("countup"))}
                    </IonButton>
                  </IonCardTitle>
                </IonCardHeader>
              </IonCard>
            </div>
          )
        } else if (row.length == 0 && countdate_events_data_list.length && count=="countup") {
          row.push(
            <div key="div">
              <IonCard>
                <img src={changeViewImg} alt="Change view to countdown" />
                <IonCardHeader>
                  <IonCardSubtitle>{t("no_data")}</IonCardSubtitle>
                  <IonCardTitle>
                    <IonButton onClick={() => {changeCount("countdown")}} color={accent} shape="round">
                      <IonIcon icon={arrowBackCircle} /> {capitalize(t("countdown"))}
                    </IonButton>
                  </IonCardTitle>
                </IonCardHeader>
              </IonCard>
            </div>
          )
        } else if (row.length == 0) {
          row.push(
            <div key="div">
              <TitleCard
                key="title"
                title={capitalize(t("add")) + t("between_words") + "Countdate" +t("exclamation_mark")}
                subtitle={t("no_data")}
              />
              <IonButton key="add" routerLink="/add" color={accent} shape="round" style={{marginLeft: 16}}>
                <IonIcon icon={add} /> {capitalize(t("add"))}{t("between_words")}Countdate
              </IonButton>
            </div>
          );
        }
        return row;
      })()}

      <IonGrid style={{marginTop: "56px"}}>
        <IonRow>
          <IonCol>
            {/* <IonButton expand="full" shape="round" onClick={check_countdate_events_storage_data} color="primary">
              {t("refresh")}
            </IonButton> */}
            {/* <IonButton expand="full" shape="round" onClick={(e) => setEditable(!editable)} disabled={countdate_events_data_list.length === 0}>
              <IonIcon icon={create} /> {!editable ? capitalize(t("edit")) : capitalize(t("complete"))+t("between_words")+t("edit")}
            </IonButton> */}
            <IonButton expand="full" shape="round" routerLink="/edit" color={accent} disabled={countdate_events_data_list.length === 0}>
              <IonIcon icon={create} /> {capitalize(t("edit"))}
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton expand="full" shape="round" routerLink="/settings" color={accent}>
              <IonIcon icon={settings} /> {capitalize(t("settings"))}
            </IonButton>
          </IonCol>
          {devChecked ? 
          <IonCol>
            <IonButton
              fill="outline"
              shape="round"
              expand="full"
              onClick={() => {
                check_countdate_events_storage_data();
                set_popover_oepn(true);
              }}
              color={accent}
            >
              <IonIcon icon={information} /> {capitalize(t("check"))+t("between_words")+t("data")}
            </IonButton>
          </IonCol>
          : <></>}
        </IonRow>
      </IonGrid>

      <IonModal
        isOpen={popover_oepn}
        onDidDismiss={() => set_popover_oepn(false)}
      >
        <IonButton onClick={() => set_popover_oepn(false)}>
          {capitalize(t("close"))}
        </IonButton>
        <IonButton
          onClick={() => {
            presentAlert({
              header: capitalize(t("delete")) + t("question_mark"),
              message: t("delete_data_message"),
              buttons: [
                capitalize(t("cancel")),
                { text: capitalize(t("confirm")), handler: (d) => {
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
          {capitalize(t("delete"))+t("between_words")+t("all")+t("between_words")+t("data")}
        </IonButton>
        {(isPlatform("android") && isPlatform("hybrid")) || (isPlatform("ios") && isPlatform("hybrid")) ? 
        <IonButton onClick={() => {
            copy(popover_content)
            presentToast({
              message: capitalize(t("copied"))+t("exclamation_mark"),
              duration: 1500,
              position: "bottom"
            });
          }}
        >
          {t("copy_data_label")}
        </IonButton> : ''
        }
        <IonContent>
          <div style={{padding: "20px"}}>
            LanguageCode: <IonLabel>{languageCode}</IonLabel><br/>
            RawData: <IonTextarea autoGrow={true} value={popover_content} readonly={true}></IonTextarea>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
}
