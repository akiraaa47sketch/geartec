/* Mapa "Torre do Relógio": cenário, props de cobertura e lista de coberturas */
/* ===== CENÁRIO "TORRE DO RELÓGIO": prédios laterais, colunas, árvores, torres, céu e sol ===== */
const cst=m=>{m.castShadow=m.receiveShadow=true;sc.add(m);return m};
const fb=(w,h,d)=>{const g=new T.BoxGeometry(w,h,d),u=g.attributes.uv;for(let i=0;i<u.count;i++){const f=Math.floor(i/4);u.setXY(i,u.getX(i)*(f<2?d:w)/3,u.getY(i)*(f>1&&f<4?d:h)/3)}return g};
function bld(x,z,w,d,h){box(x,z,w,d,h,0xd9cfbb);sm[sm.length-1].material=MT(0xe6dcc6,'fac');const q=w/Math.SQRT2,rf=cst(new T.Mesh(new T.BoxGeometry(q,q,d+.6),MT(0x6a4f45,'metal')));rf.position.set(x,h,z);rf.rotation.z=Math.PI/4}
bld(-21,0,5,47,6);bld(21,0,5,47,6);
[-14,-7,0,7,14].forEach(z=>[-1,1].forEach(q=>box(q*17.7,z,.9,.9,4.6,0xd8cfbc)));
function tree(x,z){const t=cst(new T.Mesh(new T.CylinderGeometry(.28,.4,3.6,10),MT(0x6b4a2c)));t.position.set(x,1.8,z);sm.push(t);solids.push({x,z,w:.9,d:.9,h:3.6,y0:0});
 const gp=new T.Mesh(new T.CircleGeometry(2.4,20),MT(0x5b7f45));gp.rotation.x=-Math.PI/2;gp.position.set(x,.02,z);gp.receiveShadow=true;sc.add(gp);
 [[0,4.4,0,1.5],[.8,3.8,.3,1.1],[-.7,3.9,-.4,1.2],[0,5.4,.1,1.1]].forEach(([a,b,c,r],i)=>{const f=cst(new T.Mesh(new T.SphereGeometry(r,12,10),MT(i%2?0x3f7a35:0x4e8c3d)));f.position.set(x+a,b,z+c)})}
tree(-7,-9);tree(7,9);
function tower(x,z){const b=cst(new T.Mesh(fb(7,22,7),MT(0xe6dcc6,'fac')));b.position.set(x,11,z);const r=cst(new T.Mesh(new T.CylinderGeometry(0,6,9,4),MT(0x5a4a44,'metal')));r.position.set(x,26.5,z);r.rotation.y=Math.PI/4;
 [-1,1].forEach(q=>{const c=new T.Mesh(new T.CircleGeometry(2.6,32),MT(0xffffff,'clk'));c.position.set(x,17,z+q*3.52);c.rotation.y=q>0?0:Math.PI;sc.add(c)})}
tower(0,-38);tower(0,38);
{const r=seedR(5);for(let i=0;i<18;i++){const a=i/18*6.283+r()*.3,d=58+r()*14,h=10+r()*14,w=8+r()*6,m=cst(new T.Mesh(fb(w,h,w),MT(0xd0c6b2,'fac')));m.position.set(Math.cos(a)*d,h/2,Math.sin(a)*d);m.rotation.y=r()}
 const gd=new T.Mesh(new T.PlaneGeometry(400,400),new T.MeshLambertMaterial({color:0x7d8070}));gd.rotation.x=-Math.PI/2;gd.position.y=-.03;gd.receiveShadow=true;sc.add(gd);
 const c=document.createElement('canvas');c.width=4;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);[[0,'#2a63b8'],[.22,'#5f9bd8'],[.42,'#b9d8ee'],[.5,'#f0ead6'],[1,'#f0ead6']].forEach(a=>g.addColorStop(a[0],a[1]));x.fillStyle=g;x.fillRect(0,0,4,256);
 const dome=new T.Mesh(new T.SphereGeometry(150,24,16),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.BackSide,fog:false,depthWrite:false}));dome.frustumCulled=false;sc.add(dome);
 const sd=sun.position.clone().normalize().multiplyScalar(130);[[5,0xfff4d0,1],[14,0xffe6a0,.22]].forEach(([rr,col,op])=>{const m=new T.Mesh(new T.SphereGeometry(rr,16,12),new T.MeshBasicMaterial({color:col,transparent:op<1,opacity:op,fog:false,depthWrite:false}));m.position.copy(sd);sc.add(m)})}
/* ===== PROPS: coberturas baixas viram sacos de areia ou barreiras de concreto (só visual; a caixa de colisão fica invisível e continua bloqueando os tiros) ===== */
{const INV=new T.MeshBasicMaterial({visible:false}),r=seedR(9),o=new T.Object3D();
 const bagG=(()=>{const g=new T.SphereGeometry(1,14,8),p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);p.setXYZ(i,p.getX(i)*.31*(1-.1*y*y),Math.max(-.62,Math.min(.62,y))*.19,p.getZ(i)*.21*(1-.1*y*y))}g.computeVertexNormals();return g})();
 const barG=(D,Ln)=>{const h=D/2,sh=new T.Shape();sh.moveTo(-h,0);sh.lineTo(h,0);sh.lineTo(h,.14);sh.lineTo(h*.86,.42);sh.lineTo(h*.82,1.29);sh.lineTo(h*.76,1.32);sh.lineTo(-h*.76,1.32);sh.lineTo(-h*.82,1.29);sh.lineTo(-h*.86,.42);sh.lineTo(-h,.14);sh.lineTo(-h,0);
  const g=new T.ExtrudeGeometry(sh,{depth:Ln,bevelEnabled:false});g.translate(0,0,-Ln/2);return g};
 let k=0;for(let i=0;i<solids.length;i++){const s=solids[i];if(s.y0||Math.abs(s.h-1.32)>.01)continue;const m=sm[i];m.material=INV;m.castShadow=m.receiveShadow=false;
  const al=s.w>=s.d,L=al?s.w:s.d,D=al?s.d:s.w,P2=(u,v)=>al?[s.x+u,s.z+v]:[s.x+v,s.z+u];
  if(k++%2==0){const rows=6,per=Math.max(2,Math.round(L/.56)),dep=Math.max(1,Math.round(D/.46)),im=new T.InstancedMesh(bagG,MT(0xa99b7c,'bag'),rows*per*dep);let c=0;
   for(let y=0;y<rows;y++)for(let j=0;j<dep;j++){const np=y%2?per-1:per;for(let q=0;q<np;q++){const u=-L/2+(q+(y%2?1:.5))*L/per,v=-D/2+(j+.5)*D/dep,[px,pz]=P2(u,v);
    o.position.set(px,.115+y*.22,pz);o.rotation.set((r()-.5)*.06,(al?0:Math.PI/2)+(r()-.5)*.14,(r()-.5)*.06);o.scale.setScalar(.94+r()*.1);o.updateMatrix();im.setMatrixAt(c++,o.matrix)}}
   im.count=c;im.castShadow=im.receiveShadow=true;sc.add(im)}
  else{const n=Math.max(1,Math.round(L/2.1)),sl=L/n;for(let q=0;q<n;q++){const[px,pz]=P2(-L/2+(q+.5)*sl,0),b=cst(new T.Mesh(barG(D,sl-.07),MT(0xc4bfb5,'bar')));b.position.set(px,0,pz);b.rotation.y=al?Math.PI/2:0;
    [-1,1].forEach(e=>{const lp=cst(new T.Mesh(new T.TorusGeometry(.07,.014,6,12,Math.PI),MT(0x6a5a4a,'metal')));lp.position.set(px+(al?e*sl*.3:0),1.32,pz+(al?0:e*sl*.3));lp.rotation.y=al?0:Math.PI/2})}}}}
const covers=solids.filter(s=>!s.y0),lowCov=covers.filter(s=>s.h<1.4&&Math.max(s.w,s.d)>=2);
