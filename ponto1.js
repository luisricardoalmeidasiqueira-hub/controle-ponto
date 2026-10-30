const $=id=>document.getElementById(id);
let D={cfg:{e:'07:30',s:'17:00',l:90,m:1},r:{}};
try{const x=localStorage.getItem('ponto_v1');if(x)D=JSON.parse(x)}catch(e){}
D.sys=D.sys||{};D.fer=D.fer||[];if(D.cfg.l===60&&!D.cfg.m){D.cfg.l=90;D.cfg.m=1;try{localStorage.setItem('ponto_v1',JSON.stringify(D))}catch(e){}}
const dm=d=>d.split('-').reverse().slice(0,2).join('/');
let ferEd=null;
function addFer(){const a=$('fa').value,b=$('fb').value;if(!a||!b){alert('Escolha a data de início e de fim.');return}if(b<a){alert('A data final é antes da inicial.');return}if(ferEd!==null)D.fer[ferEd]={a,b};else D.fer.push({a,b});ferEd=null;D.fer.sort((x,y)=>x.a<y.a?-1:1);gravar();$('fa').value=$('fb').value='';$('fbtn').textContent='🏖️ Lançar férias';render()}
function editFer(i){ferEd=i;$('fa').value=D.fer[i].a;$('fb').value=D.fer[i].b;$('fbtn').textContent='💾 Salvar alteração das férias';$('fa').scrollIntoView({block:'center'})}
function delFer(i){if(confirm('Apagar estas férias?')){ferEd=null;$('fbtn').textContent='🏖️ Lançar férias';D.fer.splice(i,1);gravar();render()}}
function nUtil(ds){const d=new Date(ds+'T12:00'),n=d.getDate();let c=0;for(let i=1;i<=n;i++){const w=new Date(d.getFullYear(),d.getMonth(),i,12).getDay();if(w!=0&&w!=6)c++}const w0=d.getDay();return(w0==0||w0==6)?0:c}
function mesAnt(ds){const d=new Date(ds+'T12:00');d.setDate(1);d.setMonth(d.getMonth()-1);return d.getFullYear()+'-'+p2(d.getMonth()+1)}
function mesPasso(n){const a=($('mes').value||hoje().slice(0,7)).split('-'),d=new Date(+a[0],+a[1]-1+n,1),nv=d.getFullYear()+'-'+p2(d.getMonth()+1);if(nv>hoje().slice(0,7))return;$('mes').value=nv;render()}
function irMesAnt(){$('mes').value=mesAnt(hoje());aba(1)}
function copiarMes(){const m=$('mes').value,L=[];Object.keys(D.r).sort().forEach(k=>{if(!k.startsWith(m))return;const x=D.r[k],nome=new Date(k+'T12:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}).replace('.','');L.push(nome+': '+(x.folga?'FOLGA':(x.i||'--:--')+' às '+(x.o||'--:--')))});FER().filter(f=>f.a.slice(0,7)<=m&&f.b.slice(0,7)>=m).forEach(f=>L.push('FÉRIAS: '+dm(f.a)+' a '+dm(f.b)));if(!L.length){alert('Nenhum registro neste mês.');return}const t='Horários de '+m.split('-').reverse().join('/')+'\n'+L.join('\n');navigator.clipboard.writeText(t).then(()=>alert('Horários copiados! É só colar onde for acertar o ponto.'))}
async function restaurar(){let t='';try{t=await navigator.clipboard.readText()}catch(e){}let b=null;try{b=JSON.parse(t)}catch(e){}if(!b||!b.r){t=prompt('Cole aqui o backup que você copiou com 📋:')||'';try{b=JSON.parse(t)}catch(e){b=null}}if(!b||!b.r){alert('Não encontrei um backup válido. Copie de novo com 📋 no outro celular e tente outra vez.');return}const n=Object.keys(b.r).length;if(!confirm('Restaurar '+n+' dia(s) de registro? Os dados do backup são somados aos deste celular (as fotos daqui ficam).'))return;Object.keys(b.r).forEach(k=>{D.r[k]=Object.assign({},D.r[k]||{},b.r[k])});D.cfg=Object.assign({},D.cfg,b.cfg||{});D.sys=Object.assign({},D.sys,b.sys||{});D.hol=Object.assign({},H(),b.hol||{});(b.fer||[]).forEach(f=>{if(!D.fer.some(x=>x.a==f.a&&x.b==f.b))D.fer.push(f)});D.fer.sort((x,y)=>x.a<y.a?-1:1);gravar();render();alert('Backup restaurado!')}
function proxUtil(n){const h=new Date(),h0=new Date(h.getFullYear(),h.getMonth(),h.getDate());for(let o=0;o<4;o++){let c=0;for(let d=1;d<=31;d++){const x=new Date(h.getFullYear(),h.getMonth()+o,d);if(x.getMonth()!=(h.getMonth()+o)%12)break;if(x.getDay()!=0&&x.getDay()!=6&&++c==n){if(x>=h0)return x;break}}}return h0}
function baixarIcs(){const z=x=>x.getFullYear()+p2(x.getMonth()+1)+p2(x.getDate()),st=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z',ev=(n,t,desc)=>{const d=z(proxUtil(n));return ['BEGIN:VEVENT','UID:ponto-'+n+'o-dia-util@controle-de-ponto','DTSTAMP:'+st,'DTSTART:'+d+'T110000Z','DTEND:'+d+'T113000Z','RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS='+n,'SUMMARY:'+t,'DESCRIPTION:'+desc,'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+t,'TRIGGER:PT0M','END:VALARM','END:VEVENT']};const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Controle de Ponto//PT-BR','CALSCALE:GREGORIAN'].concat(ev(2,'🔔 Acertar o ponto (2º dia útil)','Acertar o ponto do mês anterior. Abra o app Controle de Ponto, aba Mês, e use Copiar horários do mês.'),ev(3,'🔔 ÚLTIMO DIA: acertar o ponto (3º dia útil)','Último dia para acertar o ponto do mês anterior.'),['END:VCALENDAR']);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([L.join('\r\n')],{type:'text/calendar'}));a.download='lembretes-ponto.ics';document.body.appendChild(a);a.click();a.remove();alert('Arquivo baixado. Abra-o (em Downloads ou na notificação) e escolha adicionar ao calendário. Os lembretes são às 8h, no 2º e no 3º dia útil (sem contar feriados).')}
function salvaVh(){D.cfg.vh=$('vh').value.trim();gravar();render()}
function gravar(){try{localStorage.setItem('ponto_v1',JSON.stringify(D));const s=document.getElementById('sv');if(s)s.textContent='✓ Salvo às '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});return 1}catch(e){alert('Memória cheia: apague fotos antigas.')}}
const p2=n=>String(n).padStart(2,'0');
const hoje=()=>{const d=new Date();return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
const hm=t=>{const[a,b]=t.split(':').map(Number);return a*60+b};
const hmStr=m=>Math.floor(m/60)+':'+p2(m%60);
const alm=v=>{v=String(v||'').trim();if(!v)return null;if(!/[:h]/.test(v))return +v>=10?+v:+v*60;return parseHM(v)};
const fmt=m=>{const s=m<0?'-':'';m=Math.abs(Math.round(m));return s+Math.floor(m/60)+'h'+p2(m%60)};
const parseHM=t=>{if(!t)return null;t=t.trim().replace('h',':');const n=t.startsWith('-');t=t.replace('-','');const[a,b]=t.split(':');const v=(+a||0)*60+(+b||0);return n?-v:v};
const fimSem=ds=>{const w=new Date(ds+'T12:00').getDay();return w==0||w==6};
function aba(n){document.querySelectorAll('.pg').forEach((p,i)=>p.classList.toggle('on',i==n));document.querySelectorAll('.tabs button').forEach((b,i)=>b.classList.toggle('on',i==n));render();if(n==2){try{if(!$('galMes').value)$('galMes').value=hoje().slice(0,7);galTx()}catch(e){}}}
let galAberta=false;
const MESES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
function galTx(){const m=$('galMes').value||hoje().slice(0,7),a=m.split('-');$('galMesTx').textContent=MESES[+a[1]-1]+' de '+a[0];$('galBtn').textContent=galAberta?'☁️ Esconder as fotos':'☁️ Ver fotos de '+MESES[+a[1]-1];$('galBtn').className=galAberta?'s':''}
function galPasso(n){const m=$('galMes').value||hoje().slice(0,7),a=m.split('-'),d=new Date(+a[0],+a[1]-1+n,1),nv=d.getFullYear()+'-'+p2(d.getMonth()+1);if(nv>hoje().slice(0,7))return;$('galMes').value=nv;galTx();if(galAberta)window.verFotosNuvem&&window.verFotosNuvem()}
function galAbrir(){galAberta=!galAberta;galTx();if(galAberta)window.verFotosNuvem&&window.verFotosNuvem();else $('galOld').innerHTML=''}
function calc(ds,r){
 if(r.folga){const j=hm(D.cfg.s)-hm(D.cfg.e)-D.cfg.l;return{w:0,ex:-j}}
 if(!r.i||!r.o)return null;
 const l=r.l!=null&&r.l!==''?+r.l:D.cfg.l,fs=fimSem(ds);
 const w=hm(r.o)-hm(r.i)-(fs?0:l);let ex;
 if(r.e!=null&&r.e!=='')ex=parseHM(r.e);
 else if(fs)ex=w*1.5;
 else ex=w-(hm(D.cfg.s)-hm(D.cfg.e)-D.cfg.l);
 return{w,ex};
}
function bater(t){
 const d=new Date(),ds=hoje(),h=p2(d.getHours())+':'+p2(d.getMinutes());
 const r=D.r[ds]=D.r[ds]||{};
 if(r[t]&&!confirm('Já existe '+r[t]+'. Substituir?'))return;
 r[t]=h;r.folga=false;gravar();render();
}
function folgaHoje(){const ds=hoje(),r=D.r[ds]=D.r[ds]||{};if(r.folga){r.folga=false}else{if(!confirm('Lançar hoje como FOLGA? Vai descontar a jornada do saldo de horas.'))return;r.folga=true;r.i='';r.o=''}gravar();render()}
let edit=false;function editarHoje(){edit=true;render()}function salvarHoje(){edit=false;manual()}
function mask(el){const d=el.value.replace(/\D/g,'').slice(0,4);el.value=d.length>2?d.slice(0,2)+':'+d.slice(2):d}
function nt(v){const d=String(v||'').replace(/\D/g,'');if(!d)return '';let t=d.length<=2?d.padStart(2,'0')+'00':d.length==3?'0'+d:d.length==4?d:null;if(t===null)return null;if(+t.slice(0,2)>23||+t.slice(2)>59)return null;return t.slice(0,2)+':'+t.slice(2)}
function limpa(id){const el=$(id);if(!el.value)return;edit=true;el.value='';manual()}
function manual(){const ds=hoje(),r=D.r[ds]=D.r[ds]||{};const a=nt($('hi').value),b=nt($('ho').value);if(a===null||b===null){alert('Horário inválido. Digite assim: 1120 para 11:20.');render();return}r.folga=false;r.i=a;r.o=b;gravar();render()}
let alvo=null;
function foto(k,ds){alvo={k,ds:ds||hoje()};$('ff').value='';$('ff').click()}
$('ff').onchange=function(){
 const f=this.files[0];if(!f||!alvo)return;const a=alvo;
 const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,1600/im.width);c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);
  lerFoto(a,c)};
 im.src=URL.createObjectURL(f);
};
const IAK='ponto_ia',IAM='ponto_ia_m';let iaChave='',iaModelo='',iaErro='';
try{iaChave=localStorage.getItem(IAK)||'';iaModelo=localStorage.getItem(IAM)||''}catch(e){}
const IA_MODELOS=['gemini-flash-latest','gemini-2.5-flash','gemini-2.0-flash','gemini-flash-lite-latest','gemini-2.5-flash-lite'];
function iaSalvar(){try{iaChave?localStorage.setItem(IAK,iaChave):localStorage.removeItem(IAK);iaModelo?localStorage.setItem(IAM,iaModelo):localStorage.removeItem(IAM)}catch(e){}}
function iaStatus(){const e=$('iaSt');if(e)e.textContent=iaChave?(iaErro?'🔴 Último problema: '+iaErro:'🟢 IA ligada'):'⚪ IA desligada (a foto só guarda ou usa o leitor do celular)'}
function iaMotivo(st,t){return st>=500?'o Google está sobrecarregado agora (a chave está certa, tente de novo daqui a pouco)':st===429?'o limite grátis da chave acabou por agora (tente mais tarde)':(st===400||st===401||st===403)&&/key|chave|API_KEY|permission|PERMISSION/i.test(t)?'a chave não foi aceita pelo Google':'erro '+st}
async function iaChamar(parts){
  const ms=iaModelo?[iaModelo,...IA_MODELOS.filter(m=>m!==iaModelo)]:IA_MODELOS;let ult='nenhum modelo respondeu',ocup=null;
  for(let volta=0;volta<2;volta++){if(volta){if(!ocup)break;await new Promise(ok=>setTimeout(ok,2500))}
  for(const m of ms){
    const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':iaChave},body:JSON.stringify({contents:[{parts}],generationConfig:{temperature:0,responseMimeType:'application/json'}})});
    if(r.status===404){ult='modelo '+m+' não existe';continue}
    if(r.status===429||r.status>=500){ocup=iaMotivo(r.status,await r.text());continue}
    if(!r.ok){const t=await r.text();throw new Error(iaMotivo(r.status,t))}
    const j=await r.json(),t=((((j.candidates||[])[0]||{}).content||{}).parts||[]).map(x=>x.text||'').join('');
    if(iaModelo!==m){iaModelo=m;iaSalvar()}
    return JSON.parse(t.replace(/^\s*```(?:json)?/,'').replace(/```\s*$/,''));
  }}
  throw new Error(ocup||ult);
}
function b64Canvas(c){const k=Math.min(1,1600/Math.max(c.width,c.height)),o=document.createElement('canvas');o.width=Math.round(c.width*k);o.height=Math.round(c.height*k);o.getContext('2d').drawImage(c,0,0,o.width,o.height);return o.toDataURL('image/jpeg',.85).split(',')[1]}
async function iaLer(c,instr){if(!iaChave||navigator.onLine===false)return null;const j=await iaChamar([{text:instr},{inline_data:{mime_type:'image/jpeg',data:b64Canvas(c)}}]);iaErro='';iaStatus();return j}
let iaNada=false,iaAvisou=false;function iaFalhou(err){iaErro=String(err&&err.message||err);iaStatus();if(!iaAvisou){iaAvisou=true;setTimeout(()=>iaAvisou=false,8000);alert('🤖 A IA não conseguiu ler agora ('+iaErro+').\nVou tentar o leitor do celular.')}}
function iaConfig(){
 try{const o=localStorage.getItem('controle_leituras_luis_ricardo_v1_ia');if(o&&o!==iaChave&&confirm('Achei a chave de IA do Controle de Leituras neste celular. Usar a mesma aqui?')){iaChave=o;iaErro='';iaSalvar();iaStatus();iaTestar();return}}catch(e){}
 const v=prompt('🤖 Leitura das fotos com IA (Google Gemini)\n\nCole aqui a sua chave do Google AI Studio. Ela fica só neste celular (não vai no backup nem na nuvem).\n\nDeixe em branco e toque OK para desligar.'+(iaErro?'\n\n🔴 Último problema: '+iaErro:''),'');
 if(v===null)return;const k=v.trim().replace(/\s+/g,'');
 if(!k){if(iaChave&&confirm('Desligar a leitura com IA e apagar a chave deste celular?')){iaChave='';iaModelo='';iaErro='';iaSalvar();iaStatus()}return}
 iaChave=k;iaErro='';iaSalvar();iaStatus();iaTestar()}
async function iaTestar(){if(!iaChave)return alert('Cole a chave primeiro (🔑).');try{const j=await iaChamar([{text:'Responda só JSON: {"ok":true}'}]);iaErro='';iaStatus();alert(j&&j.ok?'🟢 IA funcionando.':'🟢 A IA respondeu.')}catch(e){iaErro=String(e&&e.message||e);iaStatus();alert('🔴 A IA não funcionou: '+iaErro)}}
function pedeHora(hs,a,guardar){const v=prompt(hs.length>1?'Li estes horários: '+hs.join(' · ')+'.\nDigite o que vale (ex.: 0732):':'Li o horário '+hs[0]+'.\nConfirme ou corrija (ex.: 0732):',hs[0]);if(v===null){guardar();return true}const h=nt(v);if(h){const r=D.r[a.ds]=D.r[a.ds]||{};r[a.k=='fi'?'i':'o']=h;guardar();return true}return false}
let __tess=null;
function carregarTesseract(){if(window.Tesseract)return Promise.resolve();if(__tess)return __tess;__tess=new Promise((ok,erro)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=ok;s.onerror=()=>{__tess=null;erro()};document.head.appendChild(s)});return __tess}
function realce(c){const o=document.createElement('canvas');o.width=c.width;o.height=c.height;const g=o.getContext('2d');g.drawImage(c,0,0);const d=g.getImageData(0,0,o.width,o.height),px=d.data;for(let i=0;i<px.length;i+=4){let y=.299*px[i]+.587*px[i+1]+.114*px[i+2];y=y<128?Math.max(0,y-25):Math.min(255,y+25);px[i]=px[i+1]=px[i+2]=y}g.putImageData(d,0,0);return o}
async function ocrTexto(c,msg){await carregarTesseract();const w=await Tesseract.createWorker('por',1,{logger:m=>{if(m.status==='recognizing text')msg('🔎 Lendo… '+Math.round((m.progress||0)*100)+'%')}});try{await w.setParameters({tessedit_pageseg_mode:'11'});const r=await w.recognize(realce(c));return r.data.text||''}finally{await w.terminate()}}
function acharHoras(t){const out=[],re=/\b([01]?\d|2[0-3])\s*[:hH]\s*([0-5]\d)\b/g;let m;while((m=re.exec(t))){const h=p2(m[1])+':'+m[2];if(!out.includes(h))out.push(h)}return out}
const peq=c=>{const k=Math.min(1,640/c.width),o=document.createElement('canvas');o.width=c.width*k;o.height=c.height*k;o.getContext('2d').drawImage(c,0,0,o.width,o.height);return o.toDataURL('image/jpeg',.55)};
async function lerFoto(a,c){
 if(a.k=='sys')return lerSys(c);if(a.k=='hol')return lerHol(c);
 const guardar=()=>{const r=D.r[a.ds]=D.r[a.ds]||{};r[a.k]=peq(c);r[a.k+'t']=p2(new Date().getHours())+':'+p2(new Date().getMinutes());gravar();render()};
 const msgF=t=>{const e=$('fhoje');if(e)e.textContent=t};
 if(iaChave){try{
  msgF('🤖 Lendo com IA...');
  const j=await iaLer(c,'Esta é uma foto de um relógio de ponto da empresa (modelo MADIS, visor LCD azul/cinza). O visor mostra: uma linha com a data, o nome do funcionário, uma linha com data e hora do registro no formato "dd/mm/aa HH:MM" e, embaixo, um relógio grande "HH:MM:SS". Leia o horário do registro (use a linha "dd/mm/aa HH:MM"; se ela estiver ilegível, use o relógio grande). Ignore os segundos e a data. Responda só JSON: {"horarios":["HH:MM"]}. Use 24 horas. Se houver vários registros, liste todos na ordem em que aparecem. Se de fato não der para ler, {"horarios":[]}.');
  let hs=((j&&j.horarios)||[]).map(x=>nt(String(x))).filter(Boolean);
  if(!hs.length){try{const j2=await iaLer(c,'Transcreva todo o texto que aparece no visor do relógio de ponto desta foto, linha por linha, exatamente como está (datas, nome e horas). Responda só JSON: {"texto":"..."}');hs=acharHoras(String((j2&&j2.texto)||'')).map(x=>nt(x)).filter(Boolean)}catch(e){}}
  if(hs.length&&pedeHora(hs,a,guardar))return;if(!hs.length)iaNada=true;
 }catch(e){iaFalhou(e)}}
 try{
  msgF('📷 Preparando a leitura… (a 1ª vez demora um pouco)');
  const hs=acharHoras(await ocrTexto(c,msgF));
  if(hs.length){
   const v=prompt(hs.length>1?'Li estes horários: '+hs.join(' · ')+'.\nDigite o que vale (ex.: 0732):':'Li o horário '+hs[0]+'.\nConfirme ou corrija (ex.: 0732):',hs[0]);
   if(v===null){guardar();return}
   const h=nt(v);if(h){const r=D.r[a.ds]=D.r[a.ds]||{};r[a.k=='fi'?'i':'o']=h;guardar();return}
  }
 }catch(e){}
 render();
 let sm=null;try{sm=await claude.use('sample')}catch(e){}
 if(!sm){alert((!iaChave?'A IA está desligada (Config → 🤖). Sem ela, o leitor do celular não lê mostradores de LED, como o de um relógio digital.':iaNada?'A IA olhou a foto e não achou um horário.':'Não consegui ler o horário nessa foto.')+'\nGuardei a foto como prova; digite o horário.');return guardar()}
 try{
  $('fhoje').textContent='Lendo o horário da foto...';
  const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.8));
  const {text}=await sm('Esta é a foto de um relógio de ponto ou comprovante de ponto. Leia o horário do registro. Responda SOMENTE com HH:MM em 24h. Se não conseguir ler, responda NAO.',{images:[blob],modelTier:'quick'});
  const m=text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if(m){const h=p2(m[1])+':'+m[2];
   if(confirm('Li '+h+'. Está certo?')){const r=D.r[a.ds]=D.r[a.ds]||{};r[a.k=='fi'?'i':'o']=h;guardar();return}}
 }catch(e){}
 alert('Não deu para confirmar o horário. Guardei a foto; digite o horário na mão.');guardar();
}
const H=()=>D.hol=D.hol||{};
const ph=v=>{v=String(v||'').trim().replace(',','.');if(!v)return null;if(/[:h]/.test(v))return parseHM(v);const n=parseFloat(v);return isNaN(n)?null:Math.round(n*60)};
const rr=n=>'R$ '+n.toFixed(2).replace('.',',');
function appExtMes(mm){let e=0;Object.keys(D.r).forEach(k=>{if(!k.startsWith(mm))return;const c=calc(k,D.r[k]);if(c)e+=c.ex});return e}
const agora=()=>{const n=new Date();return hoje()+'T'+p2(n.getHours())+':'+p2(n.getMinutes())};
function pintaHol(hl,mm,ap,previa){
 if(!hl)return '<span class="mu">Nenhum holerite lançado neste mês.</span>';
 const d=ap-hl.m,rate=hl.m>0?hl.v/(hl.m/60):0,ok=Math.abs(d)<=2;
 return (previa?'<span class="mu">Prévia · ainda não salvo (toque no 💾)</span><br>':'')+
 'Holerite pagou: <b>'+fmt(hl.m)+'</b> = <b>'+rr(hl.v)+'</b>'+(rate?' · <b>'+rr(rate)+'/h</b>':'')+
 '<br>No app ('+mf(mm)+'): <b>'+fmt(ap)+'</b><br>'+
 (ok?'<b style="color:var(--pr)">✅ Confere</b>':'<b class="neg">⚠️ Diferença: '+fmt(d)+'</b>'+(rate?' (≈ '+rr(Math.abs(d)/60*rate)+')':'')+'<br><span class="mu">'+(d>0?'O app tem mais horas do que o holerite pagou.':'O holerite pagou mais horas do que o app tem.')+'</span>')+
 (!previa&&hl.fg?'<br>FGTS do mês no holerite: <b>'+rr(hl.fg)+'</b>':'')+(!previa&&hl.em?'<br><span class="mu">Conferência salva em '+new Date(hl.em).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' (o app tinha '+fmt(hl.ap||0)+')</span>':'')+
 (!previa&&hl.m>0?'<br><button class="s" style="padding:4px 8px;margin-top:4px" onclick="usarVh()">Usar este R$/h como valor da hora extra</button>':'')}
function liveHol(){const mm=$('hmr').value,m=ph($('hh').value),v=parseFloat(String($('hv').value).replace(',','.'));if(!mm||m==null||isNaN(v))return;$('hres').innerHTML=pintaHol({m,v},mm,appExtMes(mm),true)}
function salvaHol(){const mm=$('hmr').value;if(!mm)return alert('Escolha o mês do holerite.');const m=ph($('hh').value),v=parseFloat(String($('hv').value).replace(',','.'));if(m==null||isNaN(v))return alert('Preencha as horas extras pagas (ex.: 6:00) e o valor pago (ex.: 150,00).');H()[mm]={m,v,fg:(H()[mm]||{}).fg||0,ap:appExtMes(mm),em:agora()};gravar();render()}
function delHol(){const mm=$('hmr').value;if(H()[mm]&&confirm('Apagar o holerite de '+mm.split('-').reverse().join('/')+'?')){delete H()[mm];$('hh').value=$('hv').value='';gravar();render()}}
function usarVh(){const hl=H()[$('hmr').value];if(!hl||!hl.m)return;D.cfg.vh=(hl.v/(hl.m/60)).toFixed(2).replace('.',',');gravar();render();alert('Valor da hora extra ajustado para R$ '+D.cfg.vh+' (aba Mês)')}
async function lerHol(c){
 if(!iaChave)return alert('Para ler a foto, ligue a IA em Config → 🤖 (cole a chave). Ou digite as horas e o valor.');
 if(!confirm('A foto vai para o Google (Gemini) para ser lida. No plano grátis o Google pode usar o conteúdo. Cubra o CPF e o endereço antes. Continuar?'))return;
 $('hres').textContent='🤖 Lendo o holerite...';
 try{
  const j=await iaLer(c,'Esta é a foto de um holerite (contracheque) brasileiro. Some todas as linhas de HORA EXTRA (qualquer percentual, como HE 50% ou HE 100%) e responda só JSON: {"ref":"AAAA-MM","horas":"H:MM","valor":numero em reais,"fgts":numero em reais ou null}. ref é o mês de referência do holerite. fgts é o valor do FGTS do mês, que costuma aparecer no rodapé. Se não houver hora extra use horas "0:00" e valor 0. Não invente.');
  const m=ph(j&&j.horas),v=Number(j&&j.valor),fg=Number(j&&j.fgts)||0;
  if(m!=null&&!isNaN(v)&&confirm('Li: horas extras '+fmt(m)+' = '+rr(v)+(fg>0?'\nFGTS do mês: '+rr(fg):'')+(j.ref?'\nMês: '+mf(j.ref):'')+'\n\nEstá certo?')){const mm=/^\d{4}-\d{2}$/.test(j.ref||'')?j.ref:$('hmr').value;$('hmr').value=mm;H()[mm]={m,v,fg:fg>0?fg:0,ap:appExtMes(mm),em:agora()};gravar()}
 }catch(e){iaFalhou(e)}
 render()}
const nomeD=k=>new Date(k+'T12:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}).replace('.','');
const lx=(f,l)=>'<button class="s xd" onclick="'+f+'" aria-label="'+l+'" title="'+l+'">🗑</button>';
const mf=m=>m.split('-').reverse().join('/');
function rendApagar(){try{const kb=Math.round((localStorage.getItem('ponto_v1')||'').length/1024);$('dEsp').textContent='Espaço usado no celular: '+kb+' KB de uns 5000 KB'+(kb>3500?' ⚠️ quase cheio, apague fotos antigas':'')}catch(e){}
 if(!$('dmes').value)$('dmes').value=hoje().slice(0,7);const m=$('dmes').value;let h='',f='',o='',y='',v='';
 Object.keys(D.r).sort().reverse().forEach(k=>{const x=D.r[k];
  if(k.startsWith(m))h+='<div class="dl"><span>'+nomeD(k)+' · '+(x.folga?'🌴 folga':(x.i||'--:--')+' → '+(x.o||'--:--'))+'</span>'+lx("apagar('"+k+"')",'Apagar dia')+'</div>';
  ['fi','fo'].forEach(q=>{if(x[q]&&x[q].length>50)f+='<div class="dl"><span>'+nomeD(k)+' · '+(q=='fi'?'entrada':'saída')+(x[q+'t']?' '+x[q+'t']:'')+'<img src="'+x[q]+'"></span>'+lx("delFotoDia('"+k+"','"+q+"')",'Apagar foto')+'</div>'})});
 Object.keys(H()).sort().reverse().forEach(k=>{o+='<div class="dl"><span>'+mf(k)+' · '+fmt(H()[k].m)+' = '+rr(H()[k].v)+'</span>'+lx("delHolMes('"+k+"')",'Apagar holerite')+'</div>'});
 Object.keys(D.sys||{}).sort().reverse().forEach(k=>{y+='<div class="dl"><span>'+mf(k)+' · '+fmt(D.sys[k].total)+'</span>'+lx("delSys('"+k+"')",'Apagar extras do sistema')+'</div>'});
 (D.fer||[]).forEach((x,i)=>{v+='<div class="dl"><span>'+dm(x.a)+' a '+dm(x.b)+'</span>'+lx('delFer('+i+')','Apagar férias')+'</div>'});
 const n='<span class="mu">Nada lançado.</span>';
 $('dDias').innerHTML=h||'<span class="mu">Nenhum dia neste mês.</span>';$('dFotos').innerHTML=f||'<span class="mu">Nenhuma foto no celular. As fotos ficam na nuvem (aba Fotos).</span>';$('dHol').innerHTML=o||n;$('dSys').innerHTML=y||n;$('dFer').innerHTML=v||n}
function apagarMes(){const m=$('dmes').value,ks=Object.keys(D.r).filter(k=>k.startsWith(m));if(!ks.length)return alert('Nada para apagar neste mês.');if(!confirm('Apagar os '+ks.length+' dias de '+mf(m)+'? Não dá para desfazer.'))return;ks.forEach(k=>delete D.r[k]);gravar();render()}
function delFotoDia(k,q){if(!confirm('Apagar esta foto?'))return;window.apagaFotoNuvem&&window.apagaFotoNuvem(k,q);delete D.r[k][q];delete D.r[k][q+'t'];delete D.r[k][q+'n'];gravar();render()}
function delHolMes(k){if(!confirm('Apagar o holerite de '+mf(k)+'?'))return;delete H()[k];gravar();render()}
function delSys(k){if(!confirm('Apagar os extras do sistema de '+mf(k)+'?'))return;delete D.sys[k];gravar();render()}
function apagarTudo(){if((prompt('Isso apaga TODOS os dados do app neste celular. Digite APAGAR para confirmar:')||'').trim().toUpperCase()!=='APAGAR')return;D={cfg:D.cfg,r:{},sys:{},fer:[],hol:{}};gravar();render();alert('Tudo apagado. A jornada (Config) foi mantida.')}
async function exportaArq(){const t=JSON.stringify(D,(k,v)=>k[0]=='f'&&k.length<=3&&typeof v=='string'&&v.length>50?undefined:v),nome='ponto-backup-'+hoje()+'.json',file=new File([t],nome,{type:'text/plain'});
 if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Backup do Controle de Ponto'});return}catch(e){if(e&&e.name==='AbortError')return}}
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'application/json'}));a.download=nome;document.body.appendChild(a);a.click();a.remove();alert('Arquivo '+nome+' baixado.')}
function importaArq(inp){const f=inp.files[0];inp.value='';if(!f)return;const rd=new FileReader();rd.onload=()=>{let b=null;try{b=JSON.parse(rd.result)}catch(e){}
  if(!b||!b.r){alert('Esse arquivo não é um backup do Controle de Ponto.');return}
  if(!confirm('Importar '+Object.keys(b.r).length+' dia(s) e '+Object.keys(b.hol||{}).length+' holerite(s)? Somam com o que já está neste celular.'))return;
  Object.keys(b.r).forEach(k=>{D.r[k]=Object.assign({},D.r[k]||{},b.r[k])});D.cfg=Object.assign({},D.cfg,b.cfg||{});D.sys=Object.assign({},D.sys,b.sys||{});D.hol=Object.assign({},H(),b.hol||{});(b.fer||[]).forEach(x=>{if(!D.fer.some(y=>y.a==x.a&&y.b==x.b))D.fer.push(x)});D.fer.sort((x,y)=>x.a<y.a?-1:1);gravar();render();alert('Backup importado!')};rd.readAsText(f)}
const b64=u=>btoa(String.fromCharCode(...u)),unb64=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
async function hashPin(p){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('ponto-pin:'+p));return b64(new Uint8Array(b))}
let lkBuf='',lkErr=0,lkTrav=0,lkHid=0;
function lkSt(){const p=!!localStorage.getItem('ponto_pin'),b=!!localStorage.getItem('ponto_bio');$('lkSt').textContent='PIN: '+(p?'ativo':'desligado')+' · Face ID/digital: '+(b?'ativo':'desligado')}
function lkDots(){$('lkDots').textContent='●'.repeat(lkBuf.length)+'○'.repeat(4-lkBuf.length)}
function lkTrancar(){if(!localStorage.getItem('ponto_pin'))return;lkBuf='';lkDots();$('lkMsg').textContent='Digite o PIN de 4 números';$('lock').style.display='flex';if(localStorage.getItem('ponto_bio'))setTimeout(lkBio,300)}
function lkAbrir(){lkBuf='';lkErr=0;$('lock').style.display='none'}
async function lkBio(){if(await bioEntrar())lkAbrir()}
async function lkTecla(t){
 if(Date.now()<lkTrav){$('lkMsg').textContent='Aguarde alguns segundos...';return}
 if(t==='B'){lkBio();return}
 if(t==='<')lkBuf=lkBuf.slice(0,-1);else if(lkBuf.length<4)lkBuf+=t;
 lkDots();
 if(lkBuf.length==4){let h='';try{h=await hashPin(lkBuf)}catch(e){}
  if(h&&h===localStorage.getItem('ponto_pin'))lkAbrir();
  else{lkErr++;lkBuf='';lkDots();$('lkMsg').textContent='PIN errado'+(lkErr>=5?' · aguarde 30 s':'');if(lkErr>=5){lkTrav=Date.now()+30000;lkErr=0}}}}
function lkEsqueci(){if(!confirm('Esqueci o PIN: isso APAGA todos os dados deste celular e tira o bloqueio. Continuar?'))return;if((prompt('Digite APAGAR para confirmar:')||'').trim().toUpperCase()!=='APAGAR')return;['ponto_v1','ponto_pin','ponto_bio'].forEach(k=>localStorage.removeItem(k));location.reload()}
async function pinDefinir(){const a=prompt('Escolha um PIN de 4 números (anote ele):');if(a===null)return;if(!/^\d{4}$/.test(a))return alert('O PIN precisa ter exatamente 4 números.');const b=prompt('Digite o PIN de novo para confirmar:');if(b!==a)return alert('Os PINs não são iguais. Tente de novo.');try{localStorage.setItem('ponto_pin',await hashPin(a));lkSt();alert('PIN ativado. O app vai pedir o PIN ao abrir.')}catch(e){alert('Não foi possível ativar o PIN neste navegador.')}}
function pinRemover(){if(!localStorage.getItem('ponto_pin'))return alert('O bloqueio já está desligado.');if(!confirm('Tirar o bloqueio (PIN e Face ID/digital)?'))return;localStorage.removeItem('ponto_pin');localStorage.removeItem('ponto_bio');lkSt()}
async function bioAtivar(){if(!localStorage.getItem('ponto_pin'))return alert('Primeiro defina o PIN (🔑). O Face ID/digital é um atalho para o PIN.');if(!window.PublicKeyCredential)return alert('Este aparelho ou navegador não permite Face ID/digital dentro do app. Use só o PIN.');
 try{const c=await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:'Controle de Ponto'},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:'ponto',displayName:'Controle de Ponto'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required'},timeout:60000}});localStorage.setItem('ponto_bio',b64(new Uint8Array(c.rawId)));lkSt();alert('Face ID / digital ativado. Na próxima vez que abrir, ele pede primeiro.')}catch(e){alert('Não foi possível ativar o Face ID/digital: '+(e&&e.message||e))}}
