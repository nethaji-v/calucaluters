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
    var set = (Airspeed)*OAT;
    var send =Math.floor(Altitude / 1000);
    var rest=Math.round(set*send);
    var result = ((rest)+(Airspeed));
    document.getElementById("tsaresult").value = result;
    // alert(Airspeed);
}