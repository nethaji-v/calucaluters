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

function nsr(form)
{
  i=form.i.selectedIndex
  g=eval(form.g.value)
  v=eval(form.v.value)
  if(g<=1.0)
  {
    form.m1.value=""
    form.m2.value=""
    form.p02p01.value=""
    form.p1p02.value=""
    form.p2p1.value=""
    form.r2r1.value=""
    form.t2t1.value=""
    alert("gamma must be greater than 1")
    return
  }

  if(i==1)
  {
    if(v>=1.0 || v<=Math.sqrt((g-1.)/2./g))
    {
      form.m1.value=""
      form.m2.value=""
      form.p02p01.value=""
      form.p1p02.value=""
      form.p2p1.value=""
      form.r2r1.value=""
      form.t2t1.value=""
      alert("M2 must be between "+ format(""+Math.sqrt((g-1.)/2./g))+" and 1")
      return
    }
    m1=m2(g,v)
  }
  else if(i==2)
  {
    if(v<=1.0)
    {
      form.m1.value=""
      form.m2.value=""
      form.p02p01.value=""
      form.p1p02.value=""
      form.p2p1.value=""
      form.r2r1.value=""
      form.t2t1.value=""
      alert("p2/p1 must be greater than 1")
      return
    }
    m1=Math.sqrt((v-1.)*(g+1.)/2./g +1.)
  }
  else if(i==3)
  {
    if(v<=1.0 || v>=(g+1.)/(g-1.))
    {
      form.m1.value=""
      form.m2.value=""
      form.p02p01.value=""
      form.p1p02.value=""
      form.p2p1.value=""
      form.r2r1.value=""
      form.t2t1.value=""
      alert("rho2/rho1 must be between 1 and "+format(""+((g+1.)/(g-1.))))
      return
    }
    m1=Math.sqrt(2.*v/(g+1.-v*(g-1.)))
  }
  else if(i==4)
  {
    if(v<=1.0) 
    {
      form.m1.value=""
      form.m2.value=""
      form.p02p01.value=""
      form.p1p02.value=""
      form.p2p1.value=""
      form.r2r1.value=""
      form.t2t1.value=""
      alert("T2/T1 must be greater than 1")
      return
    }
    aa=2.*g*(g-1.)
    bb=4.*g-(g-1.)*(g-1.)-v*(g+1.)*(g+1.)
    cc=-2.*(g-1.)
    m1=Math.sqrt((-bb+Math.sqrt(bb*bb-4.*aa*cc))/2./aa)
  }
  else if(i==5)
  {
    if(v>=1.0 || v<=0.0)
    {
      form.m1.value=""
      form.m2.value=""
      form.p02p01.value=""
      form.p1p02.value=""
      form.p2p1.value=""
      form.r2r1.value=""
      form.t2t1.value=""
      alert("p02/p01 must be between 0 and 1")
      return
    }
    mnew=2.0
    m1=0.0
    while( Math.abs(mnew-m1) > 0.00001)
    {
      m1=mnew
      al=(g+1.)*m1*m1/((g-1.)*m1*m1+2.)
      be=(g+1.)/(2.*g*m1*m1-(g-1.))
      daldm1=(2./m1-2.*m1*(g-1.)/((g-1.)*m1*m1+2.))*al
      dbedm1=-4.*g*m1*be/(2.*g*m1*m1-(g-1.))
      fm=Math.pow(al,g/(g-1.))*Math.pow(be,1./(g-1.))-v
      fdm=g/(g-1.)*Math.pow(al,1/(g-1.))*daldm1*Math.pow(be,1./(g-1.))+Math.pow(al,g/(g-1.))/(g-1.)*Math.pow(be,(2.-g)/(g-1.))*dbedm1
      mnew=m1-fm/fdm
    }
  }
  else if(i==6)
  {
    vmax=Math.pow((g+1.)/2.,-g/(g-1.))
    if(v>=vmax || v<=0.0)
    {
      form.m1.value=""
      form.m2.value=""
      form.p02p01.value=""
      form.p1p02.value=""
      form.p2p1.value=""
      form.r2r1.value=""
      form.t2t1.value=""
      alert("p1/p02 must be between 0 and "+format(""+vmax))
      return
    }
    mnew=2.0
    m1=0.0
    while( Math.abs(mnew-m1) > 0.00001)
    {
      m1=mnew
      al=(g+1.)*m1*m1/2.
      be=(g+1.)/(2.*g*m1*m1-(g-1.))
      daldm1=m1*(g+1.)
      dbedm1=-4.*g*m1*be/(2.*g*m1*m1-(g-1.))
      fm=Math.pow(al,g/(g-1.))*Math.pow(be,1./(g-1.))-1./v
      fdm=g/(g-1.)*Math.pow(al,1/(g-1.))*daldm1*Math.pow(be,1./(g-1.))+Math.pow(al,g/(g-1.))/(g-1.)*Math.pow(be,(2.-g)/(g-1.))*dbedm1
      mnew=m1-fm/fdm
    }
  }  
  else
  {
    if(v<=1.0)
    {
      form.m1.value=""
      form.m2.value=""
      form.p02p01.value=""
      form.p1p02.value=""
      form.p2p1.value=""
      form.r2r1.value=""
      form.t2t1.value=""
      alert("M1 must be greater than 1")
      return
    }
    m1=v
  }
  form.m1.value=format(""+m1)
  form.m2.value=format(""+m2(g,m1))
  p2p1=1.+2.*g/(g+1.)*(m1*m1-1.)
  form.p2p1.value = format(""+p2p1)
  p02p01=pp0(g,m1)/pp0(g,m2(g,m1))*p2p1
  form.p02p01.value=format(""+p02p01)
  form.r2r1.value=format(""+rr0(g,m2(g,m1))/rr0(g,m1)*p02p01)
  form.t2t1.value=format(""+tt0(g,m2(g,m1))/tt0(g,m1))
  form.p1p02.value=format(""+pp0(g,m1)/p02p01)
}

function tt0(g,m)
{
   return Math.pow((1.+(g-1.)/2.*m*m),-1.)
}

function pp0(g,m)
{
   return Math.pow((1.+(g-1.)/2.*m*m),-g/(g-1.))
}

function rr0(g,m)
{
   return Math.pow((1.+(g-1.)/2.*m*m),-1./(g-1.))
}

function tts(g,m)
{
   return tt0(g,m)*(g/2. + .5)
}

function pps(g,m)
{
   return pp0(g,m)*Math.pow((g/2. + .5),g/(g-1.))
}

function rrs(g,m)
{
   return rr0(g,m)*Math.pow((g/2. + .5),1./(g-1.))
}

function aas(g,m)
{
   return 1./rrs(g,m)*Math.sqrt(1./tts(g,m))/m
}

function nu(g,m)
{
   n=Math.sqrt((g + 1.) / (g - 1.)) * Math.atan(Math.sqrt((g - 1.) / (g + 1.) * (m * m - 1.)))
   n=n - Math.atan(Math.sqrt(m * m - 1.))
   n=n*180./3.14159265359
   return n
}

function m2(g,m1)
{
   return Math.sqrt((1. + .5 * (g - 1.) * m1 * m1) / (g * m1 * m1 - .5 * (g - 1.)))
}

function mdb(g,m1,d,i)
{
  p=-(m1*m1+2.)/m1/m1-g*Math.sin(d)*Math.sin(d)
  q=(2.*m1*m1+1.)/Math.pow(m1,4.)+((g+1.)*(g+1.)/4.+(g-1.)/m1/m1)*Math.sin(d)*Math.sin(d)
  r=-Math.cos(d)*Math.cos(d)/Math.pow(m1,4.)
  a=(3.*q-p*p)/3.
  b=(2.*p*p*p-9.*p*q+27.*r)/27.
  test=b*b/4.+a*a*a/27.
  if(test>0.0) {return -1.0}
  else
  {
    if(test==0.0)
    {
      x1=Math.sqrt(-a/3.)
      x2=x1
      x3=2.*x1
      if(b>0.0)
      {
        x1*=-1.
        x2*=-1.
        x3*=-1.
      }
    }
    if(test<0.0)
    {
      phi=Math.acos(Math.sqrt(-27.*b*b/4./a/a/a))
      x1=2.*Math.sqrt(-a/3.)*Math.cos(phi/3.) 
      x2=2.*Math.sqrt(-a/3.)*Math.cos(phi/3.+3.14159265359*2./3.)
      x3=2.*Math.sqrt(-a/3.)*Math.cos(phi/3.+3.14159265359*4./3.)  
      if(b>0.0)
      {
        x1*=-1.
        x2*=-1.
        x3*=-1.
      }
    }
    s1=x1-p/3.
    s2=x2-p/3.
    s3=x3-p/3.
    if(s1<s2 && s1<s3)
    {
      t1=s2
      t2=s3
    }
    else if(s2<s1 && s2<s3)
    {
      t1=s1
      t2=s3
    }
    else
    {
      t1=s1
      t2=s2
    }
    b1=Math.asin(Math.sqrt(t1))
    b2=Math.asin(Math.sqrt(t2))
    betas=b1
    betaw=b2
    if(b2>b1)
    {
      betas=b2
      betaw=b1
    }
    if(i==0) {return betaw}
    if(i==1) {return betas}
  }
}

function mbd(g,m1,b)
{
   return Math.atan((m1*m1*Math.sin(2.*b)-2./Math.tan(b))/(2.+m1*m1*(g+Math.cos(2.*b))))
}

function format(s)
{
  val=eval(s)
  if(Math.abs(val)<1.0e+6 && Math.abs(val)>1.0e-5)
  {
     if(val>0.0) return " "+s.substring(0,10)     // Medium size numbers w/o exponents
     else return s.substring(0,11)
  }
  ie=s.indexOf("e")                               // Numbers with exponents
  if(ie>0)
  {
    mant=s.substring(0,ie)
    if(val>=0.0) mant=" "+mant
    if(mant.length>8) mant=mant.substring(0,8)
    if(Math.abs(val)>1.0) mant=mant+"e+"
    else if(Math.abs(val)<1.0) mant=mant+"e-"
  }
  else if(Math.abs(val)>=1.0e+6)                  // Large numbers w/o exponents
  {
    if(val>0) mant=" "+s.substring(0,1)+"."+s.substring(1,6)+"e+"
    else mant=s.substring(0,2)+"."+s.substring(1,6)+"e+"
  }
  else if(Math.abs(val)<=1.0e-5)                  // Small numbers w/o exponents
  {
    ip=s.indexOf(".") 
    t=s.substring(ip+1,s.length)
    ix=1
    while(t.substring(0,1)=="0")
    {
      t=t.substring(1,t.length)
      ix++
    }
    if(val>0) mant=" "+t.substring(0,1)+"."+t.substring(1,6)+"e-"
    else mant=s.substring(0,2)+"."+t.substring(1,6)+"e-"
  }
  xpo=Math.abs(Math.floor(Math.log(Math.abs(val))/Math.log(10.0)))
  xpos=""+xpo
  if(xpo<10) return mant+"00"+xpos
  if(xpo<100) return mant+"0"+xpos
  return mant+xpos
}