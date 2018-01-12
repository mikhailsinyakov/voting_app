"use strict";
function drawChart(data) {
    const names = data.map(val => val.name);
    const votes = data.map(val => val.votes);
    const ctx = document.querySelector("#myChart").getContext("2d");
    const initColor = {
        r: 100,
        g: 40,
        b: 70
    };
    const colors = data.map((val, i) => `rgb(${initColor.r + (i * 40)},${initColor.g + (i * 20)},${initColor.b + (i * 50)})`);
    const myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: names,
            datasets: [{
                data: votes,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: false,
            legend: {
                position: "left",
                labels: {
                    boxWidth: 15,
                    fontSize: 10
                }
            }
        }
    });
}