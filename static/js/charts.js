// document.addEventListener("DOMContentLoaded", function () {
//     var ctx = document.getElementById('bar-chart').getContext('2d');

//     // sample data
//     var data = {
//         labels: Object.keys(agg_dataset),
//         datasets: [{
//             label: 'Sample Data',
//             data: Object.values(agg_dataset),
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)'
//             ],
//             borderWidth: 1
//         }]
//     }

//     // Create the bar chart
//     var myBarChart = new Chart(ctx, {
//         type: 'bar',
//         data: data,
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     })



//     // Get the canvas element by its id
//     var pieChartCanvas = document.getElementById("pie-chart");

//     // // Create the data for the pie chart
//     // var pieChartData = {
//     //     labels: ["Label 1", "Label 2", "Label 3"], // Replace with your labels
//     //     datasets: [{
//     //         data: [30, 40, 50], // Replace with your data values
//     //         backgroundColor: ["#FF5733", "#33FF57", "#5733FF"], // Replace with your colors
//     //     }]
//     // };

//     // Create a pie chart instance
//     var pieChart = new Chart(pieChartCanvas, {
//         type: 'pie',
//         data: data,
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//         }
//     })
// })
