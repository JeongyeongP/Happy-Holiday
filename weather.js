function getWeather(selectedDate, latitude, longitude) {
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

export async function displayWeatherInfo(selectedDate, latitude, longitude) {
  const weatherTable = document.getElementById("weatherTable");
  const weatherTableBody = document.getElementById("weatherTableBody");
  const weatherData = await getWeather(selectedDate, latitude, longitude);

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
