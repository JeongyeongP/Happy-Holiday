let statesName;
let statesCode;
let countryCode;
let destID;
let latitude;
let longitude;

import { displayWeatherInfo } from "./weather.js";
import { displayHotelInfo } from "./accommodation.js";

//Listen to Buttons
const searchButton = document.querySelector(".button-search2");
searchButton.addEventListener("click", getTravelInfo);
const restButton = document.querySelector(".button-reset2");
restButton.addEventListener("click", clearInfo);

export function getTravelInfo() {
  statesName = document.getElementById("inputStates").value;
  const statesInfoURL = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${statesName}&languagecode=en-us`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
      "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
    },
  };
  return fetch(statesInfoURL, options)
    .then((response) => response.json())
    .then((data) => {
      // log the data for debugging
      // console.log(data);
      if (data[0] && data[0].cc1.length > 0) {
        countryCode = data[0].cc1;
        destID = data[0].dest_id;
        latitude = data[0].latitude;
        longitude = data[0].longitude;
        return countryCode;
      } else {
        window.alert("Invalid state name");
        throw new Error("Invalid state name");
      }
    })
    .then((countryCode) => {
      statesCode = getStatesCode(countryCode);
      getHoliday(countryCode, statesCode);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getStatesCode(countryCode) {
  const statesCodeURL = `https://api.countrystatecity.in/v1/countries/${countryCode}/states/`;
  var headers = new Headers();
  headers.append(
    "X-CSCAPI-KEY",
    "cm5HS3N3cGpTMnd6enc1akhWYjVYT3J0empaT2ZXa0RGMDhTcEJEbQ=="
  );
  var options = {
    method: "GET",
    headers: headers,
  };
  return fetch(statesCodeURL, options)
    .then((response) => response.text())
    .then((result) => {
      const Data = JSON.parse(result);
      // console.log(Data);
      for (let i = 0; i < Data.length; i++) {
        if (
          Data[i].name.toLowerCase().trim() === statesName.toLowerCase().trim()
        ) {
          return Data[i].iso2;
        }
      }
    })
    .catch((error) => {
      window.alert(
        "Please try again. Some error happens during getting information!"
      );
      console.log(error);
    });
}

export function getHoliday(countryCode, statesCode) {
  const holidaysContainer = document.getElementById("holidays-container");
  holidaysContainer.style.display = "none";
  if (holidaysContainer.style.display === "none") {
    holidaysContainer.style.display = "block";
  } else {
    holidaysContainer.style.display = "none";
  }

  // construct the API URL with the input country parameter
  const calendarificKey = "3a396b216c15c82cf983a738aaf89483ff73b6bd";
  const holidayApiURL = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificKey}&country=${countryCode}&year=2023&location=${countryCode}-${statesCode}`;

  fetch(holidayApiURL)
    .then((response) => response.json())
    .then((holiday) => {
      // console.log(holiday);
      const holidaysList = document.getElementById("holidays-drop");
      // reselt holiday list
      while (holidaysList.firstChild) {
        holidaysList.removeChild(holidaysList.firstChild);
      }
      const addedHolidays = {};
      holiday.response.holidays.forEach((h) => {
        // the current holiday's date
        const holidayDate = new Date(h.date.iso);
        // today's date
        const today = new Date();
        if (holidayDate >= today) {
          const option = document.createElement("option");
          option.textContent = `${h.name} - ${h.date.iso}`;
          option.value = `${h.name} - ${h.date.iso}`;
          holidaysList.appendChild(option);
          addedHolidays[h.name] = true;
        }
      });
      // add event listener for when a holiday is selected
      holidaysList.addEventListener("change", async () => {
        const selectedValue = event.target.value;
        const selectedDate = selectedValue.split(" - ")[1];
        await displayWeatherInfo(selectedDate, latitude, longitude);
        displayHotelInfo(selectedDate, destID);
      });
    })
    .catch((error) => {
      window.alert(
        "Please try again. Some error happens during getting information!"
      );
      console.log(error);
    });
}

export function clearInfo() {
  const holidaysContainer = document.getElementById("holidays-container");
  holidaysContainer.style.display = "none";
  document.getElementById("weatherInfo").style.display = "none";
  document.getElementById("hotelInfo").style.display = "none";
}
