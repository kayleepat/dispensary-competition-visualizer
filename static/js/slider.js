var slider = document.getElementById("slider-range")
var output = document.getElementById("slider-value")

output.innerHTML = slider.value

slider.oninput = function () {
    output.innerHTML = this.value
    console.log(this.value)
}