import { useState } from 'react';
import { IonIcon, IonActionSheet, IonContent, IonButton, IonLabel, useIonPicker } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { language } from 'ionicons/icons'
import { capitalize } from '../lib/Capitalize';

export default function LanguageSelectAction(){
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [t,i18n] = useTranslation()
  const [present] = useIonPicker()
  const allLangName = ["zh-TW","en-US","zh-CN"]
  const openPicker = async () => {
    present({
      columns: [
        {
          name: 'lang',
          options: createOptions()
        },
      ],
      buttons: [
        {
          text: capitalize(t("cancel")),
          role: 'cancel',
        },
        {
          text: capitalize(t("confirm")),
          handler: (value) => {
            console.log(`You selected: ${value.lang.value}`)
            i18n.changeLanguage(value.lang.value)
          },
        },
      ],
    });
  };
  const createOptions = () => {
    let opt:any = []
    allLangName.forEach((name) => {
      opt.push({
        text: name,
        value: name
      });
    });
    return opt
  }

  return (
    <div>
      <IonLabel onClick={openPicker}>
        <IonIcon icon={language} /> {t("change_language")}
      </IonLabel>
    </div>
  );
}