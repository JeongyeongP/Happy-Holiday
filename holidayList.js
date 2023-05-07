function getCountryCode() {
  var countryName = document.getElementById("inputCountry").value;
  const countryCodeURL = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${countryName}&languagecode=en-us`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5ed80ac7bbmsh00e5698e19f596ep1af8acjsn7518f6696b71",
      "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
    },
  };
  return fetch(countryCodeURL, options)
    .then((response) => response.json())
    .then((data) => {
      // // log data for debugging
      // console.log(data);
      if (data[0] && data[0].cc1.length > 0) {
        const countryCode = data[0].cc1;
        return countryCode;
      } else {
        window.alert("Invalid country name");
        throw new Error("Invalid country name");
      }
    })
    .then((countryCode) => {
      getEveryHoliday(countryCode);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getEveryHoliday(countryCode) {
  const calendarificKey = "3a396b216c15c82cf983a738aaf89483ff73b6bd";
  const holidayApiURL = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificKey}&country=${countryCode}&year=2023`;
  fetch(holidayApiURL)
    .then((response) => response.json())
    .then((holiday) => {
      // console.log(holiday);
      const holidaysList = document.getElementById("holidays");
      while (holidaysList.firstChild) {
        holidaysList.removeChild(holidaysList.firstChild);
      }
      holiday.response.holidays.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = `${h.name} - ${h.date.iso}`;
        holidaysList.appendChild(li);
      });
    })
    .catch((error) => console.log(error));
}

function clearHolidays() {
  const holidaysList = document.getElementById("holidays");
  while (holidaysList.firstChild) {
    holidaysList.removeChild(holidaysList.firstChild);
  }
}
