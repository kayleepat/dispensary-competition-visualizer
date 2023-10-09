const url = "http://127.0.0.1:5000/api/v1.0/geoJSON"

// data import
d3.json(url).then(data => {

    //initial variables
    const test_coords = { lat: 28.613140672712017, lng: -81.43263221505724 }
    coords = test_coords
    radius = 1

    //initial log of data
    console.log(data)

    //set up options for dropdown
    // function setup_radius_dropdown() {

    //     radius_options = [1,2,3,4,5,10,15,20,50,100]

    //     var radius_options_list = radius_options;     
    //     var sel = document.getElementById('selDataset');
    //     for(var i = 0; i < radius_options_list.length; i++) {
    //         var opt = document.createElement('option');
    //         opt.innerHTML = radius_options_list[i];
    //         opt.value = radius_options_list[i];
    //         sel.appendChild(opt);
    //     }

    // }

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

        //subtract one from competitors to account for self
        competitors = competitors - 1

        console.log(`competitors within ${radius} miles = ${competitors}`)

        return competitors

    }

    function add_new_radius_marker(radius = 1, coords){

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

    //main body of code that runs when map is updated
    function main(radius = 1, coords = test_coords) {

        console.log(`radius = ${radius}`)
        console.log(`coords = ${coords}`)

        plot_map(radius, coords)

        add_new_radius_marker(radius, coords)

        calculate_competitors_within_radius(radius, coords)

    }

    //setup dropdown values
    // setup_radius_dropdown()

    //run main code on first website vist
    main()

    // listen for updates to the radius value. If triggered, refresh visuals
    // slider.oninput = function () {
    //     // output.innerHTML = this.value
    //     console.log('AAAAAAAAAAAAAAAAAAAA')
    //     console.log(this.value)
    //     main(parseInt(this.value), coords)
    // }

    // d3.select('#slider-value').on('change', function() {
    //     main(parseInt(this.value), coords)
    // })

    // Listen for the custom event
    document.addEventListener("inputChange", function () {
        console.log('SSSSSSSSSSSSS')
        console.log(slider_value)
        // Call the function when the custom event occurs
        main(slider_value, coords)
    })

})
