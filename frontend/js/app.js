const COUNTS=[["bedrooms","Bedrooms",1,8],["bathrooms","Bathrooms",1,6],["stories","Stories",1,4],["parking","Parking spaces",0,5]];
const YN=[["mainroad","Faces the main road","Road access in front of the plot","Main road"],["guestroom","Guest room","","Guest room"],["basement","Basement","","Basement"],["hotwaterheating","Hot water heating","","Hot water"],["airconditioning","Air conditioning","","Air conditioning"],["prefarea","Preferred area","Sits in a sought-after locality","Preferred area"]];
const FURN=[["furnished","Furnished"],["semi","Semi-furnished"],["unfurnished","Unfurnished"]];
const SAMPLE={bedrooms:3,bathrooms:2,stories:3,parking:0,mainroad:1,guestroom:1,basement:0,hotwaterheating:1,airconditioning:1,prefarea:0,furn:"semi"};
let S={bedrooms:3,bathrooms:2,stories:2,parking:1,mainroad:1,guestroom:0,basement:0,hotwaterheating:0,airconditioning:0,prefarea:0,furn:"semi"};
let hasResult=false;
const $=s=>document.querySelector(s), sheet=$("#sheet");
const IC={
 bedrooms:'<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/>',
 bathrooms:'<path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 3.5-1.3M7 18l-1 2M17 18l1 2"/>',
 stories:'<path d="M4 20h5v-5h5v-5h6"/>',
 parking:'<path d="M5 16v-4l2-5h10l2 5v4M3 16h18M7 19v-3M17 19v-3"/>',
 area:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};
const stat=(k,l,res)=>`<div class="stat${res?" res":""}"><svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg><b id="v-${k}">–</b><span>${l}</span></div>`;

function seg(k,label,opts){return `<div class="seg" role="radiogroup" aria-label="${label}">`+opts.map(([v,t])=>`<label><input type="radio" name="${k}" value="${v}"><span>${t}</span></label>`).join("")+`</div>`}
function build(){
 $("#counts").innerHTML=COUNTS.map(([k,l])=>`<div class="step"><span id="l-${k}">${l}</span><div><button type="button" data-k="${k}" data-d="-1" aria-label="Fewer ${l.toLowerCase()}">−</button><output aria-labelledby="l-${k}" id="o-${k}"></output><button type="button" data-k="${k}" data-d="1" aria-label="More ${l.toLowerCase()}">+</button></div></div>`).join("");
 $("#yn").innerHTML=YN.map(([k,l,h])=>`<div class="row"><div>${l}${h?`<small>${h}</small>`:""}</div>${seg(k,l,[[1,"Yes"],[0,"No"]])}</div>`).join("");
 $("#furn").innerHTML=seg("furn","Furnishing status",FURN);
 $("#stats").innerHTML=stat("bedrooms","Bedrooms")+stat("bathrooms","Bathrooms")+stat("stories","Stories")+stat("parking","Parking")+stat("area","Area, sq.ft",1);
}
function sync(){
 COUNTS.forEach(([k])=>{$("#o-"+k).textContent=S[k];$("#v-"+k).textContent=S[k]});
 document.querySelectorAll(".seg input").forEach(i=>i.checked=String(S[i.name])===i.value);
 $("#chips").innerHTML=[...YN.filter(y=>S[y[0]]).map(y=>y[3]),FURN.find(f=>f[0]===S.furn)[1]].map(t=>`<span class="chip">${t}</span>`).join("");
 $("#draw").innerHTML=house(S);
}
function markStale(){
 if(!hasResult)return;
 sheet.classList.add("stale");
 $("#note").className="note";$("#note").textContent="Inputs changed. Estimate again to update the price and area.";
}
$("#counts").addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 const [,,lo,hi]=COUNTS.find(c=>c[0]===b.dataset.k);
 S[b.dataset.k]=Math.max(lo,Math.min(hi,S[b.dataset.k]+ +b.dataset.d));
 sync();markStale();
});
$("#form").addEventListener("change",e=>{
 const i=e.target;if(i.type!=="radio")return;
 S[i.name]=i.name==="furn"?i.value:+i.value;sync();markStale();
});
$("#sample").onclick=()=>{S={...SAMPLE};sync();markStale()};

// Column names and order match X.columns in the notebook.
function payload(s){return{bedrooms:s.bedrooms,bathrooms:s.bathrooms,stories:s.stories,mainroad:s.mainroad,guestroom:s.guestroom,basement:s.basement,hotwaterheating:s.hotwaterheating,airconditioning:s.airconditioning,parking:s.parking,prefarea:s.prefarea,"furnishingstatus_semi-furnished":+(s.furn==="semi"),"furnishingstatus_unfurnished":+(s.furn==="unfurnished")}}

async function estimate(){
 const p=payload(S);
 if(API_URL){
  const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});
  if(!r.ok)throw new Error("HTTP "+r.status);
  const d=await r.json();return{area:+d.area,price:+d.price,src:"model"};
 }
 // Real output copied from the notebook run for the sample house.
 if(JSON.stringify(p)===JSON.stringify(payload(SAMPLE)))return{area:1936.16,price:270305.13,src:"notebook"};
 // Placeholder only, until the backend is connected.
 const a=520+330*S.bedrooms+210*S.bathrooms+140*(S.stories-1)+60*S.parking+150*S.guestroom+200*S.basement+70*S.airconditioning+(S.furn==="furnished"?120:S.furn==="semi"?50:0);
 return{area:a,price:90000+95*a+20000*S.prefarea+15000*S.mainroad+12000*S.airconditioning,src:"preview"};
}

const fmt=n=>Math.round(n).toLocaleString("en-IN");
const words=n=>n>=1e7?"₹"+(n/1e7).toFixed(2)+" crore":n>=1e5?"₹"+(n/1e5).toFixed(2)+" lakh":"₹"+fmt(n);
function tween(el,to,f){
 const t0=performance.now(),d=matchMedia("(prefers-reduced-motion:reduce)").matches?0:600;
 (function step(t){const k=d?1:Math.min(1,(t-t0)/d);el.textContent=f(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)})(t0);
}
function show(r){
 hasResult=true;sheet.classList.remove("stale");
 tween($("#r-price"),r.price,n=>"₹"+fmt(n));
 tween($("#v-area"),r.area,fmt);
 $("#r-sub").textContent="About "+words(r.price)+", or ₹"+fmt(r.price/r.area)+" per sq.ft";
 const c=r.area<1000?0:r.area<2000?1:2,cat=$("#r-cat");
 cat.textContent=["Small house","Medium house","Large house"][c];cat.className="chip cat s"+c;
 document.querySelectorAll(".bar i").forEach((e,i)=>e.classList.toggle("on",i===c));
 const pin=$(".pin");pin.hidden=false;pin.style.left=Math.min(100,r.area/3000*100)+"%";
 $("#note").textContent={model:"Estimated by the trained Random Forest models.",notebook:"These are the exact values from the notebook run for this sample house.",preview:"Placeholder estimate. The trained models are not connected yet, so these figures are not real predictions."}[r.src];
 $("#note").className="note"+(r.src==="preview"?" warn":"");
}
$("#go").onclick=async()=>{
 const b=$("#go");b.disabled=true;b.textContent="Estimating…";
 try{
  show(await estimate());
  if(innerWidth<=900)sheet.scrollIntoView({behavior:"smooth"});
 }catch(e){
  $("#note").className="note bad";
  $("#note").textContent="Could not reach the prediction server at "+API_URL+". Check that it is running and allows requests from this page.";
 }finally{b.disabled=false;b.textContent="Estimate area and price"}
};

build();
sync();
