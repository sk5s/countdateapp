import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from "@ionic/react";
import { language } from "ionicons/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";
import { trigger } from "../lib/Events";

export default function LanguageSelectModal({accent}:{accent: string;}) {
  const {t,i18n} = useTranslation()

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [radioSelected, setRadioSelected] = useState("zh-TW");

  const allLangName = ["zh-TW", "en-US", "zh-CN", "th-TH"];
  const langAndDetail:any = {
    "zh-TW": {
      name: "繁體中文",
      by: "sk5s"
    },
    "zh-CN": {
      name: "簡體中文",
      by: "sk5s, Nqtural"
    },
    "en-US": {
      name: "English (US)",
      by: "sk5s, Nqtural"
    },
    "th-TH": {
      name: "Thai ไทย",
      by: "nutsupra"
    }
  }
  return (
    <>
      <IonLabel onClick={() => setModalIsOpen(true)}>
        <IonIcon icon={language} /> {t("change_language")}
      </IonLabel>

      <IonModal isOpen={modalIsOpen} onDidDismiss={() => setModalIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("change_language")}</IonTitle>
            <IonButtons slot="start">
              <IonButton color={accent} onClick={() => setModalIsOpen(false)}>
                {capitalize(t("close"))}
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton color={accent} onClick={() => {
                console.log(`You selected: ${radioSelected}`);
                i18n.changeLanguage(radioSelected);
                trigger("countdate_data:change")
              }}>
                {capitalize(t("confirm"))}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonRadioGroup
              onIonChange={(e) => {
                setRadioSelected(e.detail.value);
              }}
              value={radioSelected}
            >
              {(() => {
                let rows: any = [];
                allLangName.forEach((element,i) => {
                  rows.push(
                    <IonItem key={element}>
                      <IonRadio color={accent} labelPlacement="end" value={element} justify="space-between"></IonRadio>
                      <IonLabel>
                        {langAndDetail[element].name}
                      </IonLabel>
                      <small>{langAndDetail[element].by}</small>
                    </IonItem>
                  );
                });
                return rows;
              })()}
            </IonRadioGroup>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  )
}
