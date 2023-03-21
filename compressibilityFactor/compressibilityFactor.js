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
  var pressure = document.getElementById("inputairspeed").value;
  var volume = document.getElementById("inputaltitude").value;
  var moles = document.getElementById("inputoat").value;
  var temp = document.getElementById("inputarea").value;
  var ss =((pressure)*(volume));
  var sa =((moles)*(temp)*(8.3144626));
  var result =((ss)/(sa));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}