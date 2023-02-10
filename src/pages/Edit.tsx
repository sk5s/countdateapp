import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonReorderGroup,
  ItemReorderEventDetail,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonFab,
  IonFabButton
} from "@ionic/react";
import { add } from 'ionicons/icons'
import { capitalize } from "../lib/Capitalize";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import key from '../lib/storageKey.json'
import CountdateItem from "../components/CountdownItem";
import { on, trigger } from "../lib/Events";

const Edit: React.FC = () => {
  let countdate_events_data: {
    id: string;
    event_name: string;
    date: string;
  }[] = [];
  const { t, i18n } = useTranslation()
  const [editable, setEditable] = useState<boolean>(true)
  const [reorderIsDisabled, setReorderIsDisabled] = useState(false)

  function toggleReorder() {
    setReorderIsDisabled(current => !current);
  }
  function swapElement(from:any, to:any) {
    let copyarr = [...countdate_events_data_list]
    copyarr.splice(to, 0, copyarr.splice(from, 1)[0])
    return copyarr
  }
  async function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    console.log(swapElement(event.detail.from,event.detail.to))
    let content = JSON.stringify(swapElement(event.detail.from,event.detail.to));
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
  const [countdate_events_data_list, set_countdate_events_data_list] = useState(countdate_events_data)
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
    check_countdate_events_storage_data()
    on("countdate_data:change", () => {
      check_countdate_events_storage_data()
    })
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{capitalize(t("edit"))}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{capitalize(t("edit"))}</IonTitle>
          </IonToolbar>
        </IonHeader>
      
        <IonList inset={true}>
          {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
          <IonReorderGroup disabled={reorderIsDisabled} onIonItemReorder={handleReorder}>
          {(() => {
            let row = [];
            if (countdate_events_data_list.length) {
              countdate_events_data_list.map((event) => {
                row.push(
                  <CountdateItem
                    key={event.id}
                    id={event.id}
                    event={event.event_name}
                    date={event.date}
                    editable={editable}
                  />
                );
              });
            } else {
              row.push(
                <IonItem>
                  {t("no_data")}
                </IonItem>
              );
            }
            return row;
          })()}
          </IonReorderGroup>
        </IonList>
        {/* <IonGrid style={{marginTop: "56px"}}>
          <IonRow>
            <IonCol>
              <IonButton expand="full" shape="round" onClick={(e) => setEditable(!editable)} disabled={countdate_events_data_list.length === 0}>
                <IonIcon icon={create} /> {!editable ? capitalize(t("edit")) : capitalize(t("complete"))+t("between_words")+t("edit")}
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="full" shape="round" onClick={toggleReorder}>
                {capitalize(t("toggle"))+t("between_words")+t("reorder")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid> */}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Edit;
