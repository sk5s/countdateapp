import { Clipboard } from '@capacitor/clipboard';

export async function copy(string) {
  await Clipboard.write({
    string
  });
};