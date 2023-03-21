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
  var width = document.getElementById("inputairspeed").value;
  var length = document.getElementById("inputaltitude").value;
  var elasticmodulus = document.getElementById("inputoat").value;
  var momentofinertia = document.getElementById("inputarea").value;
  var ss =((length)*(length)*(length));
  console.log(ss);
  var sa =((-width)*(ss));
  console.log(sa);
  var sb =((192)*(elasticmodulus)*(momentofinertia));
  console.log(sb);
  var result =(Math.floor(sa)/Math.floor(sb));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}