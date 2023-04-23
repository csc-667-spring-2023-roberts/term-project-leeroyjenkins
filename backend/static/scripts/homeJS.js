console.log('this is the home')

function handleGameOnClick(event){
    event.preventDefault()
    console.log("gameID: "+ event.target.parentNode.id)
    const inputValue = prompt('Please enter a number:')
    if(inputValue === null || isNaN(inputValue)){
        console.log("invalid input")
        return
    }
    console.log("gameID: " + event.target.parentNode.id + ", Input value: " + inputValue);
    // const url = '/games/' + gameID
    // window.location.href = url
}
