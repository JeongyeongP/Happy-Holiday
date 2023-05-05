// function getCountryName() {
//   var cityName = document.getElementById("inputState").value;
//   const url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${cityName}&languagecode=en-us`;
//   const options = {
//     method: "GET",
//     headers: {
//       "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
//       "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
//     },
//   };
//   console.log("Getting City Information: Country, latitude and longitude");
//   return fetch(url, options)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data); // log the data for debugging
//       if (data[0] && data[0].cc1.length > 0) {
//         const countryName = data[0].country;
//         const countryCode = data[0].cc1;
//         console.log("This is country name ", countryName);
//         console.log("This is country code ", countryCode);
//         return countryCode, countryName;
//       } else {
//         throw new Error("Invalid city name");
//       }
//     })
//     .then((countryCode) => {
//       const stateCode = getStatesCode(countryCode);
//       console.log("This is country code ", countryCode);
//       console.log("This is state code ", stateCode);
//       console.log("Start to get Holidays");
//       getHoliday(countryCode, stateCode);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

function getCountryName() {
  var cityName = document.getElementById("inputStates").value;
  const url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${cityName}&languagecode=en-us`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
      "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
    },
  };
  console.log("Getting City Information: Country, latitude and longitude");
  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // log the data for debugging
      if (data[0] && data[0].cc1.length > 0) {
        const countryName = data[0].country;
        const countryCode = data[0].cc1;
        console.log("This is country name ", countryName);
        console.log("This is country code ", countryCode);
        return countryCode;
      } else {
        throw new Error("Invalid city name");
      }
    })
    .then((countryCode) => {
      const stateCode = getStatesCode(countryCode);
      console.log("This is country code ", countryCode);
      console.log("This is state code ", stateCode);
      getHoliday(countryCode, stateCode); // pass countryCode and stateCode as arguments
    })
    .catch((error) => {
      console.log(error);
    });
}

function getStatesCode(countryCode) {
  var stateName = document.getElementById("inputStates").value;
  console.log("Getting State Information");
  var headers = new Headers();
  headers.append(
    "X-CSCAPI-KEY",
    "cm5HS3N3cGpTMnd6enc1akhWYjVYT3J0empaT2ZXa0RGMDhTcEJEbQ=="
  );

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  url = `https://api.countrystatecity.in/v1/countries/${countryCode}/states/`;
  return fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const Data = JSON.parse(result);
      console.log(Data);
      for (let i = 0; i < Data.length; i++) {
        console.log("Checking State");
        if (
          Data[i].name.toLowerCase().trim() === stateName.toLowerCase().trim()
        ) {
          console.log(stateName, " found:", Data[i]);
          console.log(Data[i].iso2);
          return Data[i].iso2;
        }
      }
    });
}

function getHoliday(countryCode, stateCode) {
  console.log("Start to get Holidays");
  // Displaying Drop Box
  const holidaysContainer = document.getElementById("holidays-container");
  if (holidaysContainer.style.display === "none") {
    holidaysContainer.style.display = "block";
  } else {
    holidaysContainer.style.display = "none";
  }
  // construct the API URL with the input country parameter
  const calendarificKey = "3a396b216c15c82cf983a738aaf89483ff73b6bd";
  const holidayApiURL = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificKey}&country=${countryCode}&year=2023&location=${stateCode}`;
  console.log("Getting Holiday Data");
  fetch(holidayApiURL)
    .then((response) => response.json())
    .then((holiday) => {
      console.log(holiday);
      const holidaysList = document.getElementById("holidays-drop");
      const addedHolidays = {};
      holiday.response.holidays.forEach((h) => {
        // the current holiday's date
        const holidayDate = new Date(h.date.iso);
        // today's date
        const today = new Date();
        if (holidayDate >= today) {
          if (!addedHolidays[h.name]) {
            const option = document.createElement("option");
            option.textContent = `${h.name} - ${h.date.iso}`;
            option.value = `${h.name} - ${h.date.iso}`;
            holidaysList.appendChild(option);
            addedHolidays[h.name] = true;
          }
        }
      });
      // add event listener for when a holiday is selected
      holidaysList.addEventListener("change", () => {
        const selectedValue = event.target.value;
        const selectedDate = selectedValue.split(" - ")[1];
        console.log("Selected date is ", selectedDate);
        getWeather(selectedDate);
      });
    })
    .catch((error) => console.log(error));
  console.log("Done");
}
