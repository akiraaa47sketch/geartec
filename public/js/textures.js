/* Texturas procedurais (canvas) e materiais */
/* ===== TEXTURAS PROCEDURAIS (canvas): sem arquivos externos ===== */
const MC={},TC={};
function seedR(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function ctex(w,h,draw,rx,ry){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx||1,ry||1);t.anisotropy=4;return t}
function stains(x,w,h,r,n,col,a,r0,r1){for(let i=0;i<n;i++){const gx=r()*w,gy=r()*h,rad=r0+r()*(r1-r0),g=x.createRadialGradient(gx,gy,0,gx,gy,rad);g.addColorStop(0,'rgba('+col+','+a+')');g.addColorStop(1,'rgba('+col+',0)');x.fillStyle=g;x.fillRect(gx-rad,gy-rad,rad*2,rad*2)}}
function specks(x,w,h,r,n,lo,hi,a){for(let i=0;i<n;i++){const v=lo+r()*(hi-lo)|0;x.fillStyle='rgba('+v+','+v+','+v+','+a+')';x.fillRect(r()*w,r()*h,1+r()*2,1+r()*2)}}
const TXD={
 con:(x,w,h)=>{const r=seedR(11);x.fillStyle='#cfcdc8';x.fillRect(0,0,w,h);specks(x,w,h,r,6000,120,245,.35);stains(x,w,h,r,16,'70,64,58',.2,20,60);
  x.strokeStyle='rgba(50,47,44,.55)';x.lineWidth=2;x.strokeRect(1,1,w-2,h-2);x.lineWidth=1;for(let i=0;i<4;i++){x.beginPath();let px=r()*w,py=r()*h;x.moveTo(px,py);for(let k=0;k<6;k++){px+=(r()-.5)*40;py+=(r()-.3)*40;x.lineTo(px,py)}x.stroke()}},
 brick:(x,w,h)=>{const r=seedR(23);x.fillStyle='#8c8c8c';x.fillRect(0,0,w,h);const bh=32,bw=64;for(let j=0;j<h/bh;j++)for(let i=-1;i<w/bw+1;i++){const ox=(j%2)*bw/2,v=185+r()*55|0;x.fillStyle='rgb('+v+','+(v-8)+','+(v-14)+')';x.fillRect(i*bw+ox+2,j*bh+2,bw-4,bh-4)}specks(x,w,h,r,3000,90,230,.25);stains(x,w,h,r,10,'40,36,32',.22,25,70)},
 metal:(x,w,h)=>{const r=seedR(37);x.fillStyle='#c4c9cd';x.fillRect(0,0,w,h);specks(x,w,h,r,4000,150,250,.3);x.strokeStyle='rgba(40,44,48,.6)';x.lineWidth=2;x.strokeRect(1,1,w-2,h-2);x.beginPath();x.moveTo(w/2,0);x.lineTo(w/2,h);x.moveTo(0,h/2);x.lineTo(w,h/2);x.stroke();
  x.fillStyle='rgba(60,64,68,.8)';for(const p of[[10,10],[w-10,10],[10,h-10],[w-10,h-10],[w/2-8,10],[w/2+8,h-10],[10,h/2+8],[w-10,h/2-8]])x.fillRect(p[0]-2,p[1]-2,4,4);
  stains(x,w,h,r,9,'150,80,40',.25,15,45);x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=1;for(let i=0;i<30;i++){const px=r()*w,py=r()*h;x.beginPath();x.moveTo(px,py);x.lineTo(px+(r()-.5)*30,py+(r()-.5)*30);x.stroke()}},
 wood:(x,w,h)=>{const r=seedR(41);for(let i=0;i<6;i++){const v=170+r()*50|0;x.fillStyle='rgb('+v+','+(v-30)+','+(v-70)+')';x.fillRect(i*w/6,0,w/6,h);x.fillStyle='rgba(60,35,15,.35)';x.fillRect(i*w/6,0,2,h)}
  x.strokeStyle='rgba(70,40,15,.25)';for(let i=0;i<120;i++){const px=r()*w;x.beginPath();x.moveTo(px,0);x.lineTo(px+(r()-.5)*6,h);x.stroke()}x.fillStyle='rgba(50,50,50,.5)';x.fillRect(0,0,w,3);x.fillRect(0,h-3,w,3)},
 floor:(x,w,h)=>{const r=seedR(53);x.fillStyle='#b8b8b4';x.fillRect(0,0,w,h);specks(x,w,h,r,9000,110,235,.3);stains(x,w,h,r,12,'30,28,26',.22,25,70);x.strokeStyle='rgba(30,30,28,.6)';x.lineWidth=3;x.strokeRect(0,0,w,h);x.lineWidth=1;x.beginPath();x.moveTo(w/2,0);x.lineTo(w/2,h);x.moveTo(0,h/2);x.lineTo(w,h/2);x.stroke()},
 armor:(x,w,h)=>{const r=seedR(67);x.fillStyle='#d2d2d2';x.fillRect(0,0,w,h);specks(x,w,h,r,2500,120,250,.3);x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=2;x.strokeRect(3,3,w-6,h-6);x.strokeRect(10,10,w-20,h-20);stains(x,w,h,r,6,'40,40,40',.2,10,30)},
 fac:(x,w,h)=>{const r=seedR(91);x.fillStyle='#d9cfbb';x.fillRect(0,0,w,h);specks(x,w,h,r,3500,150,235,.25);stains(x,w,h,r,8,'90,75,55',.18,20,60);x.fillStyle='#8a7d68';x.fillRect(0,h-14,w,14);x.fillRect(0,0,w,8);
  x.fillStyle='#3b4a58';x.beginPath();x.moveTo(78,205);x.lineTo(78,95);x.arc(128,95,50,Math.PI,0);x.lineTo(178,205);x.fill();x.strokeStyle='#6f6350';x.lineWidth=7;x.stroke();x.fillStyle='rgba(255,255,255,.18)';x.fillRect(86,90,38,70);x.fillStyle='#8a7d68';x.fillRect(66,205,124,12);x.fillStyle='#5a5042';x.fillRect(125,45,6,160)},
 clk:(x,w,h)=>{x.fillStyle='#e9e2cf';x.fillRect(0,0,w,h);x.strokeStyle='#2a2a2a';x.lineWidth=14;x.beginPath();x.arc(128,128,118,0,6.3);x.stroke();x.lineWidth=4;for(let i=0;i<12;i++){const a=i*Math.PI/6;x.beginPath();x.moveTo(128+Math.sin(a)*95,128-Math.cos(a)*95);x.lineTo(128+Math.sin(a)*108,128-Math.cos(a)*108);x.stroke()}
  x.lineWidth=9;x.beginPath();x.moveTo(128,128);x.lineTo(128+Math.sin(-1.05)*60,128-Math.cos(-1.05)*60);x.stroke();x.lineWidth=6;x.beginPath();x.moveTo(128,128);x.lineTo(128+Math.sin(.9)*88,128-Math.cos(.9)*88);x.stroke()},
 bag:(x,w,h)=>{const r=seedR(17);x.fillStyle='#cfbb93';x.fillRect(0,0,w,h);for(let i=0;i<h;i+=4){x.fillStyle='rgba(90,70,40,.13)';x.fillRect(0,i,w,1.5)}for(let i=0;i<w;i+=4){x.fillStyle='rgba(90,70,40,.1)';x.fillRect(i,0,1.5,h)}
  specks(x,w,h,r,2500,90,200,.25);stains(x,w,h,r,10,'70,55,35',.25,15,50);x.strokeStyle='rgba(60,45,25,.55)';x.lineWidth=3;x.beginPath();x.moveTo(0,h*.5);x.lineTo(w,h*.5);x.stroke();x.setLineDash([6,6]);x.lineWidth=2;x.beginPath();x.moveTo(w*.08,0);x.lineTo(w*.08,h);x.stroke()},
 bar:(x,w,h)=>{const r=seedR(29);x.fillStyle='#cbc7be';x.fillRect(0,0,w,h);specks(x,w,h,r,6000,110,240,.32);stains(x,w,h,r,14,'60,56,50',.2,20,60);const g=x.createLinearGradient(0,h*.7,0,h);g.addColorStop(0,'rgba(60,50,40,0)');g.addColorStop(1,'rgba(60,50,40,.35)');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.strokeStyle='rgba(50,47,44,.35)';x.lineWidth=1;for(let i=0;i<3;i++){x.beginPath();let px=r()*w,py=r()*h;x.moveTo(px,py);for(let k=0;k<5;k++){px+=(r()-.5)*30;py+=(r()-.3)*30;x.lineTo(px,py)}x.stroke()}},
 camo:(x,w,h)=>{const r=seedR(79);x.fillStyle='#d0d0d0';x.fillRect(0,0,w,h);const cs=['rgba(120,120,120,.55)','rgba(160,160,160,.55)','rgba(90,90,90,.5)'];for(let i=0;i<60;i++){x.fillStyle=cs[i%3];x.beginPath();x.ellipse(r()*w,r()*h,6+r()*16,4+r()*10,r()*3,0,6.28);x.fill()}specks(x,w,h,r,600,100,240,.3)}
};
const MT=(c,k)=>{const key=c+':'+(k||'');return MC[key]||(MC[key]=new T.MeshLambertMaterial(k?{color:c,map:TC[k]||(TC[k]=ctex(256,256,TXD[k]))}:{color:c}))};
fl.material=new T.MeshLambertMaterial({color:0xa0a294,map:ctex(256,256,TXD.floor,20,20)});
function box(x,z,w,d,h,c,y0=0){const tt=y0?'metal':(h>=4&&Math.max(w,d)>20)?'brick':(h<=1.05&&w==d)?'wood':(h>1.5&&h<2.4&&w>=2&&d>=2)?'metal':'con',cc=tt=='brick'?0x7a7268:tt=='wood'?0xc8a070:c;
 const hh=h-y0,gg=new T.BoxGeometry(w,hh,d),uv=gg.attributes.uv;for(let i=0;i<24;i++){const fc=i>>2,a=fc<2?d:w,b=fc<2?hh:(fc<4?d:hh);uv.setXY(i,uv.getX(i)*a/3,uv.getY(i)*b/3)}
 const m=new T.Mesh(gg,MT(cc,tt));m.position.set(x,y0+hh/2,z);m.castShadow=m.receiveShadow=true;sc.add(m);solids.push({x,z,w,d,h,y0});sm.push(m)}
box(0,-A,2*A+2,1,4,0x4a4640);box(0,A,2*A+2,1,4,0x4a4640);box(-A,0,1,2*A+2,4,0x4a4640);box(A,0,1,2*A+2,4,0x4a4640);
[[-6,14,5,1],[6,14,5,1],[0,8,1,5],[-11,4,1,6],[11,4,1,6],[-4,0,4,1],[4,0,4,1]].forEach(([x,z,w,d])=>{box(x,z,w,d,1.32,0x8a8478);if(z)box(x,-z,w,d,1.32,0x8a8478)});
box(-9,8,1.5,1.5,4,0x5a554c);box(9,-8,1.5,1.5,4,0x5a554c);
box(-14,-8,2,2,1,0x6b6556);box(14,8,2,2,1,0x6b6556); // caixotes baixos: vault (F)
box(0,-12,5,2.4,1.6,0x55606a);box(0,12,5,2.4,1.6,0x55606a); // 'veículos': mantle (F)
box(14,-1,2,2,2.2,0x4d4a44); // bloco alto: mantle
box(-13,3,6,1,1.8,0x7a6a4a,.95); // viga baixa: só passa deslizando (C)
