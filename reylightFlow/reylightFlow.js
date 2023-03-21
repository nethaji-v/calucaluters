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
const ZERO = 0.0;
const HALF = 0.5;
const ONE = 1.0;
const TWO = 2.0;
const THREE = 3.0;
const FOUR = 4.0;
const SIX = 6.0;
const HUGE = 1E20;   // used for infinity 
const EPSILON = 1E-10;  // used for convergence tests
//  const PI = 3.141592653589793238462643383279502884197;
const PI = Math.PI;
const TWOPI=PI+PI;
const HALFPI=PI/2;
const DEG2RAD=PI/180;
const RAD2DEG=180/PI;

const INFINITY_SYMBOL = "∞";   // ASCII 236  (does not always print)
const DEGREE_SYMBOL   = "°";   // ASCII 176  (does not always print)

var gamma = 1.4;    // should this be global??

function Square(x) {
return x*x;
}   // -------------------------------------------------- End of Function Square

function Reciprocal(x) {
return 1/x;
}   // ---------------------------------------------- End of Function Reciprocal


// N A C A   1 1 3 5    P R O C E D U R E S

// I S E N T R O P I C   F L O W   P R O C E D U R E S 

function Eq43(mach,gamma) {                                    // T/Tt from mach
var compFactor = 1 + mach*mach*(gamma-1)/2;
return Reciprocal(compFactor);
}   // -------------------------------------------- End of NACA 1135 Function 43

function Eq43inverse(tratio,gamma) {                           // mach from T/Tt 
var msq = (2/(gamma-1))*(1/tratio -1);
return Math.sqrt(msq);
}   // ------------------------------------- End of NACA 1135 Function 43inverse

function Eq44(mach,gamma) {                                    // p/pt from mach
var compFactor = 1 + mach*mach*(gamma-1)/2;
return Math.pow(compFactor, -gamma/(gamma-1));
}   // -------------------------------------------- End of NACA 1135 Function 44

function Eq44inverse(pratio,gamma) {                           // mach from p/pt
var gm1=gamma-1;
var msq=(2/gm1)*(pratio**(-gm1/gamma) - 1);
return Math.sqrt(msq)
}   // ------------------------------------- End of NACA 1135 Function 44inverse

function Eq45(mach,gamma) {                                // rho/rhot from mach
var gm1=gamma-1;
var compFactor = 1 + HALF*gm1*mach*mach;
return Math.pow(compFactor, -1/gm1);
}   // -------------------------------------------- End of NACA 1135 Function 45

function Eq45inverse(densityRatio,gamma) {                 // mach from rho/rhot
var gm1=gamma-1;
var msq=(2/gm1)*(Math.pow(densityRatio,-gm1)-1);
return Math.sqrt(msq); 
}   // ------------------------------------- End of NACA 1135 Function 45inverse

function Eq46(mach,gamma) {                                    // a/at from mach
var compFactor = 1 + HALF*(gamma-1)*mach*mach;
return Math.pow(compFactor, -HALF);
}    // ------------------------------------------- End of NACA 1135 Function 46

function Eq46inverse(aratio,gamma) {                           // mach from a/at
var msq=(2/(gamma-1))*(Math.pow(aratio,-2)-1);
return Math.sqrt(msq);
}    // ------------------------------------ End of NACA 1135 Function 46inverse

function Eq47(mach,gamma) {                                     // q/p from mach
return HALF*gamma*mach*mach
}   // ---------------------------------------------------- End of Function Eq47

function Eq47inverse(qratio,gamma) {                         // mach from qratio
return Math.sqrt((2/gamma)*qratio);
}   // --------------------------------------------- End of Function Eq47inverse

function Eq48(mach,gamma)  {                                   // q/pt from mach
var gm1=gamma-1;
var compFactor = 1 + HALF*gm1*mach*mach;
return HALF*gamma*mach*mach*Math.pow(compFactor, -gamma/gm1)
}   // -----------------------------------------------------End of Function Eq48

function Eq48prime(mach,gamma) {        //  derivative of q/pt with respect to M
var gm1=gamma-1;   msq=mach*mach;
var compFactor = 1 + HALF*gm1*msq;
var term1=-HALF*gamma*gamma*mach*msq*Math.pow(compFactor, -gamma/gm1-1)
var term2= gamma*mach*Math.pow(compFactor,-gamma/gm1);
return term1+term2;
}   // ----------------------------------------------- End of Function Eq48prime

function Eq48inverseLow(qratio,gamma) {                  // mach from q/pt (low)
var x,f,mlow,mhigh,flow,fhigh;
if (qratio <= 0) return 0;

mlow=0; flow=Eq48(mlow,gamma)-qratio;         // flow will be < 0
mhigh=1.414; fhigh=Eq48(mhigh,gamma)-qratio;     // fhigh will be > 0
while (mhigh-mlow > EPSILON) {
  mmid=HALF*(mlow+mhigh); fmid=Eq48(mmid,gamma)-qratio;
  if (fmid > 0) 
    mhigh=mmid;
  else
    mlow=mmid;
} 
return mmid;
}   // ------------------------------------------ End of Function Eq48inverseLow

function Eq48inverseHigh(qratio,gamma) {                // mach from q/pt (high)
var x,f,fprime, mlow,qlow, mhigh,qhigh, mmid,qmid;
if (qratio > 0.075) {
  mlow=1.414; qlow=Eq48(mlow,gamma)-qratio;  // will always be >0
  mhigh=4, qhigh=Eq48(mhigh,gamma)-qratio;   // will always be <0
  while (mhigh-mlow > EPSILON){
    mmid=0.5*(mlow+mhigh); qmid=Eq48(mmid,gamma)-qratio; 
    if (qmid > 0) mlow = mmid;
    else          mhigh = mmid;
  }
}
else {
  mmid=Math.pow(196/qratio, 0.2);          
  while (true) {
    f=Eq48(mmid,gamma)-qratio;
    if (Math.abs(f) < EPSILON) break;
    fprime=Eq48prime(mmid,gamma);
    mmid=mmid-f/fprime;
    mmid=max(mmid,1.41421);   // do not jump to the other branch
  }
}
return mmid;
}   // ---------------------------------------- End of Function Eq48inverseHigh

function Eq49(mach,gamma) {                               // (V/at)**2 from mach
var compFactor = 1 + HALF*(gamma-1)*mach*mach;
return mach*mach*Math.pow(compFactor,-1);
}   // ---------------------------------------------------- End of Function Eq49

function Eq49inverse(vratiosq,gamma) {                    // mach from (V/at)**2
var gm1=gamma-1;
var msq=-vratiosq/(HALF*gm1*vratiosq-1);
return Math.sqrt(msq);
}   // --------------------------------------------- End of Function Eq49inverse

function Eq50(mach,gamma) {                               // (V/a*)**2 from mach
return HALF*(gamma+1)*Eq49(mach,gamma);
}   // ------------------------------------------------------- End Function Eq50

function Eq50inverse(vratiosq,gamma) {                     // mach from(V/a*)**2
var gm1=gamma-1;
var gp1=gamma+1;
var msq=-2*vratiosq/(gm1*vratiosq-gp1);
return Math.sqrt(msq);
}   // ------------------------------------------------ End Function Eq50inverse

function Eq51(mach,gamma) {                               // (V/Vm)**2 from mach
return HALF*(gamma-1)*Eq49(mach,gamma)
}   // ------------------------------------------------------- End Function Eq51 

function Eq51inverse(vratiosq,gamma) {                     // mach from vratiosq
var gm1=gamma-1
var msq=(2/gm1)*(vratiosq/(1-vratiosq))
return Math.sqrt(msq)
}   // --------------------------------------------- End of Function Eq51inverse

// Caution: Eq80 returns A*/A just as the equation in NACA 1135.
// Most tables in textbooks are of A/A*
function Eq80(mach,gamma) {                                    // A*/A from mach
var ex=HALF*(gamma+1)/(gamma-1)
var compFactor = 1 + HALF*(gamma-1)*mach*mach
var areaRatio = Math.pow(HALF*(gamma+1),ex) * mach*Math.pow(compFactor,-ex);
return areaRatio;
}    // ------------------------------------------- End of NACA 1135 Function 80

function Eq80prime(mach,gamma) {                       //  d(A*/A)/dM  from mach
ex=HALF*(gamma+1)/(gamma-1);
b=Math.pow(HALF*(gamma+1), ex);
c=HALF*(gamma-1);
compFactor=1+c*mach*mach;
d=-ex
fb=2*c*d*mach*mach*Math.pow(compFactor,d-1) + Math.pow(compFactor, d);
return b*fb;
}   // --------------------------------------- End of NACA 1135 Function 80prime

function SubsonicEq80inverse(areaRatio,gamma)  {               // mach from A*/A
if (areaRatio >= 1) {
  return 1;
}

var f,fprime;
var x=HALF;  // the first guess for Mach number
for (var k=0;k<4;k++) {
  f=Eq80(x,gamma)-areaRatio;
  fprime=Eq80prime(x,gamma);
  x=x-f/fprime;
  x=Math.min(Math.max(x,0),1);     //   0 <= x <= 1
}
return x  
}   // -------------------------- End of  NACA 1135 function SubsonicEq80inverse

function SupersonicEq80inverse(areaRatio,gamma) {              // mach from A*/A
if (areaRatio >= 1) {
  return 1;
} 

x=2;   // the first guess for Mach number
for (var k=0;k<10;k++) {
  f=Eq80(x,gamma)-areaRatio;
  fprime=Eq80prime(x,gamma);
  x=x-f/fprime;
  x=Math.max(x,1);   // do not go subsonic
}
return x; 
}   // ------------------------- End of NACA 1135 function SupersonicEq80inverse

// N O R M A L   S H O C K 

function Eq93(mach1,gamma) {                            // p2/p1 from mach,gamma
return (2*gamma*mach1*mach1-(gamma-1))/(gamma+1);
}   // ---------------------------------------------------- End of function Eq93

function Eq93inverse(pRatio,gamma) {                          // mach from p2/p1
var gp1=gamma+1;
var gm1=gamma-1;
var msq=HALF*(pRatio*gp1+gm1)/gamma;
return Math.sqrt(msq);
}   // --------------------------------------------- End of function Eq93inverse

function Eq94(mach1,gamma) {                              // rho2/rho1 from mach
return (gamma+1)*mach1*mach1/((gamma-1)*mach1*mach1+2);
}   // ---------------------------------------------------- End of function Eq94 

function Eq94inverse(rhoRatio,gamma) {                   // mach1 from rho2/rho1
var gp1=gamma+1;
var gm1=gamma-1;
var msq=2*rhoRatio/(gp1-gm1*rhoRatio);
return Math.sqrt(msq);
}   // --------------------------------------------- End of function Eq94inverse

function Eq95(mach1,gamma) {                                  // T2/T1 from mach
return Eq93(mach1,gamma)/Eq94(mach1,gamma);
}   // ---------------------------------------------------- End of function Eq95

function Eq95inverse(tRatio,gamma) {                         // mach1 from T2/T1
var gm1=gamma-1;
var gp1=gamma+1;
var a = 2*gamma*gm1;       // coefficients of quadratic equation
var b = 4*gamma - gm1*gm1 - gp1*gp1*tRatio;
var c = -2*gm1;
var msq = (-b+Math.sqrt(b*b-4*a*c))/(2*a);
return Math.sqrt(msq);
}   // -----------------------------------------------------  End of Eq95inverse

function Eq96(mach1,gamma) {                                       // M2 from M1
var msq=mach1*mach1;
var gm1=gamma-1;
return Math.sqrt((gm1*msq+2)/(2*gamma*msq-gm1));
}   // -----------------------------------------------------End of function Eq96

function Eq96inverse(mach2,gamma) {                          //  mach1 from   M2
var gm1=gamma-1;
var m2sq=mach2*mach2;
return Math.sqrt((2+gm1*m2sq)/(2*gamma*m2sq-gm1));
}   // -------------------------------------------- End of  Function Eq96inverse

function Eq97(mach1,gamma) {                              // p2/pt1   from mach1
var gm1=gamma-1;
var gp1=gamma+1;
var ex=gamma/gm1;   // exponent
var msq=mach1*mach1;
return Math.pow(((2*gamma*msq-gm1)/gp1)*(2/(gm1*msq+2)), ex);
}   // ---------------------------------------------------- End of Function Eq97

function Eq97inverse(mach2,gamma) {                         // mach1 from p2/pt1
var gm1=gamma-1;
var m2sq=mach2*mach2;
return Math.sqrt((2+gm1*m2sq)/(2*gamma*m2sq-gm1));
}   // --------------------------------------------- End of Function Eq97inverse

function Eq98(mach1,gamma) {                               //  p2/pt2 from mach1
var gm1=gamma-1;
var gp1=gamma+1;
var ex=gamma/gm1;
var msq=mach1*mach1;
return Math.pow(((4*gamma*msq-2*gm1)/(gp1*gp1*msq)), ex);
}   // ---------------------------------------------------- End of Function Eq98

function Eq98inverse(pratio,gamma) {                        // mach1 from p2/pt2
var gp1=gamma+1;
var gm1=gamma-1;
var msq=2*gm1/(4*gamma-gp1*gp1*Math.pow(pratio, (gm1/gamma)));
return Math.sqrt(msq);
}   // --------------------------------------------- End of Function Eq98inverse

function Eq99(mach1,gamma) {                              //  pt2/pt1 from mach1
var term1 = Math.pow(Eq94(mach1,gamma), (gamma/(gamma-1)));
var term2 = Math.pow(Eq93(mach1,gamma), (-1/(gamma-1)));
return term1*term2;
}   // ---------------------------------------------------- End of Function Eq99

function Eq99prime(mach1,gamma) {               // deriv of pt2/pt1 w.r.t. mach1
var gp1=gamma+1;
var gm1=gamma-1;
var msq=mach1*mach1;
var f = Math.pow((gp1*msq/(gm1*msq+2)), gamma/gm1);
var factor1=(gamma/gm1)*Math.pow((gp1*msq/(gm1*msq+2)), 1/gm1);
var factor2=4*gp1*mach1/Square(gm1*msq+2);
var fprime=factor1*factor2;
var g=Math.pow((gp1/(2*gamma*msq-gm1)), 1/gm1);
factor1=(1/gm1)*Math.pow(gp1/(2*gamma*msq-gm1), ((2-gamma)/gm1));
factor2=-4*gamma*gp1*mach1/Square(2*gamma*msq-gm1);
var gprime=factor1*factor2;
return f*gprime + fprime*g;
}   // ----------------------------------------------- End of Function Eq99prime

function Eq99inverse(pratio,gamma) {                       // mach1 from pt2/pt1
if (pratio >= 1) {       // defend against bad input
  return 1;
}   
var f,fprime; 
var x=2;
for (var k=0; k<10; k++) {
  f=Eq99(x,gamma)-pratio;
  if (Math.abs(f) < EPSILON) break;
  fprime=Eq99prime(x,gamma);
  x=x-f/fprime;
  x=Math.max(x,1);   // do not go subsonic
}  
return x;
}   // --------------------------------------------- End of Function Eq99inverse


// tables in books usually show p1/pt2, but this is the way in NACA Rep. 1135
function Eq100(mach1,gamma) {                                // pt2/p1 from mach
var gp1=gamma+1;
var gm1=gamma-1;
var msq=mach1*mach1;
var factor1 = Math.pow(HALF*gp1*msq, gamma/gm1);
var factor2 = Math.pow(gp1/(2*gamma*msq-gm1), 1/gm1);
return  factor1*factor2;
}   // --------------------------------------------------- End of Function Eq100

function Eq100prime(mach1,gamma) {          // derivative of pt2/p1 w.r.t. mach1
var gp1=gamma+1;
var gm1=gamma-1;
var msq=mach1*mach1;
var f = Math.pow(HALF*gp1*msq, gamma/gm1);
var factor1 = gamma*gp1*mach1/gm1;
var factor2 = Math.pow(HALF*gp1*msq, 1/gm1);
var fprime=factor1*factor2;
var g = Math.pow(gp1/(2*gamma*msq-gm1), 1/gm1);
factor1=(1/gm1)*Math.pow(gp1/(2*gamma*msq-gm1), (2-gamma)/gm1);
factor2=-4*gamma*gp1*mach1/Square(2*gamma*msq-gm1)
var gprime=factor1*factor2;
return f*gprime + fprime*g;
}   // ---------------------------------------------- End of Function Eq100prime

function Eq100inverse(pratio,gamma) {                       // mach1 from pt2/p1
if (pratio > 0.5283) {  // defend against bad input
  return 1;
}
var f,fprime;
var x=2;
for (var k=0; k<10; k++) {
  f=Eq100(x,gamma)-pratio;
  if (Math.abs(f) < EPSILON) break;
  fprime=Eq100prime(x,gamma);
  x=x-f/fprime;
}  
return x;
}   // -------------------------------------------- End of Function Eq100inverse

function Eq101(mach,gamma) {                            // deltaS/cv  from mach1
return  -(gamma-1)*Math.log(Eq99(mach,gamma));
}   // --------------------------------------------------- End of Function Eq101   

function Eq101inverse(entropyJump,gamma) {               // mach1 from deltaS/Cv 
var z = Math.exp(-entropyJump/(gamma-1));
return Eq99inverse(z,gamma);
}   // -------------------------------------------- End of Function Eq101inverse

function Eq102(mach1,gamma) {                              // (p2-p1)/q  from M1
var msq=mach1*mach1;
return 4*(msq-1)/((gamma+1)*msq);
}   // --------------------------------------------------- End of function Eq102

function Eq102inverse(pratio,gamma) {                       // M1 from (p2-p1)/q
return Math.sqrt(4/(4-(gamma+1)*pratio));
}   // -------------------------------------------  End of function Eq102inverse

// O B L I Q U E   S H O C K
// Note that many of the oblique shock solutions are identical to those of
// the normal shock with M1 replaced with M1 sin(theta) 

function Eq128(mach1,theta,gamma) {                    // p2/p1 from mach1,theta
return Eq93(mach1*Math.sin(theta), gamma);
}   // --------------------------------------------------- End of Function Eq128

function Eq128inverse(mach1,pratio,gamma) {           // theta from p2/p1, mach1
var ms = Eq93inverse(pratio,gamma);   // mach1*sin(theta)
//alert("In Eq128inverse");
var xx = Math.asin(ms/mach1);
//alert(xx);
return xx;
}   // -------------------------------------------- End of Function Eq128inverse

function Eq129(mach1,theta,gamma) {                // rho2/rho1 from mach1,theta
return Eq94(mach1*Math.sin(theta), gamma);
}   // --------------------------------------------------- End of Function Eq129

function Eq129inverse(mach1,pratio,gamma) {       // theta from rho2/rho1, mach1
var ms = Eq94inverse(pratio,gamma);    // mach1*sin(theta)
return Math.asin(ms/mach1);
}   // -------------------------------------------- End of Function Eq129inverse

function Eq130(mach1,theta,gamma) {                    // T2/T1 from mach1,theta
return Eq95(mach1*Math.sin(theta), gamma);
}   // --------------------------------------------------- End of Function Eq130

function Eq130inverse(mach1,tratio,gamma) {           // theta from T2/T1, mach1
var ms = Eq95inverse(tratio,gamma);
return Math.asin(ms/mach1);
}   // -------------------------------------------- End of Function Eq130inverse

                               // M2**2*SIN((theta-delta))**2 from mach1,theta
function Eq131(mach1,theta,gamma) { 
var gm1=gamma-1;
var msq = Math.pow(mach1*SIN(theta), 2);
return (gm1*msq+2)/(2*gamma*msq-gm1);
}   // --------------------------------------------------- End of Function Eq131

function Eq131inverse(mach1,pratio,gamma) {           // mach1 from p2/p1, theta
var ms = Eq93inverse(pratio,gamma);
var arg = Math.sqrt(ms/(mach1*mach1));
return Math.asin(Math.min(1,arg));
}   // -------------------------------------------- End of Function Eq131inverse

function Eq132(mach1,theta,gamma) {                       // M2 from mach1,theta 
gm1=gamma-1;
var ms = Square(mach1*Math.sin(theta));
var term1 = (gamma+1)*(gamma+1)*ms*mach1*mach1;
var term2 = -4*(ms-1)*(gamma*ms+1);
var denom = (2*gamma*ms-gm1)*(gm1*ms+2);
return Math.sqrt((term1+term2)/denom);
}   // --------------------------------------------------- End of Function Eq132

function Eq132inverse(mach1,mach2,gamma) {             // theta from mach1,mach2
const EPS = 1E-6;
var thetaOld=Math.asin(1/mach1);   // Mach angle
var mach2Old=mach1;
var mach2New;
var thetaNew=thetaOld+0.1;
do {
  mach2New=Eq132(mach1,thetaNew,gamma);
  var deriv=(mach2New-mach2Old)/(thetaNew-thetaOld);
  mach2Old=mach2New;
  thetaOld=thetaNew;
  thetaNew=thetaOld - (mach2Old-mach2)/deriv; 
} while (Math.abs(mach2Old-mach2) > EPS);
return thetaOld;
}   // -------------------------------------------- End of Function Eq132inverse

function Eq138(mach1,theta,gamma) {                    // delta from mach1,theta
var gp1=gamma+1;
var ms = Square(mach1*Math.sin(theta));
if (Math.abs(ms-1) < EPSILON) 
  return 0;
else {
  var cotdel=Math.tan(theta)*((gp1*mach1*mach1)/(2*(ms-1))-1);
  return Math.atan(1/cotdel);
}  
}   // --------------------------------------------------- End of Function Eq138

function Eq138prime(mach1,theta,gamma) {    // d(delta)/d(theta) for mach1,theta
const EPS = 1E-12;
var c=Math.cos(theta);
var s=Math.sin(theta);
var t=s/c;
var msq=mach1*mach1;
var ms=msq*s*s - 1;
var num,num1,denom,cotd

if (ms <= EPS) {
  cotd=Eq138(mach1,theta+EPS,gamma);
  c=Math.cos(theta+EPS);
  s=Math.sin(theta+EPS);
  t=s/c;
  ms=msq*s*s - 1;
  num1=(1+t*t)/ms - 2*msq*s*s/(ms*ms);
  num=HALF*(gamma+1)*msq*num1 - 1/(c*c);
  denom=-(1+cotd*cotd);
  return num/denom;
}    

cotd=1/Math.tan(Eq138(mach1,theta,gamma));
num1=(1+t*t)/ms - 2*msq*(s/ms)*(s/ms);
num=HALF*(gamma+1)*msq*num1 - 1/(c*c);
denom=-(1+cotd*cotd);
return num/denom;
}   // ---------------------------------------------- End of Function Eq138prime


function Eq138inverseWeak(mach1,delta,gamma) {    // weak theta from mach1,delta
var k,mu,x,f,fprime;  
const MAX_ITER = 20;
mu = Math.asin(1/mach1);   // Mach angle
x = mu + EPSILON;  // first guess for theta
for (k=0; k<MAX_ITER; k++) {
  f = Eq138(mach1,x,gamma)-delta;
  if (Math.abs(f) < EPSILON) break;
  fprime=Eq138prime(mach1,x,gamma);
  x=x-f/fprime;  
  x=Math.max(x, mu+EPSILON);
  
//    alert("138inverseIterWeak "+x+" "+f+" "+fprime);
}  
return x;
}   // ---------------------------------------------End of Function Eq138inverse


function Eq138inverseStrong(mach1,delta,gamma) {// strong theta from mach1,delta
var k,mu,x,f,fprime;  
const MAX_ITER = 20;
thetastar = Eq168(mach1,gamma);  // theta for max deflection
x = 0.5*(thetastar + HALFPI);  // the first guess for theta
for (k=0; k<MAX_ITER; k++) {
  f = Eq138(mach1,x,gamma)-delta;
  if (Math.abs(f) < EPSILON) break;
  fprime=Eq138prime(mach1,x,gamma);
  x=x-f/fprime;  
  x=Math.max(x, thetastar+EPSILON);
  
//    alert("138inverseIterStrong "+x+" "+f+" "+fprime);
}  
return x;
}   // ---------------------------------------------End of Function Eq138inverse



function Eq140(mach1,theta,gamma) {                   // p2/pt1 from mach1,theta
return Eq97(mach1*Math.sin(theta), gamma);
}   // --------------------------------------------------- End of Function Eq140

function Eq140inverse(mach1,pratio,gamma) {          // mach1 from p2/pt1, theta
var ms = Eq97inverse(pratio,gamma);
var arg = Math.sqrt(ms/(mach1*mach1));
return Math.asin(Math.min(1,arg));
}   // -------------------------------------------- End of Function Eq140inverse

function Eq141(mach1,theta,gamma) {                   // p2/pt2 from mach1,theta
var gm1 = gamma-1;
var gp1=gamma+1;
var ms = Square(mach1*Math.sin(theta));
var num=(2*gamma*ms-gm1)*(gm1*ms+2);
var denom=gp1*gp1*ms*(gm1*mach1*mach1+2);
var ex=gamma/gm1;
return Math.pow(2*num/denom, ex);
}   // --------------------------------------------------- End of Function Eq141

function Eq141inverse(mach1,pratio,gamma) {          // mach1 from p2/pt1, theta
var ms = Eq93inverse(pratio,gamma);
var arg = Math.sqrt(ms/(mach1*mach1));
return Math.asin(Math.min(1,arg));
}   // -------------------------------------------- End of Function Eq141inverse

function Eq142(mach1,theta,gamma) {                  // pt2/pt1 from mach1,theta
var gm1 = gamma-1;
var gp1 = gamma+1;
var ms = Math.pow(mach1*Math.sin(theta), 2);
var factor1 = Math.pow((gp1*ms)/(gm1*ms+2.0), gamma/gm1);
var factor2 = Math.pow(gp1/(2.0*gamma*ms-gm1), 1/gm1);
return factor1*factor2;
}   // --------------------------------------------------- End of Function Eq142

function Eq142inverse(mach1,pratio,gamma) {         // theta from pt2/pt1, mach1
var ms = Eq99inverse(pratio,gamma);   // mach1*sin(theta)
return Math.asin(ms/mach1);
}   // -------------------------------------------- End of Function Eq142inverse

function Eq144(mach1,theta,gamma) {                // deltaS/cv from mach1,theta
return -(gamma-1)*Math.log(Eq142(mach1,theta,gamma));
}   // --------------------------------------------------- End of Function Eq144

// IS THIS CORRECT??????
function Eq144inverse(mach1,pratio,gamma) {           // mach1 from p2/p1, theta
var ms = Eq93inverse(pratio,gamma);
var arg = Math.sqrt(ms/(mach1*mach1));
return Math.asin(Math.min(1,arg));
}   // -------------------------------------------- End of Function Eq144inverse

function Eq145(mach1,theta,gamma) {           // (p2-p1)/q, pressure coefficient
var ms = Square(mach1*Math.sin(theta));
var num = 4*(ms - 1);
var denom = (gamma+1)*Square(mach1);
return num/denom;
}   // --------------------------------------------------- End of Function Eq145

function Eq168(mach,gamma) {                              // theta for max delta
var gp1,gm1,msq,m4,term1,term2,term3,sinsq,sinth;
gp1=gamma+1;  gm1=gamma-1;  msq=mach*mach;  m4=msq*msq;
term1 = 1/(4*gamma*msq);
term2 = gp1*msq-4;
term3 = gp1*(gp1*m4 + 8*gm1*msq + 16);
sinsq = term1*(term2 + Math.sqrt(term3));
sinth = Math.sqrt(sinsq);
return Math.asin(sinth);
}   // --------------------------------------------------- End of Function Eq168

//   P R A N D T L   -   M E Y E R    F U N C T I O N S   **********************

function Eq171c(mach,gamma) {                              // nu [Prandtl-Meyer]
var nu = 0;    // default for mach <= 1
if (mach > 1) {
  var g =(gamma+1)/(gamma-1);
  nu = Math.sqrt(g)*Math.atan(Math.sqrt((mach*mach-1)/g)) - 
    Math.atan(Math.sqrt(mach*mach-1));
  }  
return nu;
}   // ----------------------------------------------------- End Function Eq171c

// PURPOSE - Compute the Mach number corresponding to a given value of nu, the
//  Prandtl-Meyer function. This is an approximate value from a rational
//  polynomial function by I.M. Hall, Aeronautical Journal, Sept 1975, p.417. 

function HallInversePrandtlMeyer(nu) {
const NUMAX = HALFPI*(Math.sqrt(6)-1);
var y=Math.pow((nu/NUMAX),2.0/3.0);
var num = 1.0 + y*(1.3604 + y*(0.0962 - 0.5127*y));
var denom = 1.0 +y*(-0.6722 + y*(-0.3278));
return num/denom;
}   // ------------------------------------ End Function HallInversePrandtlMeyer



function Eq171inverse(nu,gamma) {                         // mach from nu, gamma

if (nu==0) {
  return 1;
}

var lambda1=Math.sqrt((gamma+1)/(gamma-1));
var lambda=1/lambda1;
var lambdasq = lambda*lambda;

// First, we make an excellent guess using Hall
var x=HallInversePrandtlMeyer(nu)

// Next, we make 4 iterative improvements, using Newton
for (var k=0;k<4;k++) {
  var beta=Math.sqrt(x*x-1);
  var f=lambda1*Math.atan(lambda*beta)-Math.atan(beta) - nu;
  var fp=(1-lambdasq)*beta/(x*(1+lambdasq*beta*beta));
  x=x-f/fp;
  x=Math.max(x,1);   // do not go subsonic
}  

return x;
}   // -------------------------------------------- End of Function Eq171Inverse



// ========== D I R E C T   R A Y L E I G H    F U N C T I O N S ===============

function RayleighP(mach,gamma) {                                       //   P/P*
return (gamma+1)/(1+gamma*mach*mach);
}   // ----------------------------------------------- End of Function RayleighP

function RayleighPt(mach,gamma) {                                    //   Pt/Pt*
var gp1=gamma+1; var gm1=gamma-1; var msq=mach*mach;
var p=RayleighP(mach,gamma);
var num=2+gm1*msq;
var denom=gp1;
var xx=gamma/gm1;
return p*Math.pow(num/denom, xx);
}   // ---------------------------------------------- End of Function RayleighPt

function RayleighT(mach,gamma) {                                       //   T/T*
var msq=mach*mach;
return Square(gamma+1)*msq/Square(1+gamma*msq);
}   // ----------------------------------------------- End of Function RayleighT

function RayleighTt(mach,gamma) {                                    //   Tt/Tt*
var  denom,msq,num;
msq=mach*mach;
num=2*(gamma+1)*msq*(1+HALF*(gamma-1)*msq);
denom=Square(1+gamma*msq);
return num/denom;
}   // ---------------------------------------------- End of Function RayleighTt

function RayleighRho(mach,gamma) {                                 //   rho/rho*
if (mach <= 0) return HUGE;
var msq=mach*mach;
return (1+gamma*msq)/((gamma+1)*msq)
}   // --------------------------------------------- End of Function RayleighRho

function RayleighV(mach,gamma) {                                       //   V/V*
var msq=mach*mach;
return (1+gamma)*msq/(1+gamma*msq);
}   // ----------------------------------------------- End of Function RayleighV

function RayleighS(mach, gamma) {                                      // Smax/R
  if (mach==0.0) return 1E20;
  var gp1,gm1,msq;
  gp1=gamma+1; gm1=gamma-1; msq=mach*mach;
  return -(gamma/gm1)*Math.log(msq*Math.pow(gp1/(1+gamma*msq),gp1/gamma));
}   // ----------------------------------------------- End of Function RayleighS  


// ========= I N V E R S E   R A Y L E I G H   F U N C T I O N S ===============


function RayleighMachFromP(pratio,gamma) {                          // MachFromP
var msq=(gamma+1-pratio)/(gamma*pratio);
return Math.sqrt(msq);
}   // --------------------------------------- End of Function RayleighMachFromP

function RayleighMachFromPtSubsonic(ptratio,gamma) {       // MachFromPtSubsonic
var mlow=0; var plow=RayleighPt(mlow,gamma)-ptratio;   // > 0
var mhigh=1; var phigh=RayleighPt(mhigh,gamma)-ptratio; // < 0 ???
var mmid,pmid;
do {   //solution using bisection
  mmid=HALF*(mlow+mhigh); pmid=RayleighPt(mmid,gamma)-ptratio;
  if (pmid < 0)
    mhigh=mmid;
  else
    mlow=mmid; } 
while (Math.abs(mhigh-mlow) > EPSILON);

return mmid;
}   // ------------------------------ End of Function RayleighMachFromPtSubsonic

function RayleighMachFromPtSupersonic(ptratio,gamma) {   // MachFromPtSupersonic
var slope,mnew;
var m1=1; var pt1=RayleighPt(m1,gamma)-ptratio;
var m2=2; var pt2=RayleighPt(m2,gamma)-ptratio;
do {   // solution using secant method
  slope=(m2-m1)/(pt2-pt1);
  mnew=m2-slope*pt2;   mnew=Math.max(1,mnew);  // don't go subsonic
  m1=m2; m2=mnew;
  pt1=pt2; pt2=RayleighPt(m2,gamma)-ptratio; }
while (Math.abs(m2-m1) > EPSILON);

return m2;
}   // ---------------------------- End of Function RayleighMachFromPtSupersonic

function RayleighMachFromTLow(tratio,gamma) {                  //   MachFromTLow
var mlow=0;       var tlow=RayleighT(mlow,gamma)-tratio;
var mhigh=0.8451542; var thigh=RayleighT(mhigh,gamma)-tratio;
var mmid,tmid;
do {   // solution by bisection
  mmid=HALF*(mlow+mhigh); tmid=RayleighT(mmid,gamma)-tratio;
  if (tmid > 0)
    mhigh=mmid;
  else
    mlow=mmid;  }
while (Math.abs(mhigh-mlow) > EPSILON);

return mmid;
}   // ------------------------------------ End of Function RayleighMachFromTLow

function RayleighMachFromTHigh(tratio,gamma) {                //   MachFromTHigh
var slope,mnew;
var m1=1; var t1=RayleighT(m1,gamma)-tratio;
var m2=2; var t2=RayleighT(m2,gamma)-tratio;
do {   // solution by secant method
  slope=(m2-m1)/(t2-t1);
  mnew=m2-slope*t2;   mnew=Math.max(1,mnew);
  m1=m2; m2=mnew;
  t1=t2; t2=RayleighT(m2,gamma)-tratio;}
while (Math.abs(m2-m1) > EPSILON);

return m2;
}   // ----------------------------- End of Function RayleighMachFromTSupersonic

function RayleighMachFromTtSubsonic(ttratio,gamma) {     //   MachFromTtSubsonic
var mlow=0; var tlow=RayleighTt(mlow,gamma)-ttratio;
var mhigh=1; var thigh=RayleighTt(mhigh,gamma)-ttratio;
var mmid,tmid;
do {   // solution by bisection
  mmid=HALF*(mlow+mhigh); tmid=RayleighTt(mmid,gamma)-ttratio;
  if (tmid > 0)
    mhigh=mmid;
  else
    mlow=mmid;}
while (Math.abs(mhigh-mlow) > EPSILON);

return mmid;
}   // ------------------------------ End of Function RayleighMachFromTtSubsonic

function RayleighMachFromTtSupersonic(ttratio,gamma) { //   MachFromTtSupersonic
var slope,mnew;
var m1=1; var t1=RayleighTt(m1,gamma)-ttratio;
var m2=2; var t2=RayleighTt(m2,gamma)-ttratio;
do {   // solution by secant method
  slope=(m2-m1)/(t2-t1);
  mnew=m2-slope*t2;  mnew=Math.max(1,mnew);
  m1=m2; m2=mnew;
  t1=t2; t2=RayleighTt(m2,gamma)-ttratio; }
while (Math.abs(m2-m1) > EPSILON);

return m2;
}   // ---------------------------- End of Function RayleighMachFromTtSupersonic

function RayleighMachFromRho(rhoratio,gamma) {                    // MachFromRho
var msq=1/(rhoratio*gamma+rhoratio-gamma);
return Math.sqrt(msq);
}   // ------------------------------------- End of Function RayleighMachFromRho

function RayleighMachFromV(vratio,gamma) {                          // MachFromV
var  msq=vratio/(gamma+1-gamma*vratio);
return Math.sqrt(msq)
}   // --------------------------------------- End of Function RayleighMachFromV



// ========== F A N N O   D I R E C T   F U N C T I O N S ======================

function FannoT(mach,gamma) {                                          //   T/T*
  var num   = gamma+1;
  var denom = 2 + (gamma-1)*mach*mach; 
  return num/denom;   
}   // --------------------------------------------------------- Function FannoT

function FannoP(mach,gamma) {                                          //   P/P*
  if (mach <= 0) return HUGE;
//    var num=gamma+1;
//    var denom=2+(gamma-1)*mach*mach;
  return (1/mach)*Math.sqrt(FannoT(mach,gamma));   
}   // --------------------------------------------------------- Function FannoP

function FannoPt(mach,gamma) {                                       //   Pt/Pt*
  if (mach <= 0) return HUGE;
  
  var gp1=gamma+1; var gm1=gamma-1;
  var num=2+gm1*mach*mach; 
  var denom=gp1;
  var xx=HALF*gp1/gm1;
  return (1/mach)*Math.pow(num/denom, xx);   
}   // -------------------------------------------------------- Function FannoPt

function FannoV(mach,gamma) {                                          //   V/V*
//    var num=gamma+1;
//    var denom=2+(gamma-1)*mach*mach;
  return mach*Math.sqrt(FannoT(mach,gamma));
}   // --------------------------------------------------------- Function FannoV

function FannoRho(mach,gamma) {                                    //   rho/rho*
  if (mach == 0) return HUGE;
  return 1/FannoV(mach,gamma);   
}   // ------------------------------------------------------- Function FannoRho

function FannoFLD(mach,gamma){                                     //   FLD/FLD*
  if (mach <= 0) return HUGE;
  var msq=mach*mach; var gp1=gamma+1; var gm1=gamma-1;
  var num=gp1*msq;
  var denom=2+gm1*msq;
  var term1=(gp1/(gamma+gamma))*Math.log(num/denom);
  var term2=(1/gamma)*((1/msq)-1);
  return term1+term2;   
}   // ------------------------------------------------------- Function FannoFLD

function FannoS(mach,gamma) {                                             // S/R
  if (mach==0.0) return 1E20;
  var gp1,gm1,msq;
  gp1=gamma+1; gm1=gamma-1; msq=mach*mach; xx=gp1/(2*gm1);
  return Math.log((1/mach)* Math.pow((1.+(gm1/2.)*msq)/(1.+(gm1/2.)), xx))
}   // --------------------------------------------------------- Function FannoS


// ============ F A N N O   I N V E R S E   F U N C T I O N S ==================

function FannoMachFromP(pratio,gamma) {                             // MachFromP
  var psq=pratio*pratio;
  var a=psq*(gamma-1);
  var b=psq+psq;
  var c=-(gamma+1);
  var msq = (-b + Math.sqrt(b*b-4*a*c))/(a+a);
  return Math.sqrt(msq);   
}   // ------------------------------------------------- Function FannoMachFromP

function FannoMachFromPtSubsonic(ptratio, gamma) {       //   MachFromPtSubsonic
  if (ptratio < 1) return -1;  // fatal error 
  var mlow,plow,mhigh,phigh,mmid,pmid;
  mlow=0; plow=FannoPt(mlow,gamma)-ptratio       //   > 0 
  mhigh=1; phigh=FannoPt(mhigh,gamma)-ptratio    //   < 0
  do {  // solution by bisection method
      mmid=HALF*(mlow+mhigh); pmid=FannoPt(mmid,gamma)-ptratio;
      if (pmid > 0)
          mlow=mmid;
      else
          mhigh=mmid; }
  while ((mhigh-mlow) > EPSILON)

  return mmid;    
}   // ---------------------------------------- Function FannoMachFromPtSubsonic

function FannoMachFromPtSupersonic(ptratio, gamma) {   //   MachFromPtSupersonic
  if (ptratio < 1) return -1;   // fatal error
  var gp1,gm1,m1,pt1,m2,pt2, slope,mnew;
  gp1=gamma+1; gm1=gamma-1;
  m1=1; pt1=FannoPt(m1,gamma)-ptratio; 
  m2=4; pt2=FannoPt(m2,gamma)-ptratio;
  do {   // solution by secant method
      slope=(m2-m1)/(pt2-pt1);
      mnew=m2-slope*pt2;   mnew=Math.max(1,mnew);  // don't go subsonic 
      m1=m2; m2=mnew;
      pt1=pt2; pt2=FannoPt(m2,gamma)-ptratio; }
  while (Math.abs(m2-m1) > 1E-10);
      
  return m2;   
}   // ------------------------------------------- Function MachFromPtSupersonic

function FannoMachFromT(tratio,gamma) {                           //   MachFromT
  var msq = (gamma+1 -2*tratio) / ((gamma-1)*tratio);
  return Math.sqrt(msq);   
}   // ------------------------------------------------- Function FannoMachFromT
  
function FannoMachFromRho(rhoratio,gamma) {                     //   MachFromRho
  var num=2/(gamma+1);
  var denom=rhoratio*rhoratio - (gamma-1)/(gamma+1);
  return Math.sqrt(num/denom)   
}   // ----------------------------------------------- Function FannoMachFromRho

function FannoMachFromV(vratio,gamma){                            //   MachFromV
  if (vratio == 0) return 0;
  var rhoratio = 1/vratio;
  return FannoMachFromRho(rhoratio,gamma);
}   // ------------------------------------------------- Function FannoMachFromV        

function FannoMachFromFLDSubsonic(fld, gamma) {         //   MachFromFLDsubsonic
  var gp1=gamma+1; var gm1=gamma-1;
  var mlow,flow,mhigh,fhigh,mmid,fmid;
  mlow=0;  flow=FannoFLD(mlow,gamma)-fld;      //   > 0
  mhigh=1; fhigh=FannoFLD(mhigh,gamma)-fld;    //   < 0
  do {  // solution using bisection
      mmid=HALF*(mlow+mhigh); fmid=FannoFLD(mmid,gamma)-fld;
      if (fmid > 0)
          mlow=mmid;
      else
          mhigh=mmid; }
  while (Math.abs(mhigh-mlow) > 1E-10);
  
  return mmid;   
}   // -------------------------------------------- Function MachFromFLDsubsonic

function FannoMachFromFLDSupersonic(fld, gamma) {     //   MachFromFLDsupersonic
  var gp1=gamma+1; var gm1=gamma-1;

//    var fldmax=gp1*Math.log(gp1/gm1)/(2*gamma)-1/gamma;  
//    if (fld > fldmax):
//        print("fL/D exceeds max. value");
//        return -1.0;
  var m1,f1,m2,f2, slope,mnew;
  m1=1; f1=FannoFLD(m1,gamma)-fld;
  m2=2; f2=FannoFLD(m2,gamma)-fld;

  do {
      slope=(m2-m1)/(f2-f1);
      mnew=m2-slope*f2;   mnew=Math.max(1,mnew)  // don't go subsonic 
      m1=m2; m2=mnew;
      f1=f2; f2=FannoFLD(m2,gamma)-fld; }
  while (Math.abs(m2-m1) > 1E-10);     

  return m2;   
}   // ------------------------------------------ Function MachFromFLDsupersonic




//   A T M O S P H E R E   F U N C T I O N S    ********************************


function GetAtmosBand(htab,h) {
const TABLESIZE = 8;
//  const htab = [0.0, 11.0, 20.0, 32.0, 47.0, 51.0, 71.0, 84.852];
var i,j,k;

i=0;
j=TABLESIZE-1;
while (true) {                           // binary search in ordered table
  k = Math.floor((i+j) / 2);             // floor division.
  if (h < htab[k])  j=k; else i=k;
  if (j <= i+1) break;
}  
//  alert("i " + i.toFixed() );
return i;
}   // -------------------------------------------- End of function GetAtmosBand


function Viscosity(theta) {    // returns viscosity in SI units 
const TZERO = 288.15;     // temperature at sealevel, kelvins 
const BETAVISC = 1.458E-6;   // viscosity term, N sec/(sq.m Sqrt(K) }
const SUTH = 110.4;      // Sutherland's constant, kelvins 

var t=TZERO*theta;   // temperature, Kelvins
return BETAVISC*Math.sqrt(t*t*t)/(t+SUTH);     // Sutherland's formula 
}   // ----------------------------------------------- End of function Viscosity


function ComputeAtmosphere(h) {
//   h is geopotential altitude in kilometers
const TABLESIZE = 8;
const REARTH = 6369.0;         // polar radius of the Earth (km)
const GMR = 34.163195;         // hydrostatic constant (kelvins/km)

const TZERO      = 288.15;               // temperature at sealevel, kelvins }
const PZERO      = 101325.0;            // pressure at sealevel, N/sq.m. = Pa}
const RHOZERO    = 1.2250;                  // density at sealevel, kg/cu.m. }
const ASOUNDZERO = 340.294;             // speed of sound at sealevel, m/sec }

const FT2METERS = 0.3048;                 // mult. ft. to get meters (exact) }
const KELVIN2RANKINE = 1.8;                       // mult deg K to get deg R }
const PSF2NSM = 47.880258;                    // mult lb/sq.ft to get N/sq.m }
const SCF2KCM = 515.379;                  // mult slugs/cu.ft to get kg/cu.m }
const FT2KM = 0.0003048;                        // mult ft to get kilometers

const htab = [0.0, 11.0, 20.0, 32.0, 47.0, 51.0, 71.0, 84.852];
const ttab = [288.15, 216.65, 216.65, 228.65, 270.65,
                     270.65, 214.65, 186.87 ];
const ptab = [1.0, 2.2336110E-1, 5.4032950E-2, 8.5666784E-3,
                   1.0945601E-3, 6.6063531E-4, 3.9046834E-5, 3.685010E-6];
const gtab = [-6.5, 0.0, 1.0, 2.8, 0.0, -2.8, -2.0, 0.0];

var gamma = 1.4;
var i;
var h, tgrad, deltah, tbase, tlocal;

var delta,theta;


//  alert("alt and mach " + alt.toPrecision(4) + " " + mach.toPrecision(4)
//    + " " + altkm.toPrecision(4) + " " + h.toPrecision(4) );
//  alert("h" + h.toPrecision(4) );
var iband = GetAtmosBand(htab,h);  
//  alert("atmos band " + iband.toFixed() );
tgrad=gtab[iband];
//  alert("tgrad " + tgrad.toPrecision(4) );
deltah=h-htab[iband];
tbase=ttab[iband];
//  alert("tgrad,deltah,tbase " + tgrad.toPrecision(4) + " " +
//     deltah.toPrecision(4) + " " + tbase.toPrecision(4) );

tlocal=tbase+tgrad*deltah;
theta=tlocal/ttab[0];                                // temperature ratio 
delta=1.0;
if (tgrad==0.0)                                         // pressure ratio 
  delta=ptab[iband]*Math.exp(-GMR*deltah/tbase);
else
  delta=ptab[iband]*Math.exp(Math.log(tbase/tlocal)*GMR/tgrad);

var arr=[delta,theta];   // the way to get multiple returns in JavaScript
return arr;
}   // ------------------------------------------ End function ComputeAtmosphere

//  E N D   G A S D Y N A M I C   &   A T M O S P H E R E   F U N C T I O N S

//   B E G I N   C O M P U T A T I O N S

// 1) R E A D   U S E R  I N P U T  2) C O M P U T E   3) D I S P L A Y 


// G E N E R A L   V I S I B I L I T Y   F U N C T I O N S  
function HideAll() {
document.getElementById("main").style.display="none";
document.getElementById("isentropicFlow").style.display="none";
document.getElementById("normalShock").style.display="none";
document.getElementById("obliqueShock").style.display="none";
document.getElementById("atmosphere").style.display="none";
document.getElementById("rayleighFlow").style.display="none";
document.getElementById("fannoFlow").style.display="none";
document.getElementById("gamma").style.display="none";
document.getElementById("atmosphere").style.display="none";
}   // ------------------------------------------------- End of function HideAll

function ShowMain() {
HideAll();
document.getElementById("main").style.display="block";
}   // ------------------------------------------------ End of function ShowMain

function ShowGamma() {
HideAll();
document.getElementById("gamma").style.display="block";
}   // ----------------------------------------------- End of function ShowGamma

function ShowIsentropicFlow() {
HideAll();
document.getElementById("isentropicFlow").style.display="block";
}   // -------------------------------------- End of function ShowIsentropicFlow

function ShowNormalShock() {
HideAll();
document.getElementById("normalShock").style.display="block";
}   // ----------------------------------------- End of function ShowNormalShock

function ShowObliqueShock() {
HideAll();
document.getElementById("obliqueShock").style.display="block";
}   // ---------------------------------------- End of function ShowObliqueShock

function ShowRayleighFlow() {
HideAll();
document.getElementById("rayleighFlow").style.display="block";
}   // ---------------------------------------- End of function ShowRayleighFlow

function ShowFannoFlow() {
HideAll();
document.getElementById("fannoFlow").style.display="block";
}   // ------------------------------------------- End of function ShowFannoFlow

function ShowAtmosphere() {
HideAll();
document.getElementById("atmosphere").style.display="block";
}   // ------------------------------------------ End of function ShowAtmosphere


// I S E N T R O P I C   F L O W   F O R M   H A N D L I N G 

function IsenGetMach() {
var isenInputField = document.getElementById("isenvalue").value;
var isenInput = Number(isenInputField);
if (isNaN(isenInput)) {alert("isenInput is not a number"); return -1;}
if (isenInput < 0) {alert("isenInput cannot be negative"); return -1;}
  
var xx=isenInput;  // xx is a number


if (document.getElementById("isenStaticqRatio").checked) 
   xx = Eq47inverse(isenInput,gamma);

if (document.getElementById("isenTotalqRatioLow").checked) 
    if (isenInput > 0.4312) 
      {alert("q/pt must not exceed 0.4312"); return -1;}
    else  
       xx = Eq48inverseLow(isenInput,gamma);

if (document.getElementById("isenTotalqRatioHigh").checked) 
    if (isenInput > 0.4312) 
      {alert("q/pt must not exceed 0.4312"); return -1;}
    else  
       xx = Eq48inverseHigh(isenInput,gamma);

if (document.getElementById("isenPressureRatio").checked) 
    if (isenInput > 1) 
      {alert ("pressure ratio must be less than 1"); return -1;}
    else
      xx = Eq44inverse(isenInput,gamma);

if (document.getElementById("isenAreaRatioSub").checked) 
  if (isenInput < 1) {alert("area ratio cannot be < 1"); return -1;}
  else
    xx = SubsonicEq80inverse(Reciprocal(isenInput),gamma);
    
if (document.getElementById("isenAreaRatioSup").checked) 
  if (isenInput < 1) {alert("area ratio cannot be < 1"); return -1;}
  else
    xx = SupersonicEq80inverse(Reciprocal(isenInput),gamma);
    
if (document.getElementById("isenDensityRatio").checked) 
    if (isenInput > 1) {alert("density ratio cannot be > 1"); return -1;}
  else
    xx = Eq45inverse(isenInput,gamma);
    
if (document.getElementById("isenTemperatureRatio").checked) 
  if (isenInput > 1) {alert("temperature ratio cannot be > 1"); return -1;}
  else
    xx = Eq43inverse(isenInput,gamma);
    
if (document.getElementById("isenVelocityRatio").checked) 
   xx = Eq50inverse(Square(isenInput),gamma);
   
if (document.getElementById("isenPmAngle").checked) 
    if (isenInput > 130.45) 
                {alert("Prandtl-Meyer angle cannot be > 130.45"); return -1;}
  else
    xx = Eq171inverse(DEG2RAD*isenInput,gamma);
    
if (document.getElementById("isenMachAngle").checked) 
    if (isenInput >= 90) {alert("Mach angle must be < 90"); return -1;}
  else
    xx = 1/Math.sin(DEG2RAD*isenInput);
 
return xx;   // returns the Mach number
}   // --------------------------------------------- End of function IsenGetMach

function IsenGetResults(mach,gamma) {                        //   IsenGetResults
document.getElementById("isenMachOutput").value = 
   mach.toFixed(5);
document.getElementById("isenCompFactorOutput").value =
   Math.sqrt(Math.abs(mach*mach-1)).toFixed(5);   
document.getElementById("isenStaticqRatioOutput").value = 
   Eq47(mach,gamma).toFixed(5);
document.getElementById("isenTotalqRatioOutput").value = 
   Eq48(mach,gamma).toPrecision(5);
document.getElementById("isenPressureRatioOutput").value = 
   Eq44(mach,gamma).toPrecision(5);
document.getElementById("isenAreaRatioOutput").value = 
   Reciprocal(Eq80(mach,gamma)).toPrecision(5);
document.getElementById("isenDensityRatioOutput").value = 
   Eq45(mach,gamma).toPrecision(5);
document.getElementById("isenTemperatureRatioOutput").value = 
   Eq43(mach,gamma).toPrecision(5);
document.getElementById("isenVelocityRatioOutput").value = 
   (Math.sqrt(Eq50(mach,gamma))).toPrecision(5);
if (mach >= 1) 
  document.getElementById("isenPmAngleOutput").value = 
     (RAD2DEG*Eq171c(mach,gamma)).toPrecision(5) + DEGREE_SYMBOL;
else
  document.getElementById("isenPmAngleOutput").value = "N/A";

if (mach >= 1)
  document.getElementById("isenMachAngleOutput").value = 
    (RAD2DEG*Math.asin(1/mach)).toPrecision(5) + DEGREE_SYMBOL;
else
  document.getElementById("isenMachAngleOutput").value = "N/A";

document.getElementById("isenGammaOutput").value = gamma.toPrecision(5);

if (mach == 0) 
  document.getElementById("isenAreaRatioOutput").value = INFINITY_SYMBOL; 
}   // ------------------------------------------ End of function IsenGetResults

function IsenHideResults(mach,gamma) {                        // IsenHideResults
document.getElementById("isenMachOutput").value = " ";
document.getElementById("isenCompFactorOutput").value = " ";
document.getElementById("isenStaticqRatioOutput").value =  " ";
document.getElementById("isenTotalqRatioOutput").value =  " ";
document.getElementById("isenPressureRatioOutput").value =  " ";
document.getElementById("isenAreaRatioOutput").value =  " ";
document.getElementById("isenDensityRatioOutput").value =  " ";
document.getElementById("isenTemperatureRatioOutput").value =  " ";
document.getElementById("isenVelocityRatioOutput").value =  " ";
document.getElementById("isenPmAngleOutput").value =  " ";
document.getElementById("isenMachAngleOutput").value =  " ";
document.getElementById("isenGammaOutput").value =  " ";
}   // ----------------------------------------- End of function IsenHideResults

function IsenCompute() {                                        //   IsenCompute
var mach = IsenGetMach();
if (mach >= 0) IsenGetResults(mach,gamma); // negative mach is error
}   // --------------------------------------------- End of function IsenCompute

//    E N D   O F   I S E N T R O P I C   F L O W   F O R M   H A N D L I N G

//    N O R M A L   S H O C K   F O R M   H A N D L I N G


function NormalGetUpstreamMach() {
var normalInputField = document.getElementById("normalvalue").value;
var normalInput = Number(normalInputField);
if (isNaN(normalInput)) {alert("normalInput is not a number"); return -1;}
if (normalInput < 0) {alert("normalInput cannot be negative"); return -1;}
  
var xx=normalInput;  // xx is a number
if (document.getElementById("normalUpstreamMachNumber").checked) 
  if (normalInput < 1) 
    {alert("upstream Mach cannot be < 1"); return -1;}
  else
    xx = normalInput;

if (document.getElementById("normalDownstreamMachNumber").checked) 
  if (normalInput > 1) 
    {alert("downstream Mach cannot be > 1"); return -1;}
  else
    xx = Eq96inverse(normalInput,gamma);

if (document.getElementById("normalTotalPressureRatio").checked) 
  if (normalInput > 1) 
    {alert("total pressure ratio cannot be > 1"); return -1;}
  else
    xx = Eq99inverse(normalInput,gamma);

if (document.getElementById("normalStaticPressureRatio").checked) 
  if (normalInput < 1) 
    {alert("static pressure ratio cannot be < 1"); return -1;}
  else
    xx = Eq93inverse(normalInput,gamma);

if (document.getElementById("normalStaticTemperatureRatio").checked) 
  if (normalInput < 1) 
    {alert("static temperature ratio cannot be < 1"); return -1;}
  else
    xx = Eq95inverse(normalInput,gamma);

if (document.getElementById("normalStaticDensityRatio").checked) 
  if (normalInput < 1) 
    {alert("static density ratio cannot be < 1"); return -1;}
  else
    xx = Eq94inverse(normalInput,gamma);
 
return xx;   // returns the upstream Mach number
}   // ----------------------------------- End of function NormalGetUpstreamMach

function NormalGetResults(mach1,gamma) {                   //   NormalGetResults

document.getElementById("normalUpstreamMachOutput").value = 
   mach1.toFixed(5);
document.getElementById("normalDownstreamMachOutput").value = 
   Eq96(mach1,gamma).toFixed(5);
document.getElementById("normalTotalPressureRatioOutput").value = 
   Eq99(mach1,gamma).toPrecision(5);
document.getElementById("normalStaticPressureRatioOutput").value = 
   Eq93(mach1,gamma).toPrecision(5);
document.getElementById("normalStaticTemperatureRatioOutput").value = 
   Eq95(mach1,gamma).toPrecision(5);
document.getElementById("normalStaticDensityRatioOutput").value = 
   Eq94(mach1,gamma).toPrecision(5);
document.getElementById("normalPitotPressureOutput").value =
   Eq100(mach1,gamma).toPrecision(5);   
document.getElementById("normalGammaOutput").value = gamma.toPrecision(5);

}   // ---------------------------------------- End of function NormalGetResults

function NormalHideResults(mach1,gamma) {                 //   NormalHideResults 
document.getElementById("normalUpstreamMachOutput").value = " ";
document.getElementById("normalDownstreamMachOutput").value =  " ";
document.getElementById("normalTotalPressureRatioOutput").value =  " ";
document.getElementById("normalStaticPressureRatioOutput").value =  " ";
document.getElementById("normalStaticTemperatureRatioOutput").value =  " ";
document.getElementById("normalStaticDensityRatioOutput").value =  " ";
document.getElementById("normalPitotPressureOutput").value = " ";
document.getElementById("normalGammaOutput").value = " ";
}   // ---------------------------------------- End of function NormalGetResults

function NormalCompute() {
var mach1 = NormalGetUpstreamMach();
if (mach1 >= 0) NormalGetResults(mach1,gamma);   // negative mach1 is error
}   // ------------------------------------------- End of function NormalCompute

//    E N D   O F   N O R M A L   S H O C K   F O R M   H A N D L I N G

//   O B L I Q U E   S H O C K  F O R M   H A N D L I N G


function ObliqueGetTheta(obliqueUpstreamMach) {
var obliqueInputField = document.getElementById("obliquevalue").value;
var obliqueInput = Number(obliqueInputField);
if (isNaN(obliqueInput)) {alert("obliqueInput is not a number"); return -1;}
if (obliqueInput < 0){alert("obliqueInput cannot be negative"); return -1;}

var xx=obliqueInput;  // xx is a number
if (document.getElementById("obliqueRampAngleWeak").checked) {
  var thetastar = Eq168(obliqueUpstreamMach,gamma);
  var deltamax = RAD2DEG*Eq138(obliqueUpstreamMach,thetastar,gamma);
  deltamaxText = deltamax.toFixed(5);
  if (obliqueInput > deltamax) 
    {alert ("ramp angle must be less than " + deltamaxText); return -1;}
  else
    xx = Eq138inverseWeak(obliqueUpstreamMach, DEG2RAD*obliqueInput, gamma);
}

if (document.getElementById("obliqueRampAngleStrong").checked) {
  var thetastar = Eq168(obliqueUpstreamMach,gamma);
  var deltamax = RAD2DEG*Eq138(obliqueUpstreamMach,thetastar,gamma);
  deltamaxText = deltamax.toFixed(5);
  if (obliqueInput > deltamax) 
    {alert ("ramp angle must be less than " + deltamaxText); return -1;}
  else
    xx = Eq138inverseStrong(obliqueUpstreamMach, DEG2RAD*obliqueInput, gamma);
}

 
if (document.getElementById("obliqueShockAngle").checked) {
  var machAngleDeg = RAD2DEG*Math.asin(1/obliqueUpstreamMach);
  var machAngleDegText = machAngleDeg.toFixed(5);
  if (obliqueInput + EPSILON < machAngleDeg) 
    {alert ("shock angle must not be less than " + 
                                              machAngleDegText); return -1;}
  else
    xx = DEG2RAD*obliqueInput; 
    
}
   
   
if (document.getElementById("obliqueTotalPressureRatio").checked) 
  if (obliqueInput > 1) 
    {alert ("total pressure ratio must not be greater than 1"); return -1;}
  else
    xx = Eq142inverse(obliqueUpstreamMach,obliqueInput,gamma);
   
if (document.getElementById("obliqueStaticPressureRatio").checked) 
  if (obliqueInput < 1) 
    {alert ("static pressure ratio must not be less than 1"); return -1;}
  else
    xx = Eq128inverse(obliqueUpstreamMach,obliqueInput,gamma);
   
if (document.getElementById("obliqueStaticTemperatureRatio").checked) 
  if (obliqueInput < 1) 
    {alert ("static temperature ratio must not be less than 1"); return -1;}
  else
    xx = Eq130inverse(obliqueUpstreamMach,obliqueInput,gamma);
   
if (document.getElementById("obliqueStaticDensityRatio").checked) 
  if (obliqueInput < 1) 
    {alert ("static density ratio must not be less than 1"); return -1;}
  else
    xx = Eq129inverse(obliqueUpstreamMach,obliqueInput,gamma);
   
if (document.getElementById("obliqueDownstreamMach").checked) 
   xx = Eq132inverse(obliqueUpstreamMach,obliqueInput,gamma);

if (document.getElementById("obliqueUpstreamNormal").checked) {
  var sinth = obliqueInput/obliqueUpstreamMach;
  if (sinth > 1) 
    {alert ("normal mach must be less than freestream mach"); return -1;}
  else
    xx = Math.asin(sinth);
 }
   
 
return xx;   // returns the shock angle (wave angle) in radians (-1 for error)
}   // ----------------------------------------- End of function ObliqueGetTheta

function ObliqueGetResults(mach1,theta,gamma) {           //   ObliqueGetResults
document.getElementById("obliqueRampAngleOutput").value =
  (RAD2DEG*Eq138(mach1,theta,gamma)).toPrecision(5) + DEGREE_SYMBOL;
document.getElementById("obliqueShockAngleOutput").value =
  (RAD2DEG*theta).toFixed(5) + DEGREE_SYMBOL;
document.getElementById("obliqueTotalPressureRatioOutput").value = 
   Eq142(mach1,theta,gamma).toPrecision(5);
document.getElementById("obliqueStaticPressureRatioOutput").value = 
   Eq128(mach1,theta,gamma).toPrecision(5);
document.getElementById("obliqueStaticTemperatureRatioOutput").value = 
   Eq130(mach1,theta,gamma).toPrecision(5);
document.getElementById("obliqueStaticDensityRatioOutput").value = 
   Eq129(mach1,theta,gamma).toPrecision(5);
document.getElementById("obliqueDownstreamMachOutput").value =
   Eq132(mach1,theta,gamma).toPrecision(5);
document.getElementById("obliquePressureCoeffOutput").value =
   Eq145(mach1,theta,gamma).toPrecision(5);
document.getElementById("obliqueUpstreamNormalOutput").value =
   mach1*Math.sin(theta).toFixed(5);
document.getElementById("obliqueGammaOutput").value = gamma.toFixed(5);
return;
}   // --------------------------------------- End of function ObliqueGetResults

function ObliqueHideResults(mach1,theta,gamma) {         //   ObliqueHideResults
document.getElementById("obliqueRampAngleOutput").value = " ";
document.getElementById("obliqueShockAngleOutput").value = " ";
document.getElementById("obliqueTotalPressureRatioOutput").value =  " ";
document.getElementById("obliqueStaticPressureRatioOutput").value =  " ";
document.getElementById("obliqueStaticTemperatureRatioOutput").value =  " ";
document.getElementById("obliqueStaticDensityRatioOutput").value =  " ";
document.getElementById("obliquePressureCoeffOutput").value = " ";  
document.getElementById("obliqueDownstreamMachOutput").value = " ";
document.getElementById("obliqueUpstreamNormalOutput").value = " ";
document.getElementById("obliqueGammaOutput").value =  " ";
return;
}   // -------------------------------------- End of function ObliqueHideResults


function ObliqueCompute() {
var obliqueUpstreamMachField = 
   document.getElementById("obliqueUpstreamMachField").value;
var obliqueUpstreamMach = Number(obliqueUpstreamMachField);
if (isNaN(obliqueUpstreamMach)) 
  {alert("obliqueUpstreamMach is not a number"); return -1;}
if (obliqueUpstreamMach < 1) 
  {alert("upstream Mach number must not be < 1"); return -1;}  

var theta = ObliqueGetTheta(obliqueUpstreamMach);
if (theta >= 0) ObliqueGetResults(obliqueUpstreamMach,theta,gamma);
}   // ------------------------------------------ End of function ObliqueCompute


//   E N D   O F   O B L I Q U E   S H O C K  F O R M   H A N D L I N G


// R A Y L E I G H   F L O W   H A N D L I N G 

function RayleighGetMach() {
var rayleighInputField = document.getElementById("rayleighvalue").value;
var rayleighInput = Number(rayleighInputField);
if (isNaN(rayleighInput)) {alert("rayleighInput is not a number"); return -1;}
if (rayleighInput < 0) 
   {alert("rayleighInput cannot be negative"); return -1;}
  
var xx=rayleighInput;  // xx is a number
if (document.getElementById("rayleighMachNumber").checked) 
  xx = rayleighInput;


if (document.getElementById("rayleighSubsonicTtotal").checked) 
    if (rayleighInput > 1)
      {alert("Rayleigh total temperature ratio must not be > 1"); return -1;}
    else
      xx = RayleighMachFromTtSubsonic(rayleighInput,gamma);

if (document.getElementById("rayleighSupersonicTtotal").checked) 
    if (rayleighInput > 1) 
      {alert ("Rayleigh total temperature ratio must not be > 1"); return -1;}
    else
      if (rayleighInput < 0.4898)
        {alert 
         ("Rayleigh total temperature ratio must not be < 0.4898 supersonic");
           return -1;}
      else     
        xx = RayleighMachFromTtSupersonic(rayleighInput,gamma);

if (document.getElementById("rayleighSubsonicTstatic").checked) 
    if (rayleighInput > 1.02857)
      {alert("Rayleigh static temperature ratio must not be > 1.02857"); 
       return -1;}
    else
      xx = RayleighMachFromTLow(rayleighInput,gamma);
    
if (document.getElementById("rayleighSupersonicTstatic").checked) 
    if (rayleighInput > 1.02857)
      {alert("Rayleigh static temperature ratio must not be > 1.02857"); 
       return -1;}
    else
      xx = RayleighMachFromTHigh(rayleighInput,gamma);
    
if (document.getElementById("rayleighStaticPressureRatio").checked) 
    if (rayleighInput > 2.4)
      {alert("Rayleigh static pressure ratio must not be > 2.4"); return -1;}
   else
     xx = RayleighMachFromP(rayleighInput,gamma);
    
if (document.getElementById("rayleighSubsonicTotalPressureRatio").checked) 
  if (rayleighInput > 1.2679)
    {alert("Rayleigh total pressure ratio cannot be > 1.2679"); return -1;}
  else
    if (rayleighInput < 1)
      {alert("Rayleigh total pressure ratio must not be < 1"); return -1;}
    else
      xx = RayleighMachFromPtSubsonic(rayleighInput,gamma);
    
if (document.getElementById("rayleighSupersonicTotalPressureRatio").checked) 
  if (rayleighInput > 1.2679)
    {alert("Rayleigh total pressure ratio cannot be > 1.2679"); return -1;}
  else
    xx = RayleighMachFromPtSupersonic(rayleighInput,gamma);
   
if (document.getElementById("rayleighVelocityRatio").checked) 
    if (rayleighInput > 1.7143)
      {alert("Rayleigh velocity ratio cannot be > 1.7143"); return -1;}
   else
     xx = RayleighMachFromV(rayleighInput,gamma);
    
if (document.getElementById("rayleighDensityRatio").checked) 
  if (rayleighInput < 0.56) 
    {alert("Rayleigh density ratio must not be < 0.56"); return -1;}
  else
    xx = RayleighMachFromRho(rayleighInput,gamma);
 
return xx;   // returns the Mach number
}   // ----------------------------------------- End of function RayleighGetMach

function RayleighGetResults(mach,gamma) {                //   RayleighGetResults
document.getElementById("rayleighMachNumberOutput").value = 
   mach.toFixed(5);
document.getElementById("rayleighTtotalOutput").value = 
   RayleighTt(mach,gamma).toFixed(5);
document.getElementById("rayleighTstaticOutput").value = 
   RayleighT(mach,gamma).toFixed(5);
document.getElementById("rayleighStaticPressureRatioOutput").value = 
   RayleighP(mach,gamma).toPrecision(5);
document.getElementById("rayleighTotalPressureRatioOutput").value = 
   RayleighPt(mach,gamma).toPrecision(5);
document.getElementById("rayleighVelocityRatioOutput").value = 
   RayleighV(mach,gamma).toPrecision(5);
document.getElementById("rayleighStaticDensityRatioOutput").value = 
   RayleighRho(mach,gamma).toPrecision(5);
document.getElementById("rayleighEntropyOutput").value = 
   RayleighS(mach,gamma).toPrecision(5);
document.getElementById("rayleighGammaOutput").value = 
   gamma.toPrecision(5);
if (mach==0) {
  document.getElementById("rayleighStaticDensityRatioOutput").value =
      INFINITY_SYMBOL;
  document.getElementById("rayleighEntropyOutput").value = INFINITY_SYMBOL;
}
}   // -------------------------------------- End of function RayleighGetResults

function RayleighHideResults() {                        //   RayleighHideResults
document.getElementById("rayleighMachNumberOutput").value = " ";
document.getElementById("rayleighTtotalOutput").value = " ";
document.getElementById("rayleighTstaticOutput").value = " ";
document.getElementById("rayleighStaticPressureRatioOutput").value = " ";
document.getElementById("rayleighTotalPressureRatioOutput").value = " ";
document.getElementById("rayleighVelocityRatioOutput").value = " ";
document.getElementById("rayleighStaticDensityRatioOutput").value = " "; 
document.getElementById("rayleighEntropyOutput").value = " ";
document.getElementById("rayleighgammaOutput").value = " ";
}   // ------------------------------------- End of function RayleighHideResults

function RayleighCompute() {                                //   RayleighCompute
var mach = RayleighGetMach();
if (mach >= 0) RayleighGetResults(mach,gamma);
}  //  ----------------------------------------- End of Function RayleighCompute
// E N D   O F   R A Y L E I G H   F L O W   H A N D L I N G


// F A N N O   F L O W   H A N D L I N G 

function FannoGetMach() {                                      //   FannoGetMach
var fannoInputField = document.getElementById("fannovalue").value;
var fannoInput = Number(fannoInputField);
if (isNaN(fannoInput)) {alert("fannoInput is not a number"); return -1;}
if (fannoInput < 0) {alert("fannoInput cannot be negative"); return -1;}
  
var xx=fannoInput;  // xx is a number
if (document.getElementById("fannoMachNumber").checked) 
  xx = fannoInput;  

if (document.getElementById("fannoTratio").checked) 
  if (fannoInput > 1.2)
      {alert("fanno temperature ratio must not be > 1.2"); return -1;}
  else
    xx = FannoMachFromT(fannoInput,gamma);

if (document.getElementById("fannoStaticPressureRatio").checked) 
  xx = FannoMachFromP(fannoInput,gamma);

if (document.getElementById("fannoSubsonicTotalPressureRatio").checked) 
  if (fannoInput < 1) 
     {alert("fanno total pressure ratio cannot be < 1"); return -1;}
  else
    xx = FannoMachFromPtSubsonic(fannoInput,gamma);
    
if (document.getElementById("fannoSupersonicTotalPressureRatio").checked)
  if (fannoInput < 1)
     {alert("fanno total pressure ratio cannot be < 1"); return -1;}
  else
    xx = FannoMachFromPtSupersonic(fannoInput,gamma);
    
if (document.getElementById("fannoVelocityRatio").checked) 
  if (fannoInput > 2.4495)
     {alert("fanno velocity ratio cannot be > 2.4495"); return -1;}
  else
    xx = FannoMachFromV(fannoInput,gamma);

 if (document.getElementById("fannoSubsonicLDratio").checked) 
    xx = FannoMachFromFLDSubsonic(fannoInput,gamma);
    
if (document.getElementById("fannoSupersonicLDRatio").checked) 
  if (fannoInput > 0.82153)
    {alert("fanno fLmax/D must not be > 0.82153 supersonic "); return -1;}
  else  
    xx = FannoMachFromFLDSupersonic(fannoInput ,gamma);

 
return xx;   // returns the Mach number
}   // -------------------------------------------- End of function FannoGetMach

function FannoGetResults(mach,gamma) {                      //   FannoGetResults

document.getElementById("fannoMachOutput").value = 
   mach.toPrecision(5);
document.getElementById("fannoTratioOutput").value = 
   FannoT(mach,gamma).toPrecision(5);
document.getElementById("fannoStaticPressureRatioOutput").value = 
   FannoP(mach,gamma).toPrecision(5);
document.getElementById("fannoTotalPressureRatioOutput").value = 
   FannoPt(mach,gamma).toPrecision(5);
document.getElementById("fannoDensityRatioOutput").value = 
   FannoRho(mach,gamma).toPrecision(5);
document.getElementById("fannoVelocityRatioOutput").value = 
   FannoV(mach,gamma).toPrecision(5);
document.getElementById("fannoLDratioOutput").value = 
   FannoFLD(mach,gamma).toPrecision(5);
document.getElementById("fannoEntropyOutput").value = 
   FannoS(mach,gamma).toPrecision(5);
document.getElementById("fannoGammaOutput").value = gamma.toFixed(5);

if (mach==0) {
  document.getElementById("fannoStaticPressureRatioOutput").value = INFINITY_SYMBOL;
  document.getElementById("fannoTotalPressureRatioOutput").value = INFINITY_SYMBOL;
  document.getElementById("fannoDensityRatioOutput").value = INFINITY_SYMBOL;
  document.getElementById("fannoLDratioOutput").value =  INFINITY_SYMBOL;
  document.getElementById("fannoEntropyOutput").value =  INFINITY_SYMBOL;
}

}   // ----------------------------------------- End of function FannoGetResults

function FannoHideResults(mach,gamma) {                    //   FannoHideResults
document.getElementById("fannoMachOutput").value = " ";
document.getElementById("fannoTratioOutput").value = " ";
document.getElementById("fannoStaticPressureRatioOutput").value = " ";
document.getElementById("fannoTotalPressureRatioOutput").value = " ";
document.getElementById("fannoDensityRatioOutput").value = " ";
document.getElementById("fannoVelocityRatioOutput").value = " ";
document.getElementById("fannoLDratioOutput").value = " ";
document.getElementById("fannoGammaOutput").value = " ";
document.getElementById("fannoEntropyOutput").value =  " ";
}   // ---------------------------------------- End of function FannoHideResults

function FannoCompute() {
var mach = FannoGetMach();
if (mach >= 0) FannoGetResults(mach,gamma);
}
// E N D   O F   F A N N O   F L O W   H A N D L I N G

<!--      A T M O S P H E R E   F O R M   H A N D L I N G                    -->

function AtmosChangeUnits() {
const FT2METERS = 0.3048;                   // mult. ft. to get meters (exact)
var si = document.getElementById("unitsSi").checked;

var oldAltField = document.getElementById("altfield").value;  
//  alert("oldAltField "+oldAltField);
var alt = Number(oldAltField);
//  alert("alt "+ alt.toPrecision(4));
if (si)
  alt = alt*FT2METERS;
else  
  alt = alt/FT2METERS;
  
//  alert("alt "+ alt.toPrecision(4));    

var newAltField = alt.toFixed();  
//  alert("newAltField "+newAltField);
  
document.getElementById("altfield").value = newAltField;
if (si) document.getElementById("altunits").value = "meters";
else    document.getElementById("altunits").value = "feet";
//  SetUnitFields();
document.getElementById("atmosphereResults").style.visibility="hidden";    
}   // ---------------------------------------- End of function AtmosChangeUnits

function AtmosHideResults() {
//  alert("Hiding results");
document.getElementById("atmosphereResults").style.visibility="hidden";
}   // ----------------------------------- End of function HideAtmosphereResults



function AtmosGetResults(si,mach,altkm,sigma,delta,theta) {

const TABLESIZE = 8;
const REARTH = 6369.0;         // polar radius of the Earth (km)
const GMR = 34.163195;         // hydrostatic constant (kelvins/km)

const TZERO      = 288.15;                 // temperature at sealevel, kelvins 
const PZERO      = 101325.0;             // pressure at sealevel, N/sq.m. = Pa
const RHOZERO    = 1.2250;                    // density at sealevel, kg/cu.m. 
const ASOUNDZERO = 340.294;               // speed of sound at sealevel, m/sec 

const FT2METERS = 0.3048;                   // mult. ft. to get meters (exact) 
const KELVIN2RANKINE = 1.8;                         // mult deg K to get deg R 
const PSF2NSM = 47.880258;                      // mult lb/sq.ft to get N/sq.m 
const SCF2KCM = 515.379;                    // mult slugs/cu.ft to get kg/cu.m 
const FT2KM = 0.0003048;                          // mult ft to get kilometers


//  alert("AtmosGetResults si ", si);
//  alert("mach,altkm " + mach.toPrecision(4) + " " + altkm.toPrecision(4) );
//  alert("sigma,delta,theta " + sigma.toPrecision(4) + " " + 
//                               delta.toPrecision(4) + " " +
//                               theta.toPrecision(4) );
var xx,zz   // xx will be a number and zz will be a string

zz = "Temperature / Sea-level temperature = ";
document.getElementById("thetafield").value = zz + theta.toPrecision(5);
zz = "Pressure / Sea-level pressure = ";
document.getElementById("deltafield").value = zz + delta.toPrecision(5);
zz = "Density / Sea-level density = ";
document.getElementById("sigmafield").value = zz + sigma.toPrecision(5);

xx = TZERO*theta;
if (!si) xx = xx*KELVIN2RANKINE;
zz="Temperature = " + xx.toPrecision(5);
if (si) document.getElementById("tempfield").value = zz + " kelvins";
else    document.getElementById("tempfield").value = zz + " deg. R"

xx = PZERO*delta;
if (!si) xx = xx/PSF2NSM;
zz="Pressure = " + xx.toPrecision(5);
if (si) document.getElementById("pressfield").value = zz + " Pascals";
else    document.getElementById("pressfield").value = 
                                           zz + " pounds/square foot";
  
xx = RHOZERO*sigma;
if (!si) xx = xx/SCF2KCM;
zz="Density = " + xx.toPrecision(5);
if (si) document.getElementById("denfield").value = zz + " kg/m^3";
else    document.getElementById("denfield").value = zz + " pounds/cubic foot"

xx=ASOUNDZERO*Math.sqrt(theta);   // speed of sound 
if (!si) xx=xx/FT2METERS;
zz="Speed of sound = " + xx.toPrecision(5);
if (si) document.getElementById("asoundfield").value = zz + " m/s";
else    document.getElementById("asoundfield").value = zz + " feet/second"

var dynamicViscosity = Viscosity(theta);  // so we can use this again
xx = dynamicViscosity;
if (!si) xx=xx/PSF2NSM;
zz="Dynamic viscosity = " + xx.toPrecision(5);
if (si) document.getElementById("mufield").value = zz + " kg/ms";
else    document.getElementById("mufield").value = zz + " slugs/foot-second";
//  alert("Viscosity " + dynamicViscosity.toPrecision(6) );

xx = dynamicViscosity/(RHOZERO*sigma);   // kinematic viscosity
if (!si) xx=xx*SCF2KCM/PSF2NSM;
zz="Kinematic viscosity = " + xx.toPrecision(5);
if (si) document.getElementById("nufield").value = zz + " m^2/s";
else    document.getElementById("nufield").value = zz + " square feet/second";

xx = ASOUNDZERO*Math.sqrt(theta)*mach*RHOZERO*sigma/dynamicViscosity;
if (!si) xx=xx*FT2METERS;
zz="Unit Reynolds Number = " + xx.toPrecision(5);
if (si) document.getElementById("rnlfield").value = zz + " 1/m";
else    document.getElementById("rnlfield").value = zz + " 1/foot";

xx = ASOUNDZERO*Math.sqrt(theta)*mach;   // velocity 
if (!si) xx=xx/FT2METERS;
zz="Velocity = " + xx.toPrecision(5);
if (si) document.getElementById("velfield").value = zz + " m/s";
else    document.getElementById("velfield").value = zz + " feet/second";

xx = 0.5*gamma*PZERO*delta*mach*mach;   // dynamic pressure 
if (!si) xx=xx/PSF2NSM;
zz="Dynamic pressure = " + xx.toPrecision(5);
if (si) document.getElementById("qfield").value = zz + " Pascals";
else    document.getElementById("qfield").value = zz + " pounds/square foot";

xx = TZERO*theta/Eq43(mach,gamma);   // total temperature
if (!si) xx=xx*KELVIN2RANKINE;
zz="Total temperature = " + xx.toPrecision(5);
if (si) document.getElementById("ttfield").value = zz + " kelvins";
else    document.getElementById("ttfield").value = zz + " deg R"

xx = PZERO*delta/Eq44(mach,gamma);   // total pressure 
if (!si) xx=xx/PSF2NSM;
zz="Total pressure = " + xx.toPrecision(5);
if (si) document.getElementById("ptfield").value = zz + " Pascals";
else    document.getElementById("ptfield").value = zz + " pounds/square-foot";

//  SetUnitFields();
document.getElementById("atmosphereResults").style.visibility="visible";

}   // ----------------------------------------- End of function AtmosGetResults


function AtmosCompute() {
//  alert("Units");

var si = document.getElementById("unitsSi").checked;
//  alert("Units " + si);
var altfield = document.getElementById("altfield").value;    // a string
//  alert("altitude " + altfield);
var machfield = document.getElementById("machfield").value;   // a string
//  alert("mach " + machfield);

var alt = Number(altfield); // convert string to number 
if (isNaN(alt)) {alert("Altitude is not a number."); return; }

var mach = Number(machfield); // convert string to number 
if (isNaN(mach)) {alert("Mach Number is not a number."); return; }

const FT2KM = 0.0003048;                          // mult ft to get kilometers
const REARTH = 6369.0;                       // polar radius of the Earth (km)
var altkm;
if (si) altkm=alt/1000; else altkm=FT2KM*alt;
 // Convert geometric to geopotential altitude (kilometers)
h=altkm*REARTH/(altkm+REARTH);    // h is geopotential alt in km.
//  alert("altkm,h " + altkm.toPrecision(5) + " " + h.toPrecision(5));

var sigma,delta,theta,arr 
arr = ComputeAtmosphere(h);
//  alert("arr "+ arr[0].toPrecision(3) + " " + arr[1].toPrecision(3) );
 delta=arr[0];
 theta=arr[1];
 sigma=delta/theta;

AtmosGetResults(si,mach,altkm,sigma,delta,theta);
}   // -------------------------------------------- End of function AtmosCompute



// G A M M A   F L O W   H A N D L I N G 
// Note that gamma is a global variable; this is the only place it is ever
// changed from its default value of 1.4
// gamma is the only global variable in the program

function ApplyGamma() {
var gammaInputField = document.getElementById("gammafield").value;
var gammaInput = Number(gammaInputField);
gamma = gammaInput;
gp1=gamma+1;
gm1=gamma-1;
return;
}


