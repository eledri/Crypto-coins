let tickerArray = [];
getCoinsData(coinsUrl).then((data) => {
  for (let i = 0; i < 6; i++) {
    tickerArray.push(
      data[i].image.thumb,
      data[i].name,
      data[i].market_data.current_price.usd + " $"
    );
  }
  displayCurrency(tickerArray)
 
});

function displayCurrency(tickerArray){
    $("#popupCurrency").html(
      `<img class="scrollImg" src="${tickerArray[0]}"/> ${tickerArray[1]}  ${tickerArray[2]} `
    );

  setTimeout(() => {
    $("#popupCurrency").html(
      `<img class="scrollImg" src="${tickerArray[3]}"/> ${tickerArray[4]}  ${tickerArray[5]} `
    );
  }, 3000);
  setTimeout(() => {
    $("#popupCurrency").html(
      `<img class="scrollImg" src="${tickerArray[15]}"/> ${tickerArray[16]}  ${tickerArray[17]} `
    );
  }, 6000);
  setTimeout(() => {
    $("#popupCurrency").html(
      `<img class="scrollImg" src="${tickerArray[12]}"/> ${tickerArray[13]}  ${tickerArray[14]} `
    );
 }, 9000);

 setTimeout(()=>{
  getCoinsData()
  displayCurrency(tickerArray)
    },12000)
}
