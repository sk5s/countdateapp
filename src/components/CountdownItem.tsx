import {
  IonReorder,
  IonItem,
  IonIcon,
  useIonAlert,
  IonButton,
  IonLabel,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonPopover,
  IonContent,
  IonChip,
  IonText,
  useIonToast
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";

import { reorderThree, trash } from "ionicons/icons";
import { trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";
import key from "../lib/storageKey.json"
import format from "date-fns/format";
import { useState } from "react";
import "./CountdownItem.css"

export default function CountdateItem(props: {
  date: string;
  event: string;
  editable: boolean;
  id: string;
  accent: string;
  textColor: string;
}): JSX.Element {
  const [t] = useTranslation()
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [modalIsOpen,setModalIsOpen] = useState(false)
  let countdate_events_data = [];
  const handleDelete = () => {
    presentAlert({
      header: capitalize(t("delete")) + t("question_mark"),
      buttons: [
        capitalize(t("cancel")),
        {
          text: capitalize(t("confirm")),
          role: 'confirm',
          handler: () => {
            remove_this_countdate_item()
          },
        },
      ],
      onDidDismiss: (e: CustomEvent) => console.log(e.detail.role),
    })
  }
  const remove_this_countdate_item = async () => {
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      countdate_events_data = countdate_events_data.filter((item: any) => {
        console.log(item.id);
        console.log(String(item.id) != String(props.id));
        return String(item.id) != String(props.id);
      });
      let content = JSON.stringify(countdate_events_data);
      await Preferences.set({
        key: key.data,
        value: content,
      });
      trigger("countdate_data:change");
      presentToast({
        message: capitalize(t("deleted"))+t("exclamation_mark"),
        duration: 1500,
        position: "bottom",
        color: props.accent
      });
    }
  };
  const edit_this_countdate_item_name_handler = () => {
    presentAlert({
      buttons: [{text:capitalize(t("cancel")),role:"cancel"}, {text:capitalize(t("confirm")),handler:(data) => {if (data.name!='') edit_this_countdate_item_name(data.name)}}],
      inputs: [
        {
          name: 'name',
          value: props.event,
          placeholder: capitalize(t("input"))+t("between_words")+t("event")+t("between_words")+t("name")
        }
      ],
    })
  }
  const edit_this_countdate_item_name = async (newName:string) => {
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      for (const i of countdate_events_data) {
        if (String(i.id) == String(props.id)) {
          i.event_name = newName;
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
  const edit_this_countdate_item_date = async (newDate:string) => {
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      for (const i of countdate_events_data) {
        if (String(i.id) == String(props.id)) {
          let olddate = i.date;
          i.date = newDate + "T" + olddate.split("T")[1];
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
    <IonItem>
      <IonLabel>
        <IonText color={props.accent} style={{color:props.textColor}}>
          <h1 style={{cursor: "pointer"}} onClick={edit_this_countdate_item_name_handler}>{props.event}</h1>
        </IonText>
        <IonChip color={props.accent} onClick={() => setModalIsOpen(!modalIsOpen)}>{format(new Date(props.date), 'yyyy / MM / dd')}</IonChip>
      </IonLabel>
      <IonIcon
        slot="end"
        icon={trash}
        onClick={handleDelete}
        style={{cursor: "pointer"}}
      />
      <IonReorder slot="end">
        <IonIcon icon={reorderThree}></IonIcon>
      </IonReorder>
      <IonPopover isOpen={modalIsOpen} size="cover" keepContentsMounted={false}>
        <IonDatetime mode="md" color={props.accent} presentation="date" showDefaultButtons={true} min={(parseInt(format(new Date(), 'yyyy'))-2).toString()} max={(parseInt(format(new Date(), 'yyyy'))+2).toString()} onIonChange={e => edit_this_countdate_item_date(format(new Date(`${e.detail.value}`),'yyyy-MM-dd'))} value={props.date} id="datetime"></IonDatetime>
      </IonPopover>
    </IonItem>
  );
}
