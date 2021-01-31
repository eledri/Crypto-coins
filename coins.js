$("#main").hide();
$("#searchBox").hide();

// drawing the main menu
$("#container").html(` 
        <div class="parallax">
            <div id="welcome"><br><br><br> <h1>Welcome To Crypto Current Currency</h1> 
             <p>Here you can find reliable information on currency exchange rates.<br>
             You can view the information on reports in real time. 
             </p> <div class=" d-none d-xl-block" id="popupCurrency"></div> </div>
            <div class="arrow bounce"> <span class="fa fa-arrow-down fa-2x scrollArrow"></span> </div> </div>
            <div class="parallaxMenu">
            <div class="menuCard "> <div class="card menuCard " style="width: 18rem;">
             <img src="assets/images/menu_coins.jpg" class="card-img-top " alt="Current Currency"> 
            <div class="card-body"> <h5 class="card-title">Crypto Current Currency </h5> 
            <p class="card-text">Get the current updated currency for a wide variety of currencies.</p>
             <a href="#" id="currencyPage" class="btn btn-warning" ><i class="fas fa-coins"></i>Current Currency</a> </div> </div>
            <div class="card menuCard" style="width: 18rem;">
             <img src="assets/images/menu_stock.jpg" class="card-img-top" alt="Real Time Reports"> <div class="card-body">
             <h5 class="card-title">Real Time Reports </h5>
              <p class="card-text">Get real time reports using live data on functional graphs.</p> 
              <a id="reports" href="#nav-profile" data-toggle="pill" role="tab" aria-controls="pills-home" aria-selected="true"  class="btn btn-warning">
             <i class="fas fa-chart-line"></i>Real Time Reports</a> </div> </div>
            <div class="card menuCard" style="width: 18rem;">
             <img src="assets/images/menu_about.jpg" class="card-img-top" alt="About"> <div class="card-body"> 
            <h5 class="card-title">About </h5> <p class="card-text">Get information about the programer.</p> 
            <a id="about" href="#nav-contact" data-toggle="pill" role="tab" aria-controls="pills-home" aria-selected="true" class="btn btn-warning">
            <i class="far fa-address-card">
            </i>About</a> </div> </div>     
            </div>`);

//menu manipulation
$("#currencyPage").click(() => {
  $("#container").hide();
  $("#main").show();
  $("#searchBox").show();
});

$("#about").click(() => {
  $("#container").hide();
  $("#main").show();
  $("html, body").animate({ scrollTop: "0px" }, 0);
  $("#nav-contact-tab").attr("class", "nav-link active ");
  $("#nav-home-tab").attr("class", "nav-link");
});

$("#reports").click(() => {
  $("#container").hide();
  $("#main").show();
  $("html, body").animate({ scrollTop: "0px" }, 0);
  $("#nav-profile-tab").attr("class", "nav-link active ");
  $("#nav-home-tab").attr("class", "nav-link");
  $("#nav-profile").append(`
  <div id="noCurrency">
  <div class="alert alert-warning col-lg-6" role="alert">
  <h4 class="alert-heading">No currencies for comparison in real-time reports!</h4>
  <p>Please return to Currency Page to select coins for comparison by the toggle switch.</p> <hr>
  <p class="mb-0">
  <a class="btn btn-primary" id="back" data-toggle="pill" href="#nav-home" role="tab">Currency Page</a> </li> </p> </div> </div> `);
  $("#back").click(() => {
    $("#nav-home-tab").addClass("active");
    $("#nav-profile-tab").removeClass("active");
    $("#searchBox").show();
    $("#toggleArr").hide();
  });
});

//ajax
function getCoinsData(url) {
  return new Promise((resolve) => resolve($.get(url)));
}

// searchBox toggle
$("#nav-home-tab").click(() => {
  $("#searchBox").show();
  $("#toggleArr").hide();

  checkbox();
});
$("#nav-contact-tab").click(() => {
  $("#searchBox").hide();
  $("#toggleArr").hide();
  $("#clearSearch").hide();
});
const coinsUrl = `https://api.coingecko.com/api/v3/coins`;
let dataArray = [];
let loaderDiv = `<div class="loader2 text-center spinner-border  text-warning" role="status" ></div>`;
let checkboxData = [];

// get coins array
getCoinsData(coinsUrl).then((data) => {
  $(".loader1").hide();

  for (let i = 0; i < data.length; i++) {
    drawInfo(data[i], i);
    dataArray.push(data[i]);
  }

  $('input[type="checkbox"]').on("change", (event) => {
    dataArray[
      parseInt(event.target.getAttribute("id").split("-")[1])
    ].isChecked = $(event.target).is(":checked");
    checkbox(
      $(event.target).is(":checked"),
      event.target.getAttribute("id").split("-")[2],
      event.target.getAttribute("id")
    );
  });

  $("a").click((event) => {
    if (event.target.classList[1] === "btn-primary") {
      if (
        event.target.getAttribute("aria-expanded") === "false" ||
        event.target.getAttribute("aria-expanded") == null
      ) {
        aClick(event.target.classList[3], event.target.classList[4]);
      }
    }
  });
});

// draw coins cards
function drawInfo(array, i) {
  let coinCard = `
    <div class="card noSpace box">
    <div class="card-body ">
    <div class="custom-control custom-switch toggle "><input type="checkbox" class="custom-control-input" id="customSwitch-${i}-${array.symbol}">
    <label class="custom-control-label" for="customSwitch-${i}-${array.symbol}"></label></div>
    <h5 class="card-title">${array.symbol}</h5> <p class="card-text">${array.name}</p> </div>
    <div class="card-footer ">
    <button id="close${i}" type="button" class="ml-2 mb-1 close" data-toggle="collapse" data-target="#demo${i}"  aria-label="Close">
    <span aria-hidden="true">&times;</span></button>
    <a href="#" class="btn btn-primary btn-sm ${array.id} #demo${i}" id="infoButton${i}" data-toggle="collapse" data-target="#demo${i}">More Info</a>
    <small class="text-muted "> <div id="demo${i}"class="collapse "></div></small></div></div>`;

  $("#mainRow").append(coinCard);
  $(`#close${i}`).hide();
  $(`#infoButton${i}`).click(() => {
    $(`#infoButton${i}`).hide();
    $(`#close${i}`).show();
  });
  $(`#close${i}`).click(() => {
    $(`#close${i}`).hide();
    $(`#infoButton${i}`).fadeIn(1000);
  });
}

// get coin currency
function getCoinInfo(coinId, divId, ifData) {
  function infoUrl(url) {
    return new Promise((resolve) => resolve($.get(url)));
  }

  const coinsInfoUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;

  infoUrl(coinsInfoUrl).then((data) => {
    $(".loader2").hide();
    let coinIdData = `<div ><br><img src="${data.image["thumb"]}" class="img-thumbnail"><p class="coinInfo">
    USD: ${data.market_data.current_price["usd"]} $<br>
    EUR: ${data.market_data.current_price["eur"]} €<br>
    ILS: ${data.market_data.current_price["ils"]}‏ ₪</p></div>`;
    $(divId).append(coinIdData);
    createStorage(
      ifData,
      coinId,
      data.image["thumb"],
      data.market_data.current_price["usd"],
      data.market_data.current_price["eur"],
      data.market_data.current_price["ils"]
    );
  });
}

// search function
$("#clearSearch").hide();
$("#searchCoins").keyup(function () {
  if ($.trim(this.value).length > 0) $("#clearSearch").show();
  else $("#clearSearch").hide();
});

$("#clearSearch").click(() => {
  $("#searchCoins").val("");
  $("#searchCoins").keyup();
});

$("#searchCoins").keyup(() => {
  $("#mainRow").empty();

  let newDataArray = getNewDataArray(
    dataArray,
    $("#searchCoins").val().toLowerCase()
  );

  for (let i = 0; i < newDataArray.length; i++) {
    drawInfo(newDataArray[i], i);

    for (let j = 0; j < checkboxData.length; j++) {
      if (newDataArray[i].symbol === checkboxData[j]) {
        $(`#customSwitch-${i}-${checkboxData[j]}`).click();
      }
    }
  }

  $('input[type="checkbox"]').on("change", (event) => {
    newDataArray[
      parseInt(event.target.getAttribute("id").split("-")[1])
    ].isChecked = $(event.target).is(":checked");
    checkbox(
      $(event.target).is(":checked"),
      event.target.getAttribute("id").split("-")[2],
      event.target.getAttribute("id")
    );
  });

  $("a").click((event) => {
    if (event.target.classList[1] === "btn-primary") {
      if (
        event.target.getAttribute("aria-expanded") === "false" ||
        event.target.getAttribute("aria-expanded") == null
      ) {
        aClick(event.target.classList[3], event.target.classList[4]);
      }
    }
  });
});

//search filter
function getNewDataArray(data, searchValue) {
  return data.filter((dataName) =>
    dataName.symbol.toLowerCase().startsWith(searchValue)
  );
}

function aClick(coinId, divId) {
  $(divId).empty();
  $(divId).append(loaderDiv);
  let data = window.localStorage.getItem("coins");
  let parseData = JSON.parse(data);

  if (!data) {
    getCoinInfo(coinId, divId, "noData");
  } else {
    let same = false;
    let index = 0;
    for (let i = 0; i < parseData.length; i++) {
      if (parseData[i].coinId === coinId) {
        same = true;
        index = i;
      }
    }

    if (same) {
      let newTime = new Date().getTime();
      if (newTime - parseData[index].time < 120000) {
        $(".loader2").hide();
        let coinIdData = `<div><br><img src="${parseData[index].image}"><p class="coinInfo">
        USD: ${parseData[index].usdPrice} $<br>
        EUR: ${parseData[index].eurPrice} €<br>
        ILS: ${parseData[index].ilsPrice}‏ ₪</p></div>`;
        $(divId).append(coinIdData);
      } else {
        parseData.splice(index, 1);
        window.localStorage.setItem("coins", JSON.stringify(parseData));
        getCoinInfo(coinId, divId, "yesData");
      }
    } else {
      getCoinInfo(coinId, divId, "yesData");
    }
  }
}

//toggle array
function createArrCheckbox() {
  checkboxData = [];
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].isChecked == true) {
      checkboxData.push(dataArray[i].symbol);
      window.onbeforeunload = function () {
        return "";
      };
    } else if (dataArray[i].isChecked == false) {
      window.onbeforeunload = null;
    }
  }

  sessionStorage.setItem("checkbox", checkboxData);
}

let eventIdNew = "";
//checkbox limit check
function checkbox(checkStat, thisEventSymbol, thisEventId) {
  $("#toggleArr").show();
  $("#toggleArr").html(`
  Live Reports currencies : ${checkboxData} `);

  if (checkboxData.length < 5) {
    createArrCheckbox();
    $("#toggleArr").html(`Live Reports currencies : ${checkboxData} `);
  } else {
    if (checkStat == true) {
      $("#toggleArr").html(`Live Reports currencies : ${checkboxData}`);

      createArrCheckbox();
      $(".modal-body").empty();
      $("#exampleModal").modal();

      let modalInfo = "";
      for (let i = 0; i < checkboxData.length; i++) {
        if (checkboxData[i] != thisEventSymbol) {
          if (i === checkboxData.length - 1) {
            modalInfo += ` 
            <div class="card box" >
            <div class="card-body">
              <h5 class="card-title modalCoin">${checkboxData[i]}</h5>
              <div class="custom-control custom-switch toggle inModal">
              <input type="checkbox" class="custom-control-input" id="customSwitch-${checkboxData[i]}">
              <label class="custom-control-label" for="customSwitch-${checkboxData[i]}"></label></div></div>
            </div>
          </div>`;
          } else {
            modalInfo += `
            <div class="card box" >
            <div class="card-body">
              <h5 class="card-title modalCoin">${checkboxData[i]}</h5>
              <div class="custom-control custom-switch toggle inModal">
              <input type="checkbox" class="custom-control-input" id="customSwitch-${checkboxData[i]}">
              <label class="custom-control-label" for="customSwitch-${checkboxData[i]}"></label></div></div>
            </div>
          </div>`;
          }
        }
      }
      $(".modal-body").append(
        `
      <p> You can select up to 5 currencies for real-time reports, if you want to add <b>${thisEventSymbol}</b>
      <br>please remove other currencies from the list or choose Cancel for exit</p>
      ` + modalInfo
      );
      for (let i = 0; i < checkboxData.length; i++) {
        $(`#customSwitch-${checkboxData[i]}`).click();
      }
    } else {
      createArrCheckbox();
      $("#toggleArr").html(`Live Reports currencies : ${checkboxData}`);
    }
  }
  if (checkboxData.length == 0) {
    $("#toggleArr").hide();
  } else {
    $("#toggleArr").show();
  }
  eventIdNew = thisEventId;
}

$("#cancelModal").click(() => {
  $(`#${eventIdNew}`).click();
  $("#toggleArr").html(`Live Reports currencies : ${checkboxData}`);
});

$("#hiddenModal").click(() => {
  $(`#${eventIdNew}`).click();
  $("#toggleArr").html(`Live Reports currencies : ${checkboxData}`);
});

$("#saveModal").click(() => {
  function changeChoice() {
    for (let j = 0; j < dataArray.length; j++) {
      for (let i = 0; i < symbolToSwitch.length; i++) {
        if (dataArray[j].symbol === symbolToSwitch[i]) {
          $(`#customSwitch-${j}-${symbolToSwitch[i]}`).click();
        }
        $("#toggleArr").html(`Live Reports currencies  : ${checkboxData}`);
      }
    }
  }
  // modal switch array
  let symbolToSwitch = [];
  for (let i = 0; i < checkboxData.length; i++) {
    if (
      $(`#customSwitch-${checkboxData[i]}`).is(":checked") === false &&
      checkboxData[i] != eventIdNew.split("-")[2]
    ) {
      symbolToSwitch.push(checkboxData[i]);
    }
  }

  if ($("#searchCoins").val()) {
    let searchVal = $("#searchCoins").val();
    $("#searchCoins").val("");
    $("#searchCoins").keyup();
    changeChoice();
    $("#searchCoins").val(searchVal);
    $("#searchCoins").keyup();
  } else {
    changeChoice();
  }

  if (symbolToSwitch.length === 0) {
    event.stopPropagation();
  }
});

// save on local storage
function createStorage(ifData, coinId, imgUrl, usd, eur, ils) {
  if (ifData === "noData") {
    window.localStorage.setItem(
      "coins",
      JSON.stringify([
        {
          coinId: coinId,
          image: imgUrl,
          usdPrice: usd,
          eurPrice: eur,
          ilsPrice: ils,
          time: new Date().getTime(),
        },
      ])
    );
  } else {
    let localStorageData = JSON.parse(window.localStorage.getItem("coins"));
    localStorageData.push({
      coinId: coinId,
      image: imgUrl,
      usdPrice: usd,
      eurPrice: eur,
      ilsPrice: ils,
      time: new Date().getTime(),
    });
    window.localStorage.setItem("coins", JSON.stringify(localStorageData));
  }
}

let coinForChart = [];
let dateForChart = [];

// chart
function infoForChart() {
  function getCoinData(url) {
    return new Promise((resolve) => resolve($.get(url)));
  }

  let symbolUrl = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";
  for (let i = 0; i < checkboxData.length; i++) {
    if (i == checkboxData.length - 1) {
      symbolUrl += `${checkboxData[i]}`;
    } else {
      symbolUrl += `${checkboxData[i]},`;
    }
  }
  symbolUrl += "&tsyms=USD";

  getCoinData(symbolUrl).then((data) => {
    let newDate = new Date();
    let newDateOption = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    if (coinForChart.length === 0) {
      Object.keys(data).map((newName) =>
        coinForChart.push({ name: newName, data: [data[newName].USD] })
      );
      dateForChart.push(newDate.toLocaleTimeString("he-iL", newDateOption));
    } else {
      if (coinForChart[0].data.length < 10) {
        dateForChart.push(newDate.toLocaleTimeString("he-iL", newDateOption));
        for (let i = 0; i < Object.keys(data).length; i++) {
          coinForChart[i].data.push(data[coinForChart[i].name].USD);
        }
      } else {
        dateForChart.shift();
        dateForChart.push(newDate.toLocaleTimeString("he-iL", newDateOption));
        for (let i = 0; i < Object.keys(data).length; i++) {
          coinForChart[i].data.shift();
          coinForChart[i].data.push(data[coinForChart[i].name].USD);
        }
      }
    }
    drawChart();
  });
}
$("#nav-profile-tab").click(() => {
  $("#searchBox").hide();
  $("#toggleArr").hide();
  $("#clearSearch").hide();

  if (checkboxData.length === 0) {
    $("#clearSearch").hide();
    $(".loader3").hide();
    $("#toggleArr").hide();
    $("#nav-profile").empty();
    $("#nav-profile").append(`
    <div id="noCurrency">
    <div class="alert alert-warning col-lg-6" role="alert">
    <h4 class="alert-heading">No currencies for comparison in real-time reports!</h4>
    <p>Please return to Currency Page to select coins for comparison by the toggle switch.</p> <hr>
    <p class="mb-0"> <a class="btn btn-primary" id="back" data-toggle="pill" href="#nav-home" role="tab">Currency Page</a> 
    </li> </p> </div> </div>
    `);
    $("#back").click(() => {
      $("#nav-home-tab").addClass("active");
      $("#nav-profile-tab").removeClass("active");
      $("#searchBox").show();
      $("#toggleArr").hide();
    });
  } else {
    coinForChart = [];
    $("#nav-profile").empty();
    $("#nav-profile").append(
      `<div id="repRow" class="row"><div class="loader3 text-center">
      <div class="loader-inner"><div class="lds-ellipsis">
      <div class="loadDiv1"></div><div class="loadDiv2">
      </div><div class="loadDiv3"></div><div class="loadDiv4">
      </div></div><h4 class="text-uppercase font-weight-bold">
      </h4></div></div></div> </div> </div>
      `
    );

    let reportsInterval = setInterval(interval, 2000);

    function interval() {
      infoForChart();
    }

    $("#nav-home-tab").click(() => clearInterval(reportsInterval));
    $("#nav-contact-tab").click(() => clearInterval(reportsInterval));
  }
});

// chart draw
function drawChart(counter) {
  $(".loader3").hide();
  Highcharts.chart("nav-profile", {
    chart: {
      type: "spline",
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: "Value of selected currencies in USD",
    },

    subtitle: {
      text: "Automatically updates every 2 seconds",
    },

    yAxis: {
      title: {
        text: "Value in USD",
      },
    },

    xAxis: {
      categories: dateForChart,
    },

    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    plotOptions: {
      spline: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
      series: {
        animation: false,
      },
    },
    series: coinForChart,

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  });
}

// top page button
const topButton = document.getElementById("topButton");
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}
function topFunction() {
  $("html, body").animate({ scrollTop: "0px" }, 300);
}
