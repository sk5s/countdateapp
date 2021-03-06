import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cyou.sk5s.app.countdate',
  appName: 'Countdate',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "src/assets/countdateapp-logo.png",
      iconColor: "#488AFF",
      allowWhileIdle: true
    }
  },
};

export default config;
