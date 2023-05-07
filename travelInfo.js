let statesName;
let statesCode;
let countryCode;
let destID;
let latitude;
let longitude;

function getTravelInfo() {
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
      getHoliday(countryCode, statesCode); // pass countryCode and stateCode as arguments
    })
    .catch((error) => {
      console.log(error);
    });
}

function getStatesCode(countryCode) {
  statesCodeURL = `https://api.countrystatecity.in/v1/countries/${countryCode}/states/`;
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

function getHoliday(countryCode, statesCode) {
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
        await displayWeatherInfo(selectedDate);
        displayHotelInfo(selectedDate);
      });
    })
    .catch((error) => {
      window.alert(
        "Please try again. Some error happens during getting information!"
      );
      console.log(error);
    });
}

function getWeather(selectedDate) {
  const weatherData = [];
  const currentDate = new Date();
  const selectedDateTime = new Date(selectedDate);
  const diffInSeconds =
    (selectedDateTime.getTime() - currentDate.getTime()) / 1000;

  if (diffInSeconds < 1296000) {
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
        // console.log(data);
        const dates = getNextFourDays(selectedDate);
        for (let i = 0; i < data.daily.data.length - 4; i++) {
          if (data.daily.data[i].day === dates[0]) {
            weatherData.push("Forecast");
            for (let j = 0; j < 5; j++) {
              weatherData.push(
                data.daily.data[i + j].day,
                data.daily.data[i + j].weather,
                data.daily.data[i + j].summary
              );
            }
            return weatherData;
          }
        }
        return null;
      })
      .catch((error) => {
        console.log("Error fetching weather data:", error);
        return null;
      });
  } else {
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
        weatherData.push("History");
        for (let i = 0; i < Data.data.length; i++) {
          weatherData.push(
            Data.data[i].date,
            Data.data[i].tmax,
            Data.data[i].tmin
          );
        }
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

  // remove existing table header
  const existingTableHeader = weatherTable.querySelector("thead");
  if (existingTableHeader) {
    existingTableHeader.parentNode.removeChild(existingTableHeader);
  }

  // check if the first value is "History" or "Forecast"
  if (weatherData[0] === "History") {
    const headers = [
      "Date",
      "Highest Temperature (°C) ",
      "Lowest Temperature (°C)",
    ];
    setTableHeaders(weatherTable, headers);
  } else if (weatherData[0] === "Forecast") {
    const headers = ["Date", "Weather", "Summary"];
    setTableHeaders(weatherTable, headers);
  }

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

function getHotel(selectedDate) {
  const hotelData = [];
  const endDate = new Date(selectedDate);
  endDate.setDate(endDate.getDate() + 4);
  const endDateString = endDate.toISOString().split("T")[0];

  const hotelurl = `https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date=${selectedDate}&departure_date=${endDateString}&guest_qty=1&dest_ids=${destID}&room_qty=1&search_type=city&children_age=0&search_id=none&price_filter_currencycode=USD&order_by=popularity&languagecode=en-us&travel_purpose=leisure`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
      "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
    },
  };

  return fetch(hotelurl, options)
    .then((response) => response.text())
    .then((data) => {
      const Data = JSON.parse(data);
      const hotels = Data.result;
      for (let i = 0; i < Math.min(5, hotels.length); i++) {
        hotelData.push(hotels[i]);
      }
      return hotelData;
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
      return null;
    });
}

function displayHotelInfo(selectedDate) {
  document.getElementById("hotelInfo").style.display = "block";

  getHotel(selectedDate).then((hotelData) => {
    // Get the table body element
    const hotelTableBody = document.getElementById("hotelTableBody");
    hotelTableBody.innerHTML = "";

    for (let i = 0; i < hotelData.length; i++) {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = hotelData[i].hotel_name;
      row.appendChild(nameCell);

      const addressCell = document.createElement("td");
      addressCell.textContent = hotelData[i].address;
      row.appendChild(addressCell);

      const reviewScoreCell = document.createElement("td");
      reviewScoreCell.textContent = hotelData[i].review_score;
      row.appendChild(reviewScoreCell);

      const totalPriceCell = document.createElement("td");
      totalPriceCell.textContent = hotelData[i].min_total_price;
      row.appendChild(totalPriceCell);

      const currencyCell = document.createElement("td");
      currencyCell.textContent = hotelData[i].currency_code;
      row.appendChild(currencyCell);

      hotelTableBody.appendChild(row);
    }
  });
}

function clearInfo() {
  const holidaysContainer = document.getElementById("holidays-container");
  holidaysContainer.style.display = "none";
  document.getElementById("weatherInfo").style.display = "none";
  document.getElementById("hotelInfo").style.display = "none";
}
