const url = "http://127.0.0.1:5000/api/v1.0/locations"

d3.json(url).then(data => {
    console.log(data)
})

console.log('test')