import * as THREE from 'three';

/* کارهای نمونه برگرفته از محبوب‌ترین مدل‌های MakerWorld (Bambu Lab)
   بعداً وقتی چاپ خودت رو گرفتی، عکس و اسمش رو جای اینا بذار */
let projects = [
  { title:'گلدان بافت‌دار (Woven Planter)', cat:'art', catName:'مجسمه و دکور', material:'PLA — سفید مات', time:'۱۲ ساعت',
    desc:'گلدان با بافت بافته‌شده به سبک سبد؛ پرینت محبوب MakerWorld با ده‌ها هزار چاپ موفق.',
    img:'https://picsum.photos/seed/wovenplanter/800/600' },
  { title:'لامپ آویز گلبرگ — حالت Vase', cat:'art', catName:'مجسمه و دکور', material:'PLA Silk — طلایی', time:'۹ ساعت',
    desc:'آباژور پیچشی چاپ‌شده در حالت Vase Mode با نوار لایه‌های لطیف و نورپردازی گرم.',
    img:'https://picsum.photos/seed/pendantlamp/800/600' },
  { title:'ماهی شناور بادی — اسباب‌بازی', cat:'art', catName:'مجسمه و دکور', material:'PETG — رنگی', time:'۴ ساعت',
    desc:'ماهی مکانیکی با بدنه متحرک؛ از مدل‌های سرگرم‌کننده و بدون نیاز به مونتاژ پیچیده.',
    img:'https://picsum.photos/seed/swimmingfish/800/600' },
  { title:'موتور جت آموزشی', cat:'proto', catName:'قطعه و نمونه اولیه', material:'PLA — مشکی و نقره‌ای', time:'۲۰ ساعت',
    desc:'ماکت موتور جت با پروانه چرخان؛ نمایش دموی قطعات مکانیکی چاپ‌شده.',
    img:'https://picsum.photos/seed/jetengine/800/600' },
  { title:'اسکراپر تخت پرینتر (Bambu Scraper)', cat:'gadget', catName:'گجت و لوازم', material:'PETG — نارنجی', time:'۲ ساعت',
    desc:'ابزار جداسازی پرینت از بستر؛ مدل رسمی و کاربردی Bambu Lab با صدها هزار دانلود.',
    img:'https://picsum.photos/seed/scraper/800/600' },
  { title:'قایق Benchy — تست دقت', cat:'proto', catName:'قطعه و نمونه اولیه', material:'PLA — آبی', time:'۱ ساعت',
    desc:'قایق معروف تست کالیبراسیون؛ چاپ آن کیفیت لایه‌ها، پل‌زنی و دقت ابعادی را نشان می‌دهد.',
    img:'https://picsum.photos/seed/benchy/800/600' },
  { title:'استند نامرئی دسته Xbox', cat:'gadget', catName:'گجت و لوازم', material:'PLA — مشکی مات', time:'۵ ساعت',
    desc:'نگهدارنده کنسول و دسته با طراحی شناور؛ پرینت پرطرفدار گیمرها.',
    img:'https://picsum.photos/seed/xboxstand/800/600' },
  { title:'سنجاق اژدهای مقیاس‌دار (Flexi Dragon)', cat:'art', catName:'مجسمه و دکور', material:'PLA — گرادیان رنگی', time:'۶ ساعت',
    desc:'اژدهای مفصلی کاملاً چاپ‌شده در یک‌بار چاپ؛ بدون مونتاژ، کاملاً انعطاف‌پذیر.',
    img:'https://picsum.photos/seed/flexidragon/800/600' },
  { title:'جعبه چندکاره اوریجینامی', cat:'gadget', catName:'گجت و لوازم', material:'PLA — دو رنگ', time:'۳ ساعت',
    desc:'جعبه ذخیره مدولار در دو سایز؛ برای میز کار و کشو، در دو نسخه چاپ شد.',
    img:'https://picsum.photos/seed/multicase/800/600' },
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
  const key = new THREE.PointLight(0xff6b2b, 60); key.position.set(5, 6, 5); scene.add(key);
  const rim = new THREE.PointLight(0x4d7cff, 25); rim.position.set(-6, 3, -4); scene.add(rim);
  const LAYERS = 46;
  const layers = new THREE.Group();
  const geo = new THREE.BoxGeometry(1, .07, 1);
  const mat = new THREE.MeshStandardMaterial({color:0xff6b2b, emissive:0xff4500, emissiveIntensity:.35, metalness:.3, roughness:.4, transparent:true, opacity:.92});
  const wireMat = new THREE.MeshBasicMaterial({color:0xffb27a, wireframe:true, transparent:true, opacity:.28});
  for(let i=0;i<LAYERS;i++){
    const m = new THREE.Mesh(geo, mat);
    m.position.y = ((i/LAYERS)-0.5)*4.4;
    m.rotation.y = (i/LAYERS)*1.5;
    const w = new THREE.Mesh(geo, wireMat);
    w.scale.setScalar(1.02); w.position.copy(m.position); w.rotation.copy(m.rotation);
    m.add(w); layers.add(m);
  }
  scene.add(layers);
  const printHead = new THREE.Mesh(new THREE.TorusGeometry(2.1, .015, 8, 64), new THREE.MeshBasicMaterial({color:0xffb27a, transparent:true, opacity:.7}));
  scene.add(printHead);
  let progress = 0, mouseX = 0, mouseY = 0;
  holder.addEventListener('pointermove', e => {
    const r = holder.getBoundingClientRect();
    mouseX = ((e.clientX - r.left)/r.width - .5) * 2;
    mouseY = ((e.clientY - r.top)/r.height - .5) * 2;
  });
  function animate(t){
    requestAnimationFrame(animate);
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