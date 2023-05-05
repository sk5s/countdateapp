import { IonButton, IonChip, IonContent, IonIcon, IonItem, IonLabel, IonPopover, IonTextarea } from "@ionic/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Preferences } from "@capacitor/preferences";
import key from '../lib/storageKey.json'
import { trigger } from "../lib/Events";
import ReactMarkdown from 'react-markdown'
import { capitalize } from "../lib/Capitalize";
import { informationCircle, save } from "ionicons/icons";

export default function DescriptionEditor({
  id,
  description,
  editable,
  accent
}:{
  id:string;
  description: string;
  editable: boolean;
  accent: string;
}){
  const [editDescription, setEditDescription] = useState<string>(description)
  const [needToSave, setNeedToSave] = useState(false)
  const [t] = useTranslation()
  let countdate_events_data = [];
  const edit_this_countdate_item_description = async (newDescription:string|undefined|null) => {
    if (newDescription == undefined || newDescription == null) return
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      for (const i of countdate_events_data) {
        if (String(i.id) == String(id)) {
          i.description = newDescription
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
    <>
    {editable ? 
    <>
      <IonItem>
        <IonTextarea
          aria-label="Description editor"
          placeholder={capitalize(t("description"))}
          autoGrow={true}
          fill="solid"
          value={editDescription}
          onIonChange={e => {setEditDescription(e.detail.value!);setNeedToSave(true)}}
        ></IonTextarea>
        <IonButton color={accent} onClick={() => {edit_this_countdate_item_description(editDescription);setNeedToSave(false)}} size="default" shape="round"><IonIcon icon={save} /></IonButton>
      </IonItem>
      <IonButton size="small" id="click-trigger" color={accent} shape="round"> <IonIcon icon={informationCircle}></IonIcon> </IonButton>
      <IonPopover trigger="click-trigger" triggerAction="click">
        <IonContent class="ion-padding">{t("description_tips")}</IonContent>
      </IonPopover>
    </>
     : <>
     {editDescription ?
     <>
      {needToSave ?
      <IonChip style={{marginLeft: "10px"}} color={accent}>
        <IonIcon icon={informationCircle}></IonIcon>
        <IonLabel>{t("need_to_save")}</IonLabel>
      </IonChip>
      : <></>}
      <ReactMarkdown
        children={editDescription}
        linkTarget="_blank"
      />
      </>: <h5>{capitalize(t("description"))} {t("no_data")}</h5>}
    </>
    }
    </>
  )
}