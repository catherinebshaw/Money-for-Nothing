var query

function searchButton(event) {
    event.preventDefault()
    query = document.querySelector('#input').value
    console.log(`You searched for "${query}"`)
}






















///Watchlist JS

function dashboardList(item) {
    document.querySelector('ul').innerHTML += `<button><li class="list-group-item">${item}</li></button>`
}
