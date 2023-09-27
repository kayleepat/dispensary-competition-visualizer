const url = "/api/v1.0/locations"

d3.json(url).then(data => {
    console.log(data)
})
