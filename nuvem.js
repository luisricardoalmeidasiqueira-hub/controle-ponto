(function(){
const DEV='luissiqueir@hotmail.com',RELEASE_TS=Date.UTC(2026,8,26,3,0,0);
const FB={apiKey:'AIzaSyChZp2bseKgHuo97i6A_XFe1StEcBhcDkE',authDomain:'cofre-seguro-2642d.firebaseapp.com',projectId:'cofre-seguro-2642d',storageBucket:'cofre-seguro-2642d.firebasestorage.app',messagingSenderId:'1076024528728',appId:'1:1076024528728:web:7dcb56285cc9e0d1a31f2d'};
let F=null,auth=null,db=null,user=null,semNuvem=false,aplicando=false,timer=null,sincronizando=false,mudancas=0,nomeNovo='',marcaPor='';
const META='ponto_nuvem_meta',N=id=>document.getElementById(id);
const meta=()=>{try{return JSON.parse(localStorage.getItem(META)||'{}')}catch(e){return {}}};
const setMeta=o=>{try{localStorage.setItem(META,JSON.stringify(Object.assign(meta(),o)))}catch(e){}};
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ind(est,txt){const el=N('nuvInd');if(el){el.textContent=est=='ok'?'☁️':est=='off'?'🚫':'⏳';el.className='fbi '+est;el.title=txt;el.setAttribute('aria-label',txt)}const t=N('nuvTxt');if(t)t.textContent=txt}
function msg(t,erro){const e=N('nuMsg');if(!e)return;e.textContent=t||'';e.style.color=erro?'var(--rd)':''}
function mostra(){const o=N('nuOut'),i=N('nuIn');if(!o||!i)return;if(user){const p=N('nuSenha');if(p)p.type='password'}o.style.display=user?'none':'';i.style.display=user?'':'none';if(user)N('nuQuem').textContent='Conectado como: '+(user.email||'');N('nuDev').style.display=(user&&String(user.email||'').toLowerCase()==DEV)?'':'none'}
window.irNuvem=function(){aba(3);const c=N('nuvCard');if(c)c.scrollIntoView({block:'start'})};
const ok=()=>ind('ok','Sincronizado com a nuvem');
function temDados(){return Object.keys(D.r||{}).length>0||Object.keys(D.hol||{}).length>0||(D.fer||[]).length>0||Object.keys(D.sys||{}).length>0}
function mesclar(rem){aplicando=true;try{D.r=D.r||{};Object.keys(rem.r||{}).forEach(k=>{D.r[k]=Object.assign({},rem.r[k],D.r[k]||{})});D.cfg=Object.assign({},rem.cfg||{},D.cfg||{});D.sys=Object.assign({},rem.sys||{},D.sys||{});if(!D.bh&&rem.bh)D.bh=rem.bh;D.hol=Object.assign({},rem.hol||{},D.hol||{});D.fer=D.fer||[];(rem.fer||[]).forEach(f=>{if(!D.fer.some(x=>x.a==f.a&&x.b==f.b))D.fer.push(f)});D.fer.sort((x,y)=>x.a<y.a?-1:1);try{localStorage.setItem('ponto_v1',JSON.stringify(D))}catch(e){}}finally{aplicando=false}try{render()}catch(e){}}
function trocar(rem){aplicando=true;try{const loc=D.r||{};Object.keys(rem.r||{}).forEach(k=>{const l=loc[k];if(l){if(l.fi)rem.r[k].fi=l.fi;if(l.fo)rem.r[k].fo=l.fo}});rem.sys=rem.sys||{};rem.fer=rem.fer||[];rem.cfg=rem.cfg||D.cfg;D=rem;try{localStorage.setItem('ponto_v1',JSON.stringify(D))}catch(e){}}finally{aplicando=false}try{render()}catch(e){}}
const FOTOS_UP='ponto_fotos_up';
function upMap(){try{return JSON.parse(localStorage.getItem(FOTOS_UP)||'{}')}catch(e){return {}}}
const FOTO_DIAS=30;
function corteFotos(){const d=new Date();d.setDate(d.getDate()-FOTO_DIAS);return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function limparFotosAntigas(){const up=upMap();let n=0;
  Object.keys(D.r||{}).forEach(k=>{const r=D.r[k];['fi','fo'].forEach(q=>{const img=r&&r[q];if(typeof img==='string'&&img.length>50&&up[k+'_'+q]===img.length){delete r[q];r[q+'n']=1;n++}})});
  if(n){try{localStorage.setItem('ponto_v1',JSON.stringify(D))}catch(e){}try{render()}catch(e){}}
}
window.nuvemOn=()=>!!(user&&!semNuvem);
let fotosNuv=[];
window.verFotosNuvem=async function(){const box=document.getElementById('galOld');if(!box)return;
  if(!user){box.innerHTML='<div class="mu" style="margin-top:6px">Entre na sua conta (Config → ☁️ Nuvem) para ver as fotos.</div>';return}
  if(!F){box.innerHTML='<div class="mu" style="margin-top:6px">A nuvem ainda está conectando. Toque em 🔄 daqui a pouco.</div>';return}
  const mi=N('galMes');if(mi&&!mi.value)mi.value=hoje().slice(0,7);const m=(mi&&mi.value)||hoje().slice(0,7);
  box.innerHTML='<div class="mu" style="margin-top:6px">Buscando as fotos de '+m.split('-').reverse().join('/')+' na nuvem…</div>';
  try{const sn=await F.getDocs(F.query(F.collection(db,'ponto',user.uid,'fotos'),F.where('dia','>=',m+'-01'),F.where('dia','<=',m+'-31')));const L=[];sn.forEach(d=>{const x=d.data();if(x&&x.img&&x.dia)L.push(x)});L.sort((a,b)=>a.dia!=b.dia?(a.dia<b.dia?1:-1):(a.q=='fi'?-1:1));fotosNuv=L;
    if(!L.length){box.innerHTML='<div class="mu" style="margin-top:6px">Nenhuma foto na nuvem em '+m.split('-').reverse().join('/')+'.</div>';return}
    const dias=[...new Set(L.map(x=>x.dia))];
    box.innerHTML=dias.map(k=>{const r=D.r[k]||{};return '<div style="margin-top:8px"><b>'+nomeD(k)+'</b> <span class="mu">'+(r.i?'entrada '+r.i:'')+(r.o?' · saída '+r.o:'')+'</span><div class="ph" style="margin-top:4px">'+
      L.map((x,i)=>x.dia!=k?'':'<div><img src="'+x.img+'" onclick="verNuv('+i+')"><div class="sub">'+(x.q=='fi'?'entrada':'saída')+(x.t?' '+esc(x.t):'')+'</div></div>').join('')+'</div></div>'}).join('')
  }catch(e){box.innerHTML='<div class="mu" style="margin-top:6px">Não consegui buscar agora. Confira a internet e toque em 🔄.</div>'}};
window.verNuv=function(i){const x=fotosNuv[i];if(x)verSrc(x.dia,x.q,x.img)};
async function enviarFotos(){
  if(!user||semNuvem)return;
  const up=upMap();let mudou=false;
  for(const k of Object.keys(D.r||{})){const r=D.r[k];
    for(const q of ['fi','fo']){const img=r&&r[q];if(typeof img!=='string'||img.length<50)continue;
      const id=k+'_'+q;if(up[id]===img.length)continue;
      try{await F.setDoc(F.doc(db,'ponto',user.uid,'fotos',id),{dia:k,q:q,t:r[q+'t']||'',img:img,updatedAt:Date.now()});up[id]=img.length;mudou=true}catch(e){if(mudou)try{localStorage.setItem(FOTOS_UP,JSON.stringify(up))}catch(x){}return}
    }}
  if(mudou)try{localStorage.setItem(FOTOS_UP,JSON.stringify(up))}catch(e){}
  try{limparFotosAntigas()}catch(e){}
}
async function baixarFotos(){
  return; // as fotos ficam só na nuvem: não baixa mais para o celular
  if(!user||semNuvem)return;
  try{const sn=await F.getDocs(F.query(F.collection(db,'ponto',user.uid,'fotos'),F.where('dia','>=',corteFotos())));const up=upMap();let n=0;
    sn.forEach(d=>{const x=d.data();if(!x||!x.dia||!x.img||(x.q!=='fi'&&x.q!=='fo'))return;const r=D.r[x.dia]=D.r[x.dia]||{};if(!r[x.q]){r[x.q]=x.img;if(x.t)r[x.q+'t']=x.t;up[d.id]=x.img.length;n++}});
    if(n){aplicando=true;try{localStorage.setItem('ponto_v1',JSON.stringify(D));localStorage.setItem(FOTOS_UP,JSON.stringify(up))}catch(e){}finally{aplicando=false}try{render()}catch(e){}}
  }catch(e){}
}
window.apagaFotoNuvem=async function(k,q){if(!user)return;try{await F.deleteDoc(F.doc(db,'ponto',user.uid,'fotos',k+'_'+q))}catch(e){}const up=upMap();delete up[k+'_'+q];try{localStorage.setItem(FOTOS_UP,JSON.stringify(up))}catch(e){}};
async function enviar(){
  const str=JSON.stringify(D,(k,v)=>k[0]=='f'&&k.length<=3&&typeof v=='string'&&v.length>50?undefined:v);
  if(str.length>900000){ind('off','Dados grandes demais para a nuvem. Apague dias antigos em Config.');return}
  const m0=mudancas,t=Date.now();
  await F.setDoc(F.doc(db,'ponto',user.uid),{uid:user.uid,updatedAt:t,data:str});
  if(mudancas==m0){setMeta({pushed:t,dirty:false});ok()}else{setMeta({pushed:t,dirty:true});agendar()}
  enviarFotos();
}
async function sincronizar(){
  if(!user||semNuvem||sincronizando)return;sincronizando=true;ind('sync','Sincronizando…');
  try{
    const snap=await F.getDoc(F.doc(db,'ponto',user.uid)),mt=meta();
    if(!snap.exists()){await enviar();return}
    const r=snap.data(),rUp=Number(r.updatedAt||0);let rem=null;try{rem=JSON.parse(r.data)}catch(e){}
    if(!rem||!rem.r){await enviar();return}
    const sujo=!!mt.dirty,conhecido=Number(mt.pushed||0);
    if(rUp>conhecido){
      if(sujo||(!conhecido&&temDados())){mesclar(rem);await enviar()}
      else{trocar(rem);setMeta({pushed:rUp,dirty:false});ok()}
    }else if(sujo){await enviar()}else ok();
  }catch(e){erro(e)}finally{sincronizando=false;baixarFotos().then(enviarFotos)}
}
async function erro(e){
  console.warn('Nuvem:',e);
  if(String(e&&e.code||'').includes('permission')&&user){
    try{const m=await F.getDoc(F.doc(db,'ponto_sem_nuvem',user.uid));if(m.exists()){semNuvem=true;marcaPor=String((m.data()||{}).by||'');botoes();ind('off',marcaPor=='pessoa'?'Você parou de guardar na nuvem. Seus horários ficam só neste celular.':'O desenvolvedor desativou a nuvem para você. Seus horários ficam só neste celular.');return}}catch(x){}
  }
  ind('off','Sem conexão com a nuvem. Fica salvo no celular e envia depois.');
}
function agendar(){
  mudancas++;setMeta({dirty:true});
  if(!user){ind('sync','Entre para guardar seus horários na nuvem.');return}
  if(semNuvem)return;
  ind('sync','Enviando…');clearTimeout(timer);timer=setTimeout(sincronizar,1500);
}
const _g=gravar;gravar=function(){const x=_g.apply(this,arguments);if(!aplicando)agendar();return x};
async function liberado(u){
  const em=String(u.email||'').trim().toLowerCase();
  if(em==DEV)return true;
  try{const a=await F.getDoc(F.doc(db,'admins',em));if(a.exists()&&a.data()&&a.data().role==='admin')return true}catch(e){}
  try{const x=await F.getDoc(F.doc(db,'usuarios',u.uid));if(x.exists()){const d=x.data()||{},seen=Number(d.lastLoginAt||d.updatedAt||0);if(d.veterano===true||(!d.pending&&seen&&seen<RELEASE_TS))return true}}catch(e){}
  const l=await F.getDoc(F.doc(db,'liberados',u.uid));return l.exists();
}
let offFer=null;
function fimData(a,n){return new Date(Date.parse(a+'T00:00:00Z')+(n-1)*864e5).toISOString().slice(0,10)}
function pararFerias(){try{offFer&&offFer()}catch(e){}offFer=null}
function ouvirFerias(u){
  pararFerias();
  const A={},B={};
  const junta=()=>{const L=[],v={};[A,B].forEach(M=>Object.keys(M).forEach(id=>{if(v[id])return;v[id]=1;const r=M[id];if(r.deleted===true||r.status==='recusada')return;
    [[r.start,r.days],[r.start2,r.days2]].forEach(p=>{if(p[0]&&Number(p[1])>0)L.push({a:p[0],b:fimData(p[0],Number(p[1])),st:r.status||'pendente'})})}));
    L.sort((x,y)=>x.a<y.a?-1:1);FN=L;try{localStorage.setItem('ponto_ferias_nuvem',JSON.stringify(L))}catch(e){}try{render()}catch(e){}};
  const ouv=(campo,valor,M)=>{try{return F.onSnapshot(F.query(F.collection(db,'ferias'),F.where(campo,'==',valor)),s=>{Object.keys(M).forEach(k=>delete M[k]);s.docs.forEach(d=>{if(d.id!=='config')M[d.id]=d.data()});junta()},()=>{})}catch(e){return null}};
  const o1=ouv('ownerUid',u.uid,A),o2=u.email?ouv('ownerEmail',u.email,B):null;
  offFer=()=>{o1&&o1();o2&&o2()};
}
async function aoMudar(u){
  if(u&&u.isAnonymous){try{await F.signOut(auth)}catch(e){}return}
  if(!u){user=null;semNuvem=false;pararFerias();FN=[];try{localStorage.removeItem('ponto_ferias_nuvem')}catch(e){}try{render()}catch(e){}mostra();ind('sync','Entre para guardar seus horários na nuvem.');return}
  try{
    const b=await F.getDoc(F.doc(db,'bloqueados',u.uid));
    if(b.exists()){await F.signOut(auth);msg('Seu acesso foi removido. Fale com o responsável.',1);return}
    if(!(await liberado(u))){
      try{await F.setDoc(F.doc(db,'usuarios',u.uid),{uid:u.uid,email:u.email||'',name:nomeNovo||u.displayName||'',pending:true,requestedAt:Date.now(),updatedAt:Date.now()},{merge:true})}catch(e){}
      await F.signOut(auth);msg('Cadastro recebido! Aguarde a liberação do responsável. Depois é só entrar com e-mail e senha.');return}
    user=u;mostra();msg('');ouvirFerias(u);
    let m=null;try{m=await F.getDoc(F.doc(db,'ponto_sem_nuvem',u.uid))}catch(e){}
    semNuvem=!!(m&&m.exists());marcaPor=semNuvem?String((m.data()||{}).by||''):'';botoes();
    if(semNuvem){try{await F.deleteDoc(F.doc(db,'ponto',u.uid))}catch(e){}ind('off',marcaPor=='pessoa'?'Você parou de guardar na nuvem. Seus horários ficam só neste celular.':'O desenvolvedor desativou a nuvem para você. Seus horários ficam só neste celular.');return}
    try{await F.setDoc(F.doc(db,'ponto_usuarios',u.uid),{uid:u.uid,email:u.email||'',name:u.displayName||nomeNovo||'',updatedAt:Date.now()},{merge:true})}catch(e){}
    await sincronizar();
    if(String(u.email||'').toLowerCase()==DEV)listaDev();
  }catch(e){erro(e)}
}
async function pers(){try{await F.setPersistence(auth,N('nuLembrar').checked?F.browserLocalPersistence:F.browserSessionPersistence)}catch(e){}}
function campos(){return{nome:(N('nuNome').value||'').trim(),em:(N('nuEmail').value||'').trim().toLowerCase(),sn:N('nuSenha').value||''}}
window.nuvEntrar=async function(){
  const c=campos();if(!c.em.includes('@'))return msg('Digite um e-mail válido.',1);if(c.sn.length<6)return msg('A senha precisa ter pelo menos 6 caracteres.',1);if(!F)return msg('A nuvem ainda está iniciando. Aguarde alguns segundos.',1);
  msg('Entrando...');
  try{await pers();const cr=await F.signInWithEmailAndPassword(auth,c.em,c.sn);N('nuSenha').value='';if(c.nome&&F.updateProfile&&!cr.user.displayName){try{await F.updateProfile(cr.user,{displayName:c.nome})}catch(e){}}}
  catch(e){const k=String(e&&e.code||'');msg(k.includes('invalid-credential')||k.includes('wrong-password')||k.includes('user-not-found')?'E-mail ou senha incorretos. Se for o primeiro acesso, toque em 👤 Criar minha conta.':'Não foi possível entrar. Verifique o e-mail, a senha e a conexão.',1)}
};
window.nuvCriar=async function(){
  const c=campos();if(!c.nome)return msg('Digite seu nome completo para criar a conta.',1);if(!c.em.includes('@'))return msg('Digite um e-mail válido.',1);if(c.sn.length<6)return msg('A senha precisa ter pelo menos 6 caracteres.',1);if(!F)return msg('A nuvem ainda está iniciando. Aguarde alguns segundos.',1);
  if(!confirm('Criar uma conta com este e-mail?'))return;
  msg('Criando sua conta...');
  try{await pers();nomeNovo=c.nome;const cr=await F.createUserWithEmailAndPassword(auth,c.em,c.sn);N('nuSenha').value='';if(F.updateProfile){try{await F.updateProfile(cr.user,{displayName:c.nome})}catch(e){}}}
  catch(e){const k=String(e&&e.code||'');msg(k.includes('email-already-in-use')?'Este e-mail já tem conta (é a do app de Férias?). Use 🔑 Entrar.':k.includes('weak-password')?'Escolha uma senha com pelo menos 6 caracteres.':k.includes('invalid-email')?'E-mail inválido.':'Não foi possível criar a conta. Tente novamente.',1)}
};
window.nuvSair=async function(){if(!F)return;try{await F.signOut(auth)}catch(e){}msg('Você saiu. Seus horários continuam salvos neste celular.')};
window.nuvAgora=function(){if(!user)return msg('Entre primeiro.',1);sincronizar()};
async function listaDev(){
  const box=N('nuDevLista');if(!box||!F||!user)return;box.textContent='Carregando…';
  try{
    const [us,sn]=await Promise.all([F.getDocs(F.collection(db,'ponto_usuarios')),F.getDocs(F.collection(db,'ponto_sem_nuvem'))]);
    const sem=new Set(sn.docs.map(d=>d.id)),rows=us.docs.map(d=>Object.assign({uid:d.id},d.data())).filter(u=>String(u.email||'').toLowerCase()!=DEV);
    if(!rows.length){box.innerHTML='<span class="mu">Ninguém além de você usa a nuvem ainda.</span>';return}
    box.innerHTML=rows.map(u=>{const s=sem.has(u.uid);return '<div class="dl"><span>'+esc(u.name||u.email)+'<br><span class="mu" style="font-size:10px">'+esc(u.email||'')+' · '+(s?'🚫 sem nuvem':'☁️ na nuvem')+'</span></span><button class="s" style="padding:4px 10px" data-uid="'+esc(u.uid)+'" data-sem="'+(s?0:1)+'" title="'+(s?'Voltar a guardar na nuvem':'Parar de guardar na nuvem')+'">'+(s?'☁️':'🚫')+'</button></div>'}).join('');
  }catch(e){box.textContent='Não consegui carregar a lista (confira se as regras novas do Firebase foram publicadas).'}
}
document.addEventListener('click',async function(ev){
  const b=ev.target.closest&&ev.target.closest('#nuDevLista button[data-uid]');if(!b)return;
  const uid=b.getAttribute('data-uid'),sem=b.getAttribute('data-sem')=='1';
  try{
    if(sem){if(!confirm('Parar de guardar os horários desta pessoa na nuvem e apagar o que já está lá?'))return;
      await F.setDoc(F.doc(db,'ponto_sem_nuvem',uid),{uid:uid,at:Date.now(),by:'desenvolvedor'});
      try{await F.deleteDoc(F.doc(db,'ponto',uid))}catch(e){}}
    else{await F.deleteDoc(F.doc(db,'ponto_sem_nuvem',uid))}
  }catch(e){alert('Não consegui mudar. Confira se as regras novas do Firebase foram publicadas.')}
  listaDev();
});
window.nuvVer=function(){const i=N('nuSenha');if(i)i.type=i.type=='password'?'text':'password'};
window.nuvEsqueci=async function(){
  const c=campos();if(!c.em.includes('@'))return msg('Digite o seu e-mail no campo de e-mail e toque em ✉️ de novo.',1);
  if(!F)return msg('A nuvem ainda está iniciando. Aguarde alguns segundos.',1);
  if(!confirm('Enviar um e-mail para '+c.em+' para criar uma senha nova? A senha nova vale também para o app de Férias.'))return;
  try{await F.sendPasswordResetEmail(auth,c.em);msg('E-mail enviado para '+c.em+'. Abra o link, escolha a senha nova e olhe também a caixa de spam.')}
  catch(e){const k=String(e&&e.code||'');msg(k.includes('invalid-email')?'E-mail inválido.':k.includes('too-many')?'Muitas tentativas. Espere um pouco e tente de novo.':'Não foi possível enviar agora. Tente de novo.',1)}
};
function botoes(){const dv=!!(user&&String(user.email||'').toLowerCase()==DEV);['nuLinha','nuLeg'].forEach(id=>{const e=N(id);if(e)e.style.display=dv?'none':''});const v=N('nuVolta');if(v)v.style.display=(semNuvem&&marcaPor=='pessoa')?'':'none';const a=N('nuApaga');if(a)a.style.display=semNuvem?'none':''}
window.nuvApagarMinha=async function(){
  if(!user||!F)return msg('Entre primeiro.',1);
  if(!confirm('Apagar seus horários da nuvem e parar de enviar? Seus dados continuam neste celular. Você pode voltar depois.'))return;
  msg('Apagando...');
  try{
    await F.setDoc(F.doc(db,'ponto_sem_nuvem',user.uid),{uid:user.uid,at:Date.now(),by:'pessoa'});
    try{await F.deleteDoc(F.doc(db,'ponto',user.uid))}catch(e){}
    try{await F.deleteDoc(F.doc(db,'ponto_usuarios',user.uid))}catch(e){}
    semNuvem=true;marcaPor='pessoa';botoes();clearTimeout(timer);ind('off','Você parou de guardar na nuvem. Seus horários ficam só neste celular.');msg('Pronto: seus horários foram apagados da nuvem.')
  }catch(e){msg('Não consegui apagar agora. Confira a internet e as regras do Firebase.',1)}
};
window.nuvVoltar=async function(){
  if(!user||!F)return;
  if(!confirm('Voltar a guardar seus horários na nuvem?'))return;
  try{
    await F.deleteDoc(F.doc(db,'ponto_sem_nuvem',user.uid));semNuvem=false;marcaPor='';botoes();
    try{await F.setDoc(F.doc(db,'ponto_usuarios',user.uid),{uid:user.uid,email:user.email||'',name:user.displayName||'',updatedAt:Date.now()},{merge:true})}catch(e){}
    msg('');mudancas++;setMeta({dirty:true});sincronizar()
  }catch(e){msg('Não consegui voltar agora. Tente de novo.',1)}
};
async function init(){
  ind('sync','Conectando à nuvem…');
  try{
    const V='https://www.gstatic.com/firebasejs/12.19.0/';
    const [a,au,fs]=await Promise.all([import(V+'firebase-app.js'),import(V+'firebase-auth.js'),import(V+'firebase-firestore.js')]);
    const app=a.initializeApp(FB);auth=au.getAuth(app);db=fs.getFirestore(app);F=Object.assign({},au,fs);
    au.onAuthStateChanged(auth,aoMudar);
  }catch(e){F=null;ind('off','Sem conexão com a nuvem. Seus horários continuam salvos no celular.')}
}
document.addEventListener('visibilitychange',function(){if(!document.hidden&&user)sincronizar()});
window.addEventListener('online',function(){if(!F)init();else if(auth&&auth.currentUser)aoMudar(auth.currentUser)});
init();
})();
