const gameID = window.location.pathname.split('/').pop()

function handleGameOnClick(event){
    event.preventDefault()
    // console.log("gameID: "+ event.target.parentNode.id)
    // const inputValue = prompt('Please enter a number:')
    // if(inputValue === null || isNaN(inputValue)){
    //     console.log("invalid input")
    //     return
    // }
    // console.log("gameID: " + event.target.parentNode.id + ", Input value: " + inputValue);
    // const url = `/games/${event.target.parentNode.id}?value=${inputValue}`
    const url = `/games/${event.target.parentNode.id}`
    fetch(url, {
        method: "post",
        headers:{"Content-Type": "application/json"},
    })
    window.location.href=url
}
