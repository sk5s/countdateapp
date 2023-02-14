import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cyou.sk5s.app.countdate',
  appName: 'Countdate',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "countdateapp-logo",
      iconColor: "#488AFF"
    },
    SplashScreen: {
      backgroundColor: "#03989e",
    }
  },
};

export default config;
