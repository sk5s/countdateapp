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
import { trigger } from "../lib/Events";
import { ChromePicker } from "react-color";
import "./TextColorSelectModal.css";

export default function TextColorSelectModal({ accent }: { accent: string }) {
  const {t} = useTranslation();
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
        <IonIcon icon={text} /> {t("c.settings.changeTextColor")}
      </IonLabel>

      <IonModal isOpen={modalIsOpen} onDidDismiss={() => setModalIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("c.settings.changeTextColor")}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setModalIsOpen(false)} color={accent}>
                {t("g.close")}
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
            {t("c.settings.followAccent")}
          </IonButton>
          <IonButton
            onClick={() => changeTextColor(hex)}
            expand="full"
            shape="round"
            color={accent}
          >
            <IonIcon icon={save} /> {t("c.settings.saveColor")}
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
