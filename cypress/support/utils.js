import moment from "moment";
import "moment-timezone";

export function getRandomItemFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getDateTimeStamp(dateTimeFormat, timeZone = false) {
  if (timeZone) {
    return moment()
      .tz(timeZone)
      .format(dateTimeFormat);
  } else {
    return moment().format(dateTimeFormat);
  }
}

export function formatDateTime(dateTime, format, timeZone) {
  return moment(dateTime)
    .tz(timeZone)
    .format(format);
}

export const changeDateTime = (utcOffset, quantity, units) => {
  return Cypress.moment()
    .utcOffset(utcOffset)
    .add(quantity, units);
};
