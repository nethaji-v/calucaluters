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
  var temp = document.getElementById("inputairspeed").value;
  var molar = document.getElementById("inputaltitude").value;
  var gasa = document.getElementById("inputoat").value;
  var gasb = document.getElementById("inputarea").value;
  var ss =((8.31446261815324)*(temp));
  var sa =((molar)-(gasb));
  var sb =((ss)/(sa));
  var sc =((gasa)/(molar*molar));
  var result =((sb)-(sc));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}