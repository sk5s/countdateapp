import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonReorderGroup,
  ItemReorderEventDetail,
  IonIcon,
  IonItem,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import key from "../lib/storageKey.json";
import CountdateItem from "../components/CountdownItem";
import { on, trigger } from "../lib/Events";
import LocalizeBackButton from "../components/LocalizeBackButton";

const Edit: React.FC<{ accent: string; textColor: string }> = ({
  accent,
  textColor,
}) => {
  let countdate_events_data: {
    id: string;
    event_name: string;
    date: string;
  }[] = [];
  const { t } = useTranslation();

  function swapElement(from: any, to: any) {
    let copyarr = [...countdate_events_data_list];
    copyarr.splice(to, 0, copyarr.splice(from, 1)[0]);
    return copyarr;
  }
  async function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log("Dragged from index", event.detail.from, "to", event.detail.to);
    console.log(swapElement(event.detail.from, event.detail.to));
    let content = JSON.stringify(
      swapElement(event.detail.from, event.detail.to)
    );
    await Preferences.set({
      key: key.data,
      value: content,
    });
    trigger("countdate_data:change");

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete();
  }
  const [countdate_events_data_list, set_countdate_events_data_list] = useState(
    countdate_events_data
  );
  const check_countdate_events_storage_data = async () => {
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
    } else {
      countdate_events_data = [];
    }
    set_countdate_events_data_list(countdate_events_data);
  };
  useEffect(() => {
    check_countdate_events_storage_data();
    on("countdate_data:change", () => {
      check_countdate_events_storage_data();
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <LocalizeBackButton color={accent} />
          <IonTitle>{t("p.edit.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>{t("p.edit.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <span style={{ marginLeft: 36, marginTop: 10 }}>
          {t("p.edit.description")}
        </span>

        {/* Countdate lists */}
        <IonList inset={true}>
          {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {(() => {
              let row = [];
              if (countdate_events_data_list.length) {
                countdate_events_data_list.forEach((event) => {
                  row.push(
                    <CountdateItem
                      key={event.id}
                      id={event.id}
                      event={event.event_name}
                      date={event.date}
                      editable={true}
                      accent={accent}
                      textColor={textColor}
                    />
                  );
                });
              } else {
                row.push(<IonItem key="nodata">{t("p.edit.noData")}</IonItem>);
              }
              return row;
            })()}
          </IonReorderGroup>
        </IonList>

        {/* New countdate action button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/add" color={accent}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Edit;
