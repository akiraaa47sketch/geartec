/* Armas, skins e modelo procedural do personagem */
const W=[{n:'FUZIL',rate:.095,dmg:9,pel:1,spr:.014,mag:30,rl:2.2,rng:70,c:0xffd070,az:.46,aw:.15,ap:.045},{n:'ESCOPETA',rate:.85,dmg:0,pel:8,spr:.07,mag:6,rl:2,rng:16,c:0xffffff,az:.66,aw:.1,ap:.034}];
const LP={skin:0xd8a47f,hair:0x3b2a1c,helmet:false,beard:false,pants:0x5c6a58},LB={skin:0xb98562,hair:0x1c1612,helmet:true,beard:true,pants:0x6a5a52,ar:2,sh:1,kn:1,bk:1,bc:0x2a2a2a};
Object.assign(LP,{hs:1,hg:0,band:0,bc:0xd4351c,gl:0,eye:0x5a3a22,beard:0,ac:0x3a6ea5,ar:0,sh:0,kn:0,bk:0});const SKD=Object.assign({},LP);
try{Object.assign(LP,JSON.parse(localStorage.getItem('arenax1.skin')||'{}'))}catch(e){}
const saveSk=()=>{try{localStorage.setItem('arenax1.skin',JSON.stringify(LP))}catch(e){}};
let _hg;function headGeo(){if(_hg)return _hg;const g=new T.SphereGeometry(.19,40,30),p=g.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const t=y/.19;
 if(t<0){x*=1+t*.3;z*=z>0?1+t*.12:1+t*.04;if(t<-.45&&z<0)z-=(-t-.45)*.05}
 x*=1+.05*Math.exp(-Math.pow((t+.15)/.4,2));if(t>.1&&z<0)z*=1.04;if(t>.15&&t<.4&&z<-.1)z-=.008;
 p.setXYZ(i,x*.92,y*1.08,z)}g.computeVertexNormals();return _hg=g}
function mk(col,L){const g=new T.Group(),mat=MT,
 sp=(r,c,x,y,z,p,sx=1,sy=1,sz=1,k)=>{const m=new T.Mesh(new T.SphereGeometry(r,22,14),mat(c,k));m.position.set(x,y,z);m.scale.set(sx,sy,sz);p.add(m);return m},
 cy=(r1,r2,h,c,x,y,z,p,k)=>{const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,18),mat(c,k));m.position.set(x,y,z);p.add(m);return m},
 bx=(w,h,d,c,x,y,z,p,k)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c,k));m.position.set(x,y,z);p.add(m);return m},
 gr=(x,y,z,p)=>{const o=new T.Group();o.position.set(x,y,z);p.add(o);return o},
 lathe=(pts,seg)=>new T.LatheGeometry(pts.map(q=>new T.Vector2(q[0],q[1])),seg||20),
 capG=(r1,r2,Ln)=>{const q=[];for(let i=0;i<=6;i++){const an=-Math.PI/2+i*Math.PI/12;q.push([Math.max(0,r2*Math.cos(an)),-Ln/2+r2*Math.sin(an)])}for(let i=0;i<=6;i++){const an=i*Math.PI/12;q.push([Math.max(0,r1*Math.cos(an)),Ln/2+r1*Math.sin(an)])}return lathe(q,20)},
 cap=(r1,r2,Ln,c,x,y,z,p,k)=>{const m=new T.Mesh(capG(r1,r2,Ln),mat(c,k));m.position.set(x,y,z);p.add(m);return m},
 capb=(a,b,r1,r2,c,p,k)=>{const A=new T.Vector3(...a),B=new T.Vector3(...b),d=B.clone().sub(A),Ln=Math.max(.02,d.length()-(r1+r2)*.9),m=new T.Mesh(capG(r1,r2,Ln),mat(c,k));m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());p.add(m)};
const GR=0x3a3d3a,SK=L.skin,PT=L.pants,BT=0x2a2119,GL=0x141414,HM=!!(L.helmet||L.hg==3),HS=L.hs===undefined?1:L.hs;
const piv=gr(0,1,0,g),rig=gr(0,.05,0,piv);g.piv=piv;g.rig=rig;
sp(.3,PT,0,-.02,0,rig,1.15,.7,.85,'camo');
g.lT=[];g.lK=[];g.ft=[];
[-1,1].forEach(s=>{const th=gr(s*.2,-.05,0,rig),kn=gr(0,-.46,0,th);
 sp(.15,PT,0,0,0,th,1,1,1,'camo');capb([0,0,0],[0,-.46,0],.15,.125,PT,th,'camo');if(s>0)bx(.07,.22,.1,0x1c1c1c,.15,-.2,0,th);
 capb([0,0,0],[0,-.46,0],.125,.1,PT,kn,'camo');sp(.105,GR,0,0,-.12,kn,1,1.1,.55,'armor');
 sp(.16,PT,0,-.22,-.015,th,1,1.4,1.1,'camo');sp(.12,PT,0,-.14,.03,kn,1,1.5,1.1,'camo');const ft=gr(0,-.46,0,kn);cy(.12,.125,.16,BT,0,.12,0,ft);cy(.13,.13,.03,0x1a1a1a,0,.2,0,ft);cap(.105,.1,.1,BT,0,.05,0,ft);sp(.1,BT,0,-.04,-.1,ft,1,.62,1.9);sp(.1,0x0e0e0e,0,-.078,-.1,ft,1.03,.26,1.95);
 g.lT.push(th);g.lK.push(kn);g.ft.push(ft)});
const ch=gr(0,.1,0,rig);g.ch=ch;
/* torso: perfil com cintura, peito e ombros (lathe achatado) */
const tor=new T.Mesh(lathe([[0,-.06],[.2,-.05],[.26,.04],[.29,.16],[.34,.3],[.41,.44],[.46,.56],[.45,.64],[.34,.71],[.16,.755],[0,.77]],28),mat(col,'armor'));tor.scale.set(1,1,.7);ch.add(tor);g.chest=tor;g.cb=[1,1,.7];
sp(.3,GR,0,.42,-.26,ch,1,.85,.3,'armor');[-.17,0,.17].forEach(px=>bx(.13,.15,.07,0x1d1f1c,px,.1,-.23,ch));
sp(.25,0x23251f,0,.4,.3,ch,.8,.85,.4,'camo');
sp(.26,PT,0,.02,0,ch,1.3,.6,.9,'camo');const belt=cy(.33,.33,.07,0x1e1a14,0,.03,0,ch);belt.scale.set(.95,1,.7);
[-1,1].forEach(s=>{const pd=gr(s*.5,.6,0,ch);pd.rotation.z=-s*.32; // ombreiras em camadas (domo + 2 lâminas)
 const dm=new T.Mesh(new T.SphereGeometry(.2,20,10,0,Math.PI*2,0,Math.PI*.5),mat(col,'armor'));dm.scale.set(1.1,.7,1.15);pd.add(dm);
 for(let i=0;i<2;i++){const l=new T.Mesh(new T.CylinderGeometry(.215+i*.012,.228+i*.014,.065,20),mat(i?GR:col,'armor'));l.position.y=-.03-i*.065;l.scale.set(1.1,1,1.15);pd.add(l)}
 bx(.06,.025,.2,GR,s*.07,.13,0,pd)});
/* placas do peito e do abdômen */
[-1,1].forEach(s=>sp(.19,col,s*.15,.47,-.205,ch,1.05,.78,.38,'armor'));bx(.05,.3,.06,GR,0,.44,-.27,ch,'armor');[.2,.27].forEach((y,i)=>bx(.3-i*.04,.06,.05,GR,0,y,-.235,ch,'armor'));
cap(.095,.115,.1,SK,0,.75,0,ch);[-1,1].forEach(s=>sp(.16,col,s*.24,.7,.02,ch,1.5,.5,1.1,'armor'));cy(.14,.17,.06,GR,0,.69,0,ch,'armor');
/* cabeça: rosto com olhos, sobrancelhas, nariz, boca, orelhas, cabelo/capacete */
const hd=gr(0,.86,0,ch);g.hd=hd;
const hm=new T.Mesh(headGeo(),mat(SK));hd.add(hm);
if(L.beard){sp(.12,L.hair,0,-.1,-.05,hd,.98,.75,.95);sp(.05,L.hair,0,-.06,-.17,hd,1.8,.25,.4)}
const lip=new T.Color(SK).multiplyScalar(.75).lerp(new T.Color(0x9a3b3b),.35).getHex();
sp(.022,SK,0,.015,-.18,hd,.8,2.2,1);sp(.032,SK,0,-.035,-.19,hd,1,.85,1);[-1,1].forEach(s=>sp(.018,SK,s*.024,-.04,-.177,hd,1,.8,1));
sp(.04,lip,0,-.084,-.172,hd,1.4,.32,.5);sp(.04,lip,0,-.106,-.168,hd,1.25,.4,.55);
[-1,1].forEach(s=>{sp(.04,SK,s*.178,-.01,.02,hd,.45,1.1,.8);sp(.022,lip,s*.172,-.01,.0,hd,.3,.8,.5);sp(.03,0xf4f1ea,s*.07,.035,-.165,hd,1,.75,.55);sp(.016,L.eye||0x5a3a22,s*.07,.035,-.18,hd,1,1,.5);sp(.008,0x050505,s*.07,.035,-.186,hd,1,1,.4);sp(.031,SK,s*.07,.052,-.168,hd,1.05,.35,.55);bx(.075,.017,.025,L.hair,s*.07,.09,-.17,hd).rotation.z=-s*.14});

const hc=new T.Mesh(new T.SphereGeometry(HM?.22:.205,28,18,0,Math.PI*2,0,Math.PI*(HM?.4:.34)),mat(HM?0x3a3d3a:L.hair,HM?'armor':null));hc.position.set(0,HM?.0:.012,.01);hc.scale.set(.95,1.08,1.03);if(HM||HS)hd.add(hc);
if(!HM){if(HS)sp(.17,L.hair,0,-.02,.075,hd,1,1.05,.9);[-1,1].forEach(s=>{const e=cy(.05,.05,.03,0x222222,s*.19,0,.01,hd);e.rotation.z=Math.PI/2})}
const arm=gr(0,.5,0,ch);g.arm=arm;
const gun=gr(.1,-.12,-.7,arm);g.gun=gun;
const gL=gr(0,0,0,gun),gN=gr(0,0,0,gun);g.gL=gL;g.gN=gN;
const rx=(m,a)=>{m.rotation.x=a;return m},M1=0x24272a,M2=0x15171a,M3=0x3b3f43,MTL=0x8d9399,OR=0xd4351c,WD=0x5a3a22;
/* FUZIL: receptor, trilho com mira, guarda-mão, cano com quebra-chama, carregador, empunhadura, coronha e serra */
bx(.1,.15,.62,M1,0,0,.08,gL);bx(.104,.035,.22,OR,0,.03,.1,gL);
bx(.07,.05,.46,M2,0,.1,-.02,gL);bx(.05,.065,.13,0x0d0f10,0,.15,-.12,gL);bx(.04,.04,.02,0xb02020,0,.15,-.19,gL);
bx(.115,.12,.44,M3,0,-.015,-.4,gL);bx(.118,.02,.44,M2,0,.045,-.4,gL);
cy(.022,.022,.34,MTL,0,.01,-.78,gL).rotation.x=Math.PI/2;bx(.05,.05,.08,M2,0,.01,-.97,gL);
rx(bx(.07,.26,.1,M2,0,-.2,-.05,gL),.18);rx(bx(.06,.18,.07,M2,0,-.15,.12,gL),-.3);
bx(.09,.14,.28,M1,0,-.02,.52,gL);bx(.1,.17,.04,M2,0,-.02,.67,gL);
bx(.03,.05,.2,M2,0,-.09,-.72,gL);rx(bx(.012,.06,.3,MTL,0,-.1,-.98,gL),.06);
/* ESCOPETA: cano curto e grosso, tubo, pump de madeira, protetor de calor, coronha de madeira */
bx(.12,.17,.46,0x2c2a28,0,0,.1,gN);bx(.124,.03,.18,OR,0,.04,.08,gN);
cy(.042,.042,.62,M3,0,.03,-.45,gN).rotation.x=Math.PI/2;cy(.03,.03,.5,MTL,0,-.04,-.4,gN).rotation.x=Math.PI/2;
cy(.06,.047,.07,M2,0,.03,-.78,gN).rotation.x=Math.PI/2;bx(.02,.04,.02,M2,0,.085,-.72,gN);bx(.07,.015,.36,MTL,0,.082,-.4,gN);
bx(.11,.09,.24,WD,0,-.03,-.22,gN);bx(.115,.02,.24,M2,0,-.078,-.22,gN);
rx(bx(.085,.17,.3,WD,0,-.04,.46,gN),.06);bx(.09,.19,.03,M2,0,-.04,.62,gN);rx(bx(.06,.17,.07,M2,0,-.15,.14,gN),-.25);
const mzG=gr(0,0,-1.05,gun);g.mz=mzG;mzG.visible=false;[[.07,0xffe9a0],[.12,0xff9a30]].forEach(([r,c])=>{const m=new T.Mesh(new T.SphereGeometry(r,8,6),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.85}));m.scale.z=1.8;mzG.add(m)});
[[[.5,.08,0],[.44,-.2,-.25],[.16,-.12,-.58]],[[-.5,.08,0],[-.42,-.24,-.3],[-.02,-.1,-.9]]].forEach(([S,E,H])=>{
 capb(S,E,.105,.088,PT,arm,'camo');capb(E,H,.075,.056,SK,arm);{const L2=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);capb(L2(E,H,.15),L2(E,H,.72),.088,.074,col,arm,'armor');capb(L2(E,H,.68),L2(E,H,.74),.092,.09,GR,arm)} // braçadeirasp(.092,PT,...E,arm,1,1,1,'camo');sp(.1,col,...E,arm,1,1,1,'armor');
 const hh=gr(H[0],H[1],H[2],arm);bx(.085,.035,.09,GL,0,0,-.02,hh);sp(.05,SK,0,.01,.05,hh,1.1,.7,.8);for(let i=0;i<4;i++)cap(.013,.011,.05,GL,(i-1.5)*.021,-.04,-.06,hh);sp(.017,GL,S[0]>0?-.05:.05,0,-.03,hh,1,1,1.8)});
/* ===== PERSONALIZAÇÃO: cabelo, chapéus, bandanas, óculos, armaduras ===== */
{const hr=L.hair,bc=L.bc||0xd4351c,hg=L.hg|0,bd=L.band|0,GD=0xffc933,
 dm=(r,th,c,x,y,z,p,sx,sy,sz)=>{const m=new T.Mesh(new T.SphereGeometry(r,24,14,0,Math.PI*2,0,Math.PI*th),mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);p.add(m);return m};
 if(HS&&HS!=4&&!HM){sp(.1,hr,0,.115,-.135,hd,1.5,.35,.6);[-1,1].forEach(s=>bx(.03,.09,.05,hr,s*.165,.01,-.06,hd))}if(HS==2)bx(.05,.1,.36,hr,0,.2,0,hd);if(HS==3){sp(.19,hr,0,-.12,.1,hd,.9,1.9,.55);[-1,1].forEach(s=>sp(.07,hr,s*.15,-.12,.03,hd,.7,2.2,.9))}if(HS==4)sp(.3,hr,0,.08,.03,hd,1,.95,1);if(HS==5)sp(.09,hr,0,.27,.08,hd);
 if(hg==1){dm(.215,.42,bc,0,.005,.01,hd,.95,1.08,1.03);bx(.19,.018,.14,bc,0,.075,-.2,hd).rotation.x=-.18}
 if(hg==2){dm(.222,.5,bc,0,-.005,.01,hd,.95,1.12,1.04);cy(.205,.205,.055,bc,0,.07,.01,hd).scale.set(.93,1,1.02);sp(.05,0xffffff,0,.27,.01,hd)}
 if(hg==4){const w=0x6a4a2a;cy(.36,.36,.018,w,0,.1,0,hd);cy(.15,.19,.17,w,0,.19,0,hd);cy(.192,.192,.04,bc,0,.13,0,hd)}
 if(hg==5){const k=0x151515;cy(.3,.3,.02,k,0,.12,0,hd);cy(.15,.17,.3,k,0,.28,0,hd);cy(.172,.172,.05,bc,0,.16,0,hd)}
 if(hg==6){cy(.19,.2,.09,GD,0,.13,0,hd);for(let i=0;i<5;i++){const a=i*1.2566;cy(0,.035,.1,GD,Math.sin(a)*.17,.2,Math.cos(a)*.17,hd)}}
 if(bd==1){cy(.125,.14,.08,bc,0,.76,0,ch);bx(.11,.11,.02,bc,0,.7,-.15,ch).rotation.z=.785}
 if(bd==2){sp(.2,bc,0,-.1,-.01,hd,.93,.5,1)}
 if(bd==3){cy(.2,.2,.055,bc,0,.075,.01,hd).scale.set(.9,1,.99);[-1,1].forEach(s=>bx(.05,.14,.015,bc,s*.06,-.03,.2,hd).rotation.z=s*.3)}
 if(L.gl==1){[-1,1].forEach(s=>{bx(.085,.05,.02,0x0a0a0a,s*.07,.035,-.195,hd);bx(.01,.012,.16,0x0a0a0a,s*.17,.04,-.1,hd)});bx(.05,.012,.02,0x0a0a0a,0,.045,-.195,hd)}
 if(L.gl==2){cy(.2,.2,.07,0x1a1a1a,0,.035,0,hd).scale.set(.9,1,.99);bx(.2,.075,.03,0x2a9bff,0,.035,-.195,hd)}
 const ar=L.ar|0;if(ar>=1)sp(.34,col,0,.47,-.3,ch,.95,.8,.3,'armor');if(ar==2){cy(.21,.28,.1,col,0,.72,0,ch,'armor');bx(.3,.16,.08,col,0,-.02,-.2,ch,'armor')}
 if(L.sh)[-1,1].forEach(s=>{sp(.25+.06*(L.sh-1),col,s*(.55+.03*(L.sh-1)),.66+.04*(L.sh-1),0,ch,1.05,.55,1.1,'armor');if(L.sh==2)cy(0,.05,.14,GR,s*.62,.84,0,ch)});
 if(L.kn)g.lK.forEach(k=>bx(.17,.32,.07,GR,0,-.24,-.1,k,'armor'));
 if(L.bk){bx(.4,.45,.2,0x2c3027,0,.35,.4,ch,'camo');cy(.08,.08,.38,bc,0,.62,.42,ch).rotation.z=Math.PI/2}}
g.traverse(m=>{if(m.isMesh&&!m.material.isMeshBasicMaterial){m.castShadow=true;m.receiveShadow=true}});g.scale.setScalar(.93);sc.add(g);return g}
function reskin(){const o=P.g,v=o.visible;sc.remove(o);o.traverse(m=>{if(m.geometry)m.geometry.dispose()});P.g=mk(LP.ac,LP);P.g.visible=v}
function fighter(col,x,z,yaw,sk){return{g:mk(col,sk||(col==0x3a6ea5?LP:LB)),shd:(()=>{const m=new T.Mesh(new T.CircleGeometry(.6,18),new T.MeshBasicMaterial({color:0,transparent:true,opacity:.18,depthWrite:false}));m.rotation.x=-Math.PI/2;sc.add(m);return m})(),sx:x,sz:z,sy:yaw,x,z,yaw,hp:100,w:0,ammo:[30,6],rl:0,cd:0,last:-9,hurtT:-9,dead:0,cover:null,crouch:false,score:0,cr:0,vx:0,vz:0,spd:0,slide:null,vault:null,cn:null,roll:null,rush:null,rwant:false,hn:0,y:0,vy:0,air:0,mantle:null,sd:null,sdc:0,sk:0,rs:0,am:0,dr:0,ar:null,bst:[1,1],pk:0,pkT:0,pks:1,po:0,psr:1,lean:0,rmsg:0,rc:0,rcv:0,land:0,ct:0,ce:0,ph:0,rec:0,fl:0,ap:0,pj:[0,0,0,0,0,0]}}
const P=fighter(0x3a6ea5,0,20,0),B=fighter(0xa5443a,0,-20,Math.PI);
B.t=0;B.mode='cover';B.tx=0;B.tz=-20;B.react=0;
let now=0,locked=false,over=false,fireBuf=0,hitT=-9,killT=-9,rsLock=false,qa=null,dmgT=-9,recA=0;const DR=.6;/* DR = tempo de sacar a arma */const K={};let aim=false,fire1=false,pitch=0;
