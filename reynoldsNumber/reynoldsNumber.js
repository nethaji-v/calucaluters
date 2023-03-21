var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

function tsacalculate() {
  // event.preventDefault();
  var density = document.getElementById("inputairspeed").value;
  var velocity = document.getElementById("inputaltitude").value;
  var diameter = document.getElementById("inputoat").value;
  var dynamicviscosity = document.getElementById("inputarea").value;
  var ss =((density)*(velocity)*(diameter));
  var result =((ss)/(dynamicviscosity));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}