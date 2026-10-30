async function bioEntrar(){const id=localStorage.getItem('ponto_bio');if(!id)return false;try{await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:[{type:'public-key',id:unb64(id),transports:['internal']}],userVerification:'required',timeout:60000}});return true}catch(e){return false}}
function lkInit(){const L=['1','2','3','4','5','6','7','8','9','B','0','<'],p=$('lkPad');p.innerHTML=L.map(t=>'<button class="kp" onclick="lkTecla(\''+t+'\')">'+(t=='B'?'🙂':t=='<'?'⌫':t)+'</button>').join('');lkSt();lkTrancar();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)lkHid=Date.now();else if(lkHid&&Date.now()-lkHid>60000){lkTrancar()}})}
let zk=null;function ver(ds,k){zk=[ds,k];$('zi').src=D.r[ds][k];$('zoom').style.display='flex'}
function verSrc(ds,k,src){zk=[ds,k,1];$('zi').src=src;$('zoom').style.display='flex'}
function delFoto(){if(!zk||!confirm('Apagar esta foto?'))return;const nuv=zk[2],r=D.r[zk[0]]||{},pr=Promise.resolve(window.apagaFotoNuvem&&window.apagaFotoNuvem(zk[0],zk[1]));delete r[zk[1]];delete r[zk[1]+'t'];delete r[zk[1]+'n'];zk=null;gravar();$('zoom').style.display='none';render();if(nuv)pr.then(()=>window.verFotosNuvem&&window.verFotosNuvem())}
function salvar(){
 const ds=$('fd').value;if(!ds)return alert('Escolha a data.');
 const r=D.r[ds]=D.r[ds]||{};
 const ta=nt($('fiT').value),tb=nt($('foT').value);if(ta===null||tb===null)return alert('Horário inválido. Digite assim: 1120 para 11:20.');r.i=ta;r.o=tb;r.l=alm($('fl').value);r.e=$('fe').value;r.folga=$('fg').value==='1';if(r.folga){r.i='';r.o=''}
 gravar();limparForm();render();
}
async function lerSys(c){
 if(!iaChave)return alert('Para ler a foto, ligue a IA em Config → 🤖 (cole a chave). Ou lance os dias na mão.');
 const mes=$('mes').value||hoje().slice(0,7);$('sysout').textContent='🤖 Lendo a foto...';
 try{
  const j=await iaLer(c,'Esta é a foto de uma tela de sistema de uma empresa com as horas extras de um funcionário, dia a dia. Extraia cada linha que tenha uma data e uma quantidade de horas extras. Se a data não tiver ano, use '+mes.slice(0,4)+'. Responda só JSON: {"itens":[{"data":"AAAA-MM-DD","horas":"H:MM"}],"total":"H:MM ou null"}. Não invente linhas. Se não achar, {"itens":[]}.');
  const itens=((j&&j.itens)||[]).filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(x.data||'')&&ph(x.horas)>0);
  if(!itens.length){alert('Não achei horas extras nessa foto. Tente outra mais nítida, ou lance na mão.');render();return}
  const txt=itens.map(x=>x.data.split('-').reverse().slice(0,2).join('/')+' → '+x.horas).join('\n'),soma=itens.reduce((t,x)=>t+ph(x.horas),0);
  if(confirm('Li:\n'+txt+'\n\nTotal: '+fmt(soma)+(j.total?' (a tela diz '+j.total+')':'')+'\nEstá certo?')){
   itens.forEach(x=>{const k=x.data.slice(0,7),o=(D.sys[k]=D.sys[k]||{itens:[],total:0});o.itens=o.itens.filter(y=>y.data!=x.data);o.itens.push({data:x.data,horas:hmStr(ph(x.horas))});o.itens.sort((p,q)=>p.data<q.data?-1:1);o.total=o.itens.reduce((t,y)=>t+(ph(y.horas)||0),0)});
   $('mes').value=itens[0].data.slice(0,7);gravar()}
 }catch(e){iaFalhou(e)}
 render()}
function addSys(){const d=$('sysData').value,h=ph($('sysHoras').value);
 if(!d)return alert('Escolha o dia.');if(h==null||h<=0)return alert('Digite as horas extras, por exemplo 2:30.');
 const k=d.slice(0,7);const o=(D.sys[k]=D.sys[k]||{itens:[],total:0});
 o.itens=o.itens.filter(x=>x.data!=d);o.itens.push({data:d,horas:hmStr(h)});o.itens.sort((a,b)=>a.data<b.data?-1:1);
 o.total=o.itens.reduce((t,x)=>t+(ph(x.horas)||0),0);$('mes').value=k;$('sysHoras').value='';gravar();render()}
function delItemSys(i){const m=$('mes').value,o=D.sys[m];if(!o||!o.itens[i])return;if(!confirm('Tirar este dia da lista?'))return;o.itens.splice(i,1);if(!o.itens.length)delete D.sys[m];else o.total=o.itens.reduce((t,x)=>t+(ph(x.horas)||0),0);gravar();render()}
function limpaSys(){if(confirm('Limpar extras do sistema deste mês?')){delete D.sys[$('mes').value];gravar();render()}}
function limparForm(){['fd','fiT','foT','fl','fe','fg'].forEach(i=>$(i).value='')}
function editar(ds){const r=D.r[ds];$('fd').value=ds;$('fiT').value=r.i||'';$('foT').value=r.o||'';$('fl').value=r.l!=null&&r.l!==''?hmStr(+r.l):'';$('fe').value=r.e||'';$('fg').value=r.folga?'1':'';aba(1);$('fdet').open=true;scrollTo(0,0)}
function nomeDia(k){return new Date(k+'T12:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}).replace('.','')}
var FN=[];try{FN=JSON.parse(localStorage.getItem('ponto_ferias_nuvem')||'[]')}catch(e){FN=[]}
function FER(){return (D.fer||[]).concat(FN)}
function FNhtml(){return FN.map(f=>'<div class="day" style="display:flex;align-items:center;gap:8px;padding:8px 2px;line-height:1.4;border-top:1px solid var(--bd)"><span style="flex:none;font-size:15px">'+(f.st=='aprovada'?'✅':'❌')+'</span><div style="min-width:0"><b>'+f.a.split('-').reverse().join('/')+' a '+f.b.split('-').reverse().join('/')+'</b><div class="mu" style="font-size:10px;line-height:1.3">'+(f.st=='aprovada'?'Aprovada':'Aguardando aprovação')+' · do app de Férias</div></div></div>').join('')}
function emFerias(k){return FER().some(f=>k>=f.a&&k<=f.b)}
function lancarDia(k){aba(1);$('fd').value=k;const r=D.r[k]||{};$('fiT').value=r.i||'';$('foT').value=r.o||'';$('fl').value=r.l!=null&&r.l!==''?hmStr(+r.l):'';$('fe').value=r.e||'';$('fg').value=r.folga?'1':'';$('fdet').open=true;scrollTo(0,0)}
let dmModo='dia';
function dmLinha(k){const r=D.r[k]||{};return '<div class="day" style="display:flex;gap:4px;align-items:center"><b style="flex:0 0 78px;font-size:12px">'+nomeDia(k)+'</b><input id="dmI_'+k+'" inputmode="numeric" maxlength="5" placeholder="entrada" value="'+(r.i||'')+'" oninput="mask(this)" style="min-width:0;padding:6px"><input id="dmO_'+k+'" inputmode="numeric" maxlength="5" placeholder="saída" value="'+(r.o||'')+'" oninput="mask(this)" style="min-width:0;padding:6px"><button style="flex:0 0 42px;padding:7px 0" onclick="dmSalva(\''+k+'\')" title="Salvar este dia" aria-label="Salvar este dia">💾</button></div>'}
let hhEd=null;
function hhEditar(k){hhEd=k;render();setTimeout(()=>{const e=$('edI_'+k);if(e){e.scrollIntoView({block:'center'});(D.r[k]&&!D.r[k].i?e:$('edO_'+k)).focus()}},50)}
function hhLinha(k){const r0=D.r[k]||{},eI=$('edI_'+k),eO=$('edO_'+k),r={i:eI?eI.value:r0.i,o:eO?eO.value:r0.o};return '<div class="day" style="background:var(--bg);border-radius:6px;padding:6px"><b style="font-size:12px">✏️ Corrigir '+nomeDia(k)+'</b><div style="display:flex;gap:4px;align-items:flex-end;margin-top:4px"><div style="flex:1;min-width:0"><label>Entrada</label><input id="edI_'+k+'" inputmode="numeric" maxlength="5" placeholder="ex.: 0728" value="'+(r.i||'')+'" oninput="mask(this)"></div><div style="flex:1;min-width:0"><label>Saída</label><input id="edO_'+k+'" inputmode="numeric" maxlength="5" placeholder="ex.: 1700" value="'+(r.o||'')+'" oninput="mask(this)"></div><button style="flex:0 0 40px" onclick="hhSalva(\''+k+'\')" title="Salvar" aria-label="Salvar">💾</button><button class="s" style="flex:0 0 40px" onclick="hhEd=null;render()" title="Cancelar" aria-label="Cancelar">✕</button></div></div>'}
function hhSalva(k){const a=nt($('edI_'+k).value),b=nt($('edO_'+k).value);if(a===null||b===null){alert('Horário inválido. Digite assim: 0728 para 07:28.');return}if(!a&&!b){alert('Digite a entrada e a saída.');return}const r=D.r[k]=D.r[k]||{};r.folga=false;r.i=a;r.o=b;hhEd=null;gravar();render()}
function dmSalva(k){const a=nt($('dmI_'+k).value),b=nt($('dmO_'+k).value);if(a===null||b===null){alert('Horário inválido. Digite assim: 1120 para 11:20.');return}if(!a&&!b){alert('Digite a entrada e a saída.');return}const r=D.r[k]=D.r[k]||{};r.folga=false;r.i=a;r.o=b;gravar();render();if(dmModo=='falta')dmFalta();else dmBusca()}
function dmBusca(){dmModo='dia';const k=$('dmData').value,bx=$('dmRes');if(!k){bx.innerHTML='';return}
  const r=D.r[k],c=r?calc(k,r):null;let t='';
  if(emFerias(k))t='🏖️ Este dia está em férias (não precisa lançar horas).';
  else if(r&&r.folga)t='🌴 Folga'+(c?' · compensa '+fmt(c.ex):'');
  else if(c)t='Extra deste dia: <b>'+fmt(c.ex)+'</b>';
  else if(r)t='<span class="mu">Incompleto: falta entrada ou saída.</span>';
  else t='<span class="mu">Sem registro neste dia. Digite os horários abaixo:</span>';
  bx.innerHTML=(t?'<div class="sub" style="text-align:left;margin-bottom:2px">'+t+'</div>':'')+dmLinha(k)+'<div class="sub" style="text-align:left;margin-top:2px"><a href="#" onclick="lancarDia(\''+k+'\');return false">Mais opções (almoço, folga, extra)</a></div>'}
function dmFalta(){dmModo='falta';const fim=!!($('dmFim')&&$('dmFim').checked),m=$('mes').value,bx=$('dmRes');if(!m)return;const a=m.split('-'),y=+a[0],mo=+a[1]-1,hj=new Date(),h0=new Date(hj.getFullYear(),hj.getMonth(),hj.getDate()),L=[];
  for(let d=1;d<=31;d++){const x=new Date(y,mo,d);if(x.getMonth()!=mo)break;if(x>h0)break;const w=x.getDay();if((w==0||w==6)&&!fim)continue;const k=y+'-'+p2(mo+1)+'-'+p2(d);if(D.r[k]||emFerias(k))continue;L.push(k)}
  bx.innerHTML=L.length?'<div class="mu" style="font-size:11px">'+L.length+(fim?' dia(s)':' dia(s) útil(eis)')+' sem registro em '+a[1]+'/'+a[0]+'. Digite a entrada e a saída e toque em 💾:</div>'+L.map(dmLinha).join(''):'<span class="mu">Nenhum dia '+(fim?'':'útil ')+'sem registro em '+a[1]+'/'+a[0]+'. 👍</span>'}

function apagar(ds){if(confirm('Apagar o dia '+ds+'?')){delete D.r[ds];gravar();render()}}
function salvaCfg(){D.cfg={...D.cfg,e:$('ce').value||'07:30',s:$('cs').value||'17:00',l:alm($('cl').value)||0,m:1,pm:+$('cpm').value||3,pi:$('cpi').value||''};gravar();render();alert('Salvo')}
function backup(){const t=JSON.stringify(D,(k,v)=>k[0]=='f'&&k.length<=3&&typeof v=='string'&&v.length>50?undefined:v);navigator.clipboard.writeText(t).then(()=>alert('Backup copiado (sem fotos).'))}
function render(){
 const ds=hoje(),r=D.r[ds]||{};
 $('hi').value=r.i||'';$('ho').value=r.o||'';{const dia=new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}).replace('.','');$('lbI').textContent='Entrada · '+dia;$('lbO').textContent='Saída · '+dia}$('hi').disabled=$('ho').disabled=!!((r.i||r.o)&&!edit&&!r.folga);
 {const n=nUtil(ds),b=$('lemb'),ma=mesAnt(ds).split('-').reverse().join('/');if(n==2||n==3){b.style.display='';b.innerHTML='🔔 <b>Hoje é o '+n+'º dia útil.</b> '+(n==3?'Último dia para acertar o ponto de ':'Acerte o ponto de ')+'<b>'+ma+'</b>.<button style="width:100%;margin-top:6px" onclick="irMesAnt()">📋 Ver horários de '+ma+'</button>'}else b.style.display='none'}
 const fh=FER().find(f=>ds>=f.a&&ds<=f.b);$('fgst').textContent=fh?'🏖️ Você está de férias ('+dm(fh.a)+' a '+dm(fh.b)+') · não precisa lançar horas':(r.folga?'🌴 Hoje está lançado como folga (compensa a jornada)':'');
 $('fhoje').textContent='Fotos de hoje: entrada '+(r.fin?'☁️✅':r.fi?'⏳':'—')+' · saída '+(r.fon?'☁️✅':r.fo?'⏳':'—');
 if(!$('mes').value)$('mes').value=ds.slice(0,7);{const a=$('mes').value.split('-'),NM=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];$('mesTx').textContent=NM[+a[1]-1]+' de '+a[0]}
 $('cpm').value=D.cfg.pm||3;if(document.activeElement!==$('cpi'))$('cpi').value=D.cfg.pi||'';$('ce').value=D.cfg.e;$('cs').value=D.cfg.s;$('cl').value=hmStr(D.cfg.l);
 const m=$('mes').value;let tp=0,tn=0,np=0,tw=0,te=0,h='',g='',hh='';const vhd=parseFloat(String(D.cfg.vh||'').replace(',','.'))||0,rs=e=>vhd>0&&e>0?' · <b>R$ '+(vhd*e/60).toFixed(2).replace('.',',')+'</b>':'';
 Object.keys(D.r).sort().forEach(k=>{
  const x=D.r[k],dd=new Date(k+'T12:00'),nome=dd.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'});
  if(x.fi||x.fo)g+=`<div style="margin-top:8px"><b>${nome}</b> <span class="mu">${x.i?'entrada '+x.i:''} ${x.o?'· saída '+x.o:''}</span><div class="ph" style="margin-top:4px">`+
   (x.fi?`<div><img src="${x.fi}" onclick="ver('${k}','fi')"><div class="sub">entrada${x.fit?' '+x.fit:''}</div><button class="s" style="margin-top:4px;padding:3px 10px" onclick="delFotoDia('${k}','fi')" aria-label="Apagar foto" title="Apagar foto">🗑️</button></div>`:'')+(x.fo?`<div><img src="${x.fo}" onclick="ver('${k}','fo')"><div class="sub">saída${x.fot?' '+x.fot:''}</div><button class="s" style="margin-top:4px;padding:3px 10px" onclick="delFotoDia('${k}','fo')" aria-label="Apagar foto" title="Apagar foto">🗑️</button></div>`:'')+`</div></div>`;
  if(!k.startsWith(m))return;
  const c=calc(k,x);if(c){tw+=c.w;te+=c.ex;if(c.ex>0){tp+=c.ex;np++}else if(c.ex<0)tn+=c.ex}
  hh+=k===hhEd?hhLinha(k):`<div class="day" style="display:flex;align-items:center;gap:6px"><span style="flex:1;min-width:0"><b>${nome}</b>${x.folga?' · 🌴 FOLGA':' · '+(x.i||'--:--')+' → '+(x.o||'--:--')}${c?' · <b class="'+(c.ex<0?'neg':'')+'">'+fmt(c.ex)+'</b>'+rs(c.ex):' <span class="mu">incompleto</span> <span style="color:#e67e22">●</span>'}</span><button class="s" style="flex:0 0 34px;padding:3px 0" onclick="hhEditar('${k}')" title="Corrigir este dia" aria-label="Corrigir este dia">✏️</button></div>`;
  h+=`<div class="day"><b>${nome}</b>${fimSem(k)?' <span class="mu">(folga ×1,5)</span>':''} · ${x.folga?'🌴 FOLGA':(x.i||'--:--')+' → '+(x.o||'--:--')}`+
   (c?`<br>${x.folga?'':'trabalhou <b>'+fmt(c.w)+'</b> · '}${x.folga?'compensa':'extra'} <b class="${c.ex<0?'neg':''}">${fmt(c.ex)}</b>${rs(c.ex)}${x.e?' <span class="mu">(comprovante)</span>':''}`:' <span class="mu">incompleto</span>')+
   `<div class="row" style="margin-top:4px"><button class="s" style="padding:4px" onclick="editar('${k}')">Editar</button><button class="s" style="padding:4px" onclick="foto('fi','${k}')">📷 Ent.</button><button class="s" style="padding:4px" onclick="foto('fo','${k}')">📷 Saí.</button><button class="s" style="padding:4px;color:var(--rd);border-color:var(--rd)" onclick="apagar('${k}')">🗑</button></div></div>`;
 });
 const fm=FER().filter(f=>f.a.slice(0,7)<=m&&f.b.slice(0,7)>=m).map(f=>`<div class="day">🏖️ <b>Férias</b>${f.st&&f.st!='aprovada'?' ('+f.st+')':''} ${dm(f.a)} a ${dm(f.b)} · <span class="mu">sem horas a lançar</span></div>`).join('');
 $('ferList').innerHTML=(D.fer.map((f,i)=>`<div class="day">🏖️ ${f.a.split('-').reverse().join('/')} a ${f.b.split('-').reverse().join('/')} <span style="float:right;display:flex;gap:6px"><button class="s" style="padding:2px 8px" onclick="editFer(${i})" aria-label="Editar férias">✏️</button><button class="s" style="padding:2px 8px;color:var(--rd);border-color:var(--rd)" onclick="delFer(${i})" aria-label="Apagar férias">🗑</button></span></div>`).join('')+FNhtml())||'<span class="mu">Nenhuma férias lançada.</span>';
 hh=fm+hh;h=fm+h;
 {const n=Object.keys(D.r).filter(k=>k.startsWith(m)).length;$('dmS').textContent=n?'· '+n+' '+(n>1?'dias':'dia')+' · saldo '+fmt(te):''}
 const NMx=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],mNome=NMx[+m.split('-')[1]-1];
 const resM=(tp||tn)?'<div style="border:1px solid var(--pr);border-radius:8px;padding:6px 8px;margin:4px 0 6px"><b>📊 Horas extras de '+mNome+'</b>'+
  '<div class="dl"><span>➕ Extras feitas <span class="mu" style="font-size:10px">('+(np?np+' '+(np>1?'dias':'dia'):'nenhum dia')+')</span></span><b style="color:var(--pr)">'+fmt(tp)+rs(tp)+'</b></div>'+
  '<div class="dl"><span>➖ Horas a menos <span class="mu" style="font-size:10px">(saiu cedo ou folga)</span></span><b class="neg">'+fmt(tn)+'</b></div>'+
  '<div class="dl"><span><b>= Saldo do mês</b></span><b class="'+(te<0?'neg':'')+'" style="font-size:14px">'+fmt(te)+rs(te)+'</b></div></div>':'';
 $('listaHoje').innerHTML=hh?resM+hh:'<span class="mu">Nenhum registro neste mês.</span>';
 $('mesRes').innerHTML=resM;
 $('lista').innerHTML=h||'<span class="mu">Nenhum registro neste mês.</span>';
 $('gal').innerHTML=g?'<div class="day" style="color:#e67e22;font-weight:600">⏳ Ainda no celular, esperando subir para a nuvem'+(window.nuvemOn&&window.nuvemOn()?'':' (entre na sua conta em Config → ☁️ Nuvem)')+':</div>'+g:'';
 const sy=D.sys[m];
 $('sysout').innerHTML=sy?sy.itens.map((x,i)=>'<div class="dl"><span>'+x.data.split('-').reverse().slice(0,2).join('/')+' · '+x.horas+'</span><button class="s xd" onclick="delItemSys('+i+')" aria-label="Tirar este dia">✕</button></div>').join('')+'<div class="big" style="margin-top:4px">Total sistema: '+fmt(sy.total)+'</div>':'<span class="mu">Nenhum lançamento deste mês.</span>';
 $('rSys').textContent=sy?'Extras no sistema: '+fmt(sy.total):'';
{const N=D.cfg.pm||3,hm0=hoje().slice(0,7);let ini;const mi=x=>{const a=x.split('-');return +a[0]*12+(+a[1]-1)},ms=n=>Math.floor(n/12)+'-'+p2(n%12+1);
  if(D.cfg.pi){const k=Math.floor((mi(hm0)-mi(D.cfg.pi))/N);ini=k>=0?mi(D.cfg.pi)+k*N:mi(hm0)-N+1}else ini=mi(hm0)-N+1;
  let tot=0,L='';for(let n=ini;n<ini+N;n++){const mm=ms(n);let e=0;Object.keys(D.r).forEach(k=>{if(!k.startsWith(mm))return;const c=calc(k,D.r[k]);if(c)e+=c.ex});tot+=e;L+=mm.split('-').reverse().join('/')+': '+fmt(e)+(vhd>0&&e>0?' · R$ '+(vhd*e/60).toFixed(2).replace('.',','):'')+(n<ini+N-1?'<br>':'')}
  $('acT').textContent='💰 Acumulado ('+ms(ini).split('-').reverse().join('/')+' a '+ms(ini+N-1).split('-').reverse().join('/')+')';$('acE').textContent=fmt(tot);$('acS').textContent='· '+fmt(tot)+(vhd>0&&tot>0?' · R$ '+(vhd*tot/60).toFixed(2).replace('.',','):'');$('acE').className='big'+(tot<0?' neg':'');$('acV').textContent='R$ '+(vhd>0&&tot>0?vhd*tot/60:0).toFixed(2).replace('.',',');$('acL').innerHTML=L+'<br><span class="mu">Pago a cada '+N+' '+(N>1?'meses':'mês')+' (muda na aba Config)</span>'}
 $('rTrab').textContent=fmt(tw);$('sumS').textContent='· saldo do mês '+fmt(te);try{rendApagar()}catch(e){}
 {if(!$('hmr').value)$('hmr').value=mesAnt(ds);const hm2=$('hmr').value,hl=H()[hm2];if(hl&&document.activeElement!==$('hh')&&document.activeElement!==$('hv')){$('hh').value=hmStr(hl.m);$('hv').value=hl.v.toFixed(2).replace('.',',')}
  const ap=appExtMes(hm2);$('hres').innerHTML=pintaHol(hl,hm2,ap,false)}
 {const ch=calc(ds,r);$('hT').textContent=ch?fmt(ch.w):'0h00';$('hE').textContent=ch?fmt(ch.ex):'0h00';$('hE').className='big'+(ch&&ch.ex<0?' neg':'');$('hV').textContent=ch?((fimSem(ds)&&!r.folga?'Sáb/dom: 1h vale 1h30. ':'')+rs(ch.ex).replace(/<[^>]+>/g,'').replace(' · ','Valor de hoje: ')):'Ainda sem entrada e saída de hoje.'}
 {const v=parseFloat(String(D.cfg.vh||'').replace(',','.'))||0,val=v>0&&te>0?v*te/60:0,t='R$ '+val.toFixed(2).replace('.',',');if(document.activeElement!==$('vh'))$('vh').value=D.cfg.vh||'';$('rVal').textContent=t;$('rVal2').textContent=v>0?'Valor estimado das extras: '+t:''}
 [$('rSaldo'),$('rSaldo2')].forEach(e=>{e.textContent=fmt(te);e.className='big'+(te<0?' neg':'')});
}
const VERSAO='7.1';try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){};$('ver').textContent=VERSAO;$('ver2').textContent=VERSAO;
function compartilhar(){const u=location.href.split('?')[0].split('#')[0];if(navigator.share)navigator.share({title:'Controle de Ponto',text:'Controle de Ponto: entrada, saída, horas extras e folgas',url:u}).catch(()=>{});else navigator.clipboard.writeText(u).then(()=>alert('Link copiado: '+u))}
function atualizar(){if(!confirm('Buscar a versão mais nova do app? Seus dados não serão apagados.'))return;fetch(location.href.split('#')[0],{cache:'reload'}).finally(()=>location.reload())}
function tick(){const d=new Date();$('clk').textContent=d.toLocaleTimeString('pt-BR');$('dt').textContent=d.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});try{saidaPrev()}catch(e){}}
let spAvisou='';
function horaSaida(ds){const r=D.r[ds]||{};if(!r.i||r.folga||fimSem(ds)||emFerias(ds))return null;const j=hm(D.cfg.s)-hm(D.cfg.e)-D.cfg.l,l=r.l!=null&&r.l!==''?+r.l:D.cfg.l;return hm(r.i)+j+l}
const hhmm=m=>{m=((m%1440)+1440)%1440;return p2(Math.floor(m/60))+':'+p2(m%60)};
function saidaPrev(){const el=$('saidaPrev');if(!el)return;const ds=hoje(),r=D.r[ds]||{},sai=horaSaida(ds);
 if(sai==null||r.o){el.style.display='none';return}
 const n=new Date(),falta=sai-(n.getHours()*60+n.getMinutes());let cor='var(--pr)',t;
 if(falta>30)t='Faltam <b>'+fmt(falta)+'</b> para sair';
 else if(falta>0){cor='#e67e22';t='⏳ Faltam só <b>'+falta+' min</b>. Já pode ir se arrumando'}
 else if(falta==0){cor='#e67e22';t='✅ <b>Hora de sair!</b>'}
 else{cor='var(--rd)';t='⚠️ Já passou <b>'+fmt(-falta)+'</b> do horário (está fazendo hora extra)'}
 el.style.display='';el.style.borderColor=cor;
 el.innerHTML='<div style="font-size:12px">🕓 Entrou às <b>'+r.i+'</b> · Saída prevista: <b style="font-size:16px;color:'+cor+'">'+hhmm(sai)+'</b></div><div style="margin-top:2px;color:'+cor+'">'+t+'</div><button class="s" style="margin-top:6px;padding:4px 10px" onclick="lembreteSaida()" title="Me avisar na hora de sair" aria-label="Me avisar na hora de sair">⏰ Me avisar na hora de sair</button>';
 if(falta<=0&&falta>-2&&spAvisou!==ds+r.i){spAvisou=ds+r.i;try{navigator.vibrate&&navigator.vibrate([300,150,300])}catch(e){}try{if(window.Notification&&Notification.permission==='granted')new Notification('Controle de Ponto',{body:'Hora de sair! Saída prevista: '+hhmm(sai),icon:'icon-192.png'})}catch(e){}}}
function lembreteSaida(){const ds=hoje(),sai=horaSaida(ds);if(sai==null)return alert('Bata a entrada primeiro.');
 try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}
 const d=ds.replace(/-/g,''),t=hhmm(sai).replace(':',''),fim=hhmm(sai+5).replace(':',''),st=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
 const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Controle de Ponto//PT-BR','BEGIN:VEVENT','UID:saida-'+d+'@controle-de-ponto','DTSTAMP:'+st,'DTSTART:'+d+'T'+t+'00','DTEND:'+d+'T'+fim+'00','SUMMARY:🕓 Hora de sair ('+hhmm(sai)+')','DESCRIPTION:Saída prevista pelo Controle de Ponto. Não esqueça de bater o ponto!','BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Faltam 10 minutos para sair','TRIGGER:-PT10M','END:VALARM','BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Hora de sair!','TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'];
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([L.join('\r\n')],{type:'text/calendar'}));a.download='hora-de-sair.ics';document.body.appendChild(a);a.click();a.remove();
 alert('Abra o arquivo baixado e adicione ao calendário. O celular avisa 10 minutos antes e na hora de sair ('+hhmm(sai)+'), mesmo com o app fechado.')}
function bhMov(){const c=(D.bh&&D.bh.corte)||'';let t=0;Object.keys(D.r||{}).forEach(k=>{if(k>=c){const x=calc(k,D.r[k]);if(x&&typeof x.ex==='number'&&x.ex>0)t+=x.ex}});return t}
const sg=m=>(m>0?'+':'')+fmt(m);
function renderBH(){
 if(!$('bhD'))return;const b=D.bh;if(!b){$('bhS').textContent='';$('bhOut').innerHTML='';return}
 const set=(id,v)=>{const e=$(id);if(e&&document.activeElement!==e)e.value=v};
 set('bhData',b.data||'');set('bhSaldo',b.saldo||'');set('bhCorte',b.corte||'');set('bhMeses',b.meses||4);
 if(!$('bhV').children.length){let h='';for(let i=0;i<4;i++)h+='<div class="row" style="margin-top:4px"><div><input type="month" id="bhm'+i+'"></div><div><input id="bhh'+i+'" placeholder="h:mm"></div></div>';$('bhV').innerHTML=h}
 for(let i=0;i<4;i++){const v=(b.venc||[])[i]||['',''];set('bhm'+i,v[0]);set('bhh'+i,v[1])}
 const base=ph(b.saldo)||0,mov=bhMov(),est=base+mov;
 $('bhS').textContent='· saldo estimado '+fmt(est);
 const ven=(b.venc||[]).filter(v=>v[0]&&v[1]).map(v=>'<div class="day">⏳ vence '+mf(v[0])+' <b style="float:right">'+fmt(ph(v[1])||0)+'</b></div>').join('');
 const meses=Number(b.meses)||4,mm={};Object.keys(D.r||{}).forEach(k=>{if(k>=(b.corte||'')){const x=calc(k,D.r[k]);if(x&&typeof x.ex==='number'&&x.ex>0){const m=k.slice(0,7);mm[m]=(mm[m]||0)+x.ex}}});
 const novos=Object.keys(mm).sort().filter(m=>mm[m]!==0).map(m=>{const y=+m.slice(0,4),mo=+m.slice(5,7),d=new Date(Date.UTC(y,mo-1+meses,1)),v=d.getUTCFullYear()+'-'+p2(d.getUTCMonth()+1);return '<div class="day">➕ extras de '+mf(m)+' <span class="mu" style="font-size:10px">(vencem '+mf(v)+')</span> <b style="float:right">'+sg(mm[m])+'</b></div>'}).join('');
 $('bhOut').innerHTML='<div class="day">Saldo do relatório'+(b.data?' ('+b.data.split('-').reverse().join('/')+')':'')+' <b style="float:right">'+fmt(base)+'</b></div><div class="day">Movimento desde '+(b.corte?b.corte.split('-').reverse().slice(0,2).join('/'):'—')+' <b style="float:right">'+sg(mov)+'</b></div><div class="day"><b>Saldo estimado agora</b> <b style="float:right">'+fmt(est)+'</b></div>'+novos+ven;
}
function salvaBH(){const venc=[];for(let i=0;i<4;i++){const m=$('bhm'+i).value,h=$('bhh'+i).value.trim();if(m&&h)venc.push([m,h])}
 const sd=$('bhSaldo').value.trim();if(sd&&ph(sd)==null)return alert('Saldo inválido. Use o formato 75:43.');
 D.bh={data:$('bhData').value,saldo:sd,corte:$('bhCorte').value,meses:Math.max(1,parseInt($('bhMeses').value)||4),m4:1,venc};gravar();render();alert('Banco de horas salvo')}
var abrirManual=false;
function ajustaHoje(){const box=$('manualBox'),res=$('resumoHoje');if(!box||!res)return;
 if(box.contains(document.activeElement))return;
 const r=(D.r&&D.r[hoje()])||{};const comp=r.i&&r.o&&!r.folga;const mostrar=!comp||abrirManual;
 box.style.display=mostrar?'':'none';res.style.display=mostrar?'none':'flex';
 if(!mostrar)res.innerHTML='<span>Hoje: <b>'+r.i+' → '+r.o+'</b> · ✓ completo</span><button class="s" style="width:auto;flex:none;padding:5px 14px" onclick="abrirManual=true;ajustaHoje()" title="Corrigir horário de hoje" aria-label="Corrigir horário de hoje">✏️</button>'}
const _render0=render;render=function(){_render0();try{renderBH()}catch(e){}try{ajustaHoje()}catch(e){}};
const _sh0=salvarHoje;salvarHoje=function(){const x=_sh0.apply(this,arguments);abrirManual=false;try{ajustaHoje()}catch(e){}return x};
function semear(){
 try{if(localStorage.getItem('ponto_seed_1019'))return}catch(e){return}
 const S={'2026-10-01':['07:19','16:33'],'2026-10-02':['07:20','17:00'],'2026-10-05':['07:18','15:07'],'2026-10-06':['07:23','15:20'],'2026-10-07':['07:03','17:01'],'2026-10-08':['07:18','16:22'],'2026-10-09':['07:17','16:02'],'2026-10-13':['07:06','17:02'],'2026-10-14':['07:14','17:04'],'2026-10-15':['07:19','16:53'],'2026-10-16':['07:03','17:10'],'2026-10-17':['06:00','11:25']};
 const falta=Object.keys(S).filter(k=>{const r=D.r[k];return !r||(!r.i&&!r.o&&!r.folga)});
 try{localStorage.setItem('ponto_seed_1019','1')}catch(e){}
 if(!falta.length)return;
 if(!confirm('Preencher '+falta.length+' dias de outubro (01 a 17/10) com as batidas do sistema da Elektro? Dias que já têm horário não são mexidos.'))return;
 falta.forEach(k=>{D.r[k]=Object.assign({},D.r[k]||{},{i:S[k][0],o:S[k][1]})});
 gravar();render();alert('Pronto! '+falta.length+' dias preenchidos.');
}
tick();setInterval(tick,1000);render();lkInit();iaStatus();setTimeout(semear,600);setTimeout(()=>{if(D.bh&&!D.bh.m4){D.bh.meses=4;D.bh.m4=1;gravar();render()}},900);if(!D.bh){D.bh={data:'2026-10-19',saldo:'75:43',corte:'2026-10-17',venc:[['2026-12','10:49'],['2027-01','7:48'],['2027-02','13:31']]};gravar()}
const NMd=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],NMm=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
function datasCompactas(){document.querySelectorAll('input[type=date],input[type=month]').forEach(inp=>{
  if(!inp.parentNode.classList.contains('dw')){const w=document.createElement('div');w.className='dw';inp.parentNode.insertBefore(w,inp);const v=document.createElement('div');v.className='dv';w.appendChild(v);w.appendChild(inp);inp.addEventListener('input',datasCompactas);inp.addEventListener('change',datasCompactas)}
  const v=inp.parentNode.querySelector('.dv'),x=inp.value;let t='📅 escolher';
  if(x&&inp.type=='date'){const d=new Date(x+'T12:00');t='📅 '+d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')+', '+x.slice(8)+'/'+x.slice(5,7)+'/'+x.slice(0,4)}
  else if(x&&inp.type=='month'){t='📅 '+NMm[+x.slice(5,7)-1]+' de '+x.slice(0,4)}
  if(v.textContent!==t){v.textContent=t;v.classList.toggle('vz',!x)}})}
setInterval(datasCompactas,400);setTimeout(datasCompactas,50);
document.addEventListener('click',function(e){const t=e.target;if(t&&t.tagName=='INPUT'&&(t.type=='date'||t.type=='month')&&t.showPicker&&!t.disabled){try{t.showPicker()}catch(x){}}});
try{if(!$('dmData').value)$('dmData').value=hoje()}catch(e){}
