/* Multiplayer via WebSocket */
/* ===== MULTIPLAYER: WebSocket · lobbies · times · kills · sync de jogadores (servidor Node no Render) ===== */
const MP={on:false,ws:null,me:0,team:0,room:null,rem:new Map(),sc:null,t:0};let mpFE=null;
const TCOL=[0x3a6ea5,0xa5443a,0x3a9a55,0xd0a030],FCOL=[0xa5443a,0x3a9a55,0xd0a030,0x8a4aa5,0x4aa5a5,0xa58a4a,0xa54a7a,0x6a6a6a],TNAME=['AZUL','VERMELHO','VERDE','AMARELO'],TMS=[0,2,3,4];
const MPO=[{k:'k',t:'Kills para vencer',type:'sel',opts:['5','10','15','20','30','50']},{k:'m',t:'Máximo de jogadores',type:'sel',opts:['2','3','4','6','8']},{k:'t',t:'Times',type:'sel',opts:['Todos contra todos','2 times','3 times','4 times']},{k:'x',t:'Vida zerada',type:'sel',opts:['Derrubado + execução','Morte direta']},{k:'map',t:'Mapa',type:'sel',opts:['Torre do Relógio'],note:'Mais mapas em breve.'}];
const tcss=c=>'#'+c.toString(16).padStart(6,'0'),r2=x=>Math.round(x*100)/100,mpSend=o=>{if(MP.ws&&MP.ws.readyState==1)MP.ws.send(JSON.stringify(o))};
const mpName=()=>{const n=$('mpn').value.trim().slice(0,14)||'Jogador';try{localStorage.setItem('arenax1.name',n)}catch(e){}return n};
const mpStat=t=>{$('mpst').textContent=t;$('rmst').textContent=t};
function mpConnect(){if(MP.ws&&MP.ws.readyState<=1)return;mpStat('Conectando… (no plano grátis do Render o servidor pode levar ~1 min para acordar)');
 const defaultServer=(location.hostname==='localhost'||location.hostname==='127.0.0.1')?'ws://localhost:3000/ws':'wss://geartec.onrender.com/ws';
const u=new URLSearchParams(location.search).get('server')||defaultServer;let ws;
 try{ws=new WebSocket(u)}catch(e){mpStat('URL do servidor inválida');return}
 MP.ws=ws;ws.onopen=()=>{mpStat('Conectado');mpSend({t:'list'})};
 ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}mpMsg(m)};
 ws.onclose=()=>{if(MP.ws!==ws)return;MP.ws=null;const was=MP.on;mpLeave(false);mpStat(was?'Conexão perdida com o servidor':'Sem conexão com o servidor')}}
function mpMsg(m){switch(m.t){
 case'me':MP.me=m.id;break;
 case'rooms':mpList(m.rooms);break;
 case'err':mpStat(m.m);break;
 case'room':MP.room=m;MP.team=(m.players.find(p=>p.id==MP.me)||{}).team|0;
  if(!MP.on){MP.on=true;showScr('room')}
  if(playing)for(const[id,r]of MP.rem)if(!m.players.some(p=>p.id==id)){sc.remove(r.g);sc.remove(r.shd);sc.remove(r.tag);MP.rem.delete(id)}
  if(cur=='room')mpRoomUI();break;
 case'start':mpStart();break;
 case'st':{const r=MP.rem.get(m.id);if(r)r.sn=m.s;break}
 case'fire':mpRFire(m);break;
 case'dmg':{const a=MP.rem.get(m.from);if(a){B.x=a.x;B.z=a.z}hurt(P,m.d,a||B,m.gib);break}
 case'kill':mpKill(m);break;
 case'end':mpEnd(m);break}}
function mpList(rs){const h=$('mplist');h.innerHTML='';if(!rs.length){h.innerHTML='<div class="row"><span>Nenhuma sala ainda. Crie a primeira!</span></div>';return}
 rs.forEach(r=>{const d=document.createElement('div'),l=document.createElement('span'),b=document.createElement('button');d.className='row';d.style.gridTemplateColumns='1fr auto';
  l.textContent=r.name+' · '+r.n+'/'+r.max+' · '+r.k+' kills · '+(r.t?r.t+' times':'todos contra todos')+(r.s=='playing'?' · EM JOGO':'');
  b.className='chk';b.textContent='ENTRAR';b.disabled=r.s!='lobby'||r.n>=r.max;b.onclick=()=>mpSend({t:'join',id:r.id,name:mpName(),skin:LP});d.append(l,b);h.appendChild(d)})}
function mpRoomUI(){const r=MP.room;if(!r)return;const host=r.host==MP.me,tm=TMS[r.cfg.t];$('rmt').textContent='SALA '+r.id+' · '+r.name;
 buildRows($('rmbody'),MPO,r.cfg,k=>mpSend({t:'cfg',cfg:{[k]:r.cfg[k]}}));$('rmbody').style.pointerEvents=host?'':'none';$('rmbody').style.opacity=host?'':'.6';
 const pl=$('rmpl');pl.innerHTML='';
 r.players.forEach(p=>{const d=document.createElement('div'),n=document.createElement('span');d.className='row';d.style.gridTemplateColumns='1fr auto';
  n.textContent=(p.id==r.host?'★ ':'')+p.name+(p.id==MP.me?' (você)':'');if(tm)n.style.color=tcss(TCOL[p.team]);d.appendChild(n);
  if(tm){const s=document.createElement('div');s.className='seg';for(let i=0;i<tm;i++){const b=document.createElement('button');b.textContent=TNAME[i];b.className=p.team==i?'on':'';b.style.borderColor=tcss(TCOL[i]);if(p.id==MP.me)b.onclick=()=>mpSend({t:'team',team:i});else b.disabled=true;s.appendChild(b)}d.appendChild(s)}
  pl.appendChild(d)});
 $('rmgo').style.display=host?'':'none';$('rmgo').disabled=r.players.length<2;if(!host)$('rmst').textContent='Aguardando o host iniciar…'}
function mkTag(n,c){const cv=document.createElement('canvas');cv.width=256;cv.height=48;const x=cv.getContext('2d');x.font='bold 30px Segoe UI,sans-serif';x.textAlign='center';x.lineWidth=6;x.strokeStyle='#000c';x.strokeText(n,128,34);x.fillStyle=tcss(c);x.fillText(n,128,34);
 const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),depthTest:false,transparent:true,fog:false}));s.scale.set(2.4,.45,1);s.renderOrder=9;sc.add(s);return s}
function mpClear(){for(const r of MP.rem.values()){sc.remove(r.g);sc.remove(r.shd);sc.remove(r.tag)}MP.rem.clear()}
function mpStart(){mpClear();const r=MP.room,tm=TMS[r.cfg.t];
 r.players.forEach((p,i)=>{if(p.id==MP.me)return;const f=fighter(tm?TCOL[p.team]:FCOL[i%8],0,0,0,Object.assign({},SKD,p.skin));
  Object.assign(f,{net:true,id:p.id,name:p.name,team:p.team,dx:0,dz:1,mt:0,ms:0,sn:null,tag:mkTag(p.name,tm?TCOL[p.team]:0xffffff)});f.g.visible=false;MP.rem.set(p.id,f)});
 B.dead=999;B.g.visible=false;B.shd.visible=false;P.score=B.score=0;MP.sc=null;over=false;playing=true;respawn(P);
 const si=r.players.findIndex(p=>p.id==MP.me)%SP.length;P.x=P.px=SP[si][0];P.z=P.pz=SP[si][1];P.yaw=P.by=Math.atan2(-P.x,-P.z)+Math.PI;
 $('n1').textContent=tm?'MEU TIME':'VOCÊ';$('n2').textContent=tm?'ADVERSÁRIO':'LÍDER';showScr('pause');$('pt').textContent='PARTIDA INICIADA'}
const mpTargets=()=>[...MP.rem.values()].filter(r=>r.sn&&r.dead<=0&&!(TMS[MP.room.cfg.t]&&r.team===MP.team));
const mpMinD=p=>{let m=99;for(const r of MP.rem.values())if(r.sn&&r.dead<=0)m=Math.min(m,Math.hypot(p[0]-r.x,p[1]-r.z));return m};
const mpFoe=()=>{for(const r of MP.rem.values())if(r.sn)return r;return B};
const mpHit=(t,d,gib)=>{mpSend({t:'dmg',to:t.id,d:Math.round(d),gib:!!gib});t.fl=1};
const mpFire=(o,e)=>{if(e)mpSend({t:'fire',o:[r2(o.x),r2(o.y),r2(o.z)],e:[r2(e.x),r2(e.y),r2(e.z)],w:P.w})};
function mpRFire(m){const r=MP.rem.get(m.id);if(!r)return;r.rec=1;r.last=now;r.dr=0;const o=new T.Vector3(...m.o),e=new T.Vector3(...m.e);
 tracer(o.clone().addScaledVector(e.clone().sub(o).normalize(),.8),e,m.w?0xffffff:0xffd070,m.w?.008:.016);
 const d=Math.hypot(r.x-P.x,r.z-P.z);shotSnd(m.w,clamp(1-d/45,.1,1)*.75,((r.x-P.x)*Math.cos(P.yaw)-(r.z-P.z)*Math.sin(P.yaw))/(d||1))}
function mpDie(t,s,gib){t.dead=2.5;t.g.visible=false;t.cover=null;t.rush=null;spawnGibs(t,gib?28:8);mpSend({t:'died',by:s&&s.id||0,gib:!!gib})}
function mpScore(){const s=MP.sc,r=MP.room;if(!s||!r)return;let me,o=0;
 if(TMS[r.cfg.t]){me=s.t[MP.team]||0;s.t.forEach((v,i)=>{if(i!=MP.team)o=Math.max(o,v)})}else{me=s.p[MP.me]||0;for(const id in s.p)if(id!=MP.me)o=Math.max(o,s.p[id])}P.score=me;B.score=o}
function mpKill(m){MP.sc=m.sc;mpScore();const nm=id=>id==MP.me?'Você':((MP.rem.get(id)||{}).name||'?');
 if(m.v!=MP.me){const r=MP.rem.get(m.v);if(r)spawnGibs(r,m.gib?28:8)}
 if(m.k==MP.me){hitT=killT=now;tick(620,.2,.06);say(m.gib?'💀 GIBADO!':'Você eliminou '+nm(m.v))}
 else if(m.v==MP.me)say(m.k?nm(m.k)+(m.gib?' gibou você':' eliminou você'):'Você morreu');else say(nm(m.k)+' eliminou '+nm(m.v))}
function mpEnd(m){if(!playing)return;MP.sc=m.sc;mpScore();let msg=m.why||'FIM DE JOGO';
 if(m.win){if(m.win.team!=null)msg=m.win.team==MP.team?'SEU TIME VENCEU!':'TIME '+TNAME[m.win.team]+' VENCEU!';else msg=m.win.id==MP.me?'VOCÊ VENCEU!':((MP.rem.get(m.win.id)||{}).name||'?')+' VENCEU!'}
 over=true;showScr('over',msg);document.exitPointerLock()}
function mpState(){const f=P;mpSend({t:'st',s:{x:r2(f.x),z:r2(f.z),y:r2(f.y||0),a:r2(f.yaw),p:r2(pitch),w:f.w,rs:r2(f.rs||0),c:f.cover?covers.indexOf(f.cover):-1,n:f.cover?f.cn:null,
 ms:f.roll?1:f.sd?2:f.vault?3:f.mantle?4:f.rush?5:f.slip?6:f.slide?7:f.exec?8:0,dn:f.down?1:0,pk:r2(f.pk||0),l:r2(f.lean||0),rl:f.rl>0?1:0,d:f.dead>0?1:0}})}
function mpUpdate(dt){MP.t+=dt;if(MP.t>=.05){MP.t=0;if(!over)mpState()}
 for(const r of MP.rem.values()){const s=r.sn;if(!s)continue;
  if(!r.init){r.init=1;r.x=r.px=s.x;r.z=r.pz=s.z;r.y=s.y;r.yaw=s.a}
  const k=Math.min(1,dt*14),ox=r.x,oz=r.z;
  if(Math.hypot(s.x-r.x,s.z-r.z)>5){r.x=r.px=s.x;r.z=r.pz=s.z}else{r.x+=(s.x-r.x)*k;r.z+=(s.z-r.z)*k}
  r.yaw+=Math.atan2(Math.sin(s.a-r.yaw),Math.cos(s.a-r.yaw))*k;r.y+=(s.y-r.y)*k;
  const mx=r.x-ox,mz=r.z-oz,ml=Math.hypot(mx,mz);if(ml>.003){r.dx=mx/ml;r.dz=mz/ml}
  r.ap=s.p;r.w=s.w;r.rs=s.rs;r.pk=s.pk;r.lean=s.l;r.air=s.y>.1?1:0;r.vy=s.y>r.y?1:-1;r.dead=s.d?1:0;r.rl=s.rl?W[s.w].rl*.5:0;
  r.cover=s.c>=0?covers[s.c]:null;r.cn=s.n||null;r.rh=s.rs>.5?Math.atan2(-r.dx,-r.dz):null;
  if(r.ms!==s.ms){r.ms=s.ms;r.mt=0}r.mt+=dt;const t=r.mt,dx=r.dx,dz=r.dz,q=r.ms;
  r.roll=q==1?{t:Math.min(t,.69),dx,dz}:null;r.sd=q==2?{t:Math.min(t,.9),T:1,dx,dz}:null;r.vault=q==3?{t:t,nx:-dx,nz:-dz}:null;r.mantle=q==4?{t:Math.min(t,.7),T:.7,dx,dz}:null;
  r.rush=q==5?{t:1,T0:0,d:[dx,dz],tx:0,tz:0,sg:1}:null;r.slip=q==6?{t:t,T:.5,nx:-dx,nz:-dz,s:{h:1}}:null;r.slide=q==7?{nx:-dx,nz:-dz}:null;r.exec=q==8?{t:Math.min(t,.79),T:.8}:null;r.down=s.dn?{t:0,T:99,hp:1}:null;
  common(r,dt);if(r.dead>0)r.g.visible=false;r.tag.position.set(r.x,r.y+2.55,r.z);r.tag.visible=r.g.visible}}
function mpLeave(main){mpSend({t:'leave'});MP.on=false;MP.room=null;mpClear();playing=false;over=false;document.exitPointerLock();B.dead=0;respawn(B);respawn(P);showScr(main?'main':'mp');if(!main)mpSend({t:'list'})}
function mpAct(a){
 if(a=='mp'){from='main';try{$('mpn').value=localStorage.getItem('arenax1.name')||''}catch(e){}showScr('mp');mpConnect();mpSend({t:'list'});return true}
 if(a=='mpback'){showScr('main');return true}
 if(a=='mprefresh'){mpConnect();mpSend({t:'list'});return true}
 if(a=='mpcreate'){mpConnect();mpSend({t:'create',name:mpName(),skin:LP});return true}
 if(a=='mpstart'){mpSend({t:'start'});return true}
 if(a=='mpleave'){mpLeave(false);return true}
 if(MP.on&&a=='restart'){if(over){over=false;playing=false;mpClear();B.dead=0;respawn(B);respawn(P);showScr('room');mpRoomUI()}return true}
 if(MP.on&&a=='menu'){mpLeave(true);return true}
 return false}
setInterval(()=>{if(cur=='mp')mpSend({t:'list'})},3000);
