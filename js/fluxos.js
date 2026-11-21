/* ==========================================================================
   FLUXOS SIMULADOS — modais #n8nModal e #makeModal
   Um motor só: os dois fluxos são DADOS (nós + arestas + o que cada nó faz).
   · Carregado sob demanda pelo loader inline do index.html (intenção no card / abertura do modal).
   · Nada roda antes do modal abrir (o DOM do fluxo é montado na 1ª abertura).
   · Relógio próprio em rAF: para ao fechar, na aba "Print real" e com a aba do
     navegador oculta. Animação só com transform / opacity / stroke-dashoffset.
   · Só createElement/textContent — nenhum innerHTML com dado dinâmico.
   · prefers-reduced-motion: abre no estado final, sem animar; o botão roda.
   ========================================================================== */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg',RM=matchMedia('(prefers-reduced-motion: reduce)'),CANCEL={};
function h(t,a,p,x){const e=document.createElement(t);for(const k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
function s(t,a,p,x){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.random()*a.length|0];
const brl=v=>'R$ '+v.toLocaleString('pt-BR',{minimumFractionDigits:2});
const slug=n=>n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]+/g,'.').replace(/^\.|\.$/g,'');
const mail=n=>slug(n)+'@exemplo.com.br',first=n=>n.split(' ')[0];
const tel=()=>'(14) 9••••-'+rint(1000,9999);
const ddmm=d=>{const x=new Date(Date.now()+d*864e5);return String(x.getDate()).padStart(2,'0')+'/'+String(x.getMonth()+1).padStart(2,'0')};
const secs=ms=>ms<1000?Math.round(ms)+' ms':(ms/1000).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'\u00a0s';
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;

/* Ícones próprios (grade 24, traço). Nada de logo de marca. */
const IC={
 in:'M3 12h11M10 8l4 4-4 4M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4',
 spark:'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
 chip:'M7 7h10v10H7zM10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4',
 db:'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
 search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
 split:'M3 12h4c4 0 5-6 9-6h3M7 12c4 0 5 6 9 6h3M17 3l3 3-3 3M17 15l3 3-3 3',
 crm:'M3 5h18v14H3zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM5 16.5c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h4M14 14h4',
 chat:'M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.2-4A8 8 0 1 1 20 11.5zM9 10h6M9 13.5h4',
 mail:'M3 6h18v12H3zM3 7l9 6 9-6',
 cal:'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M9 15l2 2 4-4',
 form:'M8 3h8v3H8zM6 4.5H5V21h14V4.5h-1M8 11h8M8 15h5',
 gear:'M4 7h9M17 7h3M15 5v4M4 17h3M11 17h9M9 15v4M4 12h3M11 12h9M9 10v4',
 router:'M3 12h4M7 12c4 0 5-6 10-6M7 12h10M7 12c4 0 5 6 10 6M16 4l2 2-2 2M16 10l2 2-2 2M16 16l2 2-2 2',
 sheet:'M4 4h16v16H4zM4 9h16M4 14.5h16M10 4v16',
 phone:'M6 3h3.5l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L16 12.5l5 2V18a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z',
 skip:'M4 6l7 6-7 6zM13 6l7 6-7 6z',
 clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
 funnel:'M4 5h16l-6 7.5V18l-4 2v-7.5z',
 check:'M5 12.5l4.5 4.5L19 7.5',
 play:'M8 5l11 7-11 7z',
 flask:'M9 3h6M10 3v6.5L5 18a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-8.5V3M7.3 15h9.4',
 bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
 back:'M15 6l-6 6 6 6',
 plus:'M12 6v12M6 12h12'
};
const FILL={skip:1,play:1,bolt:1};
function icon(p,k,x,y,z,cls){return s('path',{d:IC[k],class:(FILL[k]?'fx-icf':'fx-ic')+(cls?' '+cls:''),transform:`translate(${x-z/2} ${y-z/2}) scale(${z/24})`},p)}
function svgIcon(k){const v=s('svg',{viewBox:'0 0 24 24','aria-hidden':'true'});s('path',{d:IC[k],class:FILL[k]?'fx-icf':'fx-ic'},v);return v}

/* ---------- DADOS FICTÍCIOS ---------- */
const LEADS=[
 ['Ana Souza','Clínica Vida','Saúde',18,'Google Ads','Quero automatizar o agendamento e a confirmação de consultas.',87],
 ['Juliana Prado','Prado Energia Solar','Energia solar',34,'Instagram','Chegam muitos orçamentos e perdemos lead no WhatsApp.',91],
 ['Marcos Lima','Lima & Torres Advocacia','Jurídico',12,'Indicação','Preciso organizar os contatos que chegam pelo site.',76],
 ['Rafael Nunes','Nunes Contabilidade','Contabilidade',9,'Google orgânico','Quanto custa automatizar o onboarding de clientes?',71],
 ['Patrícia Gomes','Pet Feliz','Varejo pet',6,'Instagram','Só pesquisando por enquanto.',41],
 ['Bruno Carvalho','Studio B Barbearia','Beleza',4,'Facebook','Vi o anúncio, queria saber mais.',52]
];
const NOMES=['Ana Souza','Bruno Carvalho','Camila Rocha','Diego Martins','Fernanda Alves','Lucas Ribeiro','Marina Costa','Pedro Henrique','Larissa Mendes','Thiago Moura'];
const PROD=[['Mentoria Automação Sem Código',497],['Curso Funil no Automático',297],['Workshop IA para Vendas',197]];
const STATUS={aprovado:['APROVADO','pagamento aprovado'],pendente:['AGUARDANDO_PAGAMENTO','aguardando Pix'],cancelado:['CANCELADO','cancelado no checkout']};

/* ---------- FLUXO n8n (a partir do print: gatilho → agente de IA c/ modelo, memória e ferramenta → condição → 2 caminhos) ---------- */
const N8N={
 key:'n8n',theme:'n8n',tool:'n8n',name:'Captação de leads com IA',run:'Executar workflow',again:'Executar de novo',units:['item','itens'],focus:'ai',
 title:'Workflow n8n simulado: captação e qualificação de leads',
 desc:'Um webhook recebe o lead do site. Um agente de IA, com modelo, memória e uma ferramenta de busca, enriquece os dados e dá uma nota. O nó Classifica manda leads quentes para o CRM e avisa o vendedor no WhatsApp; leads frios recebem e-mail de nutrição e um retorno é agendado.',
 vb:{d:[1010,444],m:[360,668]},sz:{d:{n:92,aw:214,ah:92,r:34},m:{n:60,aw:196,ah:60,r:22}},
 nodes:[
  {id:'wh',t:'trigger',ic:'in',c:'#ff6d5a',l:'Webhook',s:'novo lead',tg:'Webhook',d:[92,166],m:[130,44],dur:420,
   run:(x,c)=>{const L=c.lead;c.out={nome:L[0],email:mail(L[0]),telefone:tel(),empresa:L[1],mensagem:L[5],origem:L[4]};
    return {out:{headers:{'content-type':'application/json','user-agent':'form-site/2.3'},body:c.out},ms:rint(3,9),log:`recebeu lead: ${L[0]} (${L[1]})`}}},
  {id:'ai',t:'agent',ic:'spark',c:'#a78bfa',l:'IA — enriquece dados',s:'Agente de IA',tg:'IA',d:[306,166],m:[130,164],dur:1750,
   run:(x,c)=>{const L=c.lead,o=c.out,sc=c.score,q=sc>=70;
    const out={nome:o.nome,email:o.email,empresa:L[1],segmento:L[2],funcionarios:L[3],porte:L[3]>20?'pequena (21–50)':'micro (até 20)',intencao:sc>=85?'alta':sc>=70?'média':'baixa',score:sc,resumo:`${L[2]}, ${L[3]} funcionários. Pediu: ${L[5].toLowerCase()}`};
    return {out,ms:rint(1100,1900),pre:`consultou a ferramenta Busca empresa: "${L[1]}"`,log:`enriqueceu: ${L[2]} · ${L[3]} funcionários · score ${sc}`,
     subs:{m1:{i:{tarefa:'Enriquecer e pontuar o lead (0–100)',lead:o.nome},o:{tokens_entrada:rint(640,920),tokens_saida:rint(140,240),score:sc}},
           m2:{i:{sessao:'lead-'+slug(o.nome)},o:{mensagens_anteriores:q?2:0,ultimo_contato:q?'há 3 dias':null}},
           m3:{i:{consulta:L[1]},o:{site:slug(L[1]).replace(/\./g,'')+'.exemplo.com.br',segmento:L[2],funcionarios:L[3]}}}}}},
  {id:'m1',t:'sub',ic:'chip',c:'#c4b5fd',l:'Modelo de IA',s:'chat',pl:'Modelo',d:[206,312],m:[312,104]},
  {id:'m2',t:'sub',ic:'db',c:'#7dd3fc',l:'Memória',s:'Postgres',pl:'Memória',d:[306,312],m:[312,192]},
  {id:'m3',t:'sub',ic:'search',c:'#fcd34d',l:'Busca empresa',s:'ferramenta',pl:'Ferramenta',d:[406,312],m:[312,280]},
  {id:'sw',ic:'split',c:'#34d399',l:'Classifica lead',s:'score ≥ 70',tg:'Classifica',outs:['quente','frio'],d:[548,166],m:[130,290],
   run:x=>{const q=x.score>=70;return {out:Object.assign({},x,{classe:q?'quente':'frio'}),port:q?0:1,ms:rint(1,4),log:`score ${x.score} → saída "${q?'quente':'frio'}"`}}},
  {id:'crm',ic:'crm',c:'#fb923c',l:'CRM',s:'cria negócio',tg:'CRM',d:[722,76],m:[52,410],
   run:(x,c)=>{c.neg='NEG-'+rint(4100,4999);c.vend=pick(['Carlos','Fernanda','Diego']);
    return {out:{negocio_id:c.neg,titulo:`${x.empresa} — automação`,etapa:'Lead quente',responsavel:c.vend,valor_estimado:brl(rint(24,72)*100),origem:c.out.origem},ms:rint(220,420),log:`negócio ${c.neg} criado · etapa "Lead quente"`}}},
  {id:'wa',ic:'chat',c:'#4ade80',l:'WhatsApp',s:'avisa vendedor',tg:'WhatsApp',d:[896,76],m:[52,530],
   run:(x,c)=>({out:{para:c.vend+' (vendas)',mensagem:`Lead quente: ${c.out.nome} — ${c.out.empresa} (score ${c.score}). Ligar em até 5 min. ${x.negocio_id}`,status:'enviada'},ms:rint(280,520),log:`${c.vend} avisado: ligar em até 5 min`})},
  {id:'em',ic:'mail',c:'#60a5fa',l:'E-mail',s:'nutrição',tg:'E-mail',d:[722,288],m:[212,410],
   run:x=>({out:{para:x.email,assunto:`${first(x.nome)}, 3 automações que liberam 10 h por semana`,modelo:'nutricao-01',status:'enviado'},ms:rint(300,560),log:`nutrição enviada para ${x.email}`})},
  {id:'fu',ic:'cal',c:'#f472b6',l:'Agenda retorno',s:'em 3 dias',tg:'Agenda',d:[896,288],m:[212,530],
   run:(x,c)=>{const d=ddmm(3);return {out:{tarefa:'Retomar contato',lead:c.out.nome,data:d,responsavel:'SDR'},ms:rint(90,180),log:`retorno agendado para ${d}`}}}
 ],
 edges:[{a:'wh',b:'ai'},{a:'ai',b:'sw'},{a:'sw',b:'crm',k:0},{a:'crm',b:'wa'},{a:'sw',b:'em',k:1},{a:'em',b:'fu'},
        {a:'ai',b:'m1',sub:0},{a:'ai',b:'m2',sub:1},{a:'ai',b:'m3',sub:2}],
 begin(F){let i=0;if(F.runs){do i=rint(0,LEADS.length-1);while(i===F.last);}F.last=i;const L=LEADS[i];
  return {lead:L,score:Math.max(18,Math.min(98,L[6]+(F.runs?rint(-4,4):0)))}},
 end:(c,n)=>`Execução concluída · ${n} nós · `
};

/* ---------- CENÁRIO MAKE (a partir do print: gatilho → rotas com filtro → planilhas/CRM → "Ignora") ---------- */
const MAKE={
 key:'make',theme:'make',tool:'Make',name:'[Vendas] Funil automático',run:'Executar uma vez',again:'Executar de novo',units:['bundle','bundles'],focus:'pr',
 title:'Cenário Make simulado: funil de vendas automático',
 desc:'O formulário entrega três pedidos. Cada um é processado e passa pelo Router: com filtro "Aprovado" recebe e-mail de boas-vindas, vira cliente no CRM e entra na planilha; "Pendente" tem o telefone validado e recebe lembrete de Pix no WhatsApp; "Cancelado" é marcado como abandono e a rota termina.',
 vb:{d:[900,424],m:[360,720]},sz:{d:{r:34},m:{r:24}},
 nodes:[
  {id:'tr',t:'trigger',ic:'form',c:'#e0457b',l:'Novos pedidos',s:'Formulário',d:[70,206],m:[180,48],dur:520,
   run:(x,c)=>({outs:c.b.map(b=>b.raw),ms:rint(400,900),log:`${c.b.length} pedidos novos recebidos`})},
  {id:'pr',ic:'gear',c:'#8b5cf6',l:'Processa dados',s:'Ferramentas',d:[196,206],m:[180,152],
   run:(x,c)=>{c.i++;const b=c.b[c.i-1];c.cur=b;return {spd:[1,.65,.5][c.i-1],out:b.clean,ms:rint(20,60),log:`bundle ${c.i}: ${b.clean.nome} · ${STATUS[b.clean.status][1]}`}}},
  {id:'rt',t:'router',ic:'router',c:'#86c95f',l:'Router',d:[322,206],m:[180,256],dur:220,run:x=>({out:x,ms:0})},
  {id:'a1',ic:'mail',c:'#3b82f6',l:'Boas-vindas',s:'E-mail',d:[520,72],m:[62,386],
   run:x=>({out:{para:x.email,assunto:`${x.primeiro_nome}, seu acesso a ${x.produto} está liberado`,status:'enviado'},ms:rint(300,600),log:`boas-vindas enviado para ${x.primeiro_nome}`})},
  {id:'a2',ic:'crm',c:'#f59e0b',l:'Registra cliente',s:'CRM',d:[670,72],m:[62,496],
   run:(x,c)=>{c.cur.id='C-'+rint(1100,1999);return {out:{cliente_id:c.cur.id,nome:c.cur.clean.nome,etapa:'Cliente ativo',tags:['comprador',c.cur.clean.produto.split(' ')[0].toLowerCase()]},ms:rint(200,400),log:`cliente ${c.cur.id} registrado`}}},
  {id:'a3',ic:'sheet',c:'#16a34a',l:'Linha de venda',s:'Planilhas',d:[820,72],m:[62,606],
   run:(x,c)=>{const n=rint(180,260),k=c.cur.clean;return {out:{planilha:'Vendas 2026',linha:n,valores:[ddmm(0),k.nome,k.produto,brl(k.valor)]},ms:rint(250,500),log:`linha ${n} adicionada em "Vendas 2026"`}}},
  {id:'b1',ic:'phone',c:'#0ea5e9',l:'Valida telefone',s:'Ferramentas',d:[520,206],m:[180,386],
   run:x=>({out:{telefone:x.telefone,valido:true,whatsapp:true},ms:rint(80,200),log:'telefone válido · WhatsApp ativo'})},
  {id:'b2',ic:'chat',c:'#10b981',l:'Lembrete de Pix',s:'WhatsApp',d:[670,206],m:[180,496],
   run:(x,c)=>{const k=c.cur.clean;return {out:{para:x.telefone,mensagem:`Oi, ${k.primeiro_nome}! Seu Pix de ${brl(k.valor)} vence hoje. O código copia e cola está logo abaixo.`,status:'enviada'},ms:rint(300,600),log:`lembrete de Pix enviado para ${k.primeiro_nome}`}}},
  {id:'b3',ic:'crm',c:'#f59e0b',l:'Atualiza status',s:'CRM',d:[820,206],m:[180,606],
   run:(x,c)=>({out:{pedido:c.cur.clean.pedido,etapa:'Aguardando pagamento',proximo_lembrete:'em 24 h'},ms:rint(200,380),log:'status "aguardando pagamento" no CRM'})},
  {id:'c1',ic:'sheet',c:'#16a34a',l:'Marca abandono',s:'Planilhas',d:[520,340],m:[298,386],
   run:(x,c)=>({out:{planilha:'Abandonos',linha:rint(40,90),nome:x.nome,motivo:'cancelado no checkout'},ms:rint(250,450),log:`abandono registrado (${x.primeiro_nome})`})},
  {id:'c2',t:'end',ic:'skip',l:'Ignora',s:'Controle de fluxo',d:[670,340],m:[298,496],dur:260,run:()=>({out:null,ms:0,log:'rota encerrada'})}
 ],
 edges:[{a:'tr',b:'pr'},{a:'pr',b:'rt'},
  {a:'rt',b:'a1',fl:'Aprovado',f:x=>x.status==='aprovado'},{a:'a1',b:'a2'},{a:'a2',b:'a3'},
  {a:'rt',b:'b1',fl:'Pendente',f:x=>x.status==='pendente'},{a:'b1',b:'b2'},{a:'b2',b:'b3'},
  {a:'rt',b:'c1',fl:'Cancelado',f:x=>x.status==='cancelado'},{a:'c1',b:'c2'}],
 begin(F){
  const st=F.runs?[0,0,0].map(()=>pick(['aprovado','aprovado','pendente','pendente','cancelado'])):['aprovado','pendente','cancelado'];
  const ns=NOMES.slice().sort(()=>Math.random()-.5),nm=F.runs?ns:['Ana Souza','Bruno Carvalho','Camila Rocha'];
  return {i:0,b:st.map((k,j)=>{const n=nm[j],p=F.runs?pick(PROD):PROD[j%2],t=tel(),ped='#'+rint(10200,10999),m=pick(['Pix','Cartão','Boleto']);
   return {raw:{pedido:ped,comprador:{nome:n,email:mail(n),telefone:t},produto:p[0],valor:p[1].toFixed(2),status:STATUS[k][0],metodo:k==='pendente'?'Pix':m},
           clean:{pedido:ped,nome:n,primeiro_nome:first(n),email:mail(n),telefone:'+55 '+t,produto:p[0],valor:p[1],status:k}}})}},
 end:c=>`Cenário concluído · ${c.b.length} bundles · ${c.ops} operações · `
};

/* ---------- MOTOR ---------- */
const T={n8n:{travel:560,node:520,filter:0},make:{travel:280,node:300,filter:120}};
[N8N,MAKE].forEach(D=>{D.N={};D.out={};D.nodes.forEach(n=>{D.N[n.id]=n;D.out[n.id]=[]});D.edges.forEach(e=>D.out[e.a].push(e))});

function geo(F,n){const Z=F.def.sz[F.L],p=n[F.L];
 if(F.def.theme==='make'||n.t==='sub')return {x:p[0],y:p[1],w:Z.r*2,h:Z.r*2,r:Z.r};
 return {x:p[0],y:p[1],w:n.t==='agent'?Z.aw:Z.n,h:n.t==='agent'?Z.ah:Z.n}}
/* porta → [x, y, normal x, normal y]. Horizontal no desktop; vertical no celular. */
function port(F,n,dir,k,cnt){const g=geo(F,n),V=F.L==='m';
 if(dir==='in'){if(n.t==='sub')return V?[g.x-g.r,g.y,-1,0]:[g.x,g.y-g.r,0,-1];return V?[g.x,g.y-g.h/2,0,-1]:[g.x-g.w/2,g.y,-1,0]}
 if(dir==='sub'){const o=(k-1)*.3;return V?[g.x+g.w/2,g.y+o*g.h,1,0]:[g.x+o*g.w,g.y+g.h/2,0,1]}
 const o=cnt>1?(k-(cnt-1)/2)*g.h*.4:0;return V?[g.x+o,g.y+g.h/2,0,1]:[g.x+g.w/2,g.y+o,1,0]}
function curve(p,q,f){const d=Math.hypot(q[0]-p[0],q[1]-p[1]),c=Math.max(20,d*f);
 return `M${p[0]} ${p[1]}C${p[0]+p[2]*c} ${p[1]+p[3]*c} ${q[0]+q[2]*c} ${q[1]+q[3]*c} ${q[0]} ${q[1]}`}
/* ponto da curva + deslocamento pela normal que aponta pra cima (rótulo nunca em cima da linha) */
function side(P,len,t,d,mode){const a=P.getPointAtLength(len*t),b=P.getPointAtLength(Math.min(len,len*t+1)),c=P.getPointAtLength(Math.max(0,len*t-1));
 const tx=b.x-c.x,ty=b.y-c.y,m=Math.hypot(tx,ty)||1;let nx=ty/m,ny=-tx/m;
 const v=mode==='left'?(Math.abs(nx)<.15?-ny:-nx):mode==='right'?(Math.abs(nx)<.15?-ny:nx):(Math.abs(ny)<.15?nx:-ny);if(v<0){nx=-nx;ny=-ny}
 return {p:a,x:a.x+nx*d,y:a.y+ny*d+(Math.abs(nx)>.3?4:0),an:nx<-.3?'end':nx>.3?'start':'middle'}}
function labels(G,n,x,y,anchor,gap,plate){const pl=plate&&s('rect',{class:'fx-plate',rx:4},G),a=s('text',{x,y,'text-anchor':anchor,class:'fx-t'},G,n.l),b=n.s&&s('text',{x,y:y+gap,'text-anchor':anchor,class:'fx-s'},G,n.s);
 if(pl){const r=a.getBBox(),q=b?b.getBBox():r,x0=Math.min(r.x,q.x)-5,x1=Math.max(r.x+r.width,q.x+q.width)+5;pl.setAttribute('x',x0);pl.setAttribute('y',r.y-2);pl.setAttribute('width',x1-x0);pl.setAttribute('height',q.y+q.height-r.y+4)}}

function drawN8n(F,n,g,G,V){const {x,y,w,h}=g,D=F.def,gap=V?14:15;
 if(n.t==='sub'){
  s('circle',{cx:x,cy:y,r:g.r+6,class:'fx-selr'},G);
  s('circle',{cx:x,cy:y,r:g.r,class:'fx-shape'},G);icon(G,n.ic,x,y,g.r*.95);
  const p=port(F,n,'in');s('path',{d:`M${p[0]} ${p[1]-5}l5 5-5 5-5-5z`,class:'fx-dia'},G);
  s('circle',{cx:x,cy:y,r:g.r*.62,class:'fx-spin','stroke-dasharray':`${g.r*2.4} ${g.r*1.6}`},G);
  okBadge(G,x+g.r*.72,y+g.r*.72,V?7:8.5);labels(G,n,x,y+g.r+(V?15:20),'middle',gap);return}
 const tr=n.t==='trigger',ag=n.t==='agent',R=tr?h*.42:8;
 s('rect',{x:x-w/2-5,y:y-h/2-5,width:w+10,height:h+10,rx:R+4,class:'fx-selr'},G);
 if(tr)s('path',{class:'fx-shape',d:`M${x-w/2+R} ${y-h/2}H${x+w/2-8}a8 8 0 0 1 8 8V${y+h/2-8}a8 8 0 0 1-8 8H${x-w/2+R}a${R} ${R} 0 0 1-${R}-${R}V${y-h/2+R}a${R} ${R} 0 0 1 ${R}-${R}z`},G);
 else s('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:8,class:'fx-shape'},G);
 const ix=ag?x-w/2+h/2:x,iz=h*(ag?.4:.44);icon(G,n.ic,ix,y,iz);
 s('circle',{cx:ix,cy:y,r:iz*.78,class:'fx-spin','stroke-dasharray':`${iz*2.9} ${iz*2}`},G);
 if(!tr){const p=port(F,n,'in');s('rect',V?{x:p[0]-7,y:p[1]-3,width:14,height:6,rx:2,class:'fx-pi'}:{x:p[0]-3,y:p[1]-7,width:6,height:14,rx:2,class:'fx-pi'},G)}
 else icon(G,'bolt',x-w/2-(V?13:17),y,V?14:18,'fx-bolt');
 const outs=n.outs||[0],main=D.out[n.id].filter(e=>e.sub==null);
 outs.forEach((o,k)=>{const p=port(F,n,'out',k,outs.length);s('circle',{cx:p[0],cy:p[1],r:V?4.5:5.5,class:'fx-po'},G);
  if(n.outs)s('text',V?{x:p[0]+(k?7:-7),y:p[1]+15,'text-anchor':k?'start':'end',class:'fx-pl'}:{x:p[0]+11,y:p[1]+(k?17:-10),class:'fx-pl'},G,o)});
 if(!main.length){const p=port(F,n,'out',0,1),L=V?20:24,Z=V?18:22,px=p[0]+p[2]*L,py=p[1]+p[3]*L;
  s('path',{d:`M${p[0]} ${p[1]}L${px} ${py}`,class:'fx-stub'},G);
  const cx=px+p[2]*Z/2,cy=py+p[3]*Z/2;s('rect',{x:cx-Z/2,y:cy-Z/2,width:Z,height:Z,rx:4,class:'fx-plus'},G);icon(G,'plus',cx,cy,Z*.7,'fx-plusi')}
 if(ag){D.out[n.id].filter(e=>e.sub!=null).forEach(e=>{const p=port(F,n,'sub',e.sub);
   s('path',{d:`M${p[0]} ${p[1]-5}l5 5-5 5-5-5z`,class:'fx-dia'},G);
   if(!V)s('text',{x:p[0],y:p[1]+19,'text-anchor':'middle',class:'fx-pl'},G,D.N[e.b].pl)});
  const tx=x-w/2+h*.86;s('text',{x:tx,y:y-3,class:'fx-t'},G,n.l);s('text',{x:tx,y:y+(V?13:16),class:'fx-s'},G,n.s)}
 else if(V)labels(G,n,x+w/2+12,y-2,'start',gap);
 else labels(G,n,x,y+h/2+21,'middle',gap);
 okBadge(G,x+w/2-(V?11:14),y+h/2-(V?11:14),V?7:8.5)}
function okBadge(G,x,y,r){const b=s('g',{class:'fx-okb'},G);s('circle',{cx:x,cy:y,r},b);icon(b,'check',x,y,r*1.5)}

function drawMake(F,n,g,G,V){const {x,y,r}=g;
 s('circle',{cx:x,cy:y,r:r+11,class:'fx-selr'},G);
 s('circle',{cx:x,cy:y,r:r+7,class:'fx-halo'},G);s('circle',{cx:x,cy:y,r,class:'fx-shape'},G);
 icon(G,n.ic,x,y,r*(n.t==='end'?.9:1.02));
 s('circle',{cx:x,cy:y,r:r+10,class:'fx-ring'},G);
 if(n.t==='trigger'){const c=s('g',{class:'fx-clock'},G),cx=x-r*.74,cy=y+r*.74;s('circle',{cx,cy,r:V?8:10},c);icon(c,'clock',cx,cy,V?12:15)}
 if(n.t!=='router'&&n.t!=='end'){const b=s('g',{class:'fx-bub'},G),bx=x+r*.76,by=y-r*.76;s('circle',{cx:bx,cy:by,r:V?9:11},b);F.els.k[n.id]=s('text',{x:bx,y:by+(V?3.5:4),'text-anchor':'middle'},b)}
 if(V&&n.t==='router')labels(G,n,x+r+14,y+5,'start',14,1);else labels(G,n,x,y+r+(V?24:25),'middle',V?14:15,1)}

function draw(F){
 const D=F.def,L=F.L,V=L==='m',n8=D.theme==='n8n',W=D.vb[L][0],H=D.vb[L][1]+(F.big&&n8?34:0),u=F.uid;
 const svg=s('svg',{viewBox:`0 0 ${W} ${H}`,class:'fx-svg L-'+L+(F.big?' fx-big':''),role:'group','aria-labelledby':u+'t','aria-describedby':u+'d'});
 s('title',{id:u+'t'},svg,D.title);s('desc',{id:u+'d'},svg,D.desc);
 F.els.sv.replaceChildren(svg);
 const E=F.els;E.svg=svg;E.n={};E.e={};E.f={};E.k={};
 if(n8){const df=s('defs',{},svg);['a','b'].forEach((id,i)=>{const m=s('marker',{id:u+id,viewBox:'0 0 10 10',refX:'8.5',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto'},df);s('path',{d:'M1 1L9 5 1 9z',class:i?'fx-mk-ok':'fx-mk'},m)})}
 const ge=s('g',{class:'fx-edges'},svg),gn=s('g',{class:'fx-nodes'},svg);
 D.edges.forEach(e=>{const A=D.N[e.a],B=D.N[e.b],key=e.a+'>'+e.b,sub=e.sub!=null;
  let p=sub?port(F,A,'sub',e.sub):port(F,A,'out',e.k||0,(A.outs||[0]).length),q=port(F,B,'in');
  if(n8&&!sub){q[0]+=q[2]*2;q[1]+=q[3]*2}
  if(!n8){const ga=geo(F,A),gb=geo(F,B),dx=gb.x-ga.x,dy=gb.y-ga.y,m=Math.hypot(dx,dy),ux=dx/m,uy=dy/m,bx=ux+(V?0:1),by=uy+(V?1:0),l=Math.hypot(bx,by);
   p=[ga.x+ux*(ga.r+4),ga.y+uy*(ga.r+4),bx/l,by/l];q=[gb.x-ux*(gb.r+4),gb.y-uy*(gb.r+4),-bx/l,-by/l]}
  const d=curve(p,q,n8?.45:.3),g=s('g',{class:'fx-e'+(sub?' fx-sub':'')},ge);if(A.c)g.style.setProperty('--c',A.c);
  const base=s('path',{d,class:'fx-eb'},g),hot=s('path',{d,class:'fx-eh'},g),len=base.getTotalLength();
  if(n8&&!sub){base.setAttribute('marker-end',`url(#${u}a)`);hot.style.strokeDasharray=len}
  const o={g,path:base,hot,len};
  if(n8&&!sub){const m=side(base,len,A.outs?.72:.5,9,'up');o.lab=s('text',{x:m.x,y:m.y,'text-anchor':m.an,class:'fx-cnt'},g)}
  if(e.fl){const m=side(base,len,V&&p[0]===q[0]?.72:.5,V?13:16,V?'up':'left'),fg=s('g',{class:'fx-flt'},g);
   s('circle',{cx:m.p.x,cy:m.p.y,r:V?8:9.5},fg);icon(fg,'funnel',m.p.x,m.p.y,V?10:12);
   s('text',{x:m.x,y:m.y,'text-anchor':m.an},fg,e.fl);E.f[key]=fg}
  E.e[key]=o});
 D.nodes.forEach(n=>{const g=geo(F,n),G=s('g',{class:'fx-n fx-'+(n.t||'node'),tabindex:'0',role:'button','data-id':n.id,'aria-label':`${n.l}${n.s?' — '+n.s:''}. Ver dados do nó`},gn);
  if(n.c)G.style.setProperty('--c',n.c);(n8?drawN8n:drawMake)(F,n,g,G,V);E.n[n.id]=G});
 E.pk=s('g',{class:'fx-pk'},svg);s('circle',{r:n8?10:11,class:'fx-pkh'},E.pk);s('circle',{r:n8?4.5:5.5,class:'fx-pkc'},E.pk);
 paintAll(F)}

/* ---------- estado → pintura (sobrevive a redesenho quando muda o layout) ---------- */
function paintN(F,id){const G=F.els.n&&F.els.n[id];if(!G)return;const st=F.st.n[id]||{};
 G.classList.toggle('is-run',st.c==='run');G.classList.toggle('is-ok',st.c==='ok');G.classList.toggle('is-off',st.c==='off');G.classList.toggle('is-sel',F.sel===id);
 G.setAttribute('aria-pressed',F.sel===id?'true':'false');if(F.els.k[id])F.els.k[id].textContent=st.k||''}
function paintE(F,key){const o=F.els.e&&F.els.e[key];if(!o)return;const st=F.st.e[key]||{},n8=F.def.theme==='n8n';
 ['run','ok','flow'].forEach(c=>o.g.classList.toggle('is-'+c,st.c===c));
 if(n8&&o.lab){if(st.c!=='run')o.hot.style.strokeDashoffset=st.c==='ok'?0:o.len;
  st.c==='ok'?o.hot.setAttribute('marker-end',`url(#${F.uid}b)`):o.hot.removeAttribute('marker-end');
  o.lab.textContent=st.k?st.k+' '+F.def.units[st.k>1?1:0]:''}
 const f=F.els.f[key];if(f){f.classList.toggle('is-pass',F.st.f[key]==='pass');f.classList.toggle('is-block',F.st.f[key]==='block');f.classList.toggle('is-eval',F.st.f[key]==='eval')}}
function paintAll(F){F.def.nodes.forEach(n=>paintN(F,n.id));Object.keys(F.els.e).forEach(k=>paintE(F,k))}
function setN(F,id,c){(F.st.n[id]||(F.st.n[id]={})).c=c;paintN(F,id)}
function setE(F,key,c){(F.st.e[key]||(F.st.e[key]={})).c=c;paintE(F,key)}

/* ---------- relógio (rAF) com pausa/cancelamento ---------- */
function arm(F){if(!F.raf&&F.tasks.size&&!F.halt&&!document.hidden){F.last=performance.now();F.raf=requestAnimationFrame(F.fr)}}
function halt(F){cancelAnimationFrame(F.raf);F.raf=0}
function tw(F,ms,fn){if(F.instant){fn&&fn(1);return Promise.resolve()}
 return new Promise((res,rej)=>{const t0=F.t,k={f(t){const p=Math.min(1,(t-t0)/ms);fn&&fn(p);if(p>=1){F.tasks.delete(k);res()}},rej};F.tasks.add(k);arm(F)})}
function cancel(F){halt(F);F.tasks.forEach(k=>k.rej(CANCEL));F.tasks.clear()}

/* ---------- execução ---------- */
function log(F,c,tag,msg,col,done){const li=h('li',done?{class:'is-done'}:{},F.els.log);
 h('time',{},li,new Date(c.t0+c.ms).toTimeString().slice(0,8));const t=h('span',{class:'fx-tag'},li,tag);if(col)t.style.setProperty('--c',col);
 h('span',{class:'fx-msg'},li,msg);F.els.log.scrollTop=F.els.log.scrollHeight}
function status(F,c,txt,pre){const e=F.els.state;e.className='fx-state'+(c?' is-'+c:'');e.textContent='';if(pre)h('span',{class:'fx-sp'},e,pre);e.appendChild(document.createTextNode(txt))}

async function travel(F,e){const key=e.a+'>'+e.b,n8=F.def.theme==='n8n',tm=T[F.def.theme].travel*F.spd;setE(F,key,'run');
 await tw(F,tm,p=>{const o=F.els.e[key];if(!o)return;const q=ease(p),pt=o.path.getPointAtLength(o.len*q);
  F.els.pk.setAttribute('transform',`translate(${pt.x} ${pt.y})`);F.els.pk.style.opacity=p<1?1:0;
  if(n8)o.hot.style.strokeDashoffset=o.len*(1-q);else o.hot.style.strokeDashoffset=-q*42});
 const st=F.st.e[key];st.k=(st.k||0)+1;setE(F,key,'ok')}

async function step(F,id,input,c){
 const D=F.def,n=D.N[id],tm=T[D.theme],r=n.run(input,c),subs=D.out[id].filter(e=>e.sub!=null);if(r.spd)F.spd=r.spd;const dur=(n.dur||tm.node)*F.spd;
 setN(F,id,'run');status(F,'run',n.l,'Executando · ');
 subs.forEach(e=>{setE(F,e.a+'>'+e.b,'flow');setN(F,e.b,'run')});
 if(r.pre){await tw(F,dur*.45);log(F,c,n.tg||n.s,r.pre,n.c);await tw(F,dur*.55)}else await tw(F,dur);
 c.ms+=r.ms;const io=F.io[id]||(F.io[id]={i:[],o:[],ms:0});io.i.push(input);(r.outs||[r.out]).forEach(o=>io.o.push(o));io.ms+=r.ms;
 subs.forEach(e=>{const x=r.subs[e.b];F.io[e.b]={i:[x.i],o:[x.o],ms:0};setE(F,e.a+'>'+e.b,'ok');setN(F,e.b,'ok')});
 const st=F.st.n[id]||(F.st.n[id]={});if(n.t!=='router'&&n.t!=='end'){st.k=(st.k||0)+1;c.ops++}
 setN(F,id,'ok');c.nodes++;log(F,c,n.tg||n.s||n.l,r.log,n.c);if(F.sel===id)inspect(F,id);
 for(const o of (r.outs||[r.out])){
  for(const e of D.out[id]){if(e.sub!=null||(r.port!=null&&(e.k||0)!==r.port))continue;
   if(e.f){const key=e.a+'>'+e.b,ok=e.f(o);F.st.f[key]='eval';paintE(F,key);await tw(F,tm.filter*F.spd);F.st.f[key]=ok?'pass':'block';paintE(F,key);if(!ok){await tw(F,tm.filter*.5*F.spd);continue}}
   await travel(F,e);await step(F,e.b,o,c)}}}

function reset(F){F.st={n:{},e:{},f:{}};F.io={};F.els.log.replaceChildren();if(F.els.e)paintAll(F);F.els.pk&&(F.els.pk.style.opacity=0);inspect(F,F.sel)}
async function run(F,instant){
 cancel(F);reset(F);F.spd=1;const tok=F.tok=(F.tok||0)+1;F.instant=!!instant;F.busy=true;F.els.log.setAttribute('aria-busy',instant?'true':'false');
 const b=F.els.btn;b.disabled=true;b.lastChild.textContent='Executando…';status(F,'run','Executando…');
 const c=Object.assign(F.def.begin(F),{t0:Date.now(),ms:0,nodes:0,ops:0});F.runs++;
 try{if(!instant)await tw(F,420);await step(F,F.def.nodes[0].id,null,c);
  F.def.nodes.forEach(n=>{if(!F.st.n[n.id])setN(F,n.id,'off')});
  Object.keys(F.st.f).forEach(k=>{F.st.f[k]=F.st.e[k]&&F.st.e[k].k?'pass':null;paintE(F,k)});
  const tot=F.def.end(c,c.nodes)+secs(c.ms);log(F,c,'✓',tot,'#00ff66',1);status(F,'ok',secs(c.ms),'Sucesso · ');
  if(!F.sel)inspect(F,F.def.focus);
 }catch(err){if(err!==CANCEL)throw err;return}
 finally{if(F.tok===tok)F.instant=false}
 F.busy=false;F.els.log.setAttribute('aria-busy','false');b.disabled=false;b.lastChild.textContent=F.def.again;inspect(F,F.sel)}

/* ---------- inspetor de dados (JSON de entrada/saída, como no n8n) ---------- */
function jv(v,pre,ind){const pad='  '.repeat(ind),t=(x,c)=>{if(c)h('span',{class:'j'+c},pre,x);else pre.appendChild(document.createTextNode(x))};
 if(Array.isArray(v)){if(!v.length)return t('[]','p');t('[','p');t('\n');v.forEach((x,i)=>{t(pad+'  ');jv(x,pre,ind+1);t((i<v.length-1?',':'')+'\n')});t(pad+']','p')}
 else if(v&&typeof v==='object'){const k=Object.keys(v);t('{','p');t('\n');k.forEach((x,i)=>{t(pad+'  ');t('"'+x+'"','k');t(': ','p');jv(v[x],pre,ind+1);t((i<k.length-1?',':'')+'\n')});t(pad+'}','p')}
 else t(typeof v==='string'?JSON.stringify(v):String(v),typeof v==='string'?'s':typeof v==='number'?'n':'b')}
function inspect(F,id){const E=F.els,prev=F.sel;F.sel=id||null;if(prev&&prev!==id)paintN(F,prev);if(id)paintN(F,id);
 const body=E.ib;body.replaceChildren();
 if(!id){h('p',{class:'fx-hint'},body,'Clique em qualquer nó do fluxo para ver o JSON que entrou e saiu dele — exatamente como no editor.');E.it.textContent='Dados do nó';return}
 const n=F.def.N[id],io=F.io[id],D=F.def;E.it.textContent=n.l;
 const head=h('p',{class:'fx-it'},body,n.s?n.s:n.l);
 if(!io){h('small',{},head,F.busy?'aguardando…':'não executou');
  h('p',{class:'fx-hint'},body,F.busy?'Este nó ainda vai executar — acompanhe o fluxo.':(D.theme==='n8n'?'Nesta rodada o lead seguiu pelo outro caminho do Classifica. Execute de novo: cada rodada traz um lead diferente.':'Nenhum pedido passou pelo filtro desta rota nesta rodada. Execute de novo para outros pedidos.'));return}
 const data=F.mode==='i'?io.i:io.o,cnt=data.filter(x=>x!=null).length;
 h('small',{},head,`${cnt} ${D.units[cnt===1?0:1]}${io.ms?' · '+secs(io.ms):''}`);
 if(F.mode==='i'&&(n.t==='trigger')){h('p',{class:'fx-hint'},body,'Gatilho: é ele que inicia o fluxo, então não recebe entrada. Veja a saída.');return}
 if(!cnt){h('p',{class:'fx-hint'},body,'Sem saída: a rota termina aqui.');return}
 jv(data,h('pre',{class:'fx-json',tabindex:'0','aria-label':`JSON de ${F.mode==='i'?'entrada':'saída'} do nó ${n.l}`},body),0)}

/* ---------- montagem (só na 1ª abertura) ---------- */
function build(D,box){
 const pane=box.querySelector('.flow-pane'),F={def:D,uid:'fx'+D.key,box,pane,L:null,big:false,els:{k:{}},st:{n:{},e:{},f:{}},io:{},sel:null,mode:'o',
  tasks:new Set(),raf:0,t:0,last:0,spd:1,halt:false,instant:false,busy:false,runs:0,open:false};
 F.fr=now=>{F.raf=0;F.t+=Math.min(50,now-F.last);F.last=now;F.tasks.forEach(k=>k.f(F.t));if(F.tasks.size&&!F.halt&&!document.hidden)F.raf=requestAnimationFrame(F.fr)};
 const E=F.els,root=h('div',{class:'fx fx-'+D.theme},pane),cv=h('div',{class:'fx-cv'},root),bar=h('div',{class:'fx-bar'},cv);
 if(D.theme==='make'){const bk=h('span',{class:'fx-back','aria-hidden':'true'},bar);bk.appendChild(svgIcon('back'))}else h('span',{class:'fx-tool'},bar,D.tool);
 h('span',{class:'fx-name'},bar,D.name);
 const act=h('span',{class:'fx-act','aria-hidden':'true'},bar,D.theme==='make'?'Imediato':'Ativo');h('i',{},act);
 E.state=h('span',{class:'fx-state'},bar,'Pronto');
 E.sv=h('div',{class:'fx-sv'},cv);
 E.btn=h('button',{type:'button',class:'fx-run'},cv);const bi=h('span',{class:'fx-rb'},E.btn);bi.appendChild(svgIcon(D.theme==='make'?'play':'flask'));h('span',{},E.btn,D.run);
 const pn=h('div',{class:'fx-panel'},root),lb=h('div',{class:'fx-box'},pn),lh=h('div',{class:'fx-ph'},lb);
 h('h3',{id:F.uid+'lh'},lh,'Execução');h('span',{class:'fx-meta'},lh,'dados fictícios');
 E.log=h('ol',{class:'fx-log','aria-live':'polite','aria-relevant':'additions','aria-labelledby':F.uid+'lh',tabindex:'0'},lb);
 const ib=h('div',{class:'fx-box'},pn),ih=h('div',{class:'fx-ph'},ib);E.it=h('h3',{},ih,'Dados do nó');
 const tg=h('div',{class:'fx-io',role:'group','aria-label':'Mostrar dados'},ih);
 const bI=h('button',{type:'button','aria-pressed':'false'},tg,'Entrada'),bO=h('button',{type:'button','aria-pressed':'true'},tg,'Saída');
 E.ib=h('div',{class:'fx-ib'},ib);
 [bI,bO].forEach(b=>b.addEventListener('click',()=>{F.mode=b===bI?'i':'o';bI.setAttribute('aria-pressed',F.mode==='i');bO.setAttribute('aria-pressed',F.mode==='o');inspect(F,F.sel)}));
 E.btn.addEventListener('click',()=>run(F,false));
 const pickNode=ev=>{const g=ev.target.closest&&ev.target.closest('.fx-n');if(!g)return;inspect(F,g.getAttribute('data-id'));
  if(F.L==='m'&&ev.type==='click'){const r=ib.getBoundingClientRect();if(r.top>innerHeight-80)ib.scrollIntoView({block:'nearest',behavior:RM.matches?'auto':'smooth'})}};
 E.sv.addEventListener('click',pickNode);
 E.sv.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();pickNode(ev)}});
 F.ro=new ResizeObserver(()=>layout(F));
 inspect(F,null);return F}

function layout(F){const w=F.els.sv.clientWidth;if(!w)return;const L=w<560?'m':'d',big=L==='d'&&w<900;
 if(L!==F.L||big!==F.big){F.L=L;F.big=big;draw(F)}}

const FLOWS={n8n:N8N,make:MAKE},live=[],reg={};
/* abas Simulação | Print real ficam inline no index (valem mesmo sem este arquivo); aqui só reagimos ao 'fxtab' */
const onPrint=box=>{const t=box.querySelector('[role=tab][aria-selected=true]');return !!t&&/Shot$/.test(t.id)};
function start(F){F.ran=true;F.ro.observe(F.els.sv);layout(F);F.sel=null;run(F,RM.matches)}
document.querySelectorAll('.flow-modal[data-flow]').forEach(box=>{const ov=box.closest('.case-modal-overlay');let F=null;
 reg[ov.id]=()=>{if(!ov.classList.contains('active'))return;if(!F){F=build(FLOWS[box.dataset.flow],box);live.push(F)}
  F.open=true;F.ran=false;if(onPrint(box)){F.halt=true;halt(F)}else{F.halt=false;start(F)}};
 ov.addEventListener('fxtab',e=>{if(!F||!F.open)return;if(e.detail===1){F.halt=true;halt(F)}else{F.halt=false;if(F.ran)arm(F);else start(F)}});
 ov.addEventListener('casemodal:close',()=>{if(!F)return;F.open=false;F.ran=false;F.ro.disconnect();cancel(F);F.busy=false;F.sel=null;reset(F);status(F,'','Pronto');
  F.els.btn.disabled=false;F.els.btn.lastChild.textContent=F.def.run});
});
document.addEventListener('visibilitychange',()=>live.forEach(F=>{if(document.hidden)halt(F);else if(F.open)arm(F)}));
window.FLUXOS={open:id=>reg[id]&&reg[id]()};
})();
