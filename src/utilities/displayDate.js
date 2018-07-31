import { MONTH_NAMES } from 'AppConstants';

export function displayDate(date) {
  const currentTime = new Date();
  let value = '';
  if (date.getDate() === currentTime.getDate()) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours) {
      hours = date.getHours() % 12 < 10 && date.getHours() !== 0 ? `0${hours}` : hours;
    } else {
      hours = '00';
    }
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    value = `${hours}:${minutes} ${ampm}`;
  } else {
    if (currentTime.getDate() - date.getDate() === 1) {
      value = 'YESTERDAY';
    } else {
      value = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
    }
  }
  return value;
}
