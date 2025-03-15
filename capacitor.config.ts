import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cyou.sk5s.app.countdate',
  appName: 'Countdate',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
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
