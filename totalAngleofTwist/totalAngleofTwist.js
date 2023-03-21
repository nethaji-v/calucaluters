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
  var torque = document.getElementById("inputairspeed").value;
  var length = document.getElementById("inputaltitude").value;
  var shear = document.getElementById("inputoat").value;
  var inertia = document.getElementById("inputarea").value;
  var ss =((torque)*(length));
  var sa =((shear)*(inertia));
  var result =((ss)/(sa));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}