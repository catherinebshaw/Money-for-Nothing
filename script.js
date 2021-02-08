// Variables for search functions
var query
var userSearched

// Variables for API Objects
var stockList
var compInfo
var symbolInfo
var tempName

// Variables for Stocks and Year High/Lows
var closeingPrice
var yearHigh
var yearLow
var isoDatefix

// Variables for Company Card
var sector
var exchange
var qEarningsGrowthYOY
var qRevenueGrowthYOY
var qRevenue
var compName
var LSWL


//NEWS API
var news
var abstract
var url
var title
var hotTitle


//Infor for Local Storage and Watch List
var lswl
var lsCompCheck
var newCompany
var stockSymb







function LS() {
  if (localStorage.getItem('lswl') === null) {
    console.log(lswl === null)
    lswl = []
  } else {
    lswl = JSON.parse(localStorage.getItem('lswl'))
  }
  watchlist()
}
console.log(lswl)

// Saves the last thing searched in a variable
function searchButton(event) {
  event.preventDefault()
  document.querySelector('#btnGroup').innerHTML = ''
  userSearched = `${document.querySelector('#input').value}`
  // Query is stored in upper-case. Lower-case was affecting some results
  // query = tempQuery.toUpperCase()
  console.log(`You searched for "${userSearched}"`)
  nameToSymbol(userSearched)
}

// ------------------------------------------------USER SEARCH & SEARCH OPTIONS----------------------------------------------------------------------------
async function nameToSymbol(userSearched) {
  symbolInfo = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${userSearched}&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())
  console.log(symbolInfo.bestMatches[0]["1. symbol"])

  for (var i = 0; i < 3; i++) {

    query = symbolInfo.bestMatches[i]["1. symbol"]
    tempName = symbolInfo.bestMatches[i]["2. name"]
    createSearchOptions(query)
    console.log('Hi')
  }
}

function createSearchOptions(query) {
  document.querySelector('#btnGroup').innerHTML +=
    // Creates button for current query
    `
    <button  onclick="runFromOption('${query}')" type="button" class="btn btn-secondary mx-1"><strong>Symbol:</strong> ${query} <strong>Company Name:</strong> ${tempName}</button>
    `
}
// Presents information depending on which search optin use selects
function runFromOption(query) {
  companySearch(query)
  stockSearch(query)
  document.querySelector('#btnGroup').innerHTML = ''
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------




//-----------------------------------------------FINDING & DISPLAYING COMPANY INFO--------------------------------------------------------------------------
// Uses the query to find the searched companies' information
async function companySearch(query) {
  // API query is saved to a variable
  compInfo = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${query}&outputsize=size&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())

  console.log(compInfo)
  // Saves needed information in their own variables
  sector = compInfo.Sector
  exchange = compInfo.Exchange
  qEarningsGrowthYOY = compInfo.QuarterlyEarningsGrowthYOY
  qRevenueGrowthYOY = compInfo.QuarterlyRevenueGrowthYOY
  compName = compInfo.Name
  yearHigh = parseFloat(compInfo["52WeekHigh"]).toFixed(2)
  yearLow = parseFloat(compInfo["52WeekLow"]).toFixed(2)

  //bill added this
  stockSymb = compInfo.Symbol

  // LOGS INFO TO THE CONSOLE
  console.log(`${query}'s info\nTheir sector is: [${sector}]\nTheir exchange is: [${exchange}]\nTheir Quarter Earnings is: [${qEarningsGrowthYOY}]\nTheir Quarterly Revenue Growth is: [${qRevenueGrowthYOY}]`)
  console.log('query')

  console.log(stockSymb)

  stockSymb = compInfo.Symbol

  // Check Local Storage for company
  checkLS(compName, query, stockSymb)
}

// Uses query to find they previous day's closing price
async function stockSearch(query) {
  // API query is saved to a variable
  stockList = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${query}&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())

  console.log(stockList)
  // Closing price is parsed to a float and saved to a variable
  closeingPrice = parseFloat(stockList["Global Quote"]["08. previous close"])
  isoDatefix = stockList["Global Quote"]["07. latest trading day"]

  console.log(closeingPrice)

  changeCompInfo()
}

// Displays company info in a card on screen
function changeCompInfo() {
  // Dispalys Sector if it has a valid value
  sector === undefined ? document.querySelector('#cardSector').innerHTML = '' : document.querySelector('#cardSector').innerHTML = `Sector: <strong>${sector}</strong>`
  // Dispalys Exchange if it has a valid value
  exchange === undefined ? document.querySelector('#cardExchange').innerHTML = '' : document.querySelector('#cardExchange').innerHTML = `Exchange: <strong>${exchange}</strong>`
  // Dispalys Quarterly Earnings if it has a valid value
  qEarningsGrowthYOY === undefined ? document.querySelector('#allEarnings').innerHTML = '' : document.querySelector('#cardQEarnings').innerHTML = `<strong>${qEarningsGrowthYOY}</strong>`
  // Dispalys Year Over Year heading if Quarterly Earnings has a valid value
  qEarningsGrowthYOY === undefined ? document.querySelector('#YOY').innerHTML = '' : document.querySelector('#YOY').innerHTML = `Year over Year`
  // Dispalys Quarterly Revenue if it has a valid value
  qRevenueGrowthYOY === undefined ? document.querySelector('#allRevenue').innerHTML = '' : document.querySelector('#cardQRevenue').innerHTML = `<strong>${qRevenueGrowthYOY}</strong>`
  // Dispalys the latest Closing Price if it has a valid value
  isoDatefix === undefined ? document.querySelector('#dateNow').innerHTML = '' : document.querySelector('#dateNow').innerHTML = `As of: <strong>${isoDatefix}</strong>`
  // Dispalys the latest Closing Price
  closeingPrice === undefined ? document.querySelector('#sharePrice').innerHTML = '' : document.querySelector('#sharePrice').innerHTML = `Share Price (USD): <strong>$${closeingPrice}</strong>`
  // Dispalys the Company Name if it has a valid value
  compName === undefined ? document.querySelector('#companyName').innerHTML = '' : document.querySelector('#companyName').innerHTML = `${compName}`
  // Dispalys the 52 Week High if it has a valid value
  document.querySelector('#yearHigh').innerHTML = `52 Week High (USD): <strong>$${yearHigh}</strong>`
  if (document.querySelector('#yearHigh').innerText === "52 Week High (USD): $undefined") { document.querySelector('#yearHigh').innerHTML = '' }
  // Dispalys the 52 Week Low if it has a valid value
  document.querySelector('#yearLow').innerHTML = `52 Week Low (USD): <strong>$${yearLow}</strong>`
  if (document.querySelector('#yearLow').innerText === "52 Week Low (USD): $undefined") { document.querySelector('#yearLow').innerHTML = '' }

  if (`${qEarningsGrowthYOY}` < 0) { document.querySelector("#cardQEarnings").style.color = "red" }
  if (`${qRevenueGrowthYOY}` < 0) { document.querySelector("#cardQRevenue").style.color = "red" }
}
//------------------------------------------------------------------------------------------------------------------------------------------

// get news API
async function getNews() {
  news = await fetch('https://api.nytimes.com/svc/topstories/v2/business.json?api-key=IlIdSVUvpiF5PABbTeerA3kRncTqyqAo').then(r => r.json())
  console.log(news)
  for (i = 0; i < 3; i++) {

    title = news.results[i].title
    console.log(title)
    url = news.results[i].url
    hotTitle = title.link(`${url}`)
    console.log(url)
    changeNewsInfo()

  }
}

// Displays news info in a card on screen
function changeNewsInfo() {
  // Displays title of News
  document.querySelector(`#newsstory${i}`).innerHTML += `<strong>${hotTitle}</strong>`
}


console.log(lswl)

// Scan local storage
function checkLS() {
  console.log(lswl)
  // check to see if company is already on watch list     
  console.log(`${compName}`)
  // if result is less than 0 not on the list
  lsCompCheck = lswl.find(lswl => lswl.name === `${compName}`)
  lsCompCheck2 = lswl.findIndex(lswl => lswl.name === `${compName}`)

  console.log(lsCompCheck)
  // change wachlist button color and text
  if (lsCompCheck !== undefined) {
    console.log(lsCompCheck < 1)
    console.log(lsCompCheck)
    console.log(lsCompCheck2)
    console.log(typeof (lsCompCheck))

    document.querySelector('.wlbtn').classList.replace("btn-success", "btn-danger")
    document.querySelector('.wlbtn').innerHTML = "- from Watchlist"
  } else {
    document.querySelector('.wlbtn').classList.replace("btn-danger", "btn-success")
    document.querySelector('.wlbtn').innerHTML = "+ to Watchlist"
  }
}

// Watchlist button trigger (add or remove from list)
function watchListBtn(event) {
  console.log("Watch List button pressed")
  var wlbtnresults = document.querySelector('.wlbtn').innerText
  if (wlbtnresults === "+ to Watchlist") {
    console.log("good to go")
    addLocalStorage()
  } else {
    console.log("no go")
    removeLocalStorage()
  }
}


// save items to local storage
function addLocalStorage() {
  console.log("add Local Storage function started")
  // pull Local Storage if exists
  if (localStorage.getItem("lswl") === null) {
    lswl = [];
  } else {
    lswl = JSON.parse(localStorage.getItem('lswl'));
  }

  newCompany = {
    name: compName,
    ticker: `${stockSymb}`,
  }

  // if section is not blank proceed else stop
  if (compName != null) {
    lswl.push(newCompany);
  } else {
    alert("Search for a company using the search bar")
  }
  // Push updated array with new item back to Local Storage
  localStorage.setItem('lswl', JSON.stringify(lswl));
  watchlist()
}

// remove from local storage
function removeLocalStorage() {

  console.log("remove Local Storage function started")
  console.log(compName)
  lswl = JSON.parse(localStorage.getItem('lswl'));
  lswlnew = lswl.splice(lsCompCheck2, 1)
  localStorage.setItem('lswl', JSON.stringify(lswl));
  console.log(lswl)
  watchlist()
}

// Add to  Watchlist
function watchlist() {
  document.querySelector('.list-group').innerHTML = ""
  if (localStorage.lswl === undefined) {
    lswl = []
  } else {
    lswl = JSON.parse(localStorage.getItem('lswl'))
    console.log(lswl)

    var lswlLength = lswl.length
    console.log(lswl)
    console.log(lswlLength)

    for (i = 0; i < lswlLength; i++) {
      var tick = lswl[i].ticker
      var nam = lswl[i].name

      document.querySelector('.list-group').innerHTML += `<li class="wlBtn"><button onclick="wlBtnSearch('${tick}')"><span id="stkName">${nam}</span> - <span id = "stkSymb">${tick}</span></button></li>`
    }
  }

}

//when the watchlist button is pushed, pass the company name via the search function trigger
function wlBtnSearch(tick) {
  console.log("WL button click")
  console.log(tick)
  stockSearch(tick)
  companySearch(tick)
}


LS()
getNews()




