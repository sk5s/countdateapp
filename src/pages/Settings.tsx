import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonToggle,
  IonIcon,
  IonRouterLink,
} from "@ionic/react";
import {
  calendar,
  code,
  contrast,
  documentText,
  help,
  information,
  logoAndroid,
  notifications,
  reload,
  text,
} from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { Schedule } from "../lib/LocalNotification";
import { Preferences as Storage } from "@capacitor/preferences";
import key from "../lib/storageKey.json";
import { useEffect, useState } from "react";
import { trigger } from "../lib/Events";
import AccentColorSelectModal from "../components/AccentColorSelectModal";
import TextColorSelectModal from "../components/TextColorSelectModal";
import "./Settings.css";
import { useHistory } from "react-router";
import LocalizeBackButton from "../components/LocalizeBackButton";
import LanguageSelectModal from "../components/LanguageSelectModal";
import { Device } from "@capacitor/device";

const Settings: React.FC<{ accent: string; setView: any }> = ({
  accent,
  setView,
}) => {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<"ios" | "android" | "web">(
    "android"
  );
  const [darkChecked, setDarkChecked] = useState<boolean>();
  const [devChecked, setDevChecked] = useState<boolean>(false);
  const [extendChecked, setExtendChecked] = useState<boolean>(false);
  const [relativeChecked, setRelativeChecked] = useState<boolean>(false);
  const history = useHistory();

  const getDevMode = async () => {
    const { value } = await Storage.get({ key: key.dev });
    if (value === "true") setDevChecked(true);
  };
  getDevMode();
  const toggleDevModeHandler = async () => {
    console.log("toggle dev mode");
    let tovalue = !devChecked;
    await Storage.set({
      key: key.dev,
      value: tovalue.toString(),
    });
    setDevChecked(tovalue);
    // console.log(tovalue);
    trigger("countdate_dev:change");
  };
  const getExtendMode = async () => {
    const { value } = await Storage.get({ key: key.extend });
    if (value === "true") setExtendChecked(true);
  };
  getExtendMode();
  const getRelativeMode = async () => {
    const { value } = await Storage.get({ key: key.relative });
    if (value === "true") setRelativeChecked(true);
  };
  getRelativeMode();
  const toggleExtendModeHandler = async () => {
    console.log("toggle extend mode");
    let tovalue = !extendChecked;
    await Storage.set({
      key: key.extend,
      value: tovalue.toString(),
    });
    setExtendChecked(tovalue);
    // console.log(tovalue);
    trigger("countdate_extend:change");
  };

  const toggleRelativeModeHandler = async () => {
    console.log("toggle relative mode");
    let tovalue = !relativeChecked;
    await Storage.set({
      key: key.relative,
      value: tovalue.toString(),
    });
    setRelativeChecked(tovalue);
    setView("days");
    // console.log(tovalue);
    trigger("countdate_relative:change");
  };

  const testLocalNotification = async () => {
    // console.log("clicked");
    await Schedule({
      title: "Countdate",
      body: "Local Notification Test",
      id: 1,
    });
  };
  const darkEnable = (value: any) => {
    let darkmodeEnable;
    let matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    matchMedia.addEventListener("change", () => getDarkMode());
    if (value === "dark") {
      darkmodeEnable = true;
      document.body.classList.add("dark");
    } else if (value === "light") {
      darkmodeEnable = false;
      document.body.classList.remove("dark");
    } else if (matchMedia.matches) {
      darkmodeEnable = matchMedia.matches;
      document.body.classList.add("dark");
    } else {
      darkmodeEnable = matchMedia.matches;
      document.body.classList.remove("dark");
    }
    return darkmodeEnable;
  };
  const getDarkMode = async () => {
    const { value } = await Storage.get({ key: key.theme });
    // console.log(darkEnable(value));
    setDarkChecked(darkEnable(value));
  };
  getDarkMode();
  const toggleDarkModeHandler = async () => {
    // console.log(!darkChecked);
    if (darkChecked) {
      await Storage.set({
        key: key.theme,
        value: "light",
      });
      document.body.classList.remove("dark");
    } else {
      await Storage.set({
        key: key.theme,
        value: "dark",
      });
      document.body.classList.add("dark");
    }
    setDarkChecked(!darkChecked);
  };
  const darkmodeToSystem = async () => {
    setDarkChecked(window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    await Storage.set({
      key: key.theme,
      value: "",
    });
  };

  const handleReviewTour = async () => {
    await Storage.remove({
      key: key.firstTime,
    });
    history.push("/home");
    setTimeout(() => {
      trigger("countdate_first:change");
    }, 500);
  };

  useEffect(() => {
    console.log("Get device platform");
    const getDevicePlatform = async () => {
      const info = await Device.getInfo();
      setPlatform(info.platform);
    };
    getDevicePlatform();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <LocalizeBackButton color={accent} />
          <IonTitle>{t("p.settings.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader lines="none" color={accent}>
            <IonLabel>{t("p.settings.general.title")}</IonLabel>
          </IonListHeader>
          <IonItem>
            <LanguageSelectModal accent={accent} />
          </IonItem>
          <IonItem>
            <IonToggle
              checked={extendChecked}
              onClick={toggleExtendModeHandler}
              color={accent}
            >
              <div className="ion-text-wrap">
                <IonIcon icon={calendar} />{" "}
                {t("p.settings.general.toggleExtendMode")}
              </div>
            </IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle
              checked={relativeChecked}
              onClick={toggleRelativeModeHandler}
              color={accent}
            >
              <div className="ion-text-wrap">
                <IonIcon icon={text} />{" "}
                {t("p.settings.general.toggleRelativeMode")}
              </div>
            </IonToggle>
          </IonItem>
          {platform === "android" && (
            <>
              <IonItem>
                <IonToggle
                  checked={devChecked}
                  onClick={toggleDevModeHandler}
                  color={accent}
                >
                  <IonIcon icon={code} />{" "}
                  {t("p.settings.general.toggleDevMode")}
                </IonToggle>
              </IonItem>
              {(isPlatform("android") && isPlatform("hybrid") && devChecked) ||
              (isPlatform("ios") && isPlatform("hybrid") && devChecked) ? (
                <>
                  <IonItem>
                    <IonLabel onClick={testLocalNotification}>
                      <IonIcon icon={notifications} />{" "}
                      {t("p.settings.general.testLocalNotification")}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel
                      onClick={() => {
                        location.pathname = "/";
                      }}
                    >
                      <IonIcon icon={reload} />{" "}
                      {t("p.settings.general.webFrontendReload")}
                    </IonLabel>
                  </IonItem>
                </>
              ) : null}
            </>
          )}
          <IonItem>
            <IonLabel onClick={handleReviewTour}>
              <IonIcon icon={help} /> {t("p.settings.general.reviewTour")}
            </IonLabel>
          </IonItem>
          <IonRouterLink routerLink="/backup">
            <IonItem>
              <IonLabel color="dark">
                <IonIcon icon={documentText} /> {t("p.settings.general.backup")}
              </IonLabel>
            </IonItem>
          </IonRouterLink>
          <IonRouterLink routerLink="/about">
            <IonItem>
              <IonLabel color="dark">
                <IonIcon icon={information} /> {t("p.settings.general.about")}
              </IonLabel>
            </IonItem>
          </IonRouterLink>
          <IonListHeader lines="none" color={accent}>
            <IonLabel>{t("p.settings.theme.title")}</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonToggle
              checked={darkChecked}
              onClick={toggleDarkModeHandler}
              color={accent}
            >
              <IonIcon icon={contrast} /> {t("p.settings.theme.toggleDarkMode")}
            </IonToggle>
          </IonItem>
          <IonItem>
            <IonLabel onClick={darkmodeToSystem}>
              <IonIcon icon={logoAndroid} />{" "}
              {t("p.settings.theme.followSystem")}
            </IonLabel>
          </IonItem>
          <IonItem>
            <AccentColorSelectModal />
          </IonItem>
          {platform === "android" && (
            <IonItem>
              <TextColorSelectModal accent={accent} />
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
