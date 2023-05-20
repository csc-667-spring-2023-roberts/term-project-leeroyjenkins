const gameID = window.location.pathname.split('/').pop()

function handleGameOnClick(event){
    event.preventDefault() 
    const url = `/games/${event.target.parentNode.id}`
    fetch(url, {
        method: "post",
        headers:{"Content-Type": "application/json"},
    })
    window.location.href=url
}
