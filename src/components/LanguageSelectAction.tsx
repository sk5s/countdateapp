import { useState } from 'react';
import { IonActionSheet, IonContent, IonButton, IonLabel } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

export default function LanguageSelectAction(){
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [t,i18n] = useTranslation()

  return (
    <div>
      <IonLabel onClick={() => setShowActionSheet(true)}>
        {t("change_language")}
      </IonLabel>
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[{
          text: 'zh-TW',
          handler: () => {
            i18n.changeLanguage('zh-TW')
          }
        }, {
          text: 'en-US',
          handler: () => {
            i18n.changeLanguage('en-US')
          }
        }, {
          text: 'Cancel',
          icon: close,
          role: 'cancel'
        }]}
      >
      </IonActionSheet>
    </div>
  );
}