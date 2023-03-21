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
var casInput;
var easInput;
var tasInput;
var machInput;

// Define the standard atmospheric values that remain constant
var P0 = 101325;
var T0 = 288.15;
var a0 = 340.29;
var rho0 = 1.225; // All SI units

// define the actual atm variables as global variables
var tempSI;
var sonicSI; 
var pressureSI; 
var rhoSI;
var sigma;

// define the various speeds in SI units
var cas;
var eas;
var tas;
var mach;

var boolcas;
var booleas;
var booltas;
var boolmach;

var sigFig=1000;

function checkState() {
	
var casState = document.getElementById("CAScheckbox").checked;
var easState = document.getElementById("EAScheckbox").checked;
var tasState = document.getElementById("TAScheckbox").checked;
var machState = document.getElementById("Machcheckbox").checked;
var tempState = document.getElementById("Tempcheckbox").checked;


boolcas = 0;
booleas = 0;
booltas = 0;
boolmach = 0;

if (tempState){
	document.getElementById("inputTemp").disabled = false;
}
else {
	document.getElementById("inputTemp").disabled = true;
}

if (casState) {
	boolcas = 1;
	document.getElementById("inputCAS").disabled = false;
}
else {
	document.getElementById("inputCAS").disabled = true;
}

if (easState) {
	booleas = 1;
	document.getElementById("inputEAS").disabled = false;
}
else {
	document.getElementById("inputEAS").disabled = true;
}

if (tasState) {
	booltas = 1;
	document.getElementById("inputTAS").disabled = false;
}
else {
	document.getElementById("inputTAS").disabled = true;
}

if (machState) {
	boolmach = 1;
	document.getElementById("inputMach").disabled = false;
}
else {
	document.getElementById("inputMach").disabled = true;
}

var totState = boolcas+booleas+booltas+boolmach;

if (totState > 1) {
	document.getElementById("errorWrite").innerHTML = "Too many inputs selected!";
	document.getElementById("inputCAS").disabled = true;
	document.getElementById("inputEAS").disabled = true;
	document.getElementById("inputTAS").disabled = true;
	document.getElementById("inputMach").disabled = true;
}
else if (totState ===0) {
	document.getElementById("inputCAS").value = "";
	document.getElementById("inputEAS").value = "";
	document.getElementById("inputTAS").value = "";
	document.getElementById("inputMach").value = "";

	atmCalc(); // calc atm parameters
}
else {
	document.getElementById("errorWrite").innerHTML = "";
	
	if (boolcas===1) {
		casInput = Number(document.getElementById("inputCAS").value);
			if (casInput > 1) {
				casCalc();
			}
	}
	
	if (booleas===1) {
		easInput = Number(document.getElementById("inputEAS").value);
			if (easInput > 1) {
				easCalc();
			}
	}
	
	if (booltas===1) {
		tasInput = Number(document.getElementById("inputTAS").value);
			if (tasInput > 1) {
				tasCalc();
			}
	}
	
	if (boolmach===1) {
		machInput = Number(document.getElementById("inputMach").value);
			if (machInput > 0) {
				machCalc();
			}
	}
	
}

} // end checkState

function casCalc() {
	
	atmCalc(); // calc atm parameters
	
	var velUnit = +document.getElementById("selectionCAS").value;
	var velFactor;
	
	switch (velUnit) {
		case 0:
			velFactor = 0.514444444;
		break
		
		case 1:
			velFactor = 1;
		break
		
		case 2:
			velFactor = 0.277778;
		break
		
		case 3:
			velFactor = 0.44704;
		break
	}
	
	cas = velFactor*casInput;
	
	
	var qc = P0*(Math.pow(((Math.pow(cas/a0,2)+5)/5),7/2)-1);
	
	
	mach = Math.pow(5*(Math.pow(((qc/pressureSI)+1),2/7)-1),0.5);
	tas = mach*sonicSI;
	
	eas =tas/Math.pow((rho0/rhoSI),0.5);
	
	convertFromSI(); // convert results from SI to whatever units are required by the end user
	}

function easCalc() {
	
	atmCalc(); // calc atm parameters
	
	var velUnit = +document.getElementById("selectionEAS").value;
	var velFactor;
	
	switch (velUnit) {
		case 0:
			velFactor = 0.514444444;
		break
		
		case 1:
			velFactor = 1;
		break
		
		case 2:
			velFactor = 0.277778;
		break
		
		case 3:
			velFactor = 0.44704;
		break
	}
	
	eas = velFactor*easInput;
	tas =eas*Math.pow((rho0/rhoSI),0.5);
	mach = tas/sonicSI;
	
	qc = pressureSI*(Math.pow((1+0.2*Math.pow(mach,2)),(7/2))-1);
	cas = a0*(Math.pow(5*(Math.pow(((qc/P0)+1),(2/7))-1),0.5));
	
	
	convertFromSI(); // convert results from SI to whatever units are required by the end user
	}

function tasCalc() {
	
	atmCalc(); // calc atm parameters
	
	var velUnit = +document.getElementById("selectionTAS").value;
	var velFactor;
	
	switch (velUnit) {
		case 0:
			velFactor = 0.514444444;
		break
		
		case 1:
			velFactor = 1;
		break
		
		case 2:
			velFactor = 0.277778;
		break
		
		case 3:
			velFactor = 0.44704;
		break
	}
	
	tas = velFactor*tasInput;
	eas =tas/Math.pow((rho0/rhoSI),0.5);
	mach = tas/sonicSI;
	
	qc = pressureSI*(Math.pow((1+0.2*Math.pow(mach,2)),(7/2))-1);
	cas = a0*(Math.pow(5*(Math.pow(((qc/P0)+1),(2/7))-1),0.5));
	
	convertFromSI(); // convert results from SI to whatever units are required by the end user
	
	}

function machCalc() {
		
	atmCalc(); // calc atm parameters
	
	mach = machInput;
	tas = mach*sonicSI;
	eas =tas/Math.pow((rho0/rhoSI),0.5);
	
	qc = pressureSI*(Math.pow((1+0.2*Math.pow(mach,2)),(7/2))-1);
	cas = a0*(Math.pow(5*(Math.pow(((qc/P0)+1),(2/7))-1),0.5));
	
	
	convertFromSI(); // convert results from SI to whatever units are required by the end user
		
}

function convertFromSI() {
	// inputs are cas,eas and tas (all sI)
	var casUnit = +document.getElementById("selectionCAS").value;
	var easUnit = +document.getElementById("selectionEAS").value;
	var tasUnit = +document.getElementById("selectionTAS").value;
	
	var velUnitArray = new Array(casUnit,easUnit,tasUnit);
	var unitFactor = new Array;
	var i,len;
	len = velUnitArray.length;
	
	for (i = 0; i < len; i++) {
	
		switch (velUnitArray[i]) {
		case 0:
			unitFactor[i] = 1.94384;
		break
		
		case 1:
			unitFactor[i] = 1;
		break
		
		case 2:
			unitFactor[i] = 3.6;
		break
		
		case 3:
			unitFactor[i] = 2.236936;
		break
		}
	
	}
	var outputCAS,outputEAS,outputTAS,outputMach;
	
	
	outputCAS = Math.round(sigFig*cas*unitFactor[0])/sigFig;
	outputEAS = Math.round(sigFig*eas*unitFactor[1])/sigFig;
	outputTAS = Math.round(sigFig*tas*unitFactor[2])/sigFig;
	outputMach = Math.round(sigFig*mach)/sigFig;
	
		
	if (boolcas===1) {
		document.getElementById("inputEAS").value = outputEAS;
		document.getElementById("inputTAS").value = outputTAS;
		document.getElementById("inputMach").value = outputMach;
	}
	else if (booleas===1) {
		document.getElementById("inputCAS").value = outputCAS;
		document.getElementById("inputTAS").value = outputTAS;
		document.getElementById("inputMach").value = outputMach;
	}
	else if (booltas===1) {
		document.getElementById("inputEAS").value = outputEAS;
		document.getElementById("inputCAS").value = outputCAS;
		document.getElementById("inputMach").value = outputMach;
	}
	else { //mach selected
		document.getElementById("inputEAS").value = outputEAS;
		document.getElementById("inputTAS").value = outputTAS;
		document.getElementById("inputCAS").value = outputCAS;
	}
}

function atmCalc() {
	
	var altRaw = +document.getElementById("inputAltitude").value;
    var tempRaw = +document.getElementById("inputTemp").value;
	var altSelection = +document.getElementById("selectionAlt").value;
	
	var altSI;
	if (altSelection===0) {
		altSI = altRaw*0.3048;
	}
	else {
		altSI = altRaw;
	}

	
var altitudeArray = new Array(0, 11000, 20000, 32000, 47000, 51000, 71000, 84852);
    var presRelsArray = new Array(1, 2.23361105092158e-1, 5.403295010784876e-2, 8.566678359291667e-3, 1.0945601337771144e-3, 6.606353132858367e-4, 3.904683373343926e-5, 3.6850095235747942e-6);
    var tempsArray = new Array(288.15, 216.65, 216.65, 228.65, 270.65, 270.65, 214.65,186.946);
    var tempGradArray = new Array(-6.5, 0, 1, 2.8, 0, -2.8, -2, 0);
    
    var i = 0;
    while (altSI > altitudeArray[i+1]) {
        i=i+1;
    }
    
    // i defines the array position that I require for the calc
    var alts = altitudeArray[i];
    var presRels = presRelsArray[i];
    var temps = tempsArray[i];
    var tempGrad = tempGradArray[i]/1000;
    
    var deltaAlt = altSI - alts; 
    var stdTemp = temps + (deltaAlt*tempGrad); // this is the standard temperature at STP
		
		
	var tempSI = stdTemp+tempRaw; // includes the temp offset
	var tempDegC = tempSI-273.15;
	var roundTSI = Math.round(sigFig*tempSI)/sigFig;
	var roundTDeg = Math.round(sigFig*tempDegC)/sigFig;
	
	document.getElementById("writeAtmTemp").innerHTML = roundTSI+" K |"+roundTDeg+ " &deg;C";
	
	// Now for the relative pressure calc:
    
    //define constants
    var airMol = 28.9644;
    var rhoSL = 1.225; // kg/m3
    var pSL = 101325; // Pa
    var tSL = 288.15; //K
    var gamma = 1.4; 
    var g = 9.80665; // m/s2
    var stdTempGrad = -0.0065; // deg K/m 
    var rGas = 8.31432; //kg/Mol/K
    var R = 287.053;
    var gMR = g*airMol/rGas;
    var dryMM = 0.0289644; //kg/mol
    var adLapse = 0.00198; //K/ft
 
        
    if (Math.abs(tempGrad) < 1e-10) {
        
        var relPres = presRels * Math.exp(-1*gMR*deltaAlt/1000/temps);
    }
    else {
        var relPres = presRels * Math.pow(temps/stdTemp,gMR/tempGrad/1000);
    }
    
    
    // Now I can calculate the results:
    
    sonicSI = Math.sqrt(gamma*R*tempSI);
    pressureSI = pSL*relPres;
    rhoSI = rhoSL*relPres*(tSL/tempSI);
    sigma = rhoSI/rhoSL;
	
		
} // end atmCalc()

function resetAll(){
	document.getElementById("CAScheckbox").checked = false;
	document.getElementById("EAScheckbox").checked = false;
	document.getElementById("TAScheckbox").checked = false;
	document.getElementById("Machcheckbox").checked = false;
	document.getElementById("Tempcheckbox").checked = false;
	
	document.getElementById("inputCAS").value = "";
	document.getElementById("inputEAS").value = "";
	document.getElementById("inputTAS").value = "";
	document.getElementById("inputMach").value = "";
	document.getElementById("inputAltitude").value = "";
    document.getElementById("inputTemp").value = "";

	document.getElementById("inputTemp").disabled = true;
	document.getElementById("inputCAS").disabled = true;
	document.getElementById("inputEAS").disabled = true;
	document.getElementById("inputTAS").disabled = true;
	document.getElementById("inputMach").disabled = true;
	
	document.getElementById("writeAtmTemp").innerHTML="";
	
	checkState();
	}

window.onload = function() {
checkState();
};
