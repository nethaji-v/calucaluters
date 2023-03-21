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
  var emissivity = document.getElementById("inputairspeed").value;
  var area = document.getElementById("inputaltitude").value;
  var temparature1 = document.getElementById("inputoat").value;
  var temparature2 = document.getElementById("inputarea").value;
  var ss =((emissivity)*(area)*(0.0000000567));
  var sa =((temparature1)*(temparature1)*(temparature1)*(temparature1));
  var sb =((temparature2)*(temparature2)*(temparature2)*(temparature2));
  var sc =((sa)-(sb));
  var result =((ss)*(sc));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}