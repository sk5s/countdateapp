import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';

export default function AppTour() {
  const [modal,setModal] = useState(true)
  return (
    <IonModal isOpen={modal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Countdate</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setModal(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          // scrollbar={{ draggable: false }}
          onSwiper={(swiper) => console.log(swiper)}
          style={{maxWidth: "400px"}}
        >
          <SwiperSlide>
            <img src="https://raw.githubusercontent.com/sk5s/countdateapp/main/fastlane/metadata/android/en-US/images/phoneScreenshots/1.jpg" alt=""/>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://raw.githubusercontent.com/sk5s/countdateapp/main/fastlane/metadata/android/en-US/images/phoneScreenshots/2.jpg" alt=""/>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://raw.githubusercontent.com/sk5s/countdateapp/main/fastlane/metadata/android/en-US/images/phoneScreenshots/3.jpg" alt=""/>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://raw.githubusercontent.com/sk5s/countdateapp/main/fastlane/metadata/android/en-US/images/phoneScreenshots/4.jpg" alt=""/>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://raw.githubusercontent.com/sk5s/countdateapp/main/fastlane/metadata/android/en-US/images/phoneScreenshots/5.jpg" alt=""/>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://raw.githubusercontent.com/sk5s/countdateapp/main/fastlane/metadata/android/en-US/images/phoneScreenshots/6.jpg" alt=""/>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonModal>
  );
}
