let secondsInADay = 60 * 60 * 1000 * 24;

function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
}

function appendCorrectTimezone(date) {
  let now = new Date();
  let tzo = -now.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.split("+")[0] +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
}

export function countUpFromTime(date) {
  // let nowStr = toIsoString(new Date())
  let now = new Date();
  let countFrom = new Date(appendCorrectTimezone(date));
  let timeDifference = now.getTime() - countFrom.getTime();
  let days = Math.floor((timeDifference / secondsInADay) * 1);
  return days;
}

export function countDownFromTime(date) {
  // let nowStr = toIsoString(new Date())
  let now = new Date();
  let countFrom = new Date(appendCorrectTimezone(date));
  let timeDifference = countFrom.getTime() - now.getTime();
  let days = Math.floor((timeDifference / secondsInADay) * 1);
  return days;
}

export function countFromTime(date) {
  let now = new Date();
  let countFrom = new Date(appendCorrectTimezone(date));
  let timeDifference = countFrom.getTime() - now.getTime();
  if (timeDifference > 0) {
    // countdown
    return Math.floor((timeDifference / secondsInADay) * 1)
  } else {
    // countup
    return Math.floor(((now.getTime() - countFrom.getTime()) / secondsInADay) * 1)
  }
}