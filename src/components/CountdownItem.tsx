import {
  IonReorder,
  IonItem,
  IonIcon,
  useIonAlert,
  IonButton,
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";

import { reorderThree, trash } from "ionicons/icons";
import { trigger } from "../lib/Events";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";
import key from "../lib/storageKey.json"
import format from "date-fns/format";

export default function CountdateItem(props: {
  date: string;
  event: string;
  editable: boolean;
  id: string;
}): JSX.Element {
  const [t] = useTranslation()
  const [presentAlert] = useIonAlert();
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
    }
  };
  return (
    <IonItem>
      <span>{props.event} {format(new Date(props.date), 'yyyy / MM / dd')}</span>
      {props.editable && (
        <IonIcon
          slot="end"
          icon={trash}
          onClick={handleDelete}
        />
      )}
      <IonReorder slot="end">
        <IonIcon icon={reorderThree}></IonIcon>
      </IonReorder>
    </IonItem>
  );
}
