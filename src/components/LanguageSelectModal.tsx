import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from "@ionic/react";
import { language } from "ionicons/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trigger } from "../lib/Events";

export default function LanguageSelectModal({accent}:{accent: string;}) {
  const {t,i18n} = useTranslation()

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [radioSelected, setRadioSelected] = useState("zh-TW");

  const allLangName = ["zh-TW", "en", "th", "zh-CN" ];
  const langAndDetail:any = {
    "zh-TW": {
      name: "繁體中文",
      by: "sk5s"
    },
    "en": {
      name: "English (US)",
      by: "sk5s, Nqtural"
    },
    "th": {
      name: "Thai ไทย",
      by: "nutsupra"
    },
    "zh-CN": {
      name: "简体中文",
      by: "sk5s"
    }
  }
  return (
    <>
      <IonLabel onClick={() => setModalIsOpen(true)}>
        <IonIcon icon={language} /> {t("c.settings.changeLang")}
      </IonLabel>

      <IonModal isOpen={modalIsOpen} onDidDismiss={() => setModalIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("c.settings.changeLang")}</IonTitle>
            <IonButtons slot="start">
              <IonButton color={accent} onClick={() => setModalIsOpen(false)}>
                {t("g.close")}
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton color={accent} onClick={() => {
                console.log(`You selected: ${radioSelected}`);
                i18n.changeLanguage(radioSelected);
                setModalIsOpen(false)
                trigger("countdate_data:change")
              }}>
                {t("g.confirm")}
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
                      <IonRadio color={accent} value={element}>
                        <h6>{langAndDetail[element].name}</h6>
                        <small>{langAndDetail[element].by}</small>
                      </IonRadio>
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
