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
  var heat = document.getElementById("inputairspeed").value;
  var temp = document.getElementById("inputaltitude").value;
  var fluid = document.getElementById("inputoat").value;
  var ss =((temp)-(fluid));
  var result =((ss)*(heat));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}