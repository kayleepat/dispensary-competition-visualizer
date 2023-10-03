const url = "http://127.0.0.1:5000/api/v1.0/geoJSON"

// confirm data import
d3.json(url).then(data => {
    console.log(data)
})

console.log('test')

// initial draw of map
var map = L.map('map').setView([27.6648, -81.5158], 7)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)


// function loadLeafletMap() {
//     d3.json(url).then(data => {
//         for (let i = 0; i < data.length; i++) {
//             const row = data[i]

//             try {
//                 var marker = L.marker([row.latitude, row.longitude]).addTo(map).bindPopup(`${row.full_address} ${row.company}`)
//             } catch (error) {
//                 console.log(`${error}, ${row[i]}`)
//             }
//         }
//         // console.log(data)
//     })
// }

// // loadLeafletMap()

function processClick(latlng) {
    if (map.hasLayer(circle)) {
        map.removeLayer(circle)
        console.log('circle removed')
    } else {
        console.log('circle doesnt exist')
    }

    var circle = L.circle(latlng, {
        color: 'red',
        fillColor: 'red',
        radius: 8046.72
    }).addTo(map)
}

function loadGeoJSON() {
    fetch(url).then(function(response) {
        return response.json()
    }).then(function(data) {
        L.geoJSON(data, {
            
            onEachFeature: function(feature, layer) {
                    
                layer.on({
                    click: function(e) {
                        var marker = e.target
                        var latlng = marker.getLatLng()
 
                        processClick(latlng)
                    }
                })
            }

        }).addTo(map)
    })
}

function selectLocations (lat, lng) {
    var dist = 5 // change to dropdown later
    var xy = [lat,lng]
    var theRadius = dist * 1609.34 // miles to meters

    var selPts = [];

    storeLocations.eachLayer(function (layer) {
        

        // Lat, long of current point as it loops through.
		layer_lat_long = layer.getLatLng();
		
		// Distance from our circle marker To current point in meters
		distance_from_centerPoint = layer_lat_long.distanceTo(xy);
		
		// See if meters is within radius, add the to array
		if (distance_from_centerPoint <= theRadius) {
			 selPts.push(layer.feature);  
		}
    })

    // draw circle to see the selection area
	theCircle = L.circle(xy, theRadius , {   /// Number is in Meters
        color: 'orange',
        fillOpacity: 0,
        opacity: 1
      }).addTo(map);
      
      //Symbolize the Selected Points
           geojsonLayer = L.geoJson(selPts, {
           
              pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng, {
                  radius: 4, //expressed in pixels circle size
                  color: "green", 
                  stroke: true,
                  weight: 7,		//outline width  increased width to look like a filled circle.
                  fillOpcaity: 1
                  });
                  }
          });

          //Add selected points back into map as green circles.
          map.addLayer(geojsonLayer);
          
          //Take array of features and make a GeoJSON feature collection 
        //   var GeoJS = { type: "FeatureCollection",  features: selPts   };
          
          //Show number of selected features.
          console.log(GeoJS.features.length +" Selected features");
          
           // show selected GEOJSON data in console
          console.log(JSON.stringify(GeoJS));

}

loadGeoJSON()