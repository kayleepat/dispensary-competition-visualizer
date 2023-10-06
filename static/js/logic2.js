const url = "http://127.0.0.1:5000/api/v1.0/geoJSON"

const test_coords = [ 28.613140672712017, -81.43263221505724]
current_coords = test_coords
current_radius = 1

// confirm data import
d3.json(url).then(data => {

    //initial log of data
    console.log(data)

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

    setup_radius_dropdown()


    function print_selected_location(){
        console.log('Test')
    }

    // [-81.43263221505724, 28.613140672712017]


    function distance_in_miles_between_earth_coords(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
      
        return 12742 * Math.asin(Math.sqrt(a)) * 0.6213712
      }

    // console.log(distance_in_miles_between_earth_coords(data.features[0].properties.latitude, data.features[0].properties.longitude, data.features[1].properties.latitude, data.features[1].properties.longitude))
    // console.log(data.features[0].properties.latitude, data.features[1].properties.latitude)
    // console.log(data.features[0].properties.longitude, data.features[1].properties.longitude) 


    // function set_map_radius(radius = 5){
    //     console.log(`radius = ${radius}`)
    // }


    function plot_map(radius, center){
        console.log(center)

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

            console.log([e.latlng['lat'], e.latlng['lng']])
    
            new_coords = [e.latlng['lat'], e.latlng['lng']]

            current_coords = new_coords
            
            updateVisuals(new_coords, radius)
    
        })



        map.addLayer(tile_layer)
        map.addLayer(data_layer)

        console.log('map code ran')


    }


    function calculate_competitors_within_radius(lat_dispensary, lon_dispensary, radius) {

        var competitors = 0
        
        for (i = 0; i < data.features.length ; i++){
            
            distance_between_dispensaries = distance_in_miles_between_earth_coords(lat_dispensary, lon_dispensary, data.features[i].properties.latitude, data.features[i].properties.longitude)

            if (distance_between_dispensaries <= radius) {
                competitors = competitors + 1
            }
            
        }

        return competitors

    }

    function add_new_radius_marker(radius, coords){

        //convert radius from miles to meters
        var radius = radius * 1609.344

        //add circle marker
        L.circle(coords, radius).addTo(map)


    }

    function remove_old_radius_marker(){
            
    }

    function proccess_map_click(radius, coordinates) {

        calculate_competitors_within_radius(coordinates, radius)
        remove_old_radius_marker()
        add_new_radius_marker(radius, coordinates)

        competitor_count = -1 + calculate_competitors_within_radius(coordinates[0], coordinates[1], radius)
        console.log(`competitors witin ${radius} miles: ${competitor_count}`)

    }

    //main body of code that runs when map is updated
    function main(radius = current_radius , coords = current_coords) {

        // set_map_radius()

        print_selected_location()

        plot_map(radius, coords)

        proccess_map_click(radius, coords)

    }

    //run main code on first website vist
    main()


    // listen for updates to the radius value. If triggered, refresh visuals
    d3.selectAll("#selDataset").on("change", updateVisuals)
    // d3.selectAll("#map").on("click", updateVisuals)
    // d3.selectAll("#selDataset").on("click", updateVisuals)


    function updateVisuals(new_coords = current_coords, radius) {

        console.log(new_coords)

        let dropdown_radius = d3.select('#selDataset')

        new_radius = dropdown_radius.property('value')

        radius = new_radius

        main(new_radius, new_coords)

        console.log(`new radius = ${new_radius}`)
        console.log(`new coords = ${new_coords}`)

    }
    
    // data_layer.on('click', function(e){

    //     console.log([e.latlng['lat'], e.latlng['lng']])

    //     new_coords = [e.latlng['lat'], e.latlng['lng']]
        
    //     updateVisuals(new_coords)

    // })

})
