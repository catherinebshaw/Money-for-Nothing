var query

function searchButton(event) {
    event.preventDefault()
    query = document.querySelector('#input').value
    console.log(`You searched for "${query}"`)
}