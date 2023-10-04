const url = "http://127.0.0.1:5000/api/v1.0/geoJSON"


// confirm data import
d3.json(url).then(data => {
    console.log(data)

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

    console.log(distance_in_miles_between_earth_coords(data.features[0].properties.latitude, data.features[0].properties.longitude, data.features[1].properties.latitude, data.features[1].properties.longitude))
    // console.log(data.features[0].properties.latitude, data.features[1].properties.latitude)
    // console.log(data.features[0].properties.longitude, data.features[1].properties.longitude) 


    function set_map_radius(radius = 5){
        console.log(`radius = ${radius}`)
    }


    function plot_map(){

        map = L.map('map',{
            center: [28, -84]
            ,zoom: 7

        })// .setView([27.6648, -81.5158], 7)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)

        add_data_to_map()
        console.log(data.features[0].properties.company)
        console.log('map code ran')

    }

    function add_data_to_map(){

        var myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        }

        L.geoJSON(data, {

            pointToLayer: function(feature, coordinates) {

            const color_value = 'red'
            
            const markerHtmlStyles = `background-color: ${color_value}`

            const customicon = L.divIcon({
                html: `<span style="${markerHtmlStyles}" />`
            })
            
            return L.marker(coordinates, {
                fillcolor: '#3388ff'
                // ,icon:customicon
            })

            // ,onEachFeature: function(feature, layer) {


                    
            //     layer.on({
            //         click: function(e) {

            //             var marker = e.target
            //             var latlng = marker.getLatLng()
    
            //             // processClick(latlng)
            //         }
            //     })
            // // }

            }

        }).addTo(map)

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

    console.log(calculate_competitors_within_radius(data.features[0].properties.latitude, data.features[0].properties.longitude,5))


    function proccess_map_click() {

        function remove_old_radius(){
            
        }

        function add_new_radius(){

        }

        calculate_competitors_within_radius(location, radius)

    }


    function main(){

        set_map_radius()

        print_selected_location()

        plot_map()
    }

    main()

})
