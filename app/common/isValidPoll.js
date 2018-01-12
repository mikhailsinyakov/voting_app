(function () {
    const submit = document.querySelector("button[type='submit']");
    submit.onclick = (e) => {
        const options = Array.from(document.querySelectorAll(".options"));
        const values = options.map(val => val.value)
                              .map(val => val[0].toUpperCase() + val.slice(1));
        if (!allOptionsAreDifferent(values)) {
            alert("Input different options, please");
            e.preventDefault();
        }
    };
    
    function allOptionsAreDifferent(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let n = 0; n != i && n < arr.length; n++) {
                if (arr[i] == arr[n]) return false;
            }
        }
        return true;
    }
})();