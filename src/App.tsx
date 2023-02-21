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

setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const history = useHistory()
  NativeApp.addListener("backButton", ({canGoBack}) => {
    if (canGoBack){
      history.goBack()
    }else{
      NativeApp.exitApp()
    }
  })
  const [accentColor, setAccentColor] = useState<string>("primary")
  const getAccentColor = async () => {
    const { value } = await Preferences.get({ key: key.accent });
    if (value != null) {
      setAccentColor(value)
    }
  }
  getAccentColor()
  on("countdate_accent:change", () => {
    getAccentColor()
  })
  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home accent={accentColor} />
        </Route>
        <Route exact path="/add">
          <Add accent={accentColor} />
        </Route>
        <Route exact path="/settings">
          <Settings accent={accentColor} />
        </Route>
        <Route exact path="/edit">
          <Edit accent={accentColor} />
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
