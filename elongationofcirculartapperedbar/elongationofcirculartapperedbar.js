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
  var load = document.getElementById("inputairspeed").value;
  var length = document.getElementById("inputaltitude").value;
  var diameter1 = document.getElementById("inputoat").value;
  var diameter2 = document.getElementById("inputarea").value;
  var elasticmodulus = document.getElementById("inputweight").value;
  var ss =((4)*(load)*(length));
  var sa =((3.14159265359)*(diameter1)*(diameter2)*(elasticmodulus));
  var result =((ss)/(sa));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}