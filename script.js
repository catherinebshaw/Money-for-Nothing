var query

function searchButton(event) {
    event.preventDefault()
    query = document.querySelector('#input').value
    console.log(`You searched for "${query}"`)
}

​//Set Fetch command to varaible
var stockList = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=size&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())
​
//To access full list
var goal = stockList["Time Series (Daily)"]
​
//TO ACCESS DAY
goal["2021-02-01"]["4. close"]

//Fetch Top Stories News
var news = await fetch ('https://api.nytimes.com/svc/topstories/v2/business.json?api-key=IlIdSVUvpiF5PABbTeerA3kRncTqyqAo').then(r => r.json())

//Access various variables
var title = news.results[0].title
var abstract = news.results[0].abstract
var url = news.results[0].url

//Access 3 Top News Articles




//search function
function btnClick(){
  console.log("Search Button has been clicked")
  var serach = document.querySelector.
}






///Watchlist JS

function dashboardList(item) {
    document.querySelector('ul').innerHTML += `<button><li class="list-group-item">${item}</li></button>`
}
