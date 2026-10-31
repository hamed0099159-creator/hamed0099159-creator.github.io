import * as THREE from 'three';

/* ==================================================
   ⚙️ تنظیم یک‌باره: بعد از ساختن گوگل‌شیت، فقط آیدی
   شیت رو بین گیومه بذار. (آموزش پایین صفحه داده شده)
   ================================================== */
const SHEET_ID = '';

/* دسته‌بندی‌ها — این اسم‌ها رو توی ستون «دسته» شیت بنویس */
const CAT_MAP = {
  'ماکت معماری': 'arch',
  'قطعه و نمونه اولیه': 'proto',
  'مجسمه و دکور': 'art',
  'گجت و لوازم': 'gadget'
};

/* کارهای پیش‌فرض — تا وقتی شیت وصل نشده، همینا نمایش داده می‌شن */
let projects = [
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
  { title:'جاشمعی فرکتال', cat:'art', catName:'مجسمه و دکور', material:'رزین — طلایی', time:'۱۱ ساعت',
    desc:'جاشمعی با هندسه فرکتال و چاپ رزین؛ پس از رنگ‌آمیزی با ورق طلا.',
    img:'https://picsum.photos/seed/fractal/800/600' },
  { title:'پایه موبایل زاویه‌دار', cat:'gadget', catName:'گجت و لوازم', material:'PETG — نارنجی', time:'۳ ساعت',
    desc:'استند موبایل برای میز کار با شیب قابل تنظیم و جای کابل.',
    img:'https://picsum.photos/seed/stand/800/600' },
];

/* لینک گوگل‌درایو رو به لینک عکس مستقیم تبدیل می‌کنه */
function normalizeImg(u){
  if(!u) return '';
  u = String(u).trim();
  const m = u.match(/drive\.google\.com\/file\/d\/([^/&#?]+)/);
  if(m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000`;
  const m2 = u.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if(m2) return `https://drive.google.com/thumbnail?id=${m2[1]}&sz=w1000`;
  return u;
}

/* خواندن کارها از گوگل‌شیت */
async function loadFromSheet(){
  if(!SHEET_ID) return;
  try{
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&t=${Date.now()}`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    const rows = json.table.rows || [];
    const list = rows.map(r => {
      const c = r.c || [];
      const catName = (c[1] && c[1].v) ? String(c[1].v).trim() : 'مجسمه و دکور';
      return {
        title:    c[0] && c[0].v ? String(c[0].v) : '',
        catName,
        cat:      CAT_MAP[catName] || 'art',
        material: c[2] && c[2].v ? String(c[2].v) : '',
        time:     c[3] && c[3].v ? String(c[3].v) : '',
        desc:     c[4] && c[4].v ? String(c[4].v) : '',
        img:      normalizeImg(c[5] && c[5].v)
      };
    }).filter(p => p.title);
    if(list.length) projects = list;
  }catch(e){
    /* اگه شیت لود نشد، همون کارهای پیش‌فرض نمایش داده می‌شن */
  }
}

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

/* ============ فرم (نمایشی) ============ */
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

  scene.add(new THREE.AmbientLight(0xffffff, .5));
  const key = new THREE.PointLight(0xff6b2b, 60);
  key.position.set(5, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0x4d7cff, 25);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

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
    m.position.y = (t-0.5)*4.4;
    m.rotation.y = t*1.5;
    const w = new THREE.Mesh(geo, wireMat);
    w.scale.setScalar(1.02);
    w.position.copy(m.position);
    w.rotation.copy(m.rotation);
    m.add(w);
    layers.add(m);
  }
  scene.add(layers);

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
    progress = (progress + 0.0022) % 1.15;
    layers.children.forEach((m,i)=>{
      const lt = i/LAYERS;
      const grown = Math.max(0, Math.min(1, (progress - lt)*9));
      m.visible = grown > 0.01;
      const s = (1.5 - lt*0.75 + Math.sin(lt*Math.PI)*0.35) * (0.01 + grown*0.99);
      m.scale.x = s; m.scale.z = s;
    });
    printHead.position.y = (Math.min(progress,1)-0.5)*4.4;
    printHead.scale.setScalar(Math.max(.35, 1.5 - Math.min(progress,1)*0.7));
    printHead.rotation.x = Math.PI/2;
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

/* ============ لود اولیه از شیت ============ */
loadFromSheet().then(() => renderCards());