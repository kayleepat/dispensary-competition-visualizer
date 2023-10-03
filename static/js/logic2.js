const url = "http://127.0.0.1:5000/api/v1.0/geoJSON"

// confirm data import
d3.json(url).then(data => {
    console.log(data)

    function print_selected_location(){
        console.log('Test')
    }

    // function calcCrow(coords1, coords2) { //https://stackoverflow.com/questions/23115375/determine-if-a-longitude-latitude-co-ordinate-is-inside-a-radius-in-miles-and#28673693
           
    //     // var R = 6.371; // km
    //     var R = 6371000;
    //     var dLat = toRad(coords2.lat-coords1.lat);
    //     var dLon = toRad(coords2.lng-coords1.lng);
    //     var lat1 = toRad(coords1.lat);
    //     var lat2 = toRad(coords2.lat);

    //     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    //         Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    //     var d = R * c;
    //     return d;
    // }

    function set_map_radius(radius = 25){
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

            L.geoJSON(data, {
                pointToLayer: function(feature, coordinates){

                const color_value = function(feature) {
                     switch(feature.properties.company) {
                        case "Trulieve" : return {color: "#ff0000"}
                        default: return {color: "#956ce0"}
                    }
                }

                
                const markerHtmlStyles = `background-color: ${color_value}`

                const customicon = L.divIcon({
                    html: `<span style="${markerHtmlStyles}" />`

                // ,onEachFeature: function(feature, layer) {


                        
                //     layer.on({
                //         click: function(e) {

                //             var marker = e.target
                //             var latlng = marker.getLatLng()
     
                //             // processClick(latlng)
                //         }
                //     })
                // }
                }
    
            }).addTo(map)
    }

    function calculate_competitors_within_radius(dispensary, radius) {
        
    }


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
