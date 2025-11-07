javascript
const state = { player: "Pili", current: null, spinning: false, categories: [] };


async function fetchJSON(url, opts={}){ const r = await fetch(url, opts); if(!r.ok) throw new Error(await r.text()); return r.json(); }


async function loadCategories(){ state.categories = await fetchJSON('/api/categories'); drawWheel(state.categories); }


function drawWheel(names){
const canvas = document.getElementById('wheel'); const ctx = canvas.getContext('2d');
const n = names.length; const radius = canvas.width/2; const cx = radius, cy = radius;
ctx.clearRect(0,0,canvas.width,canvas.height);
for(let i=0;i<n;i++){
const a0 = (i/n)*2*Math.PI; const a1 = ((i+1)/n)*2*Math.PI;
ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,radius,a0,a1); ctx.closePath();
ctx.fillStyle = i%2? '#1a0011':'#0f0014'; ctx.fill();
ctx.strokeStyle = '#ff2aa188'; ctx.stroke();
// text
ctx.save(); ctx.translate(cx,cy); ctx.rotate((a0+a1)/2); ctx.textAlign='center'; ctx.fillStyle='#fff';
ctx.font='bold 14px system-ui'; ctx.fillText(names[i], radius*0.6, 5); ctx.restore();
}
// indicador
ctx.beginPath(); ctx.moveTo(cx, cy - radius - 8); ctx.lineTo(cx-8, cy - radius - 24); ctx.lineTo(cx+8, cy - radius - 24); ctx.closePath();
ctx.fillStyle = '#ff2aa1'; ctx.fill();
}


async function spin(){
if(state.spinning) return; state.spinning=true; document.getElementById('spinBtn').disabled=true;
// animación fake de giro
const canvas = document.getElementById('wheel'); const ctx=canvas.getContext('2d');
let angle=0; const start=performance.now();
const duration=2500+Math.random()*1000;
function frame(t){
const p=Math.min((t-start)/duration,1); angle = p*p*8*Math.PI; // ease out
ctx.save(); ctx.translate(180,180); ctx.rotate(angle); ctx.translate(-180,-180);
drawWheel(state.categories); ctx.restore();
if(p<1) requestAnimationFrame(frame); else finalize();
}
requestAnimationFrame(frame);
async function finalize(){
const data = await fetchJSON('/api/spin', {method:'POST'});
state.current = data.question;
document.getElementById('category').textContent = `Categoría: ${data.category}`;
renderQuestion();
state.spinning=false; document.getElementById('spinBtn').disabled=false;
refreshPodium();
}
}


function renderQuestion(){
const q = state.current; const qtext = document.getElementById('qtext'); const opts = document.getElementById('options');
if(!q){ qtext.textContent = 'No hay más preguntas. ¡Girá de nuevo!'; opts.innerHTML=''; return; }
qtext.textContent = q.text; opts.innerHTML = '';
q.options.forEach((opt, i)=>{
const b = document.createElement('button'); b.textContent = opt; b.onclick = ()=>answer(q.id, i); opts.appendChild(b);
});
}


async function answer(qid, idx){
const res = await fetchJSON('/api/answer', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({player: state.player, question_id: qid, option_index: idx})});
const toast = document.getElementById('toast');
if(res.result.correct){ toast.className='toast ok'; toast.textContent='¡Correcto! +10 pts'; }
else { toast.className='toast bad'; toast.textContent=`Incorrecto. Respuesta correcta: ${res.result.answer_index+1}`; }
state.current = res.next; renderQuestion(); refreshPodium();
}


async function refreshPodium(){
const podium = await fetchJSON('/api/podium');
const list = document.getElementById('podium'); list.innerHTML='';
podium.slice(0,3).forEach((p,i)=>{
const li=document.createElement('li'); li.innerHTML = `<span>#${i+1} ${p.name}</span><b>${p.score} pts</b> <small>(✔ ${p.correct} · ✖ ${p.wrong})</small>`; list.appendChild(li);
});
}


document.getElementById('spinBtn').addEventListener('click', spin);
loadCategories().then(refreshPodium);