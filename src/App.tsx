import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { App as NativeApp } from '@capacitor/app';
import { useHistory } from "react-router";
import Home from './pages/Home';
import Add from './pages/Add';
import Settings from './pages/Settings';
import Edit from './pages/Edit';
import About from './pages/About';

import './lib/Darkmode'
import AppTour from './components/AppTour';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { Preferences } from '@capacitor/preferences';
import key from "./lib/storageKey.json"
import { useState } from 'react';
import { on } from './lib/Events';
import { useTranslation } from 'react-i18next';

// Ionic setup
setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const history = useHistory()
  const {t,i18n} = useTranslation()
  const [accentColor, setAccentColor] = useState<string>("primary")
  const [textColor, setTextColor] = useState<string>("")
  const [firstTime, setFirstTime] = useState<boolean>(false)
  // Hardware back button function
  NativeApp.addListener("backButton", ({canGoBack}) => {
    if (canGoBack){
      history.goBack()
    }else{
      NativeApp.exitApp()
    }
  })
  // Restore accent color
  const getAccentColor = async () => {
    const { value } = await Preferences.get({ key: key.accent });
    if (value != null) {
      setAccentColor(value)
    }
  }
  // Restore text color
  const getTextColor = async () => {
    const { value } = await Preferences.get({ key: key.textColor });
    if (value != null) {
      setTextColor(value)
    } else {
      setTextColor("")
    }
  }
  let count = 0
  const getFirstTime = async () => {
    if (count < 1) {
      const { value } = await Preferences.get({ key: key.firstTime });
      if (value == null) {
        console.log("start first time tour");
        setFirstTime(true)
        await Preferences.set({
          key: key.firstTime,
          value: "false",
        });
        count += 1
      }
    }
  }
  // Restore settings
  getAccentColor()
  getTextColor()
  getFirstTime()
  on("countdate_accent:change", () => {
    getAccentColor()
  })
  on("countdate_text:change", () => {
    getTextColor()
  })
  on("countdate_first:change", () => {
    getFirstTime()
  })

  // Tour options
  const tourOptions = {
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      }
    },
    useModalOverlay: true
  };
  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home accent={accentColor} textColor={textColor} />
          <AppTour modal={firstTime} setModal={setFirstTime} color={accentColor} />
        </Route>
        <Route exact path="/add">
          <Add accent={accentColor} />
        </Route>
        <Route exact path="/settings">
          <Settings accent={accentColor} />
        </Route>
        <Route exact path="/edit">
          <Edit accent={accentColor} textColor={textColor} />
        </Route>
        <Route exact path="/about">
          <About accent={accentColor} />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)};

export default App;
