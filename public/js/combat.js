/* Som, tracers, dano/derrubado/execução, tiro, pose e física comum */
let AC=null,MG=null,NB=null;
function audio(){if(AC)return AC;try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=CFG.vol;MG.connect(AC.destination);const n=AC.sampleRate*.6|0;NB=AC.createBuffer(1,n,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1}catch(e){AC=null}return AC}
function aout(pan){if(pan&&AC.createStereoPanner){const p=AC.createStereoPanner();p.pan.value=clamp(pan,-1,1);p.connect(MG);return p}return MG}
function tick(fr,d,v,ty){try{if(!audio())return;const o=AC.createOscillator(),g=AC.createGain();o.type=ty||'square';o.frequency.value=fr;g.gain.value=v*CFG.sfx;o.connect(g);g.connect(MG);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function shotSnd(w,v,pan){try{if(!audio()||v<=0||CFG.sfx<=0)return;const t=AC.currentTime,o=aout(pan),vol=v*CFG.sfx;
 const n=AC.createBufferSource();n.buffer=NB;const fl=AC.createBiquadFilter();fl.type='bandpass';fl.frequency.value=w?900:2600;fl.Q.value=.7;const g=AC.createGain();g.gain.setValueAtTime(vol*(w?.9:.5),t);g.gain.exponentialRampToValueAtTime(.001,t+(w?.28:.09));n.connect(fl);fl.connect(g);g.connect(o);n.start(t);n.stop(t+.3);
 const so=AC.createOscillator(),sg=AC.createGain();so.type='sine';so.frequency.setValueAtTime(w?150:200,t);so.frequency.exponentialRampToValueAtTime(40,t+(w?.22:.1));sg.gain.setValueAtTime(vol*(w?.8:.45),t);sg.gain.exponentialRampToValueAtTime(.001,t+(w?.25:.12));so.connect(sg);sg.connect(o);so.start(t);so.stop(t+.3)}catch(e){}}
const TM={};const TG=new T.CylinderGeometry(1,1,1,5),UP=new T.Vector3(0,1,0);
function tracer(a,b,c,r){const d=b.clone().sub(a),L=d.length();if(L<.3)return;d.normalize();const e=Math.min(L,14),m=new T.Mesh(TG,TM[c]||(TM[c]=new T.MeshBasicMaterial({color:c})));m.position.copy(a).addScaledVector(d,e/2);m.quaternion.setFromUnitVectors(UP,d);m.scale.set(r,e,r);m.r=r;m.life=.07;sc.add(m);tr.push(m)}
const SPM=new T.MeshBasicMaterial({color:0xffb050});
function spark(p,n){for(let i=0;i<n;i++){const m=new T.Mesh(GG,SPM);m.scale.setScalar(.35);m.position.copy(p);m.v=new T.Vector3((R()-.5)*5,R()*4,(R()-.5)*5);m.life=.35;sc.add(m);gibs.push(m)}}
const GG=new T.BoxGeometry(.18,.18,.18),GM=[new T.MeshBasicMaterial({color:0x9a0f0f}),new T.MeshBasicMaterial({color:0x5a0a0a})];function spawnGibs(f,n){for(let i=0;i<n;i++){const m=new T.Mesh(GG,GM[i%3?0:1]);m.position.set(f.x,1+R(),f.z);m.v=new T.Vector3((R()-.5)*8,R()*6,(R()-.5)*8);m.life=2.5;sc.add(m);gibs.push(m)}}
function say(t){$('msg').textContent=t;setTimeout(()=>{if($('msg').textContent==t)$('msg').textContent=''},1400)}
/* DERRUBADO (DBNO): vida zerada sem gib = cai no chão, rasteja e sangra; o inimigo executa (E / X) ou termina com tiros */
const dbno=()=>MP.on&&MP.room?(MP.room.cfg.x|0)==0:!!TR.dbno;
function goDown(t,s){t.hp=0;t.down={t:0,T:12,hp:45,by:s};t.cover=t.cn=null;t.slide=t.vault=t.roll=t.rush=t.sd=t.mantle=t.slip=t.exec=null;t.rl=0;t.ar=null;t.vx=t.vz=0;t.rs=0;t.pk=t.pkT=t.po=t.lean=0;t.pop=false;
 if(t===P)say('DERRUBADO! Rasteje pra longe');else if(s===P){say('INIMIGO DERRUBADO · E / X = EXECUTAR');hitT=killT=now;tick(420,.18,.06)}}
function downTick(f,dt){f.down.t+=dt;if(f.down.t>=f.down.T)die(f,f.down.by||f,false)}
function hurt(t,d,s,gib){if(t.net){if(t.dead<=0)mpHit(t,d,gib);return}if(t.dead>0||t.prot>now)return;t.hurtT=now;t.fl=1;t.slow=now+.3;if(t===P){shk=Math.min(1,shk+.5);dmgT=now;tick(80,.18,.1,'sine')}
 if(t.down){t.down.hp-=d;if(t.down.hp<=0||gib)die(t,s,gib);return}
 t.hp-=d;if(t.hp<=0){if(!gib&&dbno())goDown(t,s);else die(t,s,gib)}}
/* EXECUÇÃO: pisão no inimigo derrubado */
function execTarget(f){const l=f===P?(MP.on?[...MP.rem.values()].filter(r=>r.sn&&!(TMS[MP.room.cfg.t]&&r.team===MP.team)):[B]):[P];for(const q of l)if(q.down&&q.dead<=0&&Math.hypot(q.x-f.x,q.z-f.z)<1.9)return q;return null}
function startExec(f,tg){f.exec={t:0,T:.8,tg,done:0};f.cover=f.cn=null;f.vx=f.vz=0;f.rs=0;f.yaw=Math.atan2(-(tg.x-f.x),-(tg.z-f.z));return true}
function execKey(){const f=P;if(f.dead>0||f.down||f.exec||f.vault||f.slip||f.roll||f.rush||f.mantle||f.sd||f.air)return false;const q=execTarget(f);return q?startExec(f,q):false}
function execStep(f,dt){const e=f.exec;e.t+=dt;if(!e.done&&e.t>.42){e.done=1;if(f===P){shk=1;tick(70,.3,.14,'sine')}if(e.tg&&e.tg.down&&e.tg.dead<=0)hurt(e.tg,999,f,'ex')}if(e.t>=e.T)f.exec=null}
function die(t,s,gib){t.down=null;t.exec=null;if(MP.on){mpDie(t,s,gib);return}if(s===P){if(P.w)pdots.forEach(d=>{if(now-d.t<PD.life)pdStyle(d.e,PD.kill)});hitT=killT=now;tick(620,.2,.06)}t.dead=2.5;t.g.visible=false;t.cover=null;t.rush=null;spawnGibs(t,gib?28:8);s.score++;
 if(gib)say(gib=='ex'?(s===P?'☠ EXECUTADO!':'Você foi executado!'):(s===P?'💀 GIBADO!':'Você foi gibado!'));
 if(s.score>=BD.goal){over=true;document.exitPointerLock();showScr('over',s===P?'VOCÊ VENCEU!':'O BOT VENCEU!')}}
const SP=[[0,20],[-12,19],[12,19],[-12,-19],[12,-19],[0,-20],[-15,-3],[15,3]];
function respawn(f){const o=MP.on&&f===P?mpFoe():f===P?B:P,c=SP.map(p=>({p,d:MP.on&&f===P?mpMinD(p):Math.hypot(p[0]-o.x,p[1]-o.z)})).sort((a,b)=>b.d-a.d).slice(0,3),s=c[Math.floor(R()*3)].p;
 f.x=s[0];f.z=s[1];f.yaw=Math.atan2(o.x-f.x,o.z-f.z)+Math.PI;f.by=f.yaw;if(f===P)pitch=0;f.hp=100;f.ammo=[30,6];f.rl=0;f.ar=null;f.bst=[1,1];f.dr=DR+.1;f.dead=0;f.cover=null;f.cn=null;f.slide=f.vault=f.roll=f.rush=f.sd=f.mantle=f.slip=f.down=f.exec=null;f.pop=false;f.t=0;f.cg=null;f.y=f.vy=f.rs=f.air=0;f.vx=f.vz=0;f.px=f.x;f.pz=f.z;f.prot=now+2;f.g.visible=true}
function reload(f){const w=W[f.w];if(!f.down&&f.rl<=0&&f.dr<=0&&f.ammo[f.w]<w.mag){f.rl=w.rl;if(f===P)tick(260,.05,.06);
 if(f===P){f.ar={t:0,dur:w.rl,z0:w.az,zw:w.aw,pw:w.ap,st:'run',end:0};f.bst[f.w]=1}}} // jogador: abre a barra de recarga ativa
/* RECARGA ATIVA: R de novo com o marcador na zona clara = recarrega na hora + dano extra no pente (núcleo = perfeita); fora da zona = trava (+1s) */
function activeReload(){const f=P,a=f.ar;if(!a||a.st!='run'||f.rl<=0||a.t<.12)return;const p=a.t/a.dur;
 if(p>=a.z0&&p<=a.z0+a.zw){const perf=Math.abs(p-(a.z0+a.zw/2))<=a.pw/2;a.st=perf?'perfect':'ok';a.end=now;f.rl=0;f.ammo[f.w]=W[f.w].mag;f.bst[f.w]=perf?1.5:1.3}
 else{a.st='jam';f.rl+=1}}
function shoot(f,o,d,foe){
 const w=W[f.w],bm=(f.bst?f.bst[f.w]:1)*(f===B?BD.dmg:1);if(f.cd>0||f.rl>0||f.dead>0||f.dr>0)return;
 if(f.ammo[f.w]<=0){reload(f);return}
 f.cd=w.rate;f.rec=1;{const dd=f===P?0:Math.hypot(f.x-P.x,f.z-P.z);shotSnd(f.w,f===P?1:clamp(1-dd/45,.1,1)*.75,f===P?0:((f.x-P.x)*Math.cos(P.yaw)-(f.z-P.z)*Math.sin(P.yaw))/(dd||1))}if(f.sm>2&&f.sm<5)f.blm=Math.min(1.6,(f.blm||0)+.2);if(f===P)shk=Math.min(1,shk+(w.pel>1?.9:.3));f.ammo[f.w]--;f.last=now;f.prot=0;let hits=0,dist=99;const hp=[];
 const FL=(f===P&&MP.on)?mpTargets():[foe];FL.forEach(q=>{q.g.updateMatrixWorld(true);q.nh=0});
 for(let i=0;i<w.pel;i++){
  const v=d.clone();const sx=f.sm||1;v.x+=(R()-.5)*w.spr*2*sx;v.y+=(R()-.5)*w.spr*2*sx;v.z+=(R()-.5)*w.spr*2*sx;v.normalize();
  ray.set(o,v);ray.far=w.rng;
  const hs=ray.intersectObjects([...sm,...FL.map(q=>q.g)],true);let end=o.clone().addScaledVector(v,w.rng);
  if(hs.length){end=hs[0].point;let p=hs[0].object;while(p.parent&&!FL.some(q=>q.g===p))p=p.parent;const fo=FL.find(q=>q.g===p);
   if(fo&&fo.dead<=0){hits++;hp.push(end);dist=hs[0].distance;fo.nh++;fo.nd=dist;if(w.pel==1)hurt(fo,w.dmg*bm*(1-.5*dist/70),f)}else if(!fo&&(w.pel==1||i==0))spark(end,3)}
  (mpFE=end,tracer)(o.clone().addScaledVector(v,.8),end,f.bst&&f.bst[f.w]>1?0xff6a2a:w.c,w.pel>1?.008:.016)}
 if(f===P&&hits){if(w.pel>1)pelletHits(hp);else hitT=now;tick(w.pel>1?900:1500,.04,.035)}if(w.pel>1)for(const fo of FL)if(fo.nh){const hh=fo.nh,dd=fo.nd;if(dd<3.6&&hh>=6)hurt(fo,999,f,true);else hurt(fo,hh*15*bm*Math.max(.2,1-dd/18),f)}
 if(MP.on&&f===P)mpFire(o,mpFE);if(f===P){const kk=w.pel>1?.05:.006*(1+(f.blm||0)*.3);pitch=clamp(pitch+kk,-1.1,1.1);recA+=kk*.7;f.yaw+=(R()-.5)*(w.pel>1?.012:.0045)}}
function pose(f,dt){const g=f.g,k=Math.min(1,dt*14),sp=f.spd,run=clamp(sp/6,0,1),ai=f===P?(aim||f.pk>.3):(!!f.pop||now-f.last<.7),v=f.vault,c=f.down?0:f.cr,
 spr=(f.rs||0)>.6&&!f.cover&&!ai&&!f.roll&&!f.sd,
 rh=f.rush?(f.rush.d||[f.rush.tx*f.rush.sg,f.rush.tz*f.rush.sg]):null,
 dirY=f.down&&sp>.3?Math.atan2(-(f.vx||0),-(f.vz||0)):f.roll?Math.atan2(-f.roll.dx,-f.roll.dz):(f.sd||f.mantle)?Math.atan2(-(f.sd||f.mantle).dx,-(f.sd||f.mantle).dz):(rh&&now-f.last>.4)?Math.atan2(-rh[0],-rh[1]):v?Math.atan2(v.nx,v.nz):f.slip?Math.atan2(f.slip.nx,f.slip.nz):f.slide?Math.atan2(f.slide.nx,f.slide.nz):(f.cover&&f.cn&&!ai)?Math.atan2(f.cn[0],f.cn[1]):(spr&&f.rh!=null)?f.rh:f.yaw;
 f.ph+=dt*(sp>.3?((f.rs||0)>.5?6.9:7.8):0); // cadência ligada à velocidade real: pés não escorregam
 const leg=i=>{const q=f.ph+i*Math.PI;return[Math.sin(q)*(spr?.95:.8)*run,-Math.max(0,Math.sin(q+1.3))*1.2*run]};
 const hnT=(f.cover&&f.cover.h<1.4&&f.crouch&&!f.down&&!f.slide&&!f.rush&&!f.vault&&!f.roll)?1-.65*clamp(f.pk||0,0,1):0;f.hn+=(hnT-f.hn)*Math.min(1,dt*10);const hn=f.hn; // hn = quanto o corpo se abaixa pra sumir atrás da cobertura baixa
 let A=leg(0),B=leg(1),ln=-.04-.4*(f.rs||0),ax=spr?-.6:(f.crouch&&!ai?-.2:f.ap*.9);
 for(const q of[A,B]){q[0]=q[0]*(1-c)+1.1*c;q[1]=q[1]*(1-c)-1.9*c}ln-=.12*c;for(const q of[A,B]){q[0]+=.45*hn;q[1]-=.75*hn}ln-=.6*hn;f.land=Math.max(0,f.land-dt);ln-=f.land*1.5;
 if(f.down){const cw=Math.sin(f.ph*.7)*clamp(sp/1.2,0,1)*.35;A=[1.35+cw,-2.25];B=[.35-cw,-1.9];ln=.85;ax=-1.15} // derrubado: ajoelhado e curvado, rastejando
 else if(f.exec){const k=f.exec.t/f.exec.T;if(k<.5){A=[1.55,-1.7];B=[-.05,-.15];ln=-.15;ax=-.5}else{A=[.3,-.1];B=[-.1,-.3];ln=.25;ax=-.6}} // execução: levanta o joelho e pisa
 else if(v){A=[1.3,-.6];B=[.2,-1.5];ln=-.35;ax=-.1}
 else if(f.slip){A=[1.35,-1.0];B=[1.05,-1.2];ln=-.25;ax=.15} // capô: quadril de lado, pernas dobradas passando por cima
 else if(f.rush){if(f.rush.t<f.rush.T0){A=[1,-1.2];B=[-.4,-1.4];ln=-.5;ax=-.25}else{ln=-.42;ax=now-f.last<.35?f.ap*.9:-.7}}
 else if(f.sd){const k=f.sd.t/f.sd.T;A=[1.45,-.05];B=[.4,-2.3];ln=k>.75?.1:.5;ax=.1} // entrada: agacha · execução: perna esticada + tronco inclinado · saída (k>.75): levanta
 else if(f.mantle){const k=f.mantle.t/f.mantle.T;if(k<.5){A=[1.5,-1.2];B=[.9,-1.9];ln=-.5;ax=-1.1}else{A=[1.2,-1.6];B=[.2,-.9];ln=-.3;ax=-.4}}
 else if(f.air){const up=f.vy>0;A=up?[.9,-1.3]:[.35,-.4];B=up?[-.2,-.5]:[.2,-.4];ln=-.12;ax=-.3}
 else if(f.roll){A=[1.9,-2.5];B=[1.9,-2.5];ln=-1;ax=-.9}
 else if(f.slide){A=[1,-.5];B=[-.6,-.4];ln=-.55;ax=-.3}
 if(f.rl>0)ax-=.45*Math.sin(Math.PI*clamp(1-f.rl/W[f.w].rl,0,1));
 f.rec=Math.max(0,f.rec-dt*9);f.fl=Math.max(0,f.fl-dt*5);ax+=f.rec*.07;ln+=f.fl*.35;
 /* poses novas: mira no ombro (pernas abertas, tronco girado), sacar arma, tiro cego por cima da cobertura */
 const amT=f===P?(ai?1:(now-f.last<.3?.5:0)):(now-f.last<.7?1:0);f.am+=(amT-f.am)*Math.min(1,dt*12);
 const am=f.am,dw=f.dr>0?f.dr/DR:0,bf=!!(f.cover&&!ai&&!f.rush&&now-f.last<.3),stn=(1-clamp(sp/4,0,1))*(1-c)*((v||f.roll||f.slide||f.rush)?0:1);
 A[0]+=.32*am*stn;B[0]-=.26*am*stn;A[1]-=.12*am*stn;B[1]-=.3*am*stn;ln-=.08*am;ax=ax*(1-am)+(f.ap*.9+.1)*am;
 ax-=dw*dw*1.4;ln+=Math.sin(dw*Math.PI)*.22;

 f.bfw=(f.bfw||0)+((bf?1:0)-(f.bfw||0))*Math.min(1,dt*16);const bw=f.bfw;ax=ax*(1-bw)+clamp(.95+f.ap*.6,.5,1.3)*bw;ln-=.2*bw; // tiro cego: ombro sobe e braço estica pra fora, arma na altura da mira
 ax+=.75*(f.wps||0)*(1-am);ln-=.12*(f.wps||0);
 const yv=f.pyw==null?0:Math.atan2(Math.sin(f.yaw-f.pyw),Math.cos(f.yaw-f.pyw))/Math.max(dt,.001);f.pyw=f.yaw;f.ysw=(f.ysw||0)+(clamp(-yv*.03,-.2,.2)-(f.ysw||0))*Math.min(1,dt*9);
 const tg=[A[0],B[0],A[1],B[1],ln,ax],pj=f.pj;for(let i=0;i<6;i++)pj[i]+=(tg[i]-pj[i])*k;
 g.lT[0].rotation.x=pj[0];g.lT[1].rotation.x=pj[1];g.lK[0].rotation.x=pj[2];g.lK[1].rotation.x=pj[3];g.ch.rotation.x=pj[4];g.arm.rotation.x=pj[5];for(let i=0;i<2;i++)g.ft[i].rotation.x=clamp(-(pj[i]+pj[i+2])*.75,-1,1);
 g.ch.rotation.y=.15*am+Math.sin(f.ph)*.16*run*(1-am)*(f.cover?0:1);g.rig.rotation.y=-Math.sin(f.ph)*.09*run*(f.cover?0:1);g.ch.rotation.z=Math.sin(f.ph)*.07*(f.rs||0)*(f.air?0:1);g.hd.rotation.x+=((spr?0:f.ap*.6*(1-hn))-(bf?.5:0)-.35*hn-(f.roll?.8:0)-g.hd.rotation.x)*k;g.arm.position.set(0,.5+.07*am-dw*.12,f.rec*.07+(f.wps||0)*.16);g.gun.rotation.x=Math.sin(dw*Math.PI)*.6+dw*.5-.55*bw;g.gun.rotation.y=f.ysw||0;const br=Math.sin(now*1.8+(f===P?0:1.3))*(1-run*.6);g.chest.scale.set(g.cb[0]*(1+.012*br),g.cb[1]*(1+.02*br),g.cb[2]*(1+.012*br));g.hd.rotation.y=Math.sin(now*.6+(f===P?0:2))*.05*(1-run);g.gL.visible=!f.w;g.gN.visible=!!f.w;g.mz.visible=f.rec>.55&&f.dr<=0;g.mz.position.z=f.w?-.88:-1.08;g.mz.scale.setScalar(.75+R()*.5);
 const hy=i=>.08+.46*(Math.cos(pj[i])+Math.cos(pj[i]+pj[i+2]));
 g.rig.position.y=Math.max(hy(0),hy(1))+.05-1-.42*hn-.12*f.sk-(f.down?.12:0)+Math.abs(Math.sin(f.ph))*.05*(f.rs||0)+Math.sin(now*2)*.008;
 let lift=0;if(v)lift=vlift(v);else if(f.slip)lift=slipLift(f.slip);
 if(f.roll){const r=Math.min(1,f.roll.t/.7),env=clamp(Math.min(r*7,(1-r)*7),0,1);lift=Math.sin(Math.PI*r)*.04;g.piv.position.y=1-.38*env;g.piv.scale.setScalar(1-.2*env);g.piv.rotation.x=-Math.PI*2*(r*r*(3-2*r))}else{g.piv.position.y=1;g.piv.scale.setScalar(1);f.sk+=((f.sd||f.slip?1:0)-f.sk)*Math.min(1,dt*(f.slip?18:10));g.piv.rotation.x=(f.slip?.18:.35)*f.sk}g.piv.rotation.z=-(f.lean||0)*.3+(f.slip?.95*f.sk:0)-(f.steer||0)*.2*(f.rs||0);
 g.position.set(f.x,lift+(f.y||0),f.z);
 const b0=f.by??dirY;f.by=b0+Math.atan2(Math.sin(dirY-b0),Math.cos(dirY-b0))*Math.min(1,dt*(f.roll?40:16));g.rotation.y=f.by}
function common(f,dt){f.spd=Math.hypot(f.x-(f.px??f.x),f.z-(f.pz??f.z))/dt;f.px=f.x;f.pz=f.z;
 f.cd-=dt;f.blm=Math.max(0,(f.blm||0)-dt*1.2);if(f.dr>0)f.dr=Math.max(0,f.dr-dt);if(f.rl>0){f.rl-=dt;if(f.ar&&f.ar.st=='run')f.ar.t+=dt;if(f.rl<=0){f.ammo[f.w]=W[f.w].mag;f.ar=null}}
 if(now-f.hurtT>4&&f.hp<100&&!f.down)f.hp=Math.min(100,f.hp+25*dt);
 if(!f.vault&&!f.mantle&&!f.slip&&!f.net)for(const s of solids){if(f.y>=s.h-.12)continue;if(s.y0&&f.y+(f.sd?.8:1.9)<=s.y0)continue;const cx=clamp(f.x,s.x-s.w/2,s.x+s.w/2),cz=clamp(f.z,s.z-s.d/2,s.z+s.d/2);let dx=f.x-cx,dz=f.z-cz,d=Math.hypot(dx,dz);
  if(d<.55){if(d>0){f.x+=dx/d*(.55-d);f.z+=dz/d*(.55-d)}else{f.x+=.55}}}
 f.x=clamp(f.x,-A+1,A-1);f.z=clamp(f.z,-A+1,A-1);
 if(!f.vault&&!f.mantle&&!f.slip&&!f.net){let gh=0;for(const s of solids)if(!s.y0&&s.h<3&&Math.abs(f.x-s.x)<s.w/2+.12&&Math.abs(f.z-s.z)<s.d/2+.12&&s.h<=f.y+.3)gh=Math.max(gh,s.h);
  if(f.y>gh+.001||f.vy>0){f.vy-=24*dt;f.y+=f.vy*dt;f.air=1;if(f.y<=gh&&f.vy<=0){const imp=-f.vy;f.y=gh;f.vy=0;f.air=0;f.land=Math.min(.45,.12+imp*.03);f.rcv=Math.max(f.rcv,now+Math.min(.3,imp*.03))}}else{f.y=gh;f.vy=0;f.air=0}} // gravidade, queda de plataformas e pouso
 if(f.cover&&rd(f.cover,f.x,f.z)>1.5)f.cover=null;
 f.crouch=!!f.down||((!!(f.cover&&f.cover.h<1.4)||!!(f.rush&&f.rush.t<f.rush.T0))&&(f===P?(f.pk>.3||!aim):(!f.pop&&now-f.last>.45)));
 f.cr+=((f.crouch?1:0)-f.cr)*Math.min(1,dt*12);
 /* proximidade de parede à frente (na direção da corrida): alimenta a pose da arma/corpo */
 {let wpT=0;if(!f.cover&&!f.vault&&!f.slip&&!f.mantle&&!f.roll&&!f.sd){const hy=(f.rs>.5&&f.rh!=null)?f.rh:f.yaw,fx=-Math.sin(hy),fz=-Math.cos(hy);
  for(const o of solids){if(o.h<1.5||o.y0)continue;const cx=clamp(f.x,o.x-o.w/2,o.x+o.w/2),cz=clamp(f.z,o.z-o.d/2,o.z+o.d/2),dx=cx-f.x,dz=cz-f.z,d=Math.hypot(dx,dz);if(d>1.3)continue;const dp=d>0?(dx*fx+dz*fz)/d:1;if(dp<.35)continue;wpT=Math.max(wpT,clamp(1-(d-.55)/.75,0,1)*clamp((dp-.35)/.5,0,1))}}
  f.wps=(f.wps||0)+(wpT-(f.wps||0))*Math.min(1,dt*12)}
 pose(f,dt);
 if(f.dead<=0)f.g.visible=!(f.prot>now)||Math.floor(now*12)%2==0;f.shd.position.set(f.x,.03,f.z);f.shd.visible=f.g.visible&&!!CFG.shd;const ss=1-clamp((f.y||0)*.25,0,.5);f.shd.scale.set(ss,ss,1)}
