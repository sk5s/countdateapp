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
} from "@ionic/react";
import { refresh, save, text } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { Preferences } from "@capacitor/preferences";
import key from "../lib/storageKey.json";
import { capitalize } from "../lib/Capitalize";
import { trigger } from "../lib/Events";
import { ChromePicker } from "react-color";
import "./TextColorSelectModal.css";

export default function TextColorSelectModal({ accent }: { accent: string }) {
  const [t, i18n] = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hex, setHex] = useState("");
  const changeTextColor = async (color: string) => {
    await Preferences.set({
      key: key.textColor,
      value: color,
    });
    console.log("change text color to: " + color);
    trigger("countdate_text:change");
    setModalIsOpen(false);
  };
  const removeTextColor = async () => {
    await Preferences.remove({
      key: key.textColor,
    });
    console.log("remove text color");
    trigger("countdate_text:change");
    setModalIsOpen(false);
    trigger("countdate_text:change");
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
  const openPicker = async () => {
    setModalIsOpen(true);
  };

  const handleChangeComplete = (color: any) => {
    console.log(color.hex);
    setHex(color.hex);
  };

  return (
    <>
      <IonLabel onClick={openPicker}>
        <IonIcon icon={text} /> {t("change_text_color")}
      </IonLabel>

      <IonModal isOpen={modalIsOpen} onDidDismiss={() => setModalIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("change_text_color")}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setModalIsOpen(false)}>
                {capitalize(t("close"))}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonButton
            onClick={removeTextColor}
            expand="full"
            shape="round"
            color={accent}
          >
            <IonIcon icon={refresh} />{" "}
            {capitalize(t("follow")) +
              t("between_words") +
              t("system") +
              t("between_words") +
              t("accent_color")}
          </IonButton>
          <IonButton
            onClick={() => changeTextColor(hex)}
            expand="full"
            shape="round"
            color={accent}
          >
            <IonIcon icon={save} /> {t("change_text_color")}
          </IonButton>
          <div>
            <p style={{ fontSize: "3rem", color: hex, paddingBottom: "10px" }}>
              Text Color 文字顏色
            </p>
            <ChromePicker onChangeComplete={handleChangeComplete} color={hex} />
          </div>
        </IonContent>
      </IonModal>
    </>
  );
}
