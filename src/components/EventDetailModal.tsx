import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonModal,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
// import { App as NativeApp } from "@capacitor/app";
import { useTranslation } from "react-i18next";
import DescriptionEditor from "./DescriptionEditor";
import { create, shareSocial } from "ionicons/icons";
import CountdateItem from "./CountdownItem";
import { Preferences } from "@capacitor/preferences";
import key from "../lib/storageKey.json";
import { trigger } from "../lib/Events";
import { useState } from "react";
import { isPlatform } from "@ionic/core";
import { QRCodeSVG } from "qrcode.react";
import { formatDate } from "../lib/DateFormat";
import { appendCorrectTimezone, toIsoString } from "../lib/Countdate";

export default function EventDetailModal({
  detailStr,
  contentEditable,
  setContentEditable,
  isOpen,
  setIsOpen,
  myprops,
}: {
  detailStr: string;
  contentEditable: boolean;
  setContentEditable: any;
  isOpen: boolean;
  setIsOpen: any;
  myprops: any;
}) {
  const [needToSave, setNeedToSave] = useState(false);
  const [description, setDescription] = useState(
    myprops.description ? myprops.description : ""
  );
  const { t } = useTranslation();
  const [presentAlert] = useIonAlert();
  let countdate_events_data = [];
  const closeModal = () => {
    if (needToSave) {
      presentAlert({
        header: t("c.editor.needToSave"),
        buttons: [
          {
            text: t("g.discard"),
            handler: () => {
              setIsOpen(false);
              setNeedToSave(false);
              setDescription(myprops.description);
            },
          },
          t("g.confirm"),
        ],
      });
    } else {
      setIsOpen(false);
    }
  };
  // NativeApp.addListener("backButton", () => {
  //   closeModal();
  // });
  const addOneMonthHandler = () => {
    presentAlert({
      header: t("c.editor.quickEdit.confirm"),
      buttons: [
        t("g.cancel"),
        {
          text: t("g.confirm"),
          role: "confirm",
          handler: () => {
            addOneMonth();
          },
        },
      ],
      onDidDismiss: (e: CustomEvent) => console.log(e.detail.role),
    });
  };
  const addOneMonth = () => {
    let date = new Date(appendCorrectTimezone(myprops.date));
    date.setMonth(date.getMonth() + 1);
    editDateData(toIsoString(date));
  };
  const minusOneDayHandler = () => {
    let date = new Date(appendCorrectTimezone(myprops.date));
    date.setDate(date.getDate() - 1);
    editDateData(toIsoString(date));
  };
  const addOneDayHandler = () => {
    let date = new Date(appendCorrectTimezone(myprops.date));
    date.setDate(date.getDate() + 1);
    editDateData(toIsoString(date));
  };
  const editDateData = async (newDate: string | undefined | null) => {
    if (newDate === undefined || newDate === null) return;
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      for (const i of countdate_events_data) {
        if (String(i.id) === String(myprops.id)) {
          i.date = newDate;
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
          {(isPlatform("android") && isPlatform("hybrid")) ||
            (isPlatform("ios") && isPlatform("hybrid")) ? (
            <IonButtons>
              <IonButton id="share-trigger" color={myprops.accent}>
                <IonIcon icon={shareSocial} />
              </IonButton>
              <IonPopover trigger="share-trigger" triggerAction="click">
                <IonContent class="ion-padding">
                  {t("c.editor.shareDescription")}
                  <QRCodeSVG
                    size={172}
                    includeMargin={true}
                    value={`https://app.countdate.sk5s.com/share?title=${myprops.event.replace(
                      / /g,
                      "%20"
                    )}&date=${myprops.date.split("T")[0]}`}
                    imageSettings={{
                      src: "/assets/icon/icon.png",
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                </IonContent>
              </IonPopover>
            </IonButtons>
          ) : (
            <></>
          )}
          <IonTitle>{myprops.event}</IonTitle>
          <IonButtons slot="end">
            <IonButton color={myprops.accent} onClick={() => closeModal()}>
              {t("g.close")}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <>
            {contentEditable ? (
              <IonCardContent>
                <div style={{ marginBottom: 16 }}>
                  {t("p.edit.description")}
                </div>
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
                  <span style={{ marginRight: 10 }}>
                    {t("c.editor.quickEdit.title")}
                  </span>
                  <IonButton
                    style={{ marginRight: 8 }}
                    onClick={() => addOneMonthHandler()}
                    size="small"
                    color={myprops.accent}
                    shape="round"
                  >
                    {t("c.editor.quickEdit.addOneMonth")}
                  </IonButton>
                  <IonButton
                    style={{ marginRight: 8 }}
                    onClick={() => minusOneDayHandler()}
                    size="small"
                    color={myprops.accent}
                    shape="round"
                  >
                    {t("c.editor.quickEdit.minusOneDay")}
                  </IonButton>
                  <IonButton
                    style={{ marginRight: 8 }}
                    onClick={() => addOneDayHandler()}
                    size="small"
                    color={myprops.accent}
                    shape="round"
                  >
                    {t("c.editor.quickEdit.addOneDay")}
                  </IonButton>
                </IonItem>
              </IonCardContent>
            ) : (
              <>
                <IonCardHeader>
                  <IonCardSubtitle style={{ fontSize: "1.2rem" }}>
                    {formatDate(new Date(myprops.date))} • {myprops.event}
                  </IonCardSubtitle>
                  <IonCardTitle style={{ fontSize: "2.8rem" }}>
                    {detailStr}
                  </IonCardTitle>
                </IonCardHeader>
              </>
            )}
          </>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <DescriptionEditor
              needToSave={needToSave}
              setNeedToSave={setNeedToSave}
              id={myprops.id}
              setDescription={setDescription}
              description={description}
              editable={contentEditable}
              accent={myprops.accent}
            />
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              color={myprops.accent}
              onClick={(e) => setContentEditable(!contentEditable)}
            >
              <IonIcon icon={create} />{" "}
              {!contentEditable
                ? t("c.editor.edit")
                : t("c.editor.completeEdit")}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
}
