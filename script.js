const video = document.getElementById('video');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const counters = document.querySelectorAll('.counter');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let isChanging = false;
let tiltX = 0;
let tiltY = 0;

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particles
const particlesArr = [];
for(let i=0;i<100;i++){
  particlesArr.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    size: Math.random()*3+1,
    speedX: (Math.random()-0.5)*0.3,
    speedY: Math.random()*0.5+0.2,
    color: 'rgba(255,215,0,0.7)'
  });
}

// Device tilt
window.addEventListener('deviceorientation', e=>{
  tiltX = e.gamma/90; // left/right
  tiltY = e.beta/90;  // forward/back
});

function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArr.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();

    p.x += p.speedX + tiltX*2;
    p.y -= p.speedY + tiltY*2;

    if(p.y < 0) p.y = canvas.height;
    if(p.y > canvas.height) p.y = 0;
    if(p.x < 0) p.x = canvas.width;
    if(p.x > canvas.width) p.x = 0;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// Animate counters
function animateCounter(el, target){
  let count=0;
  const step = Math.ceil(target/50);
  const interval = setInterval(()=>{
    count += step;
    if(count >= target){
      count = target;
      clearInterval(interval);
    }
    el.textContent = count;
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
  },20);
}

// Change video
function changeVideo(src, newTitle, newSub){
  if(isChanging) return;
  isChanging = true;

  video.style.opacity=0;
  video.style.transform="scale(1.05)";
  title.style.opacity=0;
  title.style.transform="translateY(30px)";
  subtitle.style.opacity=0;
  subtitle.style.transform="translateY(20px)";
  counters.forEach(c=>c.style.opacity=0);

  setTimeout(()=>{
    video.src=src;
    video.play().catch(()=>{});
    title.textContent=newTitle;
    subtitle.textContent=newSub;

    video.style.opacity=1;
    video.style.transform="scale(1)";
    title.style.opacity=1;
    title.style.transform="translateY(0)";
    subtitle.style.opacity=1;
    subtitle.style.transform="translateY(0)";

    counters.forEach(c=>{
      animateCounter(c, parseInt(c.dataset.count));
    });

    setTimeout(()=>{isChanging=false;},1000);
  },800);
}

// Scroll observer
document.querySelectorAll('section').forEach(section=>{
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        changeVideo(
          e.target.dataset.video,
          e.target.dataset.title,
          e.target.dataset.sub
        );
      }
    });
  },{threshold:0.5}).observe(section);
});