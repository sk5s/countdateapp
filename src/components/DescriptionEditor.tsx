import { IonButton, IonChip, IonIcon, IonItem, IonLabel, IonTextarea } from "@ionic/react";
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
  editable
}:{
  id:string;
  description: string;
  editable: boolean;
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
          placeholder="Description"
          autoGrow={true}
          value={editDescription}
          onIonChange={e => {setEditDescription(e.detail.value!);setNeedToSave(true)}}
        ></IonTextarea>
        <IonButton onClick={() => {edit_this_countdate_item_description(editDescription);setNeedToSave(false)}} shape="round"><IonIcon icon={save} /></IonButton>
      </IonItem>
      </>
     : <>
     {editDescription ?
     <>
      {needToSave ?
      <IonChip style={{marginLeft: "10px"}}>
        <IonIcon icon={informationCircle} color="dark"></IonIcon>
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