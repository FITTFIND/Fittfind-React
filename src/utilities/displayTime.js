export function displayTime(date) {
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
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}
