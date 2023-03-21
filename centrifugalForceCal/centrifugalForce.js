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
    var Mass = document.getElementById("inputmass").value;
    var Radius = document.getElementById("inputradius").value;
    var Velocity = document.getElementById("inputvelocity").value;
    var rest =[(Mass)*(Velocity*Velocity)];
    var result =(rest/Radius);
    document.getElementById("tsaresult").value = result;
    // alert(Airspeed);
}

