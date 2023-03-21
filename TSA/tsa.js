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
    var Airspeed = document.getElementById("inputairspeed").value;
    var Altitude = document.getElementById("inputaltitude").value;
    var OAT = document.getElementById("inputoat").value;
    var s1 = Number(Airspeed);
    console.log(typeof(s1))
    var sa = ((s1)*(OAT));
    var sb = ((Altitude)/(1000));
    var sc = ((sa)*(sb));
    console.log(s1);
    console.log(sc);
    var sd =Number(s1+sc);
    console.log(sd);
    var result = (sd);
    document.getElementById("tsaresult").value = result;
    // alert(Airspeed);
}