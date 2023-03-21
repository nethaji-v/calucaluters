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
  var lift = document.getElementById("inputairspeed").value;
  var coefficient = document.getElementById("inputaltitude").value;
  var density = document.getElementById("inputoat").value;
  var surfacearea = document.getElementById("inputarea").value;
  var ss =((2)*(lift));
  var sa =((coefficient)*(density)*(surfacearea));
  var sb =((ss)/(sa));
  var result =Math.sqrt(sb);
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}