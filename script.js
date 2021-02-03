var query
var userSearched

var stockList
var compInfo
var symbolInfo
var tempName

var closeingPrice
var yearHigh
var yearLow
var isoDatefix

// Info for Company Card
var sector
var exchange
var qEarningsGrowthYOY
var qRevenueGrowthYOY
var qRevenue
var compName

getYesterday()

// Saves the last thing searched in a variable
function searchButton(event) {
  event.preventDefault()
  userSearched = `${document.querySelector('#input').value}`
  // Query is stored in upper-case. Lower-case was affecting some results
  // query = tempQuery.toUpperCase()
  console.log(`You searched for "${userSearched}"`)

  // // Passes query to  companySearch()
  // companySearch(query)
  // // Passes query to  stockSearch()
  // stockSearch(query)

  nameToSymbol(userSearched)
}


async function nameToSymbol(userSearched) {
  symbolInfo = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${userSearched}&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())
  // console.log(symbolInfo.bestMatches)

  // console.log(symbolInfo.bestMatches[0])
  console.log(symbolInfo.bestMatches[0]["1. symbol"])


  for (var i = 0; i < 3; i++) {

    query = symbolInfo.bestMatches[i]["1. symbol"]
    tempName = symbolInfo.bestMatches[i]["2. name"]
    document.querySelector('#searchResultsHere').innerHTML +=
      `<strong>Symbol:</strong> ${query} <strong>Company Name:</strong> ${tempName}<br>`
    console.log('Hi')
  }


  // companySearch(query)
  // stockSearch(query)
}

function testFunction() {
  document.querySelector('#testId').innerHTML +=
    `  <input type="radio" onclick='testFunction()' class="btn-check" name="btnradio" id="btnradio1"
  autocomplete="off" checked>
<label id='testId' class="btn btn-outline-primary" for="btnradio1">Company Name, Symbol</label>`
}









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

  // LOGS INFO TO THE CONSOLE
  console.log(`${query}'s info\nTheir sector is: [${sector}]\nTheir exchange is: [${exchange}]\nTheir Quarter Earnings is: [${qEarningsGrowthYOY}]\nTheir Quarterly Revenue Growth is: [${qRevenueGrowthYOY}]`)
  console.log('query')
}

// Uses query to find they previous day's closing price
async function stockSearch(query) {
  // API query is saved to a variable
  stockList = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${query}&outputsize=size&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())

  console.log(stockList)
  // Closing price is parsed to a float and saved to a variable
  closeingPrice = parseFloat(stockList["Time Series (Daily)"][`${isoDatefix}`]["4. close"])

  console.log(closeingPrice)

  changeCompInfo()
}

// Displays company info in a card on screen
function changeCompInfo() {
  // Dispalys Sector
  document.querySelector('#cardSector').innerHTML = `Sector: <strong>${sector}</strong>`
  // Dispalys Exchange
  document.querySelector('#cardExchange').innerHTML = `<strong>${exchange}</strong>`
  // Dispalys Quarterly Earnings
  document.querySelector('#cardQEarnings').innerHTML = `<strong>${qEarningsGrowthYOY}</strong>`
  // Dispalys Quarterly Revenue
  document.querySelector('#cardQRevenue').innerHTML = `<strong>${qRevenueGrowthYOY}</strong>`
  // Dispalys the latest Closing Price
  document.querySelector('#dateNow').innerHTML = `As of: <strong>${isoDatefix}</strong>`
  // Dispalys the latest Closing Price
  document.querySelector('#sharePrice').innerHTML = `Share Price: <strong>${closeingPrice}</strong>`
  // Dispalys the Company Name
  document.querySelector('#companyName').innerHTML = `${compName}`
  // Dispalys the 52 Week High
  document.querySelector('#yearHigh').innerHTML = `52 Week High: <strong>${yearHigh}</strong>`
  // Dispalys the 52 Week Low
  document.querySelector('#yearLow').innerHTML = `52 Week Low: <strong>${yearLow}</strong>`
}









//Fetch Top Stories News
// var news = await fetch('https://api.nytimes.com/svc/topstories/v2/business.json?api-key=IlIdSVUvpiF5PABbTeerA3kRncTqyqAo').then(r => r.json())

//Access various variables
// var title = news.results[0].title
// var abstract = news.results[0].abstract
// var url = news.results[0].url

//Access 3 Top News Articles

function getYesterday() {
  var day = new Date()
  var yesteday = day.setDate(day.getDate() - 1)
  var isoDate = day.toISOString()
  isoDatefix = isoDate.slice(0, 10)
  console.log(`The previous day is: ${isoDatefix}`);
}
///Watchlist JS

function dashboardList(item) {
  document.querySelector('ul').innerHTML += `<button><li class="list-group-item">${item}</li></button>`
}
