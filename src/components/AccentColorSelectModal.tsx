import { useState } from "react";
import {
  IonIcon,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonRadioGroup,
  IonItem,
  IonRadio,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { Preferences } from "@capacitor/preferences";
import key from "../lib/storageKey.json";
import { capitalize } from "../lib/Capitalize";
import { trigger } from "../lib/Events";
import { colorPalette, ellipse } from "ionicons/icons";

export default function AccentColorSelectModal() {
  const [t, i18n] = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [radioSelected, setRadioSelected] = useState("primary");
  const changeAccentColorTo = async (colorName: string) => {
    await Preferences.set({
      key: key.accent,
      value: colorName,
    });
    console.log("change accent color to: " + colorName);
    trigger("countdate_accent:change");
    setModalIsOpen(false);
  };
  const allColorName = [
    "primary",
    "secondary",
    "tertiary",
    "success",
    "warning",
    "danger",
    "medium",
    "dark",
  ];
  const realColorName = {
    primary: "Navy Blue (Default)",
    secondary: "Teal",
    tertiary: "Violet",
    success: "Green",
    warning: "Yellow",
    danger: "Red",
    medium: "Grey",
    dark: "Black",
  };
  const openPicker = async () => {
    setModalIsOpen(true);
  };

  return (
    <div>
      <IonLabel onClick={openPicker}>
        <IonIcon icon={colorPalette} /> {t("change_accent_color")}
      </IonLabel>

      <IonModal isOpen={modalIsOpen} onDidDismiss={() => setModalIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("change_accent_color")}</IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={() => setModalIsOpen(false)}>
                {capitalize(t("close"))}
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={() => changeAccentColorTo(radioSelected)}>
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
                allColorName.map((element) => {
                  rows.push(
                    <IonItem key={element}>
                      <IonLabel>
                        <IonIcon color={element} icon={ellipse} size="large" />{" "}
                        {realColorName[element as keyof typeof realColorName]}
                      </IonLabel>
                      <IonRadio slot="end" value={element}></IonRadio>
                    </IonItem>
                  );
                });
                return rows;
              })()}
            </IonRadioGroup>
          </IonList>
        </IonContent>
      </IonModal>
    </div>
  );
}
