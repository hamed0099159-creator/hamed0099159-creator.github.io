import * as THREE from 'three';

/* ============ داده نمونه‌کارها ============
   عکس‌ها موقتی از picsum هستن؛ بعداً آدرس عکس‌های خودت رو بذار جاش
   مثلاً: img: 'images/vase.jpg' */
const projects = [
  { title:'گلدان مارپیچی', cat:'art', catName:'مجسمه و دکور', material:'PLA — نارنجی', time:'۹ ساعت',
    desc:'گلدان مارپیچی با مدل پیچشی لایه‌به‌لایه؛ مناسب گل خشک و دکور میز.',
    img:'https://picsum.photos/seed/vase3d/800/600' },
  { title:'ماکت ویلا مدرن', cat:'arch', catName:'ماکت معماری', material:'PLA — سفید', time:'۲۶ ساعت',
    desc:'ماکت یک‌پنجاهم مقیاس ویلا با جزئیات نما و تراس، برای ارائه به کارفرما.',
    img:'https://picsum.photos/seed/villa3d/800/600' },
  { title:'قاب رزینی فیگور', cat:'art', catName:'مجسمه و دکور', material:'رزین — خاکستری', time:'۷ ساعت',
    desc:'فیگور شخصیت سفارشی با چاپ رزین و پرداخت سطح آینه‌ای.',
    img:'https://picsum.photos/seed/figurine/800/600' },
  { title:'براکت صنعتی', cat:'proto', catName:'قطعه و نمونه اولیه', material:'PETG — مشکی', time:'۴ ساعت',
    desc:'نمونه اولیه براکت اتصال برای تست بار مکانیکی قبل از تولید انبوه.',
    img:'https://picsum.photos/seed/bracket/800/600' },
  { title:'نگهدارنده هدفون', cat:'gadget', catName:'گجت و لوازم', material:'PLA — مشکی مات', time:'۵ ساعت',
    desc:'استند رومیزی هدفون با طراحی مینیمال و پایه وزنه‌دار.',
    img:'https://picsum.photos/seed/headset/800/600' },
  { title:'ماکت چیدمان داخلی', cat:'arch', catName:'ماکت معماری', material:'PLA — دو رنگ', time:'۱۸ ساعت',
    desc:'ماکت چیدمان فضای داخلی آپارتمان با مبلمان مقیاس‌شده.',
    img:'https://picsum.photos/seed/interior/800/600' },
  { title:'گیره سخت‌یاب', cat:'proto', catName:'قطعه و نمونه اولیه', material:'ABS — آبی', time:'۶ ساعت',
    desc:'بازتولید قطعه پلاستیکی من‌قطع یک دستگاه صنعتی قدیمی.',
    img:'https://picsum.photos/seed/clamp/800/600' },
  { title:'جاشمعی فركتال', cat:'art', catName:'مجسمه و دکور', material:'رزین — طلایی', time:'۱۱ ساعت',
    desc:'جاشمعی با هندسه فرکتال و چاپ رزین؛ پس از رنگ‌آمیزی با ورق طلا.',
    img:'https://picsum.photos/seed/fractal/800/600' },
  { title:'پایه موبایل زاویه‌دار', cat:'gadget', catName:'گجت و لوازم', material:'PETG — نارنجی', time:'۳ ساعت',
    desc:'استند موبایل برای میز کار با شیب قابل تنظیم و جای کابل.',
    img:'https://picsum.photos/seed/stand/800/600' },
];

/* ============ ساخت گالری ============ */
const grid = document.getElementById('grid');
const filtersBox = document.getElementById('filters');

function renderCards(filter='all'){
  grid.innerHTML = '';
  projects
    .filter(p => filter==='all' || p.cat===filter)
    .forEach((p,i) => {
      const el = document.createElement('article');
      el.className = 'tile';
      el.style.animationDelay = (i*0.06)+'s';
      el.innerHTML = `
        <div class="tile-img">
          <img src="${p.img}" alt="${p.title}" loading="lazy">
          <span class="tile-tag">${p.catName}</span>
        </div>
        <div class="tile-body">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="tile-meta">
            <span>🧵 ${p.material}</span>
            <span>⏱ ${p.time}</span>
          </div>
        </div>`;
      el.addEventListener('click', () => openModal(p));
      grid.appendChild(el);
    });
}
renderCards();

filtersBox.addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if(!btn) return;
  filtersBox.querySelectorAll('.filter').forEach(f=>f.classList.remove('active'));
  btn.classList.add('active');
  renderCards(btn.dataset.f);
});

/* ============ مودال ============ */
const modal = document.getElementById('modal');
function openModal(p){
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalTag').textContent = `${p.catName} • ${p.material}`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

/* ============ فرم (نمایشی — بعداً به سرویس ایمیل وصلش کن) ============ */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.textContent = '✅ درخواستت ثبت شد! خیلی زود باهات تماس می‌گیرم.';
  e.target.reset();
  setTimeout(()=> msg.textContent = '', 4000);
});

/* ============ صحنه سه‌بعدی: گلدان در حال چاپ ============ */
const holder = document.getElementById('scene3d');
if(holder){
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, holder.clientWidth/holder.clientHeight, .1, 100);
  camera.position.set(0, 3.2, 11);

  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize(holder.clientWidth, holder.clientHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  holder.appendChild(renderer.domElement);

  // نور
  scene.add(new THREE.AmbientLight(0xffffff, .5));
  const key = new THREE.PointLight(0xff6b2b, 60);
  key.position.set(5, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0x4d7cff, 25);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

  // گلدان لایه‌لایه (لایه‌های چاپ با پیچش)
  const LAYERS = 46;
  const layers = new THREE.Group();
  const geo = new THREE.BoxGeometry(1, .07, 1);
  const mat = new THREE.MeshStandardMaterial({
    color:0xff6b2b, emissive:0xff4500, emissiveIntensity:.35,
    metalness:.3, roughness:.4, transparent:true, opacity:.92
  });
  const wireMat = new THREE.MeshBasicMaterial({color:0xffb27a, wireframe:true, transparent:true, opacity:.28});
  for(let i=0;i<LAYERS;i++){
    const t = i/LAYERS;
    const m = new THREE.Mesh(geo, mat);
    const s = 1.5 - t*0.75 + Math.sin(t*Math.PI)*0.35; // پروفیل گلدان
    m.scale.set(s, 1, s);
    m.position.y = (t-0.5)*4.4;
    m.rotation.y = t*1.5;
    const w = new THREE.Mesh(geo, wireMat);
    w.scale.copy(m.scale).multiplyScalar(1.02);
    w.position.copy(m.position);
    w.rotation.copy(m.rotation);
    m.add(w);
    m.userData.targetScale = 0;      // برای انیمیشن رشد
    layers.add(m);
  }
  scene.add(layers);

  // صفحه‌ی نور افقی (نازل مجازی)
  const printHead = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, .015, 8, 64),
    new THREE.MeshBasicMaterial({color:0xffb27a, transparent:true, opacity:.7})
  );
  scene.add(printHead);

  let progress = 0, mouseX = 0, mouseY = 0;
  holder.addEventListener('pointermove', e => {
    const r = holder.getBoundingClientRect();
    mouseX = ((e.clientX - r.left)/r.width - .5) * 2;
    mouseY = ((e.clientY - r.top)/r.height - .5) * 2;
  });

  function animate(t){
    requestAnimationFrame(animate);
    const time = t*0.001;

    // چاپ حلقه‌به‌حلقه: لایه‌ها یکی‌یکی رشد می‌کنن و بعد ریست
    progress = (progress + 0.0022) % 1.15;
    layers.children.forEach((m,i)=>{
      const lt = i/LAYERS;
      const grown = Math.max(0, Math.min(1, (progress - lt)*9));
      m.scale.x = m.scale.z = m.scale.z===0 ? m.scale.z : m.scale.x;
      const base = m.children[0] ? 1 : 1;
      m.userData.g = grown;
      m.visible = grown > 0.01;
      const s = m.scale.y; // حفظ ضخامت
      m.scale.x = (1.5 - (i/LAYERS)*0.75 + Math.sin((i/LAYERS)*Math.PI)*0.35) * (0.01 + grown*0.99);
      m.scale.z = m.scale.x;
    });
    // ارتفاع نازل
    printHead.position.y = (Math.min(progress,1)-0.5)*4.4;
    printHead.scale.setScalar(Math.max(.35, 1.5 - Math.min(progress,1)*0.7));
    printHead.rotation.x = Math.PI/2;

    // چرخش با موس + چرخش آرام خودکار
    layers.rotation.y += 0.0035;
    layers.rotation.x += ((mouseY*0.25) - layers.rotation.x)*0.05;
    camera.position.x += ((mouseX*2) - camera.position.x)*0.04;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
  }
  animate(0);

  addEventListener('resize', ()=>{
    camera.aspect = holder.clientWidth/holder.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(holder.clientWidth, holder.clientHeight);
  });
}