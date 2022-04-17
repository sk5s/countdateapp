import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

import Countdown from "react-countdown";

export default function CountdownCard(props: {
  date: string;
  event: string;
}): JSX.Element {
  const Completionist = () => <span>0</span>;
  const renderer = ({
    days,
    completed,
  }: {
    days: number;
    completed: boolean;
  }): any => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return <span>{days}</span>;
    }
  };
  return (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle>離 {props.event} 剩下</IonCardSubtitle>
          <IonCardTitle>
            <Countdown date={props.date} renderer={renderer} />天
          </IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </div>
  );
}
