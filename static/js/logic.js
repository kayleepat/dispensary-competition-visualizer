const url = "/api/v1.0/geoJSON"

d3.json(url).then(data => {
    // init global variables
    var slider = document.getElementById("slider-range")
    var output = document.getElementById("slider-value")
    var circle
    var circleGroup
    var sliderRadius = slider.value * 1609.34
    var competitorData = []
    
    init()


    function init() {

        // initialize map
        map = L.map('map',{
            center: { lat: 28.613140672712017, lng: -81.43263221505724 }
            ,zoom: 7
            ,autoClose: false

        }).setView([27.6648, -81.5158], 7)

        //add initial tile layer to the map
        tile_layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })

        // Create an empty feature group for circles
        circleGroup = L.featureGroup().addTo(map)

        // add markers
        data_layer = L.geoJSON(data, {

            pointToLayer: function(feature, coordinates) {

                const marker = L.marker(coordinates, {
                    // hover tooltip
                    title: feature.properties.company
                }).bindPopup(
                    `<strong>${feature.properties.company}</strong><br>${feature.properties.full_address}`
                )

                return marker

            }

        }).on('click', function(e){

            coords = e.latlng

            // console.log(`clicked coords = ${coords}`)

            // main(radius = radius, coords = coords)

            circleGroup.clearLayers()

            circle = L.circle(coords, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.3,
                radius: sliderRadius
            }).addTo(circleGroup)

            

            // count markers within circle
            var competitorCount = 0
            var competitorsOnClick = [] // init empty array for competitor data
            data_layer.eachLayer(function (marker) {
                if (marker !== e.layer && countCompetitors(marker, circle)) {
                    competitorCount++;
                    const markerCoords = marker.getLatLng()
                    const distance = markerCoords.distanceTo(coords)
                    const address = extractAddressFromPopup(marker.getPopup().getContent())

                    competitorsOnClick.push({
                        companyName: marker.options.title,
                        address: address,
                        distance: (distance * 0.000621371)
                    })
                }
            })
            
            competitorData = competitorsOnClick
            competitorData.sort((a, b) => a.distance - b.distance) // sort low to high

            // update page on click
            updateTable(competitorData, competitorCount)
            updatePieChart(pieChart, competitorData)
            updateBarChart(barChart, competitorData)

            console.log(competitorData)
            console.log(`Number of markers within the circle: ${competitorCount}`)

            map.fitBounds(circle.getBounds())
    
        })

        map.addLayer(tile_layer)
        map.addLayer(data_layer)
        initCharts()
        console.log('Map Initialized')
    }

    function generateChartColours(numColours) {
        const colours = [];
        const greenHueStart = 160; // Green hue range (approximately)
        const blueHueEnd = 240;   // Blue hue range (approximately)
        const hueRange = blueHueEnd - greenHueStart;
    
        for (let i = 0; i < numColours; i++) {
            const hue = greenHueStart + (i * (hueRange / numColours));
            const colour = `hsl(${hue}, 70%, 50%)`;
            colours.push(colour);
        }
        
        console.log('Colours Generated')
        return colours;
    }

    function initCharts() {
        const ctx_bar = document.getElementById('bar-chart').getContext('2d');
        const ctx_pie = document.getElementById('pie-chart').getContext('2d');

        const customColours = generateChartColours(25)
        // console.log(`Colours: ${customColours}`)
    
        var chartData = {
            labels: [], // Initialize an empty array for labels
            datasets: [
                {
                    label: '',
                    data: [], // Initialize an empty array for data
                    backgroundColor: customColours,
                },
            ],
        };
    
        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                  display: true,
                  text: 'Distance from Selected Store',
                },
                legend: {
                    display: false
                } 
            }
        };
    
        pieChart = new Chart(ctx_pie, {
            type: 'doughnut',
            data: chartData,
            options: {
                ...chartOptions, // Keep common options
                scales: {
                    // Disable grid lines
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                    },
                },
                plugins: {
                    legend: {
                        display: true, // Hide legend
                    },
                },
            },
        });
    
        barChart = new Chart(ctx_bar, {
            type: 'bar',
            data: chartData,
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Miles'
                        }
                    }
                }
            }
        });

        console.log("Charts Initialized")
    }

    

    // get slider radius
    slider.addEventListener("input", function () {
        sliderRadius = slider.value * 1609.34; // Update sliderRadius

        updateCircleRadius(sliderRadius, coords)
    });

    function updateCircleRadius(newRadius, coords) {
        if (circle) {
            // If the circle already exists, update its radius
            circle.setRadius(newRadius);
        } else {
            // If the circle doesn't exist, create a new one
            circle = L.circle(coords, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.3,
                radius: newRadius,
            }).addTo(circleGroup);
        }

    }

    function countCompetitors(marker, circle) {
        const markerCoords = marker.getLatLng()
        const circleCoords = circle.getLatLng()
        const radius = circle.getRadius();
        
        const distance = markerCoords.distanceTo(circleCoords)

        return distance <= radius
    }

    function extractAddressFromPopup(popupContent) {
        const parts = popupContent.split('<br>')

        return parts[1] //address
    }

    function updateTable(competitorData, competitorCount){

        //update competitor summary
        let competitorCountDisplay = d3.select('#competitor-count')
        competitorCountDisplay.text(competitorCount)

        //update main tale body
         var tableBody = d3.select('tbody')

        // clean up old table if needed
        if(tableBody != undefined){
            tableBody.selectAll('tr').remove()
        }

        //remove the first element of table data - it is the selected dispensary
        //first element will always be self since the array is sorted high to low
        competitorData = competitorData.slice(1, 11)

        row_count = competitorData.length

        for(i=0; i<row_count; i++){
            var row = tableBody.append('tr')
            row.append('td').text(competitorData[i].companyName)
            row.append('td').text(competitorData[i].address)
            row.append('td').text(`${competitorData[i].distance.toFixed(1)} mi`)
        }

        console.log('Table Updated')
    }

    function updatePieChart(chart, competitorData) {
        competitorData = competitorData.slice(1)

        // aggregate table data by taking the count of each object by the company_name property
        // code inspired by https://quickref.me/count-by-the-properties-of-an-array-of-objects
        const aggTableData = (competitorData, prop) => competitorData.reduce((prev, curr) =>
        (prev[curr[prop]] = ++prev[curr[prop]] || 1, prev),{})

        var td = aggTableData(competitorData, 'companyName')
        // console.log(typeof td)

        // console.log(`Obj Keys: ${Object.keys(td)}`)
        // console.log(`Obj Values: ${Object.values(td)}`)

        const customColours = generateChartColours(Object.keys(td).length)

        // remove old data
        chart.data.labels.length = 0
        chart.data.datasets.forEach((dataset) => {
            dataset.data.length = 0
        })

        // add new data
        chart.data.datasets[0].backgroundColor = customColours
        chart.data.labels.push(...Object.keys(td));
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(...Object.values(td));
        });

        // refresh chart
        chart.update();
        console.log('Pie Chart Updated')
    }

    function updateBarChart(chart, competitorData) {
        competitorData = competitorData.slice(1)

        // Extract company names and distances from table_data
        const companyNames = competitorData.map(item => item.companyName)
        const distances = competitorData.map(item => item.distance)

        const customColours = generateChartColours(competitorData.length)
    
        // Update chart data
        chart.data.datasets[0].backgroundColor = customColours
        chart.data.labels = companyNames
        chart.data.datasets[0].data = distances
    
        // Refresh chart
        chart.update();
        console.log('Bar Chart Updated')
    }

})