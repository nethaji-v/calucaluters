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
  var conductivity = document.getElementById("inputairspeed").value;
  var area = document.getElementById("inputaltitude").value;
  var temperature = document.getElementById("inputoat").value;
  var thickness = document.getElementById("inputarea").value;
  var ss =((conductivity)*(area));
  var sa =((temperature)/(thickness));
  var sb =((ss)*(sa));
  var result =(-(sb));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}