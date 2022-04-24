import { useState } from 'react';
import { IonActionSheet, IonContent, IonButton } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

export default function LanguageSelectAction(){
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [t,i18n] = useTranslation()

  return (
    <div>
      <IonButton onClick={() => setShowActionSheet(true)} expand="block">
        Change Language
      </IonButton>
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