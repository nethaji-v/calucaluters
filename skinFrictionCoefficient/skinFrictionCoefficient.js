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
  var reynolds = document.getElementById("inputairspeed").value;
  var ss =((reynolds**0.2));
  var result =((0.074)/(ss));
  document.getElementById("tsaresult").value = result;
  // alert(Airspeed);
}