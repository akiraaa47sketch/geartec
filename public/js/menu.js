/* Menus, configurações, teclado/mouse e personalização */
/* ===== MENU: principal · treino · pausa · configurações · controles ===== */
let cur='main',from='main',playing=false,lastMsg='',tab=0;
const TR={diff:1,goal:0,shoot:1,dbno:1};
function setBD(){const d=DIFF[TR.diff];BD.react=d.react;BD.noise=d.noise;BD.dmg=d.dmg;BD.goal=GOALS[TR.goal];BD.passive=!TR.shoot}
const pc=v=>Math.round(v*100)+'%';
const TROPTS=[{k:'diff',t:'Dificuldade do bot',type:'sel',opts:['Fácil','Normal','Difícil']},{k:'goal',t:'Kills para vencer',type:'sel',opts:['5','10','20','Sem limite']},{k:'shoot',t:'Bot atira',type:'check',note:'Desligue para treinar mira e movimentação em um alvo.'},{k:'dbno',t:'Derrubado + execução',type:'check',note:'Vida zerada (sem gib) = cai no chão e rasteja. Chegue perto e aperte E (ou X no controle) para executar, ou termine com tiros.'}];
const SETS=[['JOGABILIDADE',[{k:'sens',t:'Sensibilidade',min:.2,max:3,step:.05,f:v=>v.toFixed(2)+'x'},{k:'ads',t:'Sensibilidade ao mirar',min:.3,max:1.5,step:.05,f:v=>v.toFixed(2)+'x',note:'Multiplicador aplicado quando você segura o botão de mira.'},{k:'inv',t:'Inverter eixo Y',type:'check'}]],
 ['SOM',[{k:'vol',t:'Volume geral',min:0,max:1,step:.01,f:pc},{k:'sfx',t:'Volume de tiros e efeitos',min:0,max:1,step:.01,f:pc}]],
 ['GRÁFICOS',[{k:'gq',t:'Qualidade',type:'sel',opts:['Baixa','Média','Alta'],note:'Define a resolução máxima de renderização e a filtragem das texturas.'},{k:'fov',t:'Campo de visão (FOV)',min:60,max:100,step:1,f:v=>v+'°'},
  {k:'fsr',t:'FSR (upscale)',type:'sel',opts:['Desligado','Qualidade','Equilibrado','Desempenho','Ultra'],note:'Renderiza em resolução menor (1.5x · 1.7x · 2x · 3x) e reconstrói a imagem com upscale + nitidez RCAS, no estilo do FSR 1.0. Mais FPS em PCs fracos.'},
  {k:'sharp',t:'Nitidez do FSR',min:0,max:1,step:.05,f:pc},{k:'shd',t:'Sombras dos personagens',type:'check'},{k:'fps',t:'Mostrar FPS',type:'check'}]]];
function buildRows(host,list,st,onch){host.innerHTML='';for(const o of list){const r=document.createElement('div');r.className='row';const l=document.createElement('span');l.textContent=o.t;r.appendChild(l);let c;
 if(o.type=='sel'){c=document.createElement('div');c.className='seg';o.opts.forEach((n,i)=>{const b=document.createElement('button');b.textContent=n;b.className=st[o.k]==i?'on':'';b.onclick=()=>{st[o.k]=i;[...c.children].forEach((x,j)=>{x.className=j==i?'on':''});onch(o.k)};c.appendChild(b)})}
 else if(o.type=='check'){c=document.createElement('button');const up=()=>{c.className='chk'+(st[o.k]?' on':'');c.textContent=st[o.k]?'LIGADO':'DESLIGADO'};up();c.onclick=()=>{st[o.k]=st[o.k]?0:1;up();onch(o.k)}}
 else if(o.type=='col'){c=document.createElement('div');c.className='sw';o.cols.forEach(v=>{const b=document.createElement('button');b.style.background='#'+v.toString(16).padStart(6,'0');b.className=st[o.k]==v?'on':'';b.onclick=()=>{st[o.k]=v;[...c.children].forEach(x=>x.className='');b.className='on';onch(o.k)};c.appendChild(b)})}
 else{c=document.createElement('div');c.className='rng';const i=document.createElement('input'),v=document.createElement('b');i.type='range';i.min=o.min;i.max=o.max;i.step=o.step;i.value=st[o.k];v.textContent=o.f(+i.value);i.oninput=()=>{st[o.k]=+i.value;v.textContent=o.f(+i.value);onch(o.k)};c.appendChild(i);c.appendChild(v)}
 r.appendChild(c);if(o.note){const n=document.createElement('small');n.textContent=o.note;r.appendChild(n)}host.appendChild(r)}}
function buildSet(){const tb=$('tabs');tb.innerHTML='';SETS.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t[0];b.className=i==tab?'on':'';b.onclick=()=>{tab=i;buildSet()};tb.appendChild(b)});
 buildRows($('setbody'),SETS[tab][1],CFG,k=>{saveCfg();if(k=='gq'||k=='fsr'||k=='sharp')applyGfx();if(k=='vol'&&MG)MG.gain.value=CFG.vol})}
function showScr(n,msg){if(n=='skin'&&cur!='skin'){P.x=0;P.z=0;P.cover=null}else if(cur=='skin'&&n!='skin')respawn(P);let id=n;if(n=='over'||n=='pause'){id='pause';if(n=='over'&&msg)lastMsg=msg;$('pt').textContent=n=='over'?lastMsg:'PAUSADO';$('pc').style.display=n=='over'?'none':'';$('prs').textContent=n=='over'?(MP.on?'VOLTAR AO LOBBY':'JOGAR DE NOVO'):'REINICIAR PARTIDA';$('prs').style.display=MP.on&&n!='over'?'none':''}
 const o=$('ov');o.style.display='flex';o.className=(n=='main'||n=='train'||n=='skin'||n=='mp'||n=='room')?'main':'';
 document.querySelectorAll('.scr').forEach(e=>{e.style.display=e.id=='scr-'+id?'flex':'none'});
 $('hud').style.display=(playing&&n!='train'&&n!='main')?'block':'none';cur=n}
function startGame(){setBD();over=false;P.score=B.score=0;respawn(P);respawn(B);playing=true;audio();if(AC&&AC.state=='suspended')AC.resume();lock()}
function menuAct(a){if(mpAct(a))return;if(a=='train'){showScr('train');buildRows($('trbody'),TROPTS,TR,setBD)}
 else if(a=='start'||a=='restart')startGame();
 else if(a=='cont'){audio();if(AC&&AC.state=='suspended')AC.resume();lock()}
 else if(a=='skin'){from=cur;stab=0;showScr('skin');buildSkin()}else if(a=='skrand')skRand();else if(a=='skreset'){Object.assign(LP,SKD);saveSk();reskin();buildSkin()}
 else if(a=='set'){from=cur;tab=0;showScr('set');buildSet()}
 else if(a=='help'){from=cur;showScr('help')}
 else if(a=='back')showScr(from=='over'?'over':from);
 else if(a=='menu'){playing=false;over=false;document.exitPointerLock();showScr('main')}}
$('ov').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-a]');if(b&&!b.disabled)menuAct(b.dataset.a)});
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===rn.domElement;if(locked){$('ov').style.display='none';$('hud').style.display='block'}else{fire1=aim=false;for(const k in K)K[k]=0;if(playing)showScr(over?'over':'pause')}});
addEventListener('mousemove',e=>{if(!locked)return;const mx=clamp(e.movementX,-150,150),my=clamp(e.movementY,-150,150),sn=(aim?CFG.ads:1)*CFG.sens;if(!rsLock)P.yaw-=mx*.0022*sn;pitch=clamp(pitch-(CFG.inv?-1:1)*my*.002*sn,-1.1,1.1)});
addEventListener('mousedown',e=>{if(e.button==0){fire1=true;if(locked)fireBuf=now+.25}if(e.button==2)aim=true});
addEventListener('mouseup',e=>{if(e.button==0)fire1=false;if(e.button==2)aim=false});
addEventListener('contextmenu',e=>e.preventDefault());addEventListener('wheel',e=>{if(locked)swap(1-P.w)},{passive:true});
addEventListener('keydown',e=>{K[e.code]=1;if(!locked)return;
 if(e.code=='Space'){e.preventDefault();if(!e.repeat)act(actionKey)}
 if(e.code=='KeyF'&&!e.repeat)act(jumpKey);if(e.code=='KeyE'&&!e.repeat)act(execKey);if(e.code=='KeyV'&&!e.repeat)shs=-shs;if(e.code=='KeyC'&&!e.repeat)act(slideKey);
 if(e.code=='Digit1'||e.code=='Digit2')swap(+e.code.slice(-1)-1);if(e.code=='KeyQ'&&!e.repeat)swap(1-P.w);
 if(e.code=='KeyR'){if(!e.repeat&&P.rl>0&&P.ar)activeReload();else reload(P)}});
addEventListener('keyup',e=>K[e.code]=0);addEventListener('blur',()=>{for(const k in K)K[k]=0;fire1=aim=false});
let stab=0,skA=.6,skR=4,skY=1.1,skD=false;
const nm=(...a)=>a,PAL={skin:[0xf1c9a5,0xd8a47f,0xb98562,0x8d5a3b,0x5e3a24,0x3b2416],hair:[0x1c1612,0x3b2a1c,0x7a4a21,0xc9a45a,0xd0d0d0,0xb02020,0x2a5fb0,0x2c9a4a],arm:[0x3a6ea5,0xa5443a,0x4a7a3a,0x6a6a6a,0xc98a1a,0x6a3a9a,0x1c1c1c,0xe0e0e0],cloth:[0x5c6a58,0x6a5a52,0x3a4a6a,0x2a2a2a,0x7a6a3a,0x8a8a8a],eye:[0x5a3a22,0x2f6fae,0x3f7a4a,0x7a7a7a,0x1c1c1c],acc:[0xd4351c,0x1c1c1c,0xffffff,0x2a5fb0,0x2c9a4a,0xffb020,0x8a3ab0]};
const cO=(k,t,c)=>({k,t,type:'col',cols:PAL[c]}),sO=(k,t,o)=>({k,t,type:'sel',opts:o});
const SKT=[['CABEÇA',[sO('hs','Cabelo',['Careca','Curto','Moicano','Longo','Black power','Coque']),cO('hair','Cor do cabelo','hair'),sO('hg','Chapéu / capacete',['Nenhum','Boné','Gorro','Capacete','Cowboy','Cartola','Coroa']),cO('bc','Cor do acessório','acc')]],
 ['ROSTO',[cO('skin','Tom de pele','skin'),cO('eye','Cor dos olhos','eye'),sO('beard','Barba',['Não','Sim']),sO('gl','Óculos',['Nenhum','Escuros','Tático']),sO('band','Bandana',['Nenhuma','Pescoço','Máscara','Testeira']),cO('bc','Cor do acessório','acc')]],
 ['CORPO',[sO('ar','Peitoral',['Padrão','Reforçado','Pesado']),sO('sh','Ombreiras',['Padrão','Médias','Grandes']),sO('kn','Caneleiras',['Não','Sim']),sO('bk','Mochila',['Não','Sim'])]],
 ['CORES',[cO('ac','Armadura','arm'),cO('pants','Roupa (camuflagem)','cloth'),cO('bc','Acessórios','acc')]]];

function buildSkin(){const tb=$('sktabs');tb.innerHTML='';SKT.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t[0];b.className=i==stab?'on':'';b.onclick=()=>{stab=i;buildSkin()};tb.appendChild(b)});buildRows($('skbody'),SKT[stab][1],LP,()=>{saveSk();reskin()})}
function skRand(){const pk=a=>a[Math.random()*a.length|0];for(const t of SKT)for(const o of t[1])LP[o.k]=o.type=='col'?pk(o.cols):(Math.random()*o.opts.length|0);saveSk();reskin();buildSkin()}
function skCam(dt){const z=[[1.4,1.74],[1.5,1.74],[3.6,1.15],[4.2,1.1]][stab],k=Math.min(1,dt*5);skR+=(z[0]-skR)*k;skY+=(z[1]-skY)*k;if(!skD)skA+=dt*.35;cam.fov=45;cam.updateProjectionMatrix();cam.position.set(P.x+Math.sin(skA)*skR,skY+.15,P.z+Math.cos(skA)*skR);cam.lookAt(P.x,skY,P.z);cam.translateX(-skR*.28)}
$('ov').addEventListener('pointerdown',e=>{if(cur=='skin'&&!e.target.closest('.scr'))skD=true});addEventListener('pointerup',()=>skD=false);addEventListener('pointermove',e=>{if(skD)skA-=e.movementX*.01});
