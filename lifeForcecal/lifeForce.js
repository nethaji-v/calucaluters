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
  var coefficientofdrag = document.getElementById("inputairspeed").value;
  var density = document.getElementById("inputaltitude").value;
  var velocity = document.getElementById("inputoat").value;
  var area = document.getElementById("inputarea").value;
  var result =0.5*(coefficientofdrag*density*area*velocity*velocity);
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}