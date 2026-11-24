/* Controle (Gamepad API) */
/* ===== CONTROLE (Gamepad API) · binds, sensibilidade e aim assist configuráveis em CONFIGURAÇÕES > CONTROLE ===== */
const GPD={gsx:1,gsy:1,gads:.75,gdz:.14,ginv:0,gaa:1,gvib:1,b_act:0,b_slide:1,b_jump:2,b_swap:3,b_rel:5,b_aim:6,b_fire:7,b_gna:14,b_lan:15,b_pause:9};
Object.assign(CFG,Object.assign({},GPD,CFG));
const BN=['A','B','X','Y','LB','RB','LT','RT','VIEW','START','L3','R3','↑','↓','←','→'],bsel=(k,t,n)=>({k,t,type:'sel',opts:BN,note:n});
SETS.splice(1,0,['CONTROLE',[
 {k:'gsx',t:'Sensibilidade horizontal',min:.3,max:3,step:.05,f:v=>v.toFixed(2)+'x'},{k:'gsy',t:'Sensibilidade vertical',min:.3,max:3,step:.05,f:v=>v.toFixed(2)+'x'},
 {k:'gads',t:'Sensibilidade ao mirar',min:.3,max:1.5,step:.05,f:v=>v.toFixed(2)+'x',note:'Multiplicador aplicado enquanto você segura o botão de mira.'},
 {k:'gdz',t:'Zona morta dos analógicos',min:.05,max:.35,step:.01,f:pc,note:'Aumente se a mira ou o personagem andam sozinhos (drift).'},{k:'ginv',t:'Inverter eixo Y',type:'check'},{k:'gvib',t:'Vibração',type:'check'},
 {k:'gaa',t:'Aim assist',type:'sel',opts:['Desligado','Leve','Médio'],note:'Só no controle: reduz a velocidade da mira e puxa de leve para o inimigo quando você mira ou atira perto dele.'},
 bsel('b_act','Ação (toque) / Correr (segurar)','Cobertura, cambalhota, transpor, corner rush e corrida. Nos menus, A e B continuam confirmando e voltando.'),
 bsel('b_slide','Slide'),bsel('b_jump','Pular / vault / mantle'),bsel('b_rel','Recarregar'),bsel('b_swap','Alternar arma'),bsel('b_gna','Sacar Escopeta'),bsel('b_lan','Sacar Fuzil'),bsel('b_aim','Mirar'),bsel('b_fire','Atirar'),bsel('b_pause','Pausar')]]);
const GP={pb:[],k:{},hold:{},at:0,ad:0,sp:false,aim:false,fire:false,el:null,fi:0,hp:100,last:-9};
const gpSet=(c,v)=>{v=v?1:0;if((GP.k[c]||0)!==v){GP.k[c]=v;K[c]=v}};
const gpGrp=e=>e.closest('.seg,.sw,.tabs')||e;
const gpClr=()=>{fire1=aim=false;for(const k in K)K[k]=0;GP.k={};GP.aim=GP.fire=false};
function gpRumble(g,s,w,d){if(!CFG.gvib)return;try{const a=g.vibrationActuator;if(a&&a.playEffect)a.playEffect('dual-rumble',{duration:d,strongMagnitude:s,weakMagnitude:w})}catch(e){}}
function gpLockNow(){if(!playing||over)return;locked=true;$('ov').style.display='none';$('hud').style.display='block';document.body.style.cursor='none'} // entra no jogo sem exigir pointer lock do mouse
function gpPause(){if(document.pointerLockElement){document.exitPointerLock();return}locked=false;gpClr();if(playing)showScr(over?'over':'pause')}
function gpMenu(e){const scr=[...document.querySelectorAll('#ov .scr')].find(x=>x.style.display=='flex');if(!scr)return;
 const els=[...scr.querySelectorAll('button:not(:disabled),input')].filter(x=>x.offsetParent);if(!els.length)return;
 let el=els.includes(GP.el)?GP.el:els[Math.min(GP.fi,els.length-1)];
 if(e.up||e.down){const d=e.down?1:-1,g=gpGrp(el);let j=els.indexOf(el)+d;while(j>=0&&j<els.length&&gpGrp(els[j])===g)j+=d;
  if(j>=0&&j<els.length){const g2=gpGrp(els[j]),m=els.filter(x=>gpGrp(x)===g2);el=m.find(x=>x.classList.contains('on'))||m[0]}}
 if(e.left||e.right){if(el.type=='range'){const st=+el.step||1;el.value=clamp(+el.value+(e.right?st:-st),+el.min,+el.max);el.dispatchEvent(new Event('input'))}
  else{const m=els.filter(x=>gpGrp(x)===gpGrp(el));el=m[clamp(m.indexOf(el)+(e.right?1:-1),0,m.length-1)]}}
 if(el!==GP.el)el.scrollIntoView({block:'nearest'});GP.el=el;GP.fi=Math.max(0,els.indexOf(el));
 document.querySelectorAll('.gpf').forEach(x=>x.classList.remove('gpf'));el.classList.add('gpf');
 if(e.a){if(el.tagName=='INPUT'){if(el.type!='range')el.focus()}else{const a=el.dataset.a;el.click();if(a=='start'||a=='restart'||a=='cont')gpLockNow()}}
 if(e.b){const bk=els.find(x=>['back','mpback','mpleave'].includes(x.dataset.a));if(bk)bk.click()}}
/* AIM ASSIST (só controle): inimigo dentro de um cone pequeno e sem parede no meio */
function gpTarget(cone){const fl=MP.on?mpTargets():(B.dead<=0?[B]:[]);if(!fl.length)return null;const o=cam.position,cp=Math.cos(pitch);let best=null;
 for(const f of fl){const dx=f.x-o.x,dy=(f.y||0)+1.1-o.y,dz=f.z-o.z,h=Math.hypot(dx,dz),d=Math.hypot(h,dy);if(d<2||d>60)continue;
  const yt=Math.atan2(-dx,-dz),eY=Math.atan2(Math.sin(yt-P.yaw),Math.cos(yt-P.yaw)),eP=Math.atan2(dy,h)-pitch,ang=Math.hypot(eY*cp,eP);
  if(ang<cone&&(!best||ang<best.ang)){ray.set(o,new T.Vector3(dx,dy,dz).normalize());ray.far=d;if(!ray.intersectObjects(sm).length)best={eY,eP,ang,k:1-ang/cone}}}
 return best}
function gpPoll(dt){const g=(navigator.getGamepads?[...navigator.getGamepads()]:[]).find(x=>x&&x.connected);if(!g)return;
 const bt=g.buttons.map(x=>x.pressed),ed=i=>bt[i]&&!GP.pb[i],tv=i=>g.buttons[i]?g.buttons[i].value:0,dn=i=>(i==6||i==7)?tv(i)>.3:!!bt[i];
 const dz=(x,y,d)=>{const m=Math.hypot(x,y);if(m<d)return[0,0];const s=(m-d)/(1-d)/m;return[x*s,y*s]};
 const[lx,ly]=dz(g.axes[0]||0,g.axes[1]||0,CFG.gdz+.08),[rx,ry]=dz(g.axes[2]||0,g.axes[3]||0,CFG.gdz);
 if($('ov').style.display!='none'){ // ---- menus
  if(locked&&!document.pointerLockElement){locked=false;gpClr()}document.body.style.cursor='';
  const d={up:bt[12]||ly<-.6,down:bt[13]||ly>.6,left:bt[14]||lx<-.6,right:bt[15]||lx>.6},e={};
  for(const k in d){if(d[k]){if(!GP.hold[k]){GP.hold[k]=now+.4;e[k]=1}else if(now>GP.hold[k]){GP.hold[k]=now+.12;e[k]=1}}else GP.hold[k]=0}
  e.a=ed(0);e.b=ed(1);GP.ad=dn(CFG.b_act)?2:0;
  if((ed(CFG.b_pause)||ed(9))&&playing&&!over&&cur=='pause'){menuAct('cont');gpLockNow()}else gpMenu(e);
  GP.pb=bt;return}
 if(GP.el){GP.el=null;document.querySelectorAll('.gpf').forEach(x=>x.classList.remove('gpf'))}
 if(!locked){GP.pb=bt;return}
 // ---- jogo: analógico esquerdo vira WASD (compatível com cobertura, corner e roadie run)
 gpSet('KeyD',lx>.4);gpSet('KeyA',lx<-.4);gpSet('KeyS',ly>.4);gpSet('KeyW',ly<-.4);
 // Ação: toque curto = Espaço (cobertura/cambalhota/transpor/trocar/corner rush) · segurar = sprint (Shift)
 const a=dn(CFG.b_act);if(a&&!GP.ad){GP.ad=1;GP.at=now;GP.sp=false}if(GP.ad==1&&a&&now-GP.at>.2)GP.sp=true;
 if(!a){if(GP.ad==1&&!GP.sp){K.Space=1;act(actionKey);setTimeout(()=>{K.Space=0},130)}GP.ad=0;GP.sp=false}
 gpSet('ShiftLeft',a&&GP.sp);
 const av=dn(CFG.b_aim),fv=dn(CFG.b_fire);if(av!==GP.aim){GP.aim=av;aim=av}
 if(fv!==GP.fire){GP.fire=fv;fire1=fv;if(fv)fireBuf=now+.25}
 if(ed(CFG.b_slide))act(slideKey);if(ed(CFG.b_jump))act(jumpKey);if(ed(CFG.b_swap))swap(1-P.w);if(ed(CFG.b_gna))swap(1);if(ed(CFG.b_lan))swap(0);
 if(ed(CFG.b_rel)){if(P.rl>0&&P.ar)activeReload();else reload(P)}
 // mira: curva do analógico + aim assist leve (fricção perto do inimigo e pequena atração enquanto o analógico se move)
 const rm=Math.hypot(rx,ry),tg=(CFG.gaa&&(aim||GP.fire)&&!rsLock&&P.dead<=0)?gpTarget(CFG.gaa==2?.085:.065):null;
 if(rm){const sn=aim?CFG.gads:1,cv=u=>Math.sign(u)*Math.pow(Math.abs(u),1.7),fr=tg?1-(1-[1,.78,.62][CFG.gaa])*tg.k:1;
  if(!rsLock)P.yaw-=cv(rx)*2.9*CFG.gsx*sn*fr*dt;pitch=clamp(pitch-(CFG.ginv?-1:1)*cv(ry)*1.9*CFG.gsy*sn*fr*dt,-1.1,1.1)}
 if(tg&&rm>.1){const w=Math.min(1,[0,1.3,2.6][CFG.gaa]*dt)*Math.min(1,rm*1.5)*tg.k;P.yaw+=tg.eY*w;pitch=clamp(pitch+tg.eP*w,-1.1,1.1)}
 if(P.hp<GP.hp-.5)gpRumble(g,.8,.6,220);GP.hp=P.hp;
 if(P.last!==GP.last){GP.last=P.last;gpRumble(g,P.w?.5:0,P.w?.8:.35,P.w?120:50)}
 if(ed(CFG.b_pause)){GP.pb=bt;gpPause();return}
 GP.pb=bt}
