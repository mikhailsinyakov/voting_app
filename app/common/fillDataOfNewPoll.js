(function() {
    const path = window.location.pathname;
    const id = path.split("/")[2];
    const name = path.split("/")[3];
    const anchor = document.querySelector("#newPollLink");
    anchor.href = `https://voting-app-mikhailsinyakov.c9users.io/polls/${id}`;
    anchor.innerHTML = name;
    
})();