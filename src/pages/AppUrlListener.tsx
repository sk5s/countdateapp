import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useEffect } from "react";
import { useHistory } from "react-router";

const AppUrlListener: React.FC<any> = () => {
  let history = useHistory();
  useEffect(() => {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2
      const slug = event.url.split('app').pop();
      console.log(slug)
      if (slug) {
        history.push({
          pathname: slug.split("?")[0],
          search: "?"+slug.split("?")[1]
        });
      }
      // If no match, do nothing - let regular routing
      // logic take over
    });
  }, []);

  return null;
};

export default AppUrlListener;