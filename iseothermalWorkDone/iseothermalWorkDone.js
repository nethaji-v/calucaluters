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
  var moles = document.getElementById("inputairspeed").value;
  var temperature = document.getElementById("inputaltitude").value;
  var gas1 = document.getElementById("inputoat").value;
  var gas2 = document.getElementById("inputarea").value;
  var ss =((moles)*(8.31446261815324)*(temperature)*(2.303));
  var sa =(Math. log10(gas2/gas1));
  var result =((ss)*(sa));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}