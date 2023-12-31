const url = "/api/v1.0/geoJSON"

// data import
d3.json(url).then(data => {

    //initial variables
    const test_coords = { lat: 28.613140672712017, lng: -81.43263221505724 }
    coords = test_coords
    radius = 10
    var pieChart
    var barChart

    //initial log of data
    console.log(data)

    function distance_in_miles_between_earth_coords(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;

        console.log("Calculated Miles")
      
        return 12742 * Math.asin(Math.sqrt(a)) * 0.6213712
    }

    function calculate_competitors_within_radius(radius, coords) {

        var competitors = -1 // start at -1 to account for self counting
        var lat_dispensary = coords.lat
        var lon_dispensary = coords.lng
        var table_data = []
        
        for (i = 0; i < data.features.length ; i++){
            
            distance_between_dispensaries = distance_in_miles_between_earth_coords(lat_dispensary, lon_dispensary, data.features[i].properties.latitude, data.features[i].properties.longitude)
    

            if (distance_between_dispensaries <= radius) {

                //increment competitors if the location is within the radius
                competitors = competitors + 1

                // #name, add, distance
                table_data.push({
                    'company_name': data.features[i].properties.company
                    ,'address': data.features[i].properties.full_address
                    ,'distance': distance_between_dispensaries
                    ,'competitors': competitors
                })
            }
            
        }

        // //subtract one from competitors to account for self
        // competitors = competitors - 1

        // console.log(`competitors within ${radius} miles = ${competitors}`)
        // console.log(table_data)

        // sort table data based on distance from selected location (high to low)
        table_data.sort((a, b) => a.distance - b.distance);

        update_table(table_data, competitors)

        // update_charts(ctx_bar, table_data)
        update_pie_chart(pieChart, table_data)
        update_bar_chart(barChart, table_data)

        console.log("Calculated Competitors")

        return competitors

    }

    function add_new_radius_marker(radius, coords){

        //convert radius from miles to meters
        var radius = radius * 1609.344

        //add circle marker
        L.circle(coords, radius).addTo(map)

        console.log('New Radius Marker')

    }

    function plot_map(radius, center = test_coords){

        if (radius == 1) {
            zoom = 13
        } else if( radius == 2) {
            zoom = 12
        } else if (radius == 3){
            zoom = 11
        } else if (radius == 4){
            zoom = 11
        } else if (radius == 5){
            zoom = 11
        } else if (radius == 10){
            zoom = 11
        }else if (radius == 15){
            zoom = 10
        }else if (radius == 20){
            zoom = 9
        }else if (radius == 50){
            zoom = 9
        }else if (radius == 100){
            zoom = 8
        } else {
            zoom = 10
        }

        var container = L.DomUtil.get('map');
        if(container != null){
          container._leaflet_id = null;
        }

        map = L.map('map',{
            center: center
            ,zoom: zoom
            ,autoClose: false

        })// .setView([27.6648, -81.5158], 7)


        //add initial tile layer to the map
        tile_layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })

        data_layer = L.geoJSON(data, {

            pointToLayer: function(feature, coordinates) {

                const color_value = 'red'
                
                const markerHtmlStyles = `background-color: ${color_value}`

                const customicon = L.divIcon({

                    html: `<span style="${markerHtmlStyles}" />`

                })

                
                const marker = L.marker(coordinates, {

                    title: feature.properties.company
                    
                    
                }).bindPopup(
                    `<strong>${feature.properties.company}</strong><br>${feature.properties.full_address}`
                )

                return marker

            }

        }).on('click', function(e){

            coords = e.latlng

            // console.log(`clicked coords = ${coords}`)

            main(radius = radius, coords = coords)

            
    
        })

        map.addLayer(tile_layer)
        map.addLayer(data_layer)
        console.log('Map Plot')
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
    
    

    function update_pie_chart(chart, table_data) {
        table_data = table_data.slice(1)

        // aggregate table data by taking the count of each object by the company_name property
        // code inspired by https://quickref.me/count-by-the-properties-of-an-array-of-objects
        const agg_table_data = (table_data, prop) => table_data.reduce((prev, curr) =>
        (prev[curr[prop]] = ++prev[curr[prop]] || 1, prev),{})

        var td = agg_table_data(table_data, 'company_name')
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


    function update_bar_chart(chart, table_data) {
        table_data = table_data.slice(1)

        // Extract company names and distances from table_data
        const companyNames = table_data.map(item => item.company_name)
        const distances = table_data.map(item => item.distance)

        const customColours = generateChartColours(table_data.length)
    
        // Update chart data
        chart.data.datasets[0].backgroundColor = customColours
        chart.data.labels = companyNames
        chart.data.datasets[0].data = distances
    
        // Refresh chart
        chart.update();
        console.log('Bar Chart Updated')
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

    function update_table(table_data, competitor_count){

        //update competitor summary
        let competitorCountDisplay = d3.select('#competitor-count')
        competitorCountDisplay.text(competitor_count)

        //update main tale body
        table_body = d3.select('tbody')

        // clean up old table if needed
        if(table_body != undefined){
            table_body.selectAll('tr').remove()
        }

        //remove the first element of table data - it is the selected dispensary
        //first element will always be self since the array is sorted high to low
        table_data = table_data.slice(1, 11)

        row_count = table_data.length

        for(i=0; i<row_count; i++){
            var row = table_body.append('tr')
            row.append('td').text(table_data[i].company_name)
            row.append('td').text(table_data[i].address)
            row.append('td').text(`${table_data[i].distance.toFixed(1)} mi`)
        }

        console.log('Table Updated')
    }

    //main body of code that runs when map is updated
    function main(radius = 10, coords = test_coords) {
        console.log("Main Func Start")
        // console.log(`radius = ${radius}`)
        // console.log(`coords = ${coords}`)

        plot_map(radius, coords)
        
        add_new_radius_marker(radius, coords)

        calculate_competitors_within_radius(radius, coords)

        console.log('Main Func End')
    }

    //run main code on first website vist
    initCharts()
    main()

    // Listen for the custom event
    document.addEventListener("inputChange", function () {
        // console.log('SSSSSSSSSSSSS')
        // console.log(slider_value)
        // Call the function when the custom event occurs
        main(slider_value, coords)
    })

})
