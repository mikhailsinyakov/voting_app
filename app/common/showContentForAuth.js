function showContentForAuth() {
    const log = document.querySelector("#log");
    if (log && log.innerHTML == "Logout") {
        const forAuth = Array.from(document.querySelectorAll(".isAuth"));
        forAuth.forEach(val => {
            val.classList.remove("false");
            val.classList.add("true");
        });
    }
}
