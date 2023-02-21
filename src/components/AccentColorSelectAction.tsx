import { useState } from 'react';
import { IonIcon, IonActionSheet, IonLabel, useIonPicker } from '@ionic/react';
import { close, colorPalette } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { Preferences } from '@capacitor/preferences';
import key from '../lib/storageKey.json'
import { capitalize } from '../lib/Capitalize';
import { trigger } from '../lib/Events';
import { ellipse } from 'ionicons/icons'

export default function AccentColorSelectAction(){
  const [t,i18n] = useTranslation()
  const [present] = useIonPicker()
  const changeAccentColorTo = async (colorName:string) => {
    await Preferences.set({
      key: key.accent,
      value: colorName,
    });
    console.log("change accent color to: "+colorName)
    trigger("countdate_accent:change")
  }
  const allColorName = ["primary","secondary","tertiary","success","warning","danger","medium","dark"]
  const openPicker = async () => {
    present({
      columns: [
        {
          name: 'accent',
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
            console.log(`You selected: ${value.accent.value}`);
            changeAccentColorTo(value.accent.value)
          },
        },
      ],
    });
  };
  const createOptions = () => {
    let opt:any = []
    allColorName.forEach((name) => {
      opt.push({
        text: capitalize(name),
        value: name
      });
    });
    return opt
  }

  return (
    <div>
      <IonLabel onClick={openPicker}>
        <IonIcon icon={colorPalette} /> {t("change_accent_color")}
      </IonLabel>
    </div>
  );
}
