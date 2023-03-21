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
  var velocity = document.getElementById("inputairspeed").value;
  var tsfc = document.getElementById("inputaltitude").value;
  var ld = document.getElementById("inputoat").value;
  var initialweight = document.getElementById("inputarea").value;
  var finalweight = document.getElementById("inputweight").value;
  var ss =((velocity)/(tsfc));
  var sc =((initialweight)/(finalweight));
  var sa =(Math.log(sc));
  var sb =((ld)*(sa));
  var result =((ss)*(sb));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}