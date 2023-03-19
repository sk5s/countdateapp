import { LocalNotifications } from '@capacitor/local-notifications'
import { v4 as uuid } from 'uuid'

const day = (day) => {
  return day * 86400 * 1000
}
const hour = (hour) => {
  return hour * 3600 * 1000
}
const min = (min) => {
  return min * 60 * 1000
}
const sec = (sec) => {
  return sec * 1000
}

export async function Schedule(props){
  await LocalNotifications.schedule({
    notifications: [{
      title: props.title,
      body: props.body,
      id: props.id,
      silent: true,
      schedule: {
        at: new Date(Date.now() + sec(1)),
        allowWhileIdle:true
      }
    }]
  })
}