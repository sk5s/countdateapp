import { IonButtons, IonBackButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { capitalize } from "../lib/Capitalize";

export default function LocalizeBackButton({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <>
      <IonButtons slot="start">
        <IonBackButton text={capitalize(t("back"))} color={color}></IonBackButton>
      </IonButtons>
    </>
  );
}
