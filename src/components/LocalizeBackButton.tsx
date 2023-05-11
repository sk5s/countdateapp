import { IonButtons, IonBackButton } from "@ionic/react";
import { useTranslation } from "react-i18next";

export default function LocalizeBackButton({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <>
      <IonButtons slot="start">
        <IonBackButton text={t("back")} color={color}></IonBackButton>
      </IonButtons>
    </>
  );
}
