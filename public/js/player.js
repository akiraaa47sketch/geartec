/* Jogador: vault, voadora, cobertura, corner rush, ações e updP */
const eye=f=>new T.Vector3(f.x,(f.down?.55:f.crouch?.85:1.5)+(f.y||0),f.z);
/*H*/
const hitS=(x,z,r,ex)=>solids.some(o=>o!==ex&&rd(o,x,z)<r);
const clearD=(x,z,dx,dz,mx,r,ex)=>{for(let d=.25;d<=mx;d+=.25){const px=x+dx*d,pz=z+dz*d;if(Math.abs(px)>A-1||Math.abs(pz)>A-1||hitS(px,pz,r,ex))return d-.25}return mx};
function planVault(f,s,nx,nz,gap=.65,ig){if(s.h>1.4)return null;const th=Math.abs(nx)*s.w+Math.abs(nz)*s.d,ex=f.x-nx*(th+gap+.65),ez=f.z-nz*(th+gap+.65);
 if(Math.abs(ex)>A-1||Math.abs(ez)>A-1||hitS(ex,ez,.5,null))return null;
 const o=f===P?B:P;if(!ig&&o.dead<=0&&Math.hypot(o.x-ex,o.z-ez)<1.4)return null;
 for(let d=.3;d<th+gap+.65;d+=.3){const px=f.x-nx*d,pz=f.z-nz*d;if(hitS(px,pz,.45,s))return null;if(!ig&&o.dead<=0&&Math.hypot(o.x-px,o.z-pz)<1)return null}
 return{ex,ez}}
/*/H*/
/* ===== COVER SLIP (voadora): pula/desliza por cima da cobertura em direção ao inimigo do outro lado e o atordoa ===== */
function trySlip(f,s,nx,nz){const o=f===P?B:P;if(o.dead>0||o.prot>now||s.h>1.4)return false;
 const tx=-nz,tz=nx,ox=o.x-f.x,oz=o.z-f.z,dn=-(ox*nx+oz*nz),lat=Math.abs(ox*tx+oz*tz),th=Math.abs(nx)*s.w+Math.abs(nz)*s.d;
 if(dn<.4||lat>1.7||dn>th+2.6)return false;
 const v=planVault(f,s,nx,nz,.65,true);if(!v)return false;
 f.slip={s,t:0,T:.6,nx,nz,sx:f.x,sz:f.z,ex:v.ex,ez:v.ez,hit:false};f.cover=null;f.cn=null;f.vx=f.vz=0;return true}
const slipLift=a=>{const m=1-Math.pow(1-clamp(a.t/a.T,0,1),2),e=Math.min(1,m*3.5,(1-m)*3.5);return(a.s.h*.62+.05)*e*e*(3-2*e)}; // sobe, desliza rente ao topo da cobertura e desce
function kick(f,o,a){o.stun=now+1.6;o.kb={vx:-a.nx*8,vz:-a.nz*8,t:.3};hurt(o,30,f);spark(new T.Vector3(o.x,1,o.z),10);if(f===P){hitT=now;shk=1;tick(180,.16,.08)}}
const vm=v=>clamp((Math.min(1,v.t/.62)-.15)/.85,0,1),vlift=v=>Math.sin(Math.PI*vm(v))*1.1;
const st=f=>f.dead>0?'Dead':f.sd?'Sliding':f.mantle?'Mantling':f.air?(f.vy>0?'Jumping':'Falling'):f.rs>.6?'Sprinting':f.roll?'Rolling':f.rush?'CornerRushing':f.vault?(f.vault.t<.1?'Mantling':'Vaulting'):f.slide?'ApproachingCover':f.cover?(f.ce>0?'CornerTransition':Math.abs(f.vx)>.4?'MovingAlongCover':f.land>0?'EnteringCover':'InCover'):f.rcv>now?'Recovering':'NormalMovement';

let ch=2.1,cd=3.2,sh=.9,shs=1,shk=0,camRoll=0;
const ICON=['<svg viewBox="0 0 132 44"><rect x="2" y="15" width="26" height="10" rx="2"/><rect x="26" y="12" width="56" height="13" rx="2"/><rect x="40" y="6" width="26" height="6" rx="1.5"/><polygon points="50,25 64,25 62,40 48,40"/><polygon points="31,25 40,25 36,38 29,38"/><rect x="82" y="14" width="26" height="10" rx="1.5"/><rect x="108" y="16.5" width="22" height="4"/><path d="M84 26h38l4 5H84z"/></svg>',
 '<svg viewBox="0 0 132 44"><polygon points="4,13 36,17 36,29 4,27"/><rect x="34" y="14" width="36" height="14" rx="2"/><polygon points="40,28 49,28 45,40 37,40"/><rect x="70" y="15" width="56" height="6" rx="1"/><rect x="70" y="23" width="42" height="5" rx="1"/><rect x="82" y="22" width="24" height="10" rx="2"/><rect x="122" y="12" width="8" height="12" rx="1"/></svg>'];
$('sl').innerHTML=ICON.map(s=>'<div>'+s+'</div>').join('');
const arB=$('ar');
function arHud(){if(P.ar&&P.rl<=0&&P.ar.st!='run'&&now-P.ar.end>.7)P.ar=null;
 if(!P.ar||P.dead>0){arB.classList.remove('on');return}const a=P.ar;arB.classList.add('on');
 $('arm').style.left=clamp(a.t/a.dur,0,1)*100+'%';const z=$('arz').style,q=$('arp').style;z.left=a.z0*100+'%';z.width=a.zw*100+'%';q.left=(a.z0+a.zw/2-a.pw/2)*100+'%';q.width=a.pw*100+'%';
 const c={run:'#ffb020',ok:'#5dff7a',perfect:'#7fe9ff',jam:'#ff3b3b'}[a.st];$('arm').style.background=c;arB.style.borderColor=a.st=='run'?'#fff6':c;arB.style.boxShadow=a.st=='run'?'none':'0 0 12px '+c}
function findCover(f,r,dx,dz,md,ex){let b=null,bs=99;for(const s of covers){if(s===ex)continue;const d=rd(s,f.x,f.z);if(d>r)continue;const px=clamp(f.x,s.x-s.w/2,s.x+s.w/2),pz=clamp(f.z,s.z-s.d/2,s.z+s.d/2),vl=Math.hypot(px-f.x,pz-f.z)||1,dp=((px-f.x)*dx+(pz-f.z)*dz)/vl;if(d>.9&&dp<md)continue;const k=d-dp*1.5;if(k<bs){bs=k;b=s}}return b}
function startSlide(f,b){const dx=f.x-b.x,dz=f.z-b.z,hx=Math.abs(dx)/b.w>Math.abs(dz)/b.d,nx=hx?(Math.sign(dx)||1):0,nz=hx?0:(Math.sign(dz)||1),n0=(hx?b.w:b.d)/2+.65,hf=(hx?b.d:b.w)/2,u=clamp(hx?dz:dx,-hf,hf),tx=b.x+(hx?0:u)+nx*n0,tz=b.z+(hx?u:0)+nz*n0,L=Math.hypot(tx-f.x,tz-f.z);
 if(Math.abs(tx)>A-1||Math.abs(tz)>A-1||hitS(tx,tz,.5,b))return false;
 if(L>.05&&clearD(f.x,f.z,(tx-f.x)/L,(tz-f.z)/L,L,.45,null)<L-.05)return false;
 f.cover=null;f.slide={s:b,nx,nz,tx,tz,t:0};return true}
/* CONTORNAR QUINA: na ponta, ESPAÇO + A/D leva pra face lateral da mesma cobertura (pilares, caixotes, blocos) */
function wrapCover(f,s,nx,nz,sg){const mx=-nz*sg,mz=nx*sg,hm=(Math.abs(mx)*s.w+Math.abs(mz)*s.d)/2,hn=(Math.abs(nx)*s.w+Math.abs(nz)*s.d)/2;if(hn*2<1.4)return false;
 const tx=s.x+mx*(hm+.65)+nx*(hn-.5),tz=s.z+mz*(hm+.65)+nz*(hn-.5),wx=s.x+mx*(hm+.55)+nx*(hn+.55),wz=s.z+mz*(hm+.55)+nz*(hn+.55);
 if(Math.abs(tx)>A-1||Math.abs(tz)>A-1||hitS(tx,tz,.5,s)||hitS(wx,wz,.45,s))return false;
 f.cover=null;f.cn=null;f.slide={s,nx:mx,nz:mz,tx,tz,t:0,wp:[wx,wz]};return true}
function startRoll(f,dx,dz,mn){const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const c=clearD(f.x,f.z,dx,dz,5.6,.5,null);if(c<mn)return false;f.roll={t:0,dx,dz,k:Math.min(1,c/5.6)};f.cover=null;return true}
function leave(f,dx,dz){const lv=K.ShiftLeft?6.5:4.2;f.cover=null;f.cn=null;f.ct=0;f.ce=0;f.vx=dx*lv;f.vz=dz*lv;f.rc=now+.06;f.rcv=now+.14}

/* ===== CORNER RUSH ===== saída explosiva pela ponta da cobertura (ESPAÇO + W + A/D perto da extremidade) */
const RV=[{k1:1,s0:.15,len:1.5},{k1:.7,s0:.15,len:1.6},{k1:1,s0:.6,len:1.8},{k1:.3,s0:.4,len:1.8}]; // variantes de curva: tenta a próxima se houver obstáculo lateral
const rushSpd=tb=>tb<.08?4+95*tb:Math.max(7,11.6-8*(tb-.08)); // explosão: 3→9.5 m/s em .1s, depois decai até 6.5 (velocidade de corrida normal é 5, sprint 8)
const rushDir=(r,s)=>{const q=clamp((s-(r.de+r.s0))/r.len,0,1),k=r.k1*q*q*(3-2*q),ux=r.tx*r.sg*(1-k)-r.nx*k,uz=r.tz*r.sg*(1-k)-r.nz*k,l=Math.hypot(ux,uz)||1;return[ux/l,uz/l]}; // começa na tangente da parede, só curva pra frente (-normal) depois de passar a ponta
function simRush(f,r){const o=f===P?B:P;let x=f.x,z=f.z,s=0;for(let t=0;t<r.Dur;t+=.04){const v=rushSpd(t),d=rushDir(r,s);x+=d[0]*v*.04;z+=d[1]*v*.04;s+=v*.04;
  if(Math.abs(x)>A-1||Math.abs(z)>A-1||hitS(x,z,.5,null))return false;if(o.dead<=0&&Math.hypot(o.x-x,o.z-z)<.9)return false}return true}
function planRush(f,s2,nx,nz,sg){const tx=-nz,tz=nx,u=(f.x-s2.x)*tx+(f.z-s2.z)*tz,hl=(Math.abs(tx)*s2.w+Math.abs(tz)*s2.d)/2,de=hl-sg*u; // de = distância até a ponta nesse lado
 if(de>1.1)return{reason:'far'};
 for(const v of RV){const r={s2,nx,nz,tx,tz,sg,de:Math.max(de,0),t:0,s:0,T0:.04,Dur:.4,d:null,v:0,px:0,pz:0,still:0,...v};if(simRush(f,r))return{r}}
 return{reason:'blocked'}}
function startRush(f,r){f.rush=r;f.cover=null;f.cn=null;f.ct=f.ce=0;f.vx=f.vz=0}
function endRush(f,hard){f.rush=null;if(hard){f.vx=f.vz=0}f.rc=now+.05}
function rushStep(f,dt,wx,wz,has){const r=f.rush;r.t+=dt;r.px=f.x;r.pz=f.z;if(r.t<r.T0)return; // anticipação: corpo se encolhe, sem deslocamento
 const tb=r.t-r.T0;if(tb>=r.Dur||(f===P&&tb>=.2&&!K.KeyW)){endRush(f);return} // solta W = freia (mín. .2s) · segurar W = vai até o fim (.4s)
 const v=rushSpd(tb);let d=rushDir(r,r.s);const q=clamp((r.s-(r.de+r.s0))/r.len,0,1);
 if(has&&q>.35){const b=(q-.35)/.65*.9,ux=d[0]*(1-b)+wx*b,uz=d[1]*(1-b)+wz*b,l=Math.hypot(ux,uz)||1;d=[ux/l,uz/l]} // depois de contornar o canto, mouse + WASD guiam a direção
 f.x+=d[0]*v*dt;f.z+=d[1]*v*dt;r.s+=v*dt;r.d=d;r.v=v;f.vx=d[0]*v;f.vz=d[1]*v} // a velocidade final vira o vx/vz do movimento normal (continuidade)
function rushGuard(f,dt){const r=f.rush;if(r.t<r.T0)return;const m=Math.hypot(f.x-r.px,f.z-r.pz);r.still=m<r.v*dt*.35?r.still+dt:0;if(r.still>.12)endRush(f,true)} // preso numa quina: encerra com segurança
const edgeNear=f=>{if(!f.cover||!f.cn)return false;const[nx,nz]=f.cn,tx=-nz,tz=nx,u=(f.x-f.cover.x)*tx+(f.z-f.cover.z)*tz,hl=(Math.abs(tx)*f.cover.w+Math.abs(tz)*f.cover.d)/2;return hl-Math.abs(u)<=.8};
function jumpKey(){const f=P;if(execKey())return;if(f.dead>0||f.vault||f.slip||f.slide||f.roll||f.rush||f.mantle||f.sd||f.air||f.rc>now)return;
 if(f.cover&&f.cn){if(trySlip(f,f.cover,f.cn[0],f.cn[1]))return;const v=planVault(f,f.cover,f.cn[0],f.cn[1]);if(v){f.vault={s:f.cover,t:0,nx:f.cn[0],nz:f.cn[1],sx:f.x,sz:f.z,ex:v.ex,ez:v.ez};f.cover=null}else say('Sem espaço');return}
 const mx=(K.KeyD?1:0)-(K.KeyA?1:0),mz=(K.KeyS?1:0)-(K.KeyW?1:0),l=Math.hypot(mx,mz),c=Math.cos(f.yaw),s=Math.sin(f.yaw),dx=l?(c*mx+s*mz)/l:-s,dz=l?(-s*mx+c*mz)/l:-c;
 if(f.y<.05){let hit=null,td=0;for(let t=.3;t<=1.5&&!hit;t+=.1){const px=f.x+dx*t,pz=f.z+dz*t;hit=solids.find(o=>!o.y0&&o.h<3&&rd(o,px,pz)<.15);td=t}
  if(hit){const ox=f.x-hit.x,oz=f.z-hit.z,hx=Math.abs(ox)/hit.w>Math.abs(oz)/hit.d,nx=hx?Math.sign(ox)||1:0,nz=hx?0:Math.sign(oz)||1;
   if(hit.h<=1.45&&dx*-nx+dz*-nz>.5){const v=planVault(f,hit,nx,nz,rd(hit,f.x,f.z));if(v){f.vault={s:hit,t:0,nx,nz,sx:f.x,sz:f.z,ex:v.ex,ez:v.ez};f.cover=null;return}say('Sem espaço');return}
   if(hit.h>1.45&&hit.h<=2.4){const g=Math.max(0,td-.65),ex=clamp(f.x+dx*(td+.7),hit.x-hit.w/2+.35,hit.x+hit.w/2-.35),ez=clamp(f.z+dz*(td+.7),hit.z-hit.d/2+.35,hit.z+hit.d/2-.35);
    f.mantle={s:hit,t:0,T:.9,sx:f.x,sz:f.z,sy:f.y,gx:f.x+dx*g,gz:f.z+dz*g,ex,ez,ey:hit.h,dx,dz};f.vx=f.vz=0;return}
   if(hit.h>2.4){say('Alto demais');return}}}
 f.vy=6.8;f.air=1;f.y+=.01} // pulo simples: mantém o impulso horizontal (pouco controle no ar)
function slideKey(){const f=P;if(f.dead>0||f.vault||f.slip||f.slide||f.roll||f.rush||f.mantle||f.sd||f.air||f.cover||f.y>.05)return;
 if(f.sdc>now){say('Recuperando…');return}if(!(f.rs>.5&&f.spd>6.3))return; // o slide sai do sprint
 const l=Math.hypot(f.vx,f.vz)||1;f.sd={t:0,T:.95,dx:f.vx/l,dz:f.vz/l,v0:Math.max(10.5,f.spd*1.25),v:f.spd};f.rs=.6}
function actionKey(){const f=P;if(f.dead>0||f.vault||f.slip||f.slide||f.roll||f.rush||f.mantle||f.sd||f.air||f.y>.05||f.rc>now)return;
 const fx=-Math.sin(f.yaw),fz=-Math.cos(f.yaw),mx=(K.KeyD?1:0)-(K.KeyA?1:0),mz=(K.KeyS?1:0)-(K.KeyW?1:0),c=Math.cos(f.yaw),s=Math.sin(f.yaw),l=Math.hypot(mx,mz),wx=l?(c*mx+s*mz)/l:0,wz=l?(-s*mx+c*mz)/l:0;
 if(f.cover&&f.cn){if(!l)return;const s2=f.cover,[nx,nz]=f.cn,tx=-nz,tz=nx,dn=wx*nx+wz*nz,dtn=wx*tx+wz*tz;
  if(K.KeyW&&(K.KeyA?1:0)+(K.KeyD?1:0)==1&&!K.KeyS){const lx=(K.KeyD?1:0)-(K.KeyA?1:0),tdx=(c*tx-s*tz)*lx;if(Math.abs(tdx)>.3){const pr=planRush(f,s2,nx,nz,Math.sign(tdx));if(pr.r){startRush(f,pr.r);return}if(pr.reason=='blocked'){say('Passagem bloqueada');return}}} // ESPAÇO + W + A/D na ponta = Corner Rush (único jeito de disparar)
  if(dn<-.5){if(trySlip(f,s2,nx,nz))return;const v=planVault(f,s2,nx,nz);if(v){f.vault={s:s2,t:0,nx,nz,sx:f.x,sz:f.z,ex:v.ex,ez:v.ez};f.cover=null;return}
   const b=findCover(f,5,wx,wz,.7,s2);if(b&&startSlide(f,b))return;say(s2.h>1.4?'Cobertura alta demais':'Sem espaço');return}
  if(dn>.5){if(!startRoll(f,nx,nz,1.5))say('Sem espaço');return}
  if(Math.abs(dtn)<.5)return;
  const sg=Math.sign(dtn),uu=(f.x-s2.x)*tx+(f.z-s2.z)*tz,hl=(Math.abs(tx)*s2.w+Math.abs(tz)*s2.d)/2,atE=hl-sg*uu<=.9,nb=atE?findCover(f,2.6,tx*sg,tz*sg,.7,s2):null;
  if(nb&&startSlide(f,nb))return;if(atE&&wrapCover(f,s2,nx,nz,sg))return; // na ponta: troca pra cobertura vizinha (SWAT) ou contorna a quina da mesma cobertura
  const b=findCover(f,5,tx*sg,tz*sg,.7,s2);if(b&&startSlide(f,b))return;
  if(!startRoll(f,tx*sg,tz*sg,1.5))say('Sem espaço');return}
 const dx=l?wx:fx,dz=l?wz:fz,b=findCover(f,3.2,dx,dz,.6);
 if(b){if(!startSlide(f,b))say('Cobertura bloqueada');return}
 if(!startRoll(f,dx,dz,1.5))say('Sem espaço')}
function updP(dt){const f=P;f.ap=pitch;if(f.dead>0){f.dead-=dt;if(f.dead<=0)respawn(f);common(f,dt);return}
 if(recA>0&&!(fire1||now<fireBuf)){const r=Math.min(recA,dt*.5);pitch-=r;recA-=r}
 if(qa){if(now>qa.t)qa=null;else if(!busy(f)){const q=qa;qa=null;q.fn()}}
 const mx=(K.KeyD?1:0)-(K.KeyA?1:0),mz=(K.KeyS?1:0)-(K.KeyW?1:0),l=Math.hypot(mx,mz)||1;
 const spW=K.ShiftLeft&&mz<0&&!aim&&!f.cover&&!f.air&&!f.sd&&!f.down&&!f.exec&&now-f.last>.25;f.rs=clamp(f.rs+(spW?.95:-3.5)*dt,0,1); // corrida: acelera aos poucos
 const spin=spW;rsLock=spin;if(spin){f.steer=(f.steer||0)+(mx-(f.steer||0))*Math.min(1,dt*4);f.yaw-=f.steer*1.9*dt*(1-.35*f.rs);if(f.rh==null)f.rh=f.yaw;const dh=Math.atan2(Math.sin(f.yaw-f.rh),Math.cos(f.yaw-f.rh)),rr2=2.6-1*f.rs;f.rh+=clamp(dh,-rr2*dt,rr2*dt)}else{f.steer=0;f.rh=f.yaw} // sprint: A/D giram a corrida aos poucos · a direção de movimento segue a câmera com atraso (curva suave)
 const sp=(f.cover?2.6:5+3*f.rs*f.rs*(3-2*f.rs))*(f.rcv>now?.7:1)*(aim?.7:1)*(now-f.last<.2?.88:1)*(f.slow>now?.6:1),s=Math.sin(f.yaw),c=Math.cos(f.yaw);
 let wx=(c*mx+s*mz)/l,wz=(-s*mx+c*mz)/l;if(spin){wx=-Math.sin(f.rh);wz=-Math.cos(f.rh)}
 const wf=fire1||now<fireBuf;if(!(f.cover&&f.cn)){f.pk=f.pkT=f.po=f.lean=0} // wf = botão de tiro (com buffer curto p/ o corner shoot)
 if(f.down){const tg=(mx||mz)?1.15:0,kk=Math.min(1,dt*6);f.vx+=(wx*tg-f.vx)*kk;f.vz+=(wz*tg-f.vz)*kk;f.x+=f.vx*dt;f.z+=f.vz*dt;downTick(f,dt)}
 else if(f.exec){f.vx=f.vz=0;execStep(f,dt)}
 else if(f.vault){const v=f.vault;v.t+=dt;const m=vm(v);f.x=v.sx+(v.ex-v.sx)*m;f.z=v.sz+(v.ez-v.sz)*m;if(v.t>=.62){f.x=v.ex;f.z=v.ez;f.vault=null;f.vx=-v.nx*5;f.vz=-v.nz*5;f.rc=now+.04;f.rcv=now+.12}}
 else if(f.slip){const a=f.slip;a.t+=dt;const k=clamp(a.t/a.T,0,1),m=1-(1-k)*(1-k);f.x=a.sx+(a.ex-a.sx)*m;f.z=a.sz+(a.ez-a.sz)*m;
  if(!a.hit&&k>.3&&k<.95&&B.dead<=0&&Math.hypot(B.x-f.x,B.z-f.z)<2.2){a.hit=true;kick(f,B,a)}
  if(k>=1){f.x=a.ex;f.z=a.ez;f.slip=null;f.vx=-a.nx*3.5;f.vz=-a.nz*3.5;f.rc=now+.12;f.rcv=now+.2}}
 else if(f.roll){const r=f.roll;r.t+=dt;const k=r.t/.7;if(k>=1){f.roll=null;f.rc=now+.07;f.rcv=now+.12;f.vx=(mx||mz)?wx*5.5:0;f.vz=(mx||mz)?wz*5.5:0}else{const v=11*(1-.55*k)*r.k;f.x+=r.dx*v*dt;f.z+=r.dz*v*dt;f.vx=r.dx*5;f.vz=r.dz*5}}
 else if(f.rush){rushStep(f,dt,wx,wz,!!(mx||mz))}
 else if(f.mantle){const m=f.mantle;m.t+=dt;const k=clamp(m.t/m.T,0,1),sm=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};f.y=m.sy+(m.ey-m.sy)*sm((k-.2)/.4);
  if(k<.5){const a=sm(k/.2);f.x=m.sx+(m.gx-m.sx)*a;f.z=m.sz+(m.gz-m.sz)*a}else{const b=sm((k-.5)/.5);f.x=m.gx+(m.ex-m.gx)*b;f.z=m.gz+(m.ez-m.gz)*b}
  f.vx=f.vz=0;if(k>=1){f.mantle=null;f.vy=0;f.rc=now+.05;f.land=.1}}
 else if(f.sd){const a=f.sd;a.t+=dt;const k=a.t/a.T;
  if(mx||mz){const cur=Math.atan2(a.dz,a.dx),dA=Math.atan2(Math.sin(Math.atan2(wz,wx)-cur),Math.cos(Math.atan2(wz,wx)-cur)),na=cur+clamp(dA,-2.4*dt,2.4*dt);a.dx=Math.cos(na);a.dz=Math.sin(na)} // contorna quinas
  const v=Math.max(3.2,a.v0*(1-.55*(1-(1-k)*(1-k))));f.x+=a.dx*v*dt;f.z+=a.dz*v*dt;f.vx=a.dx*v;f.vz=a.dz*v;a.v=v;
  const b=k>.15?findCover(f,2.2,a.dx,a.dz,.75):null;
  if(b&&startSlide(f,b)){f.sd=null;f.sdc=now+.9}
  else if(a.t>.2&&f.spd<1.2){f.sd=null;f.sdc=now+1.2}
  else if(k>=1&&!solids.some(o=>o.y0&&rd(o,f.x,f.z)<.8)){f.sd=null;f.sdc=now+1.6;f.rc=now+.05;f.rcv=now+.18;const e=Math.max(5.2,a.v*1.1);f.vx=a.dx*e;f.vz=a.dz*e}} // preserva o impulso na saída; cooldown contra spam
 else if(f.slide){const a=f.slide;a.t+=dt;if(a.wp&&(Math.hypot(a.wp[0]-f.x,a.wp[1]-f.z)<.25||a.t>.6))a.wp=null;const fe=Math.hypot(a.tx-f.x,a.tz-f.z),ex=(a.wp?a.wp[0]:a.tx)-f.x,ez=(a.wp?a.wp[1]:a.tz)-f.z,el=a.wp?Math.max(fe,.3):Math.hypot(ex,ez);if(!a.wp&&(el<.15||a.t>1.2)){if(el<.6){f.x=a.tx;f.z=a.tz;f.cover=a.s;f.cn=[a.nx,a.nz];f.land=.18}f.slide=null;f.vx=f.vz=0}else{const v=Math.min(13,4+a.t*45)*clamp(el/.9,.4,1),eh=Math.hypot(ex,ez)||1,d=Math.min(eh,v*dt);f.x+=ex/eh*d;f.z+=ez/eh*d}}
 else if(f.cover&&f.cn){const[nx,nz]=f.cn,tx=-nz,tz=nx,s2=f.cover,has=mx||mz,td=has?wx*tx+wz*tz:0,away=has?wx*nx+wz*nz:0,hl=(Math.abs(tx)*s2.w+Math.abs(tz)*s2.d)/2,uB=(f.x-s2.x)*tx+(f.z-s2.z)*tz-f.po,rr=c*tx-s*tz;
  /* CORNER PEEK / SHOOT: na ponta, botão direito = espia o canto (mira precisa); clique = atira do canto */
  const tall=s2.h>=1.4;let want=0;if(locked&&(aim||(tall&&wf))&&(tall||!K.KeyW)){let sg=f.pk>.02?f.pks:0;if(!sg){const lx=(K.KeyD?1:0)-(K.KeyA?1:0),sv=lx*rr,sd=Math.abs(sv)>.3?Math.sign(sv):0;if(sd&&hl-sd*uB<=.8)sg=sd;else if(tall&&hl-Math.abs(uB)<=.9)sg=Math.sign(uB)||1}if(sg){want=1;f.pks=sg}}
  f.pkT=want;f.pk+=(want-f.pk)*Math.min(1,dt*(want?16:12));if(!want&&f.pk<.01)f.pk=0;
  f.vx+=((has&&!want?td*sp:0)-f.vx)*Math.min(1,dt*14);f.vz=0;let u=uB+f.vx*dt;if(Math.abs(f.vx)>.6)shs=Math.sign(f.vx*rr)||shs; // câmera troca de ombro pro lado que você anda na parede
  const hf=Math.max(hl-.2,.3),n0=(Math.abs(nx)*s2.w+Math.abs(nz)*s2.d)/2+.65;
  const sOut=K.KeyS&&!K.KeyW&&!K.Space;f.ct=sOut?f.ct+dt:((!(K.KeyA||K.KeyD)&&away>.6&&hl-Math.abs(uB)>.8)?f.ct+dt:0); // perto da ponta só o S tira da cobertura // A/D nunca contam como "afastar da parede", mesmo com a câmera girada
  f.ce=(Math.abs(u)>=hf&&td*Math.sign(u)>.5&&!want)?f.ce+dt:0;
  u=clamp(u,-hf,hf);f.po=f.pk*(f.pks*(hl+.85)-u);f.psr=Math.sign(f.pks*rr)||1;f.lean=f.pk*f.psr;f.x=s2.x+tx*(u+f.po)+nx*n0;f.z=s2.z+tz*(u+f.po)+nz*n0;
  if(f.ct>(sOut?.08:.12)){if(sOut&&away<.2)leave(f,nx,nz);else leave(f,wx,wz)}
  else if(f.ce>.2)f.ce=.2} // sem pulo automático pra outra cobertura: na ponta você para e fica protegido (troca de cobertura = ESPAÇO + A/D) // ponta sem cobertura vizinha: o personagem para; sair só com Corner Rush (W+A/D), Espaço ou S
 else{const tg=(mx||mz)?sp:0,k=Math.min(1,dt*(f.air?1.6:(f.rs>.4?7:(tg>f.spd?12:16)))); // inércia: arranca/vira mais devagar em sprint
  f.vx+=(wx*sp-f.vx)*k;f.vz+=(wz*sp-f.vz)*k;f.x+=f.vx*dt;f.z+=f.vz*dt}
 common(f,dt);if(f.rush)rushGuard(f,dt);
 if((f.wps||0)>.85&&f.rs>.5&&f.spd<3.5&&now>(f.bumpT||0)){f.rs=.15;f.vx*=.2;f.vz*=.2;f.rcv=now+.3;f.fl=Math.max(f.fl,.8);shk=Math.min(1,shk+.4);f.bumpT=now+.6} // bateu de frente na parede correndo: perde o sprint e cambaleia
 const h=new T.Vector3(f.x,(ch+=((f.down?.95:f.sd?1.2:f.slip?1.4:f.roll?1.1:f.crouch?1.3:2.1)-ch)*Math.min(1,dt*7))+(f.vault?vlift(f.vault):0)+(f.slip?slipLift(f.slip)*.6:0)+f.y,f.z),fw=new T.Vector3(-Math.sin(f.yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(f.yaw)*Math.cos(pitch)),rt=new T.Vector3(Math.cos(f.yaw),0,-Math.sin(f.yaw));
 sh+=((f.pk>.15?f.psr*.9:(f.rs>.5?.35:.9)*shs)-sh)*Math.min(1,dt*10);let cp=h.clone().addScaledVector(fw,-(cd+=((f.down?2.6:f.exec?3.4:f.cover?2.7:f.slip?3.8:f.roll?3.6:f.rush?3.5:f.sd?3.8:3.2+.5*f.rs)-cd)*Math.min(1,dt*4))).addScaledVector(rt,sh);cp.y+=.3;
 const dv=cp.clone().sub(h),dl=dv.length();ray.set(h,dv.normalize());ray.far=dl;const hs=ray.intersectObjects(sm);if(hs.length)cp=h.clone().addScaledVector(dv,Math.max(.4,hs[0].distance-.3));
 cp.y+=Math.sin(f.ph)*.035*f.rs;cp.x+=(R()-.5)*.06*shk;cp.y+=(R()-.5)*.06*shk;shk=Math.max(0,shk-dt*8);cam.position.copy(cp);cam.lookAt(cp.clone().add(fw));camRoll+=(clamp(-(f.vx*rt.x+f.vz*rt.z)*.0035,-.03,.03)-camRoll)*Math.min(1,dt*8);cam.rotateZ(camRoll);
 cam.fov+=((aim?CFG.fov*.74:(f.roll||f.vault||f.slip||f.rush||f.sd?CFG.fov+12:CFG.fov+7*f.rs))-cam.fov)*Math.min(1,dt*12);cam.updateProjectionMatrix();
 if(wf&&locked&&!over&&!f.down&&!f.exec&&!f.vault&&!f.slip&&!f.slide&&!f.roll&&!f.mantle&&!(f.rush&&f.rush.t<f.rush.T0)&&!(f.cover&&f.pkT&&f.pk<.6)&&!(f.cover&&f.cover.h>=1.4&&f.pk<.6)){ray.set(cp,fw);ray.far=70;const a=ray.intersectObjects([...sm,...(MP.on?mpTargets().map(q=>q.g):[B.g])],true);
  const ap=a.length?a[0].point:cp.clone().addScaledVector(fw,70),o=eye(f).addScaledVector(rt,.25*(f.pk>.15?f.psr:shs));
  const cs=f.cover&&f.pk>.5,bl=f.cover&&!aim&&!cs;f.sm=(bl?2.1+(f.blm||0):((f.rush&&!aim)?2.2:(cs&&!aim?1.8:(aim?1:1.5))))*(aim?1:1+Math.min(.5,f.spd*.05));let d=ap.sub(o).normalize();if(bl){o.y=Math.max(1.35,f.cover.h+.2);const ab=ray.intersectObject(B.g,true),tp=ab.length?ab[0].point:cp.clone().addScaledVector(fw,45);d=tp.sub(o).normalize()}const a0=f.ammo[f.w];shoot(f,o,d,B);if(f.ammo[f.w]<a0&&!fire1)fireBuf=0}}
