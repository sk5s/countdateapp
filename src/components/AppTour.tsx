import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { informationCircle, link } from "ionicons/icons";
import { capitalize } from "../lib/Capitalize";

// TODO: Update screenshots

export default function AppTour({
  modal,
  setModal,
  color,
}: {
  modal: boolean;
  setModal: any;
  color: string;
}) {
  const { t } = useTranslation();
  const imgPath = (num: number) => {
    return "assets/tour/" + (num + 1).toString() + ".jpg";
  };
  return (
    <IonModal isOpen={modal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("c.tour.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton color={color} onClick={() => setModal(false)}>
              {t("g.close")}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonChip style={{ marginLeft: "10px" }}>
          <IonIcon icon={informationCircle} color="dark"></IonIcon>
          <IonLabel>{t("c.tour.can_review")}</IonLabel>
        </IonChip>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {(() => {
            let rows = [];
            for (let i = 0; i < 8; i++) {
              rows.push(
                <SwiperSlide key={i}>
                  <IonText color="dark">
                    <h1 style={{ marginLeft: "10px" }}>
                      {t("c.tour.step_" + (i + 1).toString())}
                    </h1>
                  </IonText>
                  <IonImg src={imgPath(i)}></IonImg>
                </SwiperSlide>
              );
            }
            return rows;
          })()}
        </Swiper>
        <IonButton
          color={color}
          shape="round"
          href="https://github.com/sk5s/countdateapp/wiki"
          target="_blank"
          rel="noreferrer"
        >
          <IonIcon icon={link} /> {t("c.tour.learn_more")}
        </IonButton>
      </IonContent>
    </IonModal>
  );
}
