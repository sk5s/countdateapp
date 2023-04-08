import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonModal, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { informationCircle, link } from 'ionicons/icons';

export default function AppTour({modal, setModal}:{modal:boolean;setModal: any}) {
  const {t} = useTranslation()
  const imgPath = (num:number) => {
    return "assets/tour/"+(num+1).toString()+".jpg"
  }
  return (
    <IonModal isOpen={modal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Countdate tour</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setModal(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonChip style={{marginLeft: "10px"}}>
          <IonIcon icon={informationCircle} color="dark"></IonIcon>
          <IonLabel>{t("tour_can_review")}</IonLabel>
        </IonChip>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          // scrollbar={{ draggable: false }}
          // onSwiper={(swiper) => console.log(swiper)}
          // style={{maxWidth: "400px"}}
        >
          {
            (() => {
              let rows = []
              for (let i = 0; i < 8; i++) {
                rows.push(
                  <SwiperSlide key={i}>
                    <IonText color="dark">
                      <h1 style={{marginLeft: "10px"}}>{t("tour_step_"+(i+1).toString())}</h1>
                    </IonText>
                    <IonImg src={imgPath(i)}></IonImg>
                  </SwiperSlide>
                )
              }
              return rows
            })()
          }
        </Swiper>
        <IonButton shape="round" href='https://github.com/sk5s/countdateapp/wiki' target='_blank'><IonIcon icon={link} /> {t("tour_learn_more")}</IonButton>
      </IonContent>
    </IonModal>
  );
}
