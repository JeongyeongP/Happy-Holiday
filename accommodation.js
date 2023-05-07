export function getHotel(selectedDate, destID) {
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

export function displayHotelInfo(selectedDate, destID) {
  document.getElementById("hotelInfo").style.display = "block";

  getHotel(selectedDate, destID).then((hotelData) => {
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
