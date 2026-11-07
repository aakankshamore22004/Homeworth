// Draws the live front-elevation of the house from the form values.
function tree(x,G){return `<line class="ln" x1="${x}" x2="${x}" y1="${G}" y2="${G-34}"/><circle class="leaf" cx="${x}" cy="${G-48}" r="16"/>`}
function house(s){
 const G=270,fh=Math.min(62,190/s.stories),top=G-s.stories*fh,x0=190,x1=410,p=s.parking;
 let o=`<svg viewBox="0 0 600 340" role="img" aria-label="Front elevation of the house described by the form"><defs><linearGradient id="sk" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d4e6ec"/><stop offset="1" stop-color="#f6e6c8"/></linearGradient><pattern id="h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#a08a76" stroke-width="1"/></pattern></defs>`;
 o+=`<rect fill="url(#sk)" x="0" y="0" width="600" height="${G}"/><circle cx="548" cy="52" r="22" fill="#f2c867"/><ellipse cx="96" cy="66" rx="34" ry="11" fill="#fff" opacity=".85"/><ellipse cx="120" cy="58" rx="22" ry="10" fill="#fff" opacity=".85"/><ellipse cx="350" cy="44" rx="30" ry="9" fill="#fff" opacity=".8"/><rect fill="#bcd8a8" x="0" y="${G}" width="600" height="40"/><rect fill="#e3d6b8" x="0" y="${G+40}" width="600" height="30"/><text class="tx" x="10" y="20">Front elevation, redrawn as you edit</text><line class="ln" x1="0" x2="600" y1="${G}" y2="${G}"/>`;
 o+=s.mainroad
  ?`<rect class="road" x="0" y="${G+40}" width="600" height="24"/><line class="dash" x1="0" x2="600" y1="${G+52}" y2="${G+52}"/><text class="tx" x="8" y="${G+34}">Main road</text>`
  :`<line class="dash" x1="0" x2="600" y1="${G+52}" y2="${G+52}" style="stroke:#b9a984"/><text class="tx" x="8" y="${G+44}">Narrow lane</text>`;
 if(s.basement)o+=`<rect fill="#e6d3bb" x="${x0}" y="${G}" width="${x1-x0}" height="32"/><rect class="hatch" x="${x0}" y="${G}" width="${x1-x0}" height="32"/><text class="tx" x="${x0-6}" y="${G+20}" text-anchor="end">Basement</text>`;
 o+=`<rect class="wall" x="${x0}" y="${top}" width="${x1-x0}" height="${G-top}"/><rect class="roof" x="${x0-4}" y="${top-8}" width="${x1-x0+8}" height="8"/>`;
 for(let i=0;i<s.stories;i++){
  const y=G-(i+1)*fh,nb=Math.floor(s.bedrooms/s.stories)+(i<s.bedrooms%s.stories?1:0),nt=Math.floor(s.bathrooms/s.stories)+(i<s.bathrooms%s.stories?1:0),n=nb+(i===0?1:0),sw=156/Math.max(n,1);
  o+=`<rect class="fl" fill="${["#f1ddb0","#cfe0c8","#cbdde6","#f0d3c6"][i%4]}" x="${x0}" y="${y}" width="${x1-x0}" height="${fh}"/>`;
  for(let j=0;j<n;j++){
   const cx=x0+10+sw*(j+.5);
   if(i===0&&j===0){const h=Math.min(fh-6,38);o+=`<rect class="fw" x="${cx-11}" y="${G-h}" width="22" height="${h}"/><circle fill="#f2c867" cx="${cx+6}" cy="${G-h/2}" r="1.8"/>`;continue}
   const w=Math.min(26,sw-12),h=fh*.5,wx=cx-w/2,wy=y+fh*.22;
   o+=`<rect class="gl" x="${wx}" y="${wy}" width="${w}" height="${h}"/>`;
   if(s.furn!=="unfurnished")o+=`<rect class="cur" x="${wx}" y="${wy}" width="4" height="${h}"/>`;
   if(s.furn==="furnished")o+=`<rect class="cur" x="${wx+w-4}" y="${wy}" width="4" height="${h}"/>`;
  }
  for(let k=0;k<nt;k++)o+=`<rect class="gl" x="${374+(k%3)*11}" y="${y+8+Math.floor(k/3)*10}" width="7" height="6"/>`;
  if(s.airconditioning)o+=`<rect class="ac" x="374" y="${y+fh-18}" width="24" height="10"/><line class="ln" x1="377" x2="395" y1="${y+fh-13}" y2="${y+fh-13}"/>`;
 }
 if(s.hotwaterheating){const ty=top-8-18;o+=`<rect class="gl" x="250" y="${ty}" width="44" height="14" rx="7"/><line class="ln" x1="258" x2="258" y1="${ty+14}" y2="${top-8}"/><line class="ln" x1="286" x2="286" y1="${ty+14}" y2="${top-8}"/><text class="tx" x="272" y="${ty-4}" text-anchor="middle">Water heater</text>`}
 if(p){
  const pitch=Math.min(34,130/p),cw=pitch-5,c0=36,ce=c0+p*pitch+4;
  o+=`<line class="ln" x1="${c0-6}" x2="${ce}" y1="${G-48}" y2="${G-48}" stroke-width="2.6"/><line class="ln" x1="${c0-6}" x2="${c0-6}" y1="${G-48}" y2="${G}"/><line class="ln" x1="${ce}" x2="${ce}" y1="${G-48}" y2="${G}"/>`;
  for(let i=0;i<p;i++){const x=c0+i*pitch,cc=["#e3a08a","#bfd9e4","#f2d58e","#cfe3cf","#d9c4dd"][i%5];o+=`<rect class="car" fill="${cc}" x="${x}" y="${G-17}" width="${cw}" height="11" rx="3"/><rect class="car" fill="${cc}" x="${x+cw*.22}" y="${G-24}" width="${cw*.52}" height="8" rx="2"/><circle class="wheel" cx="${x+cw*.25}" cy="${G-5}" r="3.5"/><circle class="wheel" cx="${x+cw*.75}" cy="${G-5}" r="3.5"/>`}
 }else o+=tree(100,G);
 if(s.guestroom)o+=`<rect class="wall" x="414" y="${G-52}" width="110" height="52"/><rect class="roof" x="410" y="${G-58}" width="118" height="6"/><rect class="gl" x="430" y="${G-40}" width="26" height="22"/><rect class="fw" x="486" y="${G-34}" width="18" height="34"/><text class="tx" x="414" y="${G-64}">Guest room</text>`;
 else o+=tree(470,G);
 if(s.prefarea)o+=`<line class="ln" x1="557" x2="557" y1="${G-56}" y2="${G}"/><rect class="wall" x="534" y="${G-80}" width="46" height="24" rx="3"/><text class="tx" x="557" y="${G-68}" text-anchor="middle" style="font-size:8.5px">Preferred</text><text class="tx" x="557" y="${G-59}" text-anchor="middle" style="font-size:8.5px">area</text>`;
 return o+`</svg>`;
}
