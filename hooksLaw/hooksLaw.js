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
  var elongation = document.getElementById("inputaltitude").value;
  var area = document.getElementById("inputoat").value;
  var length = document.getElementById("inputarea").value;
  var ss =((load)*(elongation));
  var sa =((area)*(length));
  var result =((ss)/(sa));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}