/* Pós-processamento (FSR), HUD e loop principal */
const VSH='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}';
/* Passo 1 (EASU-like): upscale Catmull-Rom com 9 amostras bilineares */
const FSH_E=`uniform sampler2D tDiffuse;uniform vec2 texSize;varying vec2 vUv;
void main(){
 vec2 samplePos=vUv*texSize;
 vec2 tp1=floor(samplePos-0.5)+0.5;
 vec2 f=samplePos-tp1;
 vec2 w0=f*(-0.5+f*(1.0-0.5*f));
 vec2 w1=1.0+f*f*(-2.5+1.5*f);
 vec2 w2=f*(0.5+f*(2.0-1.5*f));
 vec2 w3=f*f*(-0.5+0.5*f);
 vec2 w12=w1+w2;
 vec2 off12=w2/w12;
 vec2 t0=(tp1-1.0)/texSize;
 vec2 t3=(tp1+2.0)/texSize;
 vec2 t12=(tp1+off12)/texSize;
 vec3 c=vec3(0.0);
 c+=texture2D(tDiffuse,vec2(t0.x,t0.y)).rgb*w0.x*w0.y;
 c+=texture2D(tDiffuse,vec2(t12.x,t0.y)).rgb*w12.x*w0.y;
 c+=texture2D(tDiffuse,vec2(t3.x,t0.y)).rgb*w3.x*w0.y;
 c+=texture2D(tDiffuse,vec2(t0.x,t12.y)).rgb*w0.x*w12.y;
 c+=texture2D(tDiffuse,vec2(t12.x,t12.y)).rgb*w12.x*w12.y;
 c+=texture2D(tDiffuse,vec2(t3.x,t12.y)).rgb*w3.x*w12.y;
 c+=texture2D(tDiffuse,vec2(t0.x,t3.y)).rgb*w0.x*w3.y;
 c+=texture2D(tDiffuse,vec2(t12.x,t3.y)).rgb*w12.x*w3.y;
 c+=texture2D(tDiffuse,vec2(t3.x,t3.y)).rgb*w3.x*w3.y;
 gl_FragColor=vec4(clamp(c,0.0,1.0),1.0);
}`;
/* Passo 2: RCAS (nitidez adaptativa ao contraste, formulação do FSR 1.0) */
const FSH_R=`uniform sampler2D tDiffuse;uniform vec2 px;uniform float sharp;varying vec2 vUv;
void main(){
 vec3 e=texture2D(tDiffuse,vUv).rgb;
 vec3 b=texture2D(tDiffuse,vUv+vec2(0.0,-px.y)).rgb;
 vec3 d=texture2D(tDiffuse,vUv+vec2(-px.x,0.0)).rgb;
 vec3 f=texture2D(tDiffuse,vUv+vec2(px.x,0.0)).rgb;
 vec3 h=texture2D(tDiffuse,vUv+vec2(0.0,px.y)).rgb;
 vec3 mn4=min(min(b,d),min(f,h));
 vec3 mx4=max(max(b,d),max(f,h));
 vec3 hitMin=min(mn4,e)/(4.0*mx4+0.0001);
 vec3 hitMax=(1.0-max(mx4,e))/(4.0*mn4-4.0-0.0001);
 vec3 lobeRGB=max(-hitMin,hitMax);
 float lobe=max(-0.1875,min(max(max(lobeRGB.r,lobeRGB.g),lobeRGB.b),0.0))*sharp;
 gl_FragColor=vec4((lobe*(b+d+f+h)+e)/(4.0*lobe+1.0),1.0);
}`;

/* ===== GRÁFICOS: qualidade, resolução e FSR (upscale + RCAS) ===== */
const GQ=[{pr:1,an:1},{pr:1.25,an:4},{pr:1.75,an:8}],FSRS=[0,1.5,1.7,2,3];
const fsrC=new T.OrthographicCamera(-1,1,1,-1,0,1),fsrS=new T.Scene(),fsrM=new T.Mesh(new T.PlaneGeometry(2,2),new T.MeshBasicMaterial());fsrM.frustumCulled=false;fsrS.add(fsrM);
let matE=null,matR=null,rtA=null,rtB=null,fsrOn=false;
function mkRT(w,h,ms){try{if(ms&&T.WebGLMultisampleRenderTarget)return new T.WebGLMultisampleRenderTarget(w,h)}catch(e){}return new T.WebGLRenderTarget(w,h)}
function applyGfx(){sun.castShadow=CFG.gq>0;const g=GQ[CFG.gq],pr=Math.min(devicePixelRatio||1,g.pr);rn.setPixelRatio(pr);rn.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();
 for(const k in TC)TC[k].anisotropy=g.an;
 const k2=FSRS[CFG.fsr]||0;if(rtA){rtA.dispose();rtA=null}if(rtB){rtB.dispose();rtB=null}fsrOn=false;
 if(k2>1){try{const W2=Math.floor(innerWidth*pr),H2=Math.floor(innerHeight*pr),w1=Math.max(2,Math.floor(W2/k2)),h1=Math.max(2,Math.floor(H2/k2));
  rtA=mkRT(w1,h1,true);rtB=mkRT(W2,H2,false);for(const r of[rtA,rtB]){r.texture.minFilter=r.texture.magFilter=T.LinearFilter}
  if(!matE){matE=new T.ShaderMaterial({uniforms:{tDiffuse:{value:null},texSize:{value:new T.Vector2(1,1)}},vertexShader:VSH,fragmentShader:FSH_E,depthTest:false,depthWrite:false});
   matR=new T.ShaderMaterial({uniforms:{tDiffuse:{value:null},px:{value:new T.Vector2(1,1)},sharp:{value:.6}},vertexShader:VSH,fragmentShader:FSH_R,depthTest:false,depthWrite:false})}
  matE.uniforms.tDiffuse.value=rtA.texture;matE.uniforms.texSize.value.set(w1,h1);matR.uniforms.tDiffuse.value=rtB.texture;matR.uniforms.px.value.set(1/W2,1/H2);fsrOn=true}catch(e){fsrOn=false}}
 if(matR)matR.uniforms.sharp.value=CFG.sharp}
function renderFrame(){if(fsrOn){rn.setRenderTarget(rtA);rn.render(sc,cam);fsrM.material=matE;rn.setRenderTarget(rtB);rn.render(fsrS,fsrC);fsrM.material=matR;rn.setRenderTarget(null);rn.render(fsrS,fsrC)}else rn.render(sc,cam)}
const E={};['amN','amM','wpi','hpr','hpn','hpw','vig','s1','s2','xh','hm','hint','di','fps'].forEach(k=>E[k]=$(k));
const sx=(e,k,v)=>{if(e['_'+k]!==v){e['_'+k]=v;e.style[k]=v}},tx=(e,v)=>{if(e._t!==v){e._t=v;e.textContent=v}};
/* ===== HITMARKER DE SHOTGUN: 1 ponto por pellet que acertou (parâmetros ajustáveis) ===== */
const PD={max:12,size:4,life:.6,scale:.4,maxR:36,jitter:3,color:'#fff',kill:'#ff4a3a'}; // max=pontos simultâneos · size=px · life=s · scale=quanto a dispersão real do pellet na tela é comprimida · maxR=raio máx (px) · jitter=irregularidade (px)
const pdots=[];let pdI=0;
function pdStyle(e,c){e.style.background=c;e.style.boxShadow='0 0 '+PD.size*1.5+'px '+c+',0 0 1px #000'}
for(let i=0;i<PD.max;i++){const e=document.createElement('i'),z=PD.size;e.style.width=e.style.height=z+'px';e.style.margin=(-z/2)+'px 0 0 '+(-z/2)+'px';pdStyle(e,PD.color);$('pd').appendChild(e);pdots.push({e,t:-9})}
function pelletHits(pts){cam.updateMatrixWorld();for(const p of pts.slice(0,PD.max)){const q=p.clone().project(cam);let x=q.x*innerWidth/2*PD.scale+(R()-.5)*PD.jitter*2,y=-q.y*innerHeight/2*PD.scale+(R()-.5)*PD.jitter*2;const r=Math.hypot(x,y);if(r>PD.maxR){x*=PD.maxR/r;y*=PD.maxR/r}
 const d=pdots[pdI++%PD.max];d.t=now;pdStyle(d.e,PD.color);d.e.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';d.e.style.opacity=1;d.e._opacity='1'}}
let fpsN=0,fpsT=0,shownW=-1,xg=6,enF=0,enT=false;
function onEnemy(){if(B.dead>0)return false;const o=cam.position,d=cam.getWorldDirection(new T.Vector3()),tx=B.x-o.x,ty=(B.y||0)+1.1-o.y,tz=B.z-o.z,dp=tx*d.x+ty*d.y+tz*d.z;if(dp<1)return false;const px=tx-d.x*dp,py=ty-d.y*dp,pz=tz-d.z*dp;if(Math.hypot(px,py,pz)>.65)return false;ray.set(o,new T.Vector3(tx,ty,tz).normalize());ray.far=dp;return !ray.intersectObjects(sm).length}
function drawHud(){const w=W[P.w];
 if(shownW!=P.w){shownW=P.w;E.xh.style.setProperty('--s',P.w?'25px':'13px');E.wpi.innerHTML=ICON[P.w];[...$('sl').children].forEach((d,i)=>d.classList.toggle('a',i==P.w))}
 tx(E.amN,P.ammo[P.w]);tx(E.amM,'/'+w.mag);
 sx(E.amN,'color',P.rl>0?'#ffb020':P.bst[P.w]>1?'#ff7a3a':P.ammo[P.w]<=w.mag*.25?'#ff4a3a':'');
 sx(E.wpi,'opacity',(.3+.7*(1-clamp(P.dr/DR,0,1))).toFixed(2));
 sx(E.hpr,'strokeDashoffset',(138.2*(1-clamp(P.hp,0,100)/100)).toFixed(1));tx(E.hpn,Math.ceil(Math.max(0,P.hp)));
 E.hpw.classList.toggle('low',P.hp<35);
 sx(E.vig,'opacity',(P.down?.75+.25*Math.sin(now*6):clamp((100-P.hp)/70,0,1)).toFixed(2));
 tx(E.s1,P.score);tx(E.s2,B.score);
 const bfl=P.cover&&!aim&&!(P.pk>.5),tg=(P.w?19:7)+Math.min(12,P.spd*1.1)+(now-P.last<.1?(P.w?9:4):0)+(bfl?9+(P.blm||0)*9:0)-(aim?3:0);xg+=(tg-xg)*.35;const gi=Math.round(xg);if(E.xh._g!==gi){E.xh._g=gi;E.xh.style.setProperty('--g',gi+'px')}
 sx(E.xh,'visibility',(aim||P.pk>.3)&&P.dead<=0?'visible':'hidden');
 if(++enF%3==0)enT=onEnemy();
 const hv=clamp(1-(now-hitT)*2.6,0,1),kv=clamp(1-(now-killT)*1.5,0,1),mv=P.w?0:Math.max(hv,kv),hd=Math.round(14+(1-mv)*12);
 E.xh.classList.toggle('en',enT);E.xh.classList.toggle('ht',hv>.4);E.hm.classList.toggle('k',kv>0);
 for(const d of pdots){const a=1-(now-d.t)/PD.life;sx(d.e,'opacity',a>0?Math.min(1,a*1.8).toFixed(2):'0')}
 sx(E.fps,'display',CFG.fps?'block':'none');fpsN++;if(now-fpsT>.5){tx(E.fps,Math.round(fpsN/(now-fpsT))+' FPS');fpsN=0;fpsT=now}
 const da=clamp(1-(now-dmgT)*1.1,0,1);sx(E.di,'opacity',da.toFixed(2));if(da>0){const ax=B.x-P.x,az=B.z-P.z,fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),qx=Math.cos(P.yaw),qz=-Math.sin(P.yaw);E.di.style.transform='rotate('+Math.atan2(ax*qx+az*qz,ax*fx+az*fz).toFixed(2)+'rad)'}
 sx(E.hm,'opacity',mv.toFixed(2));if(E.hm._d!==hd){E.hm._d=hd;E.hm.style.setProperty('--hd',hd+'px')}
 const exq=P.down||P.dead>0?null:execTarget(P),tl=P.cover&&P.cover.h>=1.4;
 const ht=P.down?'DERRUBADO · rasteje com WASD · sangrando: '+Math.ceil(P.down.T-P.down.t)+'s':exq&&!P.exec?'E / X: EXECUTAR':P.dead>0||over||P.slide||P.slip||P.vault||P.rush||P.sd||P.mantle||P.exec?'':P.cover?(tl?(edgeNear(P)?'Cobertura alta · na ponta: botão direito (ou atirar) = sair do canto e atirar · ':'Cobertura alta: vá até a ponta para atirar · ')+'A/D+ESPAÇO na ponta: contornar / outra cobertura · S: sair':(edgeNear(P)?'Na ponta: A/D + botão direito = espiar o canto · ESPAÇO+W+A/D = CORNER RUSH · A/D+ESPAÇO = contornar / trocar · ':'')+'Botão direito: levantar e mirar · Atirar = tiro cego · W+ESPAÇO: pular (inimigo do outro lado = VOADORA) · S: sair'):(findCover(P,3.2,-Math.sin(P.yaw),-Math.cos(P.yaw),.6)?'ESPAÇO: ir pra cobertura':'');
 tx(E.hint,ht);sx(E.hint,'display',ht?'block':'none');
 arHud()}
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t/1000)-now||.016);now=t/1000;gpPoll(dt);
 if(MP.on&&playing){if(locked&&!over)updP(dt);mpUpdate(dt)}else if(locked&&!over){updP(dt);updB(dt)}else if(cur=='main'||cur=='train'||cur=='skin'||cur=='mp'||cur=='room'){if(cur=='skin')skCam(dt);else{const oa=t/7000;cam.position.set(Math.cos(oa)*30,11,Math.sin(oa)*30);cam.fov=62;cam.updateProjectionMatrix();cam.lookAt(0,1,0)}common(P,dt);common(B,dt)}
 for(let i=tr.length-1;i>=0;i--){const q=tr[i];q.life-=dt;if(q.life<=0){sc.remove(q);tr.splice(i,1)}else{const k=Math.max(.25,q.life/.07);q.scale.x=q.scale.z=q.r*k}}
 for(let i=gibs.length-1;i>=0;i--){const g=gibs[i];g.v.y-=18*dt;g.position.addScaledVector(g.v,dt);if(g.position.y<.1){g.position.y=.1;g.v.multiplyScalar(.3)}g.life-=dt;if(g.life<=0){sc.remove(g);gibs.splice(i,1)}}
 drawHud();renderFrame()}
function lock(){const d=rn.domElement;try{const r=d.requestPointerLock({unadjustedMovement:true});if(r&&r.catch)r.catch(()=>d.requestPointerLock())}catch(e){d.requestPointerLock()}}
function swap(nw){if(nw!=P.w&&P.dead<=0&&!P.down&&!P.exec){P.w=nw;P.rl=0;P.ar=null;P.dr=DR}}
function busy(f){return f.dead>0||f.down||f.exec||f.vault||f.slip||f.slide||f.roll||f.rush||f.mantle||f.sd||f.air||f.rc>now}
function act(fn){if(P.dead>0||P.down||over)return;if(busy(P))qa={fn,t:now+.18};else fn()}
