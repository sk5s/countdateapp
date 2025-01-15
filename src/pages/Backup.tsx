import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

import { useTranslation } from "react-i18next";
import LocalizeBackButton from "../components/LocalizeBackButton";
import { useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { Preferences } from "@capacitor/preferences";
import key from "../lib/storageKey.json";
import { trigger } from "../lib/Events";

const Backup: React.FC<{ accent: string }> = ({ accent }) => {
  const { t } = useTranslation();
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>("android")

  const handleImport = () => {
    presentAlert({
      header: t("p.backup.confirm.title"),
      message: t("c.cards.deleteMessage"),
      buttons: [
        t("g.cancel"),
        {
          text: t("g.confirm"),
          handler: (d) => {
            document.getElementById("fileInput")?.click();
          }
        },
      ],
    });
  };
  
  const handleFileChange = async (event: any) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const jsonString = e.target?.result;
        if (typeof jsonString === "string") {
          const data = JSON.parse(jsonString);
          for (const k in data) {
            if (data[k] !== null){
              await Preferences.set({ key: key[k], value: data[k] });
            }
          }
          console.log("Data imported successfully");
          presentToast({
            message: t("p.backup.message.import.successful"),
            duration: 1500,
            position: "bottom",
          });
          trigger("countdate_data:change")
          trigger("countdate_dev:change")
          trigger("countdate_extend:change")
          trigger("countdate_relative:change")
          trigger("countdate_first:change")
          trigger("countdate_accent:change")
        } else {
          console.error("Invalid file content");
          presentToast({
            message: t("p.backup.message.failed") + `: Invalid file content`,
            duration: 1500,
            position: "bottom",
            color: "danger",
          });
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        presentToast({
          message: t("p.backup.message.failed") + `: ${error}`,
          duration: 1500,
          position: "bottom",
          color: "danger",
        });
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing data:", error);
      presentToast({
        message: t("p.backup.message.failed") + `: ${error.message}`,
        duration: 1500,
        position: "bottom",
        color: "danger",
      });
    }
  };
  
  const handleExport = async () => {
    try {
      const data = {};
      for (const k in key) {
        const { value } = await Preferences.get({
          key: key[k],
        });
        data[k] = value;
      }
      const jsonString = JSON.stringify(data);
      const date = new Date().toISOString().split('T')[0];
      const fileName = `countdate_backup_${date}.cdd`;

      if (platform === 'android' || platform === 'ios') {
        await Filesystem.writeFile({
          path: fileName,
          data: jsonString,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });

        const fileUrl = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Cache
        })
        await Share.share({
          title: t('p.backup.share.title'),
          text: t('p.backup.share.text'),
          url: fileUrl.uri,
        });
      } else {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      presentToast({
        message: t("p.backup.message.export.successful"),
        duration: 1500,
        position: "bottom",
      });
    } catch (error: any) {
      console.error("Error exporting data:", error);
      console.error("Full error object:", error);
      presentToast({
        message: t("p.backup.message.failed") + `: ${error.message}`,
        duration: 1500,
        position: "bottom",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    const getDevicePlatform = async () => {
      const info = await Device.getInfo()
      setPlatform(info.platform)
    }
    getDevicePlatform()
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <LocalizeBackButton color={accent} />
          <IonTitle>{t("p.backup.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", columnGap: "12px"}}>
          <div style={{flex: 1, maxWidth: "300px"}}>
            <IonButton color={accent} expand="full" shape="round" onClick={() => handleExport()}>{t('p.backup.export')}</IonButton>
          </div>
          <div style={{flex: 1, maxWidth: "300px"}}>
            <IonButton color={accent} expand="full" shape="round" onClick={() => handleImport()}>{t('p.backup.import')}</IonButton>
          </div>
        </div>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept=".cdd"
          onChange={handleFileChange}
        />
      </IonContent>
    </IonPage>
  );
};

export default Backup;
