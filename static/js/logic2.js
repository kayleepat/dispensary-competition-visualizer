const url = "http://127.0.0.1:5000/api/v1.0/geoJSON"

td_glob = null

// data import
d3.json(url).then(data => {

    //initial variables
    const test_coords = { lat: 28.613140672712017, lng: -81.43263221505724 }
    coords = test_coords
    radius = 1

    //initial log of data
    console.log(data)

<<<<<<< Updated upstream
    //set up options for dropdown
    function setup_radius_dropdown() {

        radius_options = [1,2,3,4,5,10,15,20,50,100]

        var radius_options_list = radius_options;     
        var sel = document.getElementById('selDataset');
        for(var i = 0; i < radius_options_list.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = radius_options_list[i];
            opt.value = radius_options_list[i];
            sel.appendChild(opt);
        }

    }
=======
>>>>>>> Stashed changes

    function distance_in_miles_between_earth_coords(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
      
        return 12742 * Math.asin(Math.sqrt(a)) * 0.6213712
    }


    function calculate_competitors_within_radius(radius, coords) {

        var competitors = 0
        var lat_dispensary = coords.lat
        var lon_dispensary = coords.lng
        
        for (i = 0; i < data.features.length ; i++){
            
            distance_between_dispensaries = distance_in_miles_between_earth_coords(lat_dispensary, lon_dispensary, data.features[i].properties.latitude, data.features[i].properties.longitude)

            if (distance_between_dispensaries <= radius) {
                competitors = competitors + 1
            }
            
        }

<<<<<<< Updated upstream
        //subtract one from competitors to account for self
        competitors = competitors - 1
=======

>>>>>>> Stashed changes

        console.log(`competitors within ${radius} miles = ${competitors}`)

        //aggregate table data by taking the count of each object by the company_name property
        // code inspired by https://quickref.me/count-by-the-properties-of-an-array-of-objects
        const agg_table_data = (table_data, prop) => table_data.reduce((prev, curr) =>
        (prev[curr[prop]] = ++prev[curr[prop]] || 1, prev),{})

        var td = agg_table_data(table_data, 'company_name')

        var ctx_bar = document.getElementById('bar-chart').getContext('2d')
        var ctx_pie = document.getElementById('pie-chart').getContext('2d')

        function addData(chart, label, newData) {
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset) => {
                dataset.data.push(newData);
            });
            chart.update();
        }
        
        function removeData(chart) {
            chart.data.labels.pop();
            chart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
            chart.update();
        }

        if(ctx_bar != undefined){
            removeData(ctx_bar)

        }
        addData(ctx_bar, Object.keys(td), Object.values(td))
        if(ctx_pie != undefined){
            removeData(ctx_pie)

        }
        addData(ctx_pie, Object.keys(td), Object.values(td))


    
        // Create a pie chart instance
        var pieChart = new Chart(ctx_pie, {
            type: 'pie',
            data: chart_data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        })

        console.log(td)

        td_glob = td

        return competitors

    }

<<<<<<< Updated upstream
    function add_new_radius_marker(radius, coords){
=======

    function add_new_radius_marker(radius = 1, coords){
>>>>>>> Stashed changes

        //convert radius from miles to meters
        var radius = radius * 1609.344

        //add circle marker
        L.circle(coords, radius).addTo(map)

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

        })

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
                
                return L.marker(coordinates, {

                    fillcolor: '#3388ff'

                })

            }

        }).on('click', function(e){

            coords = e.latlng

            console.log(`clicked coords = ${coords}`)

            main(radius = radius, coords = coords)
    
        })

        map.addLayer(tile_layer)
        map.addLayer(data_layer)

    }

<<<<<<< Updated upstream
=======
    function update_table(table_data, competitor_count){

        //update competitor summary
        var comp_summary = document.getElementById("competitor-count")
        comp_summary.innerHTML = competitor_count

        //update main tale body
        table_body = d3.select('tbody')

        // clean up old table if needed
        if(table_body != undefined){
            table_body.selectAll('tr').remove()
        }

        //remove the first element of table data - it is the selected dispensary
        //first element will always be self since the array is sorted high to low
        table_data = table_data.slice(0, 10)

        // row_count = Math.max(table_data.length, 10)
        row_count = table_data.length

        for(i=0; i<row_count; i++){
            var row = table_body.append('tr')
            var cell = row.append('td').text(table_data[i].company_name)
            var cell = row.append('td').text(table_data[i].address)
            var cell = row.append('td').text(`${Math.round(table_data[i].distance,0)} mi`)
        }

    }




>>>>>>> Stashed changes
    //main body of code that runs when map is updated
    function main(radius = 1, coords = test_coords) {

        radius_dropdown_value = d3.select('#selDataset').property('value')

        radius = radius_dropdown_value

        console.log(`radius = ${radius}`)
        console.log(`coords = ${coords}`)

        plot_map(radius, coords)

        add_new_radius_marker(radius, coords)

        calculate_competitors_within_radius(radius, coords)

    }

<<<<<<< Updated upstream
    //setup dropdown values
    setup_radius_dropdown()

    //run main code on first website vist
    main()

    // listen for updates to the radius value. If triggered, refresh visuals
    d3.selectAll("#selDataset").on("change", main)
=======
    //run main code on first website vist
    main()

    var chart_data = {
        labels: Object.keys(td_glob),
        datasets: [{
            label: 'Sample Data',
            data: Object.values(td_glob),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    }

    // Create the bar chart
    var myBarChart = new Chart(ctx_bar, {
        type: 'bar',
        data: chart_data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })  

    // Listen for the custom event
    document.addEventListener("inputChange", function () {

        // Call the function when the custom event occurs
        main(slider_value, coords)
    })
>>>>>>> Stashed changes

})
