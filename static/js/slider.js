var slider = document.getElementById("slider-range")
var output = document.getElementById("slider-value")

output.innerHTML = slider.value

slider.oninput = function () {
    output.innerHTML = this.value
    slider_value = this.value

    // Create a custom event
    var inputEvent = new Event("inputChange");

    // Dispatch the custom event
    document.dispatchEvent(inputEvent);
}