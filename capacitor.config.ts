import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.tble',
  appName: 'Tble',
  webDir: 'public',
  server: {
    // The native shell loads the live Tble web app.
    url: 'https://tble-rvwb.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
