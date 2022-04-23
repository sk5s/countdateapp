import { Toast } from '@capacitor/toast';

export default async function show(text){
  await Toast.show({
    text,
  });
};