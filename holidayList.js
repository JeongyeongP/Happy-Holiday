function getCountryCode() {
  var countryName = document.getElementById("inputCountry").value;
  const airLabsKey = "bd2a7142-10a6-450d-9932-9bf0687231ce";
  const apiURL = `https://airlabs.co/api/v9/autocomplete?query=${countryName}&api_key=${airLabsKey}`;

  console.log("Getting Country Code Data");
  return fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // log the data for debugging
      if (data.response.countries && data.response.countries.length > 0) {
        const countryArray = data.response.countries;
        var countryCode = countryArray[0].code;
        console.log("This is country code ", countryCode);
        return countryCode;
      } else {
        throw new Error("Invalid country name");
      }
    })
    .then((countryCode) => {
      // call the getCountry function with the countryCode value
      console.log("Start to get Holidays");
      getEveryHoliday(countryCode);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getEveryHoliday(countryCode) {
  // construct the API URL with the input country parameter
  const holidayApiURL = `https://calendarific.com/api/v2/holidays?&api_key=3a396b216c15c82cf983a738aaf89483ff73b6bd&country=${countryCode}&year=2023`;
  console.log("Getting Holiday Data");
  fetch(holidayApiURL)
    .then((response) => response.json())
    .then((holiday) => {
      console.log(holiday);
      const holidaysList = document.getElementById("holidays");
      holiday.response.holidays.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = `${h.name} - ${h.date.iso}`;
        // add an event listener to the li element that executes a function when it is clicked
        li.addEventListener("click", () => {
          // modify this function to do whatever you want when the li element is clicked
          console.log(`You clicked on ${h.name}`);
        });
        holidaysList.appendChild(li);
      });
    })
    .catch((error) => console.log(error));
  console.log("Done");
}

function clearHolidays() {
  const holidaysList = document.getElementById("holidays");
  while (holidaysList.firstChild) {
    holidaysList.removeChild(holidaysList.firstChild);
  }
}
