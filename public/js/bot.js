/* Bot do treino */
/* ===== BOT: escolhe cobertura do lado oposto ao jogador, levanta pra atirar e se esconde, recarrega abaixado, flanqueia com a escopeta, rola pra desviar e executa ===== */
function moveB(f,tx,tz,sp,dt){const ex=tx-f.x,ez=tz-f.z,el=Math.hypot(ex,ez);if(el<.04)return el;let dx=ex/el,dz=ez/el;const lk=Math.min(1.1,el);
 if(clearD(f.x,f.z,dx,dz,lk,.42,null)<lk-.01){for(const a of[.45,-.45,.9,-.9,1.35,-1.35,1.9,-1.9]){const c=Math.cos(a+(f.av||0)),s=Math.sin(a+(f.av||0)),nx=dx*c-dz*s,nz=dx*s+dz*c;if(clearD(f.x,f.z,nx,nz,.9,.42,null)>=.89){dx=nx;dz=nz;break}}}
 const v=Math.min(sp*dt,el);f.x+=dx*v;f.z+=dz*v;f.mdx=dx;f.mdz=dz;return el}
function bCover(f){let best=null,bs=1e9;for(const s of lowCov){const ax=s.x-P.x,az=s.z-P.z,hx=Math.abs(ax)/s.w>Math.abs(az)/s.d,nx=hx?Math.sign(ax)||1:0,nz=hx?0:Math.sign(az)||1,
  half=(hx?s.w:s.d)/2,hf=Math.max(0,(hx?s.d:s.w)/2-.6),u=clamp(hx?(P.z-s.z):(P.x-s.x),-hf,hf),tx=s.x+(hx?0:u)+nx*(half+.65),tz=s.z+(hx?u:0)+nz*(half+.65);
  if(Math.abs(tx)>A-1.2||Math.abs(tz)>A-1.2||hitS(tx,tz,.5,s))continue;const dp=Math.hypot(tx-P.x,tz-P.z);if(dp<6)continue;
  const e=new T.Vector3(tx,1.5,tz),pe=new T.Vector3(P.x,1.5,P.z);ray.set(e,pe.clone().sub(e).normalize());ray.far=dp;const los=!ray.intersectObjects(sm).length; // levantando dali dá pra ver o jogador?
  const k=Math.hypot(tx-f.x,tz-f.z)*.8+Math.abs(dp-(f.w?7:14))*.6+(los?0:7)+(f.cg&&s===f.cg.s?2.5:0)+R()*2.5;if(k<bs){bs=k;best={s,nx,nz,tx,tz}}}return best}
function updB(dt){const f=B;f.ap=Math.atan2(eye(P).y-eye(f).y,Math.hypot(P.x-f.x,P.z-f.z));if(f.dead>0){f.dead-=dt;if(f.dead<=0)respawn(f);common(f,dt);return}
 const dx=P.x-f.x,dz=P.z-f.z,dist=Math.hypot(dx,dz),face=Math.atan2(-dx,-dz),spd=f.slow>now?.6:1;
 if(f.stun>now){f.fl=1;f.pop=false;if(f.kb&&f.kb.t>0){f.kb.t-=dt;const q=f.kb.t/.3;f.x+=f.kb.vx*dt*q;f.z+=f.kb.vz*dt*q}common(f,dt);return}
 if(f.exec){execStep(f,dt);common(f,dt);return}
 if(f.down){const l=dist||1;moveB(f,f.x-dx/l*2,f.z-dz/l*2,1.05,dt);f.yaw=face;downTick(f,dt);common(f,dt);return} // derrubado: rasteja pra longe
 if(f.roll){const r=f.roll;r.t+=dt;const k=r.t/.7;if(k>=1)f.roll=null;else{const v=11*(1-.55*k)*r.k;f.x+=r.dx*v*dt;f.z+=r.dz*v*dt}f.yaw=face;common(f,dt);return}
 if(P.down&&P.dead<=0&&!BD.passive){f.cover=null;f.pop=false;f.rs=0;f.yaw=face;if(dist<1.5)startExec(f,P);else moveB(f,P.x,P.z,6*spd,dt);common(f,dt);return} // vai executar
 /* arma: escopeta de perto, fuzil de longe (com histerese) */
 const nw=f.w?(dist>10?0:1):(dist<6.5?1:0);if(nw!=f.w&&f.rl<=0){f.w=nw;f.dr=DR}
 /* linha de visão: de pé (pra decidir se vale levantar) */
 const o=new T.Vector3(f.x,1.5+(f.y||0),f.z),tg=eye(P);ray.set(o,tg.clone().sub(o).normalize());ray.far=dist;const clear=!ray.intersectObjects(sm).length;
 f.t-=dt;if(f.t<=0){f.t=2.2+R()*2.5;const agg=dist<7||(P.rl>0&&dist<16&&R()<.6)||(f.hp>60&&R()<.18);
  if(agg&&!(f.hp<40&&dist>5)){f.mode='push';f.av=(R()-.5)*.8}else{const c=bCover(f);if(c){if(!f.cg||c.s!==f.cg.s||f.mode!='cover'){f.cg=c;f.cover=null}f.mode='cover'}else f.mode='push'}}
 let mv=false;
 if(f.mode=='push'){f.cover=null;f.pop=false;const stop=f.w?2:9;if(dist>stop||!clear){const zz=dist>4?Math.sin(now*2.4+f.sx)*.9:0,l=dist||1;moveB(f,P.x+(-dz/l)*zz*3,P.z+(dx/l)*zz*3,(dist>12&&!clear?7:5.6)*spd,dt);mv=true}}
 else if(f.cg){const c=f.cg;if(!f.cover){const el=moveB(f,c.tx,c.tz,(clear?5:6.6)*spd,dt);mv=true;if(el<.3){f.x=c.tx;f.z=c.tz;f.cover=c.s;f.cn=[c.nx,c.nz];f.pop=false;f.pt=now+.5+R()*.6}}
  else{ // na cobertura: ciclo esconde/levanta
   const ce=new T.Vector3(f.x,.85,f.z);ray.set(tg,ce.clone().sub(tg).normalize());ray.far=Math.hypot(ce.x-tg.x,ce.y-tg.y,ce.z-tg.z);if(!ray.intersectObjects(sm).length&&!f.pop)f.t=Math.min(f.t,.15); // flanqueado: troca de cobertura
   if(now>f.pt){f.pop=!f.pop&&f.rl<=0&&f.ammo[f.w]>0;f.pt=now+(f.pop?1.1+R()*1.3:.7+R()*1.1)}
   if(f.pop&&!clear){f.nv=(f.nv||0)+dt;if(f.nv>1.4){f.nv=0;f.t=0}}else f.nv=0; // levantou e não vê ninguém: reposiciona
   if(!f.pop&&f.ammo[f.w]<W[f.w].mag*.45)reload(f)}}
 f.rs=mv&&!clear&&f.mode=='push'&&dist>12?Math.min(1,(f.rs||0)+dt*2):0;
 f.yaw=(clear||f.cover||!mv)?face:Math.atan2(-(f.mdx||0),-(f.mdz||0));
 /* desvio: tomou tiro em campo aberto → cambalhota pro lado */
 if(!f.cover&&now-f.hurtT<.05&&now>(f.dg||0)&&R()<.35){f.dg=now+2.5;const sg=R()<.5?1:-1,l=dist||1;startRoll(f,-dz/l*sg,dx/l*sg,1.5)}
 f.react=clear?f.react+dt:0;
 const can=(f.mode=='push'||f.pop||!f.cover)&&(f.w?dist<10:true);
 if(clear&&can&&f.react>BD.react&&P.dead<=0&&!P.down&&!BD.passive){const d=tg.sub(o).normalize();d.x+=(R()-.5)*BD.noise;d.y+=(R()-.5)*BD.noise*.6;d.z+=(R()-.5)*BD.noise;shoot(f,o,d.normalize(),P)}
 common(f,dt)}
