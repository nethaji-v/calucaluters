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
  var width = document.getElementById("inputairspeed").value;
  var length = document.getElementById("inputaltitude").value;
  var elasticmodulus = document.getElementById("inputoat").value;
  var momentofinertia = document.getElementById("inputarea").value;
  var ss =((length)*(length)*(length)*(length));
  var sa =((-width)*(ss));
  var sb =((384)*(elasticmodulus)*(momentofinertia));
  var result =((sa)/(sb));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}