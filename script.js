/* ── CURSOR ── */
const cur = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=(mx-8)+'px';cur.style.top=(my-8)+'px';});
setInterval(()=>{tx+=(mx-tx)*.15;ty+=(my-ty)*.15;trail.style.left=(tx-3)+'px';trail.style.top=(ty-3)+'px';},16);

/* ── CANVAS BACKGROUND ── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W,H;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();
window.addEventListener('resize',resize);

// Particles
const particles=[];
for(let i=0;i<80;i++){
  particles.push({x:Math.random()*2000,y:Math.random()*2000,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,size:Math.random()*1.5+.5,alpha:Math.random()*.6+.1});
}

// Grid
let gridOff=0;
function drawGrid(){
  ctx.strokeStyle='rgba(150,0,0,0.05)';
  ctx.lineWidth=1;
  const gs=50;
  const ox=gridOff%gs;
  for(let x=-gs+ox;x<W+gs;x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=-gs+ox;y<H+gs;y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
}

// Scan line
let scanY=0;
function drawScan(){
  const g=ctx.createLinearGradient(0,scanY-40,0,scanY+40);
  g.addColorStop(0,'rgba(180,0,0,0)');
  g.addColorStop(.5,'rgba(180,0,0,0.04)');
  g.addColorStop(1,'rgba(180,0,0,0)');
  ctx.fillStyle=g;
  ctx.fillRect(0,scanY-40,W,80);
  scanY+=0.8;
  if(scanY>H+50)scanY=-50;
}

function animate(){
  ctx.clearRect(0,0,W,H);
  // Subtle radial glow center
  const rg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.7);
  rg.addColorStop(0,'rgba(80,0,0,0.08)');
  rg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg;
  ctx.fillRect(0,0,W,H);

  gridOff+=0.3;
  drawGrid();
  drawScan();

  // Particles
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0;
    if(p.y<0)p.y=H; if(p.y>H)p.y=0;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle=`rgba(200,0,0,${p.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}
animate();

/* ── SCROLL REVEAL ── */
const reveals=document.querySelectorAll('.reveal');
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:.1});
reveals.forEach(r=>obs.observe(r));

/* ── LETTER ANIMATION HERO ── */
const logo=document.getElementById('logo-main');
const txt=logo.textContent;
logo.innerHTML='';
txt.split('').forEach((c,i)=>{
  const s=document.createElement('span');
  s.textContent=c;
  s.style.display='inline-block';
  s.style.animation=`fadeUp 0.5s both ${i*0.07}s`;
  logo.appendChild(s);
});