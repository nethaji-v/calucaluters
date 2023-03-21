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
  var thermal = document.getElementById("inputairspeed").value;
  var thick = document.getElementById("inputaltitude").value;
  var t1 = document.getElementById("inputoat").value;
  var t2 = document.getElementById("inputarea").value;
  var ss =((t2)-(t1));
  var sa =(-((thermal)/(thick)));
  var result =((ss)*(sa));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}