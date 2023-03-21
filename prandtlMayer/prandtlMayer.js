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

function precision( num )
{
   var digits;
   var value;

   digits = parseInt( document.getElementById( "digits" ).value );
   value = num.toPrecision( digits );

   return value;
}

// ---------------------------------------------------------------------

function scientific( num ) 
{
   var digits;
   var value;

   digits = parseInt( document.getElementById( "digits" ).value );
   value = num.toExponential( digits );

   return value;
}

// ---------------------------------------------------------------------

function transfer( from, to) 
{
   document.getElementById( to ).value = document.getElementById( from ).value;

   return true;
}

var gamma;
var M1;
var alpha;
var PM_max;

// ---------------------------------------------------------------------

function blank_output() 
{
   document.getElementById( "T2T1" ).value = "";
   document.getElementById( "p2p1" ).value = "";
   document.getElementById( "mu1"  ).value = "";
   document.getElementById( "mu2"  ).value = "";

   return true;
}

// ---------------------------------------------------------------------

function reset() 
{
   document.getElementById( "digits" ).value = 6   ;

   document.getElementById( "gamma"  ).value = 1.4 ;
   document.getElementById( "M1"     ).value = 1.0 ;

   document.getElementById( "M2"     ).value = 2.0 ;
   document.getElementById( "theta"  ).value = 10.0;

   blank_output();

   return true;
}

// ---------------------------------------------------------------------

function setvars() 
{
   gamma = parseFloat( document.getElementById( "gamma" ).value );
   M1    = parseFloat( document.getElementById( "M1"    ).value );

   if ( gamma <= 1.0 )
   {
      alert( "Ratio of specific heats, gamma, should be > 1" );
      return false;
   }

   if ( M1 < 1.0 )
   {
      alert( "M1 should be >= 1" );
      return false;
   }

   alpha = Math.sqrt( ( gamma + 1.0 ) / ( gamma - 1.0 ) );
   PM_max = ( alpha - 1.0 ) * Math.PI / 2.0;

   return true;
}

// ---------------------------------------------------------------------

function calculate_theta() 
{
   // Calculate turn angle for given Mach numbers
   var readdata;
   var M2, theta;

   readdata = setvars();
   if ( !readdata )
   {
      alert( "Unable to calculate theta" );
      return false;
   }

   M2 = parseFloat( document.getElementById( "M2" ).value );
   if ( M2 < M1 )
   {
      alert( "M2 should be >= M1" );
      return false;
   }

   theta = Prandtl_Meyer( M2 ) - Prandtl_Meyer( M1 );

   document.getElementById( "theta" ).value = precision( theta * 180.0 / Math.PI );

   ratios( M1, M2 );

   return true;
}

// ---------------------------------------------------------------------

function calculate_M2() 
{
   // Calculate downstream Mach number given the expansion angle
   var readdata;
   var M2, theta;
   var PM2;

   readdata = setvars();
   if ( !readdata )
   {
      alert( "Unable to calculate theta" );
      return false;
   }

   theta = parseFloat( document.getElementById( "theta" ).value );
   theta = theta * Math.PI / 180.0;

   PM2 = theta + Prandtl_Meyer( M1 );
   if ( PM2 < 0.0 || PM2 >= PM_max )
   {
      alert( "Unable to calculate Mach number" );
      return false;
   }

   M2 = Mach( PM2 );

   document.getElementById( "M2" ).value = precision( M2 );

   ratios( M1, M2 );

   return true;
}

// ---------------------------------------------------------------------

function ratios( M1, M2 ) 
{
   // Calculates and sets pressure and temperature ratios and Mach angles, given M1 and M2
   var T2T1, p2p1;
   var mu1, mu2;

   T2T1 = ( 1.0 + 0.5 * ( gamma - 1.0 ) * M1 * M1 ) / ( 1.0 + 0.5 * ( gamma - 1.0 ) * M2 * M2 );
   p2p1 = Math.pow( T2T1, gamma / ( gamma - 1.0 ) );
   mu1 = Math.asin( 1.0 / M1 ) * 180.0 / Math.PI;
   mu2 = Math.asin( 1.0 / M2 ) * 180.0 / Math.PI;

   document.getElementById( "T2T1" ).value = precision( T2T1 );
   document.getElementById( "p2p1" ).value = precision( p2p1 );
   document.getElementById( "mu1"  ).value = precision( mu1  );
   document.getElementById( "mu2"  ).value = precision( mu2  );

   return true;
}

// ---------------------------------------------------------------------

function Prandtl_Meyer( M ) 
{
   // Returns Prandtl-Meyer function for given Mach number M
   var PM;
   var x;

   x = Math.sqrt( M * M - 1.0 );
   PM = alpha * Math.atan( x / alpha ) - Math.atan( x );

   return PM;
}

// ---------------------------------------------------------------------


function Mach( PM ) 
{
   // Calculate Mach number for given Prandtl-Meyer function PM
   var x1, x2, x;
   var f1, f2, f;
   var tolerance = 1.0e-6;

   x1 = 1.0;
   x2 = 1.0;
   f1 = Prandtl_Meyer( x1 );
   f2 = f1;
   do 
   {
      x1 = x2;
      f1 = f2;
      x2 = x2 * 2.0;
      f2 = Prandtl_Meyer( x2 );
   } while ( f2 < PM );

   do 
   {
      x = x1 + ( x2 - x1 ) * ( PM - f1 ) / ( f2 - f1 );
      f = Prandtl_Meyer( x );
      if ( ( PM - f ) * ( PM - f1 ) > 0.0 )
      {
         x1 = x;
         f1 = f;
      }
      else 
      {
         x2 = x;
         f2 = f;
      }
   } while ( Math.abs( PM - f ) > tolerance );

   return x;
}

// ---------------------------------------------------------------------
