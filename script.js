// Inisialisasi Intro Logo
// Tampil sekali per sesi (sessionStorage). Uji ulang: buka index.html?intro=1 atau ketik resetIntro() di Console.
window.resetIntro=function(){try{sessionStorage.removeItem('baIntroSeen')}catch(e){}location.reload()};
(function(){
  const root=document.documentElement,intro=document.getElementById('intro');
  if(!intro||!root.classList.contains('intro-active'))return; // sudah pernah tampil di sesi ini
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOLD=reduce?1200:1900,SLIDE=reduce?450:1100; // lama tampil & lama transisi keluar (ms)
  let leaving=false;
  try{sessionStorage.setItem('baIntroSeen','1')}catch(e){}
  // Fallback: jika logo tidak ditemukan, tetap tampil nama sekolah
  const logo=document.getElementById('introLogo');
  if(logo){
    logo.addEventListener('error',()=>intro.classList.add('no-logo'));
    if(logo.complete&&logo.naturalWidth===0)intro.classList.add('no-logo');
  }
  const finish=()=>{root.classList.remove('intro-active','intro-leave');intro.remove()};
  const leave=()=>{if(leaving)return;leaving=true;root.classList.add('intro-leave');setTimeout(finish,SLIDE+50)};
  setTimeout(leave,HOLD);
  setTimeout(finish,6000); // pengaman: intro tidak akan pernah menutupi halaman
  intro.addEventListener('click',leave);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')leave()});
})();

// Menu mobile
const burger=document.getElementById('burger'),menu=document.getElementById('menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false)}));

// Tahun footer
document.getElementById('year').textContent=new Date().getFullYear();

// Galeri + lightbox
const box=document.getElementById('lightbox'),lb=document.getElementById('lb');
document.querySelectorAll('.g').forEach(g=>g.addEventListener('click',()=>{
  lb.innerHTML=g.innerHTML;
  lb.classList.toggle('has-photo',g.classList.contains('has-photo')); // mode foto asli vs placeholder
  lb.style.background=getComputedStyle(g).backgroundColor;
  box.hidden=false;
}));
const closeBox=()=>{box.hidden=true};
document.getElementById('close').addEventListener('click',closeBox);
box.addEventListener('click',e=>{if(e.target===box)closeBox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBox()});

// Formulir PPDB
const form=document.getElementById('form'),ok=document.getElementById('ok');
const rules={
  nama:v=>v.trim().length>=3||'Isi nama anak minimal 3 huruf.',
  lahir:v=>{if(!v)return 'Pilih tanggal lahir anak.';
    const age=(Date.now()-new Date(v))/31557600000;
    return (age>=3&&age<=7)||'Usia anak harus sekitar 3–7 tahun.'},
  'program-pilih':v=>!!v||'Pilih program pendaftaran.',
  ortu:v=>v.trim().length>=3||'Isi nama orang tua/wali.',
  hp:v=>/^(08|\+?628)\d{8,11}$/.test(v.replace(/[\s-]/g,''))||'Nomor WhatsApp tidak valid, contoh 081234567890.'
};
function check(id){
  const el=document.getElementById(id),r=rules[id](el.value),msg=el.parentElement.querySelector('em');
  el.classList.toggle('invalid',r!==true);msg.textContent=r===true?'':r;return r===true;
}
Object.keys(rules).forEach(id=>document.getElementById(id).addEventListener('input',()=>check(id)));
form.addEventListener('submit',e=>{
  e.preventDefault();
  const valid=Object.keys(rules).map(check).every(Boolean);
  if(!valid){ok.hidden=false;ok.textContent='Periksa kembali kolom yang bertanda merah.';return}
  const g=id=>document.getElementById(id).value.trim();
  const text=`Assalamu'alaikum, saya ingin mendaftar SPMB TK BA 'Aisyiyah Pacitan 2026/2027.%0A`+
    `Nama anak: ${g('nama')}%0ATanggal lahir: ${g('lahir')}%0AProgram: ${g('program-pilih')}%0A`+
    `Orang tua/wali: ${g('ortu')}%0AWhatsApp: ${g('hp')}`;
  window.open('https://wa.me/6285168603496?text='+encodeURI(text).replace(/%250A/g,'%0A'),'_blank');
  ok.hidden=false;ok.textContent='Terima kasih! WhatsApp panitia terbuka, tinggal tekan kirim.';
  form.reset();
});

// Dropdown menu (HP: ketuk untuk membuka submenu)
document.querySelectorAll('.has-sub>a').forEach(a=>a.addEventListener('click',e=>{
  if(window.innerWidth<=900){e.preventDefault();a.parentElement.classList.toggle('open')}
}));

// Slideshow hero (geser otomatis + panah)
(function(){
  const slides=document.querySelectorAll('.hs'),hero=document.getElementById('home');
  if(slides.length<2||!hero)return;
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DELAY=5000; // lama tiap slide (ms)
  const dots=document.createElement('div');dots.className='hs-dots';
  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    b.type='button';b.setAttribute('aria-label','Slide '+(i+1));
    b.addEventListener('click',()=>{show(i);restart()});
    dots.appendChild(b);
  });
  const nav=document.createElement('div');nav.className='hs-nav';
  nav.innerHTML='<button type="button" class="hs-prev" aria-label="Slide sebelumnya"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>'+
                '<button type="button" class="hs-next" aria-label="Slide berikutnya"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>';
  hero.append(dots,nav);
  let cur=0,timer;
  function show(n){
    slides[cur].classList.remove('active');dots.children[cur].classList.remove('on');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('active');dots.children[cur].classList.add('on');
  }
  function restart(){clearInterval(timer);if(!reduce)timer=setInterval(()=>show(cur+1),DELAY)}
  nav.querySelector('.hs-prev').addEventListener('click',()=>{show(cur-1);restart()});
  nav.querySelector('.hs-next').addEventListener('click',()=>{show(cur+1);restart()});
  dots.children[0].classList.add('on');
  hero.addEventListener('mouseenter',()=>clearInterval(timer));
  hero.addEventListener('mouseleave',restart);
  restart();
})();