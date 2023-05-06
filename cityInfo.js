let statesName;
let statesCode;
let countryName;
let countryCode;
let destID;
let latitude;
let longitude;

function getCountryName() {
  statesName = document.getElementById("inputStates").value;
  const url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${statesName}&languagecode=en-us`;
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
        countryName = data[0].country;
        countryCode = data[0].cc1;
        destID = data[0].dest_id;
        latitude = data[0].latitude;
        longitude = data[0].longitude;
        console.log("This is country name ", countryName);
        console.log("This is country code ", countryCode);
        console.log("This is destination ID", destID);
        console.log("This is latitude", latitude);
        console.log("This is longitude", longitude);
        return countryCode;
      } else {
        throw new Error("Invalid city name");
      }
    })
    .then((countryCode) => {
      //statesCode = getStatesCode(countryCode);
      console.log("This is country code ", countryCode);
      console.log("This is state code ", statesCode);
      console.log("Start Holiday Listtttttt", statesCode);
      //getHoliday(countryCode, statesCode); // pass countryCode and stateCode as arguments
    })
    .catch((error) => {
      console.log(error);
    });
}

function getStatesCode(countryCode) {
  console.log("I am getting!!!!!!!!!", countryCode);
  // var stateName = document.getElementById("inputStates").value;
  console.log("Getting State Information");
  var headers = new Headers();
  headers.append(
    "X-CSCAPI-KEY",
    "cm5HS3N3cGpTMnd6enc1akhWYjVYT3J0empaT2ZXa0RGMDhTcEJEbQ=="
  );

  var requestOptions = {
    method: "GET",
    headers: headers,
    // redirect: "follow",
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
          Data[i].name.toLowerCase().trim() === statesName.toLowerCase().trim()
        ) {
          console.log(statesName, " found:", Data[i]);
          console.log(Data[i].iso2);
          return Data[i].iso2;
        }
      }
    })
    .catch((error) => {
      console.log("From States Country");
      console.log(error);
    });
}

function getHoliday(countryCode, statesCode) {
  console.log("Start to get Holidays");

  // Displaying Drop Box
  const holidaysContainer = document.getElementById("holidays-container");

  holidaysContainer.style.display = "none";
  if (holidaysContainer.style.display === "none") {
    holidaysContainer.style.display = "block";
  } else {
    holidaysContainer.style.display = "none";
  }

  // construct the API URL with the input country parameter
  const calendarificKey = "3a396b216c15c82cf983a738aaf89483ff73b6bd";
  const holidayApiURL = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificKey}&country=${countryCode}&year=2023&location=${statesCode}`;
  console.log("Getting Holiday Data");
  fetch(holidayApiURL)
    .then((response) => response.json())
    .then((holiday) => {
      console.log(holiday);
      const holidaysList = document.getElementById("holidays-drop");
      console.log("Drop If there is any child");
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
        displayWeatherInfo(selectedDate);
      });
    })
    .catch((error) => console.log(error));
  console.log("Done");
}

function getWeather(selectedDate) {
  const weatherData = [];
  console.log("Getting Weather");

  const currentDate = new Date();
  const selectedDateTime = new Date(selectedDate);
  const diffInSeconds =
    (selectedDateTime.getTime() - currentDate.getTime()) / 1000;

  if (diffInSeconds < 1296000) {
    console.log("Getting Weather Forecast Data");

    const forecastURL = `https://ai-weather-by-meteosource.p.rapidapi.com/daily?lat=${latitude}&lon=${longitude}&language=en&units=metric`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
        "X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
      },
    };

    return fetch(forecastURL, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const dates = getNextFourDays(selectedDate);
        console.log("Dates to search:", dates);
        for (let i = 0; i < data.daily.data.length - 4; i++) {
          if (data.daily.data[i].day === dates[0]) {
            console.log("Found the starting date:", dates[0]);
            weatherData.push("Forecast");
            for (let j = 0; j < 5; j++) {
              weatherData.push(
                data.daily.data[i + j].day,
                data.daily.data[i + j].weather,
                data.daily.data[i + j].summary
              );
            }
            console.log("Weather data found:", weatherData);
            return weatherData; // return the weather data if we found it
          }
        }
        console.log("Could not find weather data for the selected date");
        return null; // return null if we couldn't find the data
      })
      .catch((error) => {
        console.log("Error fetching weather data:", error);
        return null; // return null if there was an error
      });
  } else {
    console.log("Sorry No Weather Forecast");
    const endDate = new Date(selectedDate);
    endDate.setFullYear(endDate.getFullYear() - 1); // Subtract one year from the selected date
    endDate.setDate(endDate.getDate() + 4);
    const endDateString = endDate.toISOString().split("T")[0];

    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setFullYear(selectedDateObj.getFullYear() - 1);
    const oneYearBeforeSelectedDate = selectedDateObj
      .toISOString()
      .split("T")[0];
    const historyURL = `https://meteostat.p.rapidapi.com/point/daily?lat=${latitude}&lon=${longitude}&start=${oneYearBeforeSelectedDate}&end=${endDateString}&alt=43`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
        "X-RapidAPI-Host": "meteostat.p.rapidapi.com",
      },
    };

    return fetch(historyURL, options)
      .then((response) => response.text())
      .then((data) => {
        const Data = JSON.parse(data);
        console.log(Data);
        console.log(Data.data);
        weatherData.push("History");
        for (let i = 0; i < Data.data.length; i++) {
          weatherData.push(
            Data.data[i].date,
            Data.data[i].tmax,
            Data.data[i].tmin
          );
        }
        console.log(weatherData);
        return weatherData;
      })
      .catch((error) => {
        console.log("Error fetching weather data:", error);
        return null; // return null if there was an error
      });
  }
}

function getNextFourDays(selectedDate) {
  const dates = [];
  dates.push(selectedDate);
  const startDate = new Date(selectedDate);
  for (let i = 1; i <= 4; i++) {
    const nextDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    dates.push(nextDate.toISOString().split("T")[0]);
  }
  return dates;
}

async function displayWeatherInfo(selectedDate) {
  const weatherTable = document.getElementById("weatherTable");
  const weatherTableBody = document.getElementById("weatherTableBody");
  const weatherData = await getWeather(selectedDate);

  // clear existing table rows
  weatherTableBody.innerHTML = "";
  document.getElementById("weatherInfo").style.display = "block";

  // // add title
  // const title = document.createElement("h3");

  // remove existing table header
  const existingTableHeader = weatherTable.querySelector("thead");
  if (existingTableHeader) {
    existingTableHeader.parentNode.removeChild(existingTableHeader);
  }

  // check if the first value is "History" or "Forecast"
  if (weatherData[0] === "History") {
    // title.textContent =
    //   "Sorry, no weather forecast is available for the selected date. Showing data from a year ago instead.";
    // set table headers
    const headers = [
      "Date",
      "Highest Temperature (°C) ",
      "Lowest Temperature (°C)",
    ];
    setTableHeaders(weatherTable, headers);
  } else if (weatherData[0] === "Forecast") {
    // title.textContent =
    //   "This is the weather forecast for the next 5 days starting from the date you selected!";
    // set table headers
    const headers = ["Date", "Weather", "Summary"];
    setTableHeaders(weatherTable, headers);
  }

  // title.style.fontSize = "15px";
  // title.style.padding = "10px 0";
  // title.style.marginLeft = "5px";
  // weatherTable.parentNode.insertBefore(title, weatherTable);

  // add new rows
  for (let i = 1; i < weatherData.length; i += 3) {
    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");

    cell1.textContent = weatherData[i];
    cell2.textContent = weatherData[i + 1];
    cell3.textContent = weatherData[i + 2];

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);

    weatherTableBody.appendChild(row);
  }
}

function setTableHeaders(table, headers) {
  const thead = table.createTHead();
  const row = thead.insertRow();

  for (let i = 0; i < headers.length; i++) {
    const th = document.createElement("th");
    th.textContent = headers[i];
    row.appendChild(th);
  }
}

function getHotel(destID) {
  const url = `https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date=2023-05-15&departure_date=2023-05-20&guest_qty=1&dest_ids=${destID}
  &room_qty=1&search_type=city&children_age=0&search_id=none&price_filter_currencycode=USD&order_by=popularity&languagecode=en-us&travel_purpose=leisure`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
      "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
    },
  };

  console.log("*********Hotel Info Get*********");
  return fetch(url, options)
    .then((response) => response.text())
    .then((data) => {
      const Data = JSON.parse(data);
      console.log(Data);
      console.log(Data.data);
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
      return null; // return null if there was an error
    });
}

function clearInfo() {
  const holidaysContainer = document.getElementById("holidays-container");
  holidaysContainer.style.display = "none";
  document.getElementById("weatherInfo").style.display = "none";
}
