/* Núcleo: THREE, configurações salvas, cena, câmera, renderer, luz e utilitários */
const T=THREE,R=Math.random,$=id=>document.getElementById(id);
/* ===== CONFIGURAÇÕES (salvas no navegador) ===== */
const CFGD={sens:1,ads:.85,inv:0,vol:.7,sfx:1,gq:2,fov:70,fsr:0,sharp:.6,shd:1,fps:0};
const CFG=Object.assign({},CFGD);try{Object.assign(CFG,JSON.parse(localStorage.getItem('arenax1.cfg')||'{}'))}catch(e){}
const saveCfg=()=>{try{localStorage.setItem('arenax1.cfg',JSON.stringify(CFG))}catch(e){}};
const BD={goal:5,passive:false,react:.45,noise:.05,dmg:1},DIFF=[{react:.8,noise:.11,dmg:.7},{react:.45,noise:.05,dmg:1},{react:.22,noise:.025,dmg:1.15}],GOALS=[5,10,20,Infinity];
const sc=new T.Scene();sc.background=new T.Color(0xcfe0ec);sc.fog=new T.Fog(0xcfe0ec,50,130);
const cam=new T.PerspectiveCamera(70,innerWidth/innerHeight,.1,260);
const rn=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});rn.setSize(innerWidth,innerHeight);document.body.appendChild(rn.domElement);rn.shadowMap.enabled=true;rn.shadowMap.type=T.PCFSoftShadowMap;
addEventListener('resize',()=>applyGfx());
sc.add(new T.HemisphereLight(0xbfd9ff,0x7a6a50,.65));
const sun=new T.DirectionalLight(0xfff0d2,1.2);sun.position.set(-26,34,18);sun.castShadow=true;const sS=sun.shadow;sS.mapSize.set(2048,2048);Object.assign(sS.camera,{left:-34,right:34,top:34,bottom:-34,near:1,far:120});sS.camera.updateProjectionMatrix();sS.bias=-.0004;sS.normalBias=.03;sc.add(sun);
const fl=new T.Mesh(new T.PlaneGeometry(60,60),new T.MeshLambertMaterial({color:0x3a3d3a}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;sc.add(fl);
const A=24,solids=[],sm=[];
const ray=new T.Raycaster(),tr=[],gibs=[];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rd=(s,x,z)=>Math.hypot(x-clamp(x,s.x-s.w/2,s.x+s.w/2),z-clamp(z,s.z-s.d/2,s.z+s.d/2));
