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
  var van = document.getElementById("inputairspeed").value;
  var ebu = document.getElementById("inputaltitude").value;
  var molal = document.getElementById("inputoat").value;
  var ss =((van)*(ebu)*(molal));
  var result =((ss));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}