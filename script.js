(function(){
  const card = document.querySelector('.invitacion');
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Título letra por letra */
  const titulo = document.querySelector('.titulo');
  titulo.innerHTML = [...titulo.textContent].map((c,i)=>
    c===' ' ? ' ' : `<span class="letra" style="animation-delay:${i*45}ms">${c}</span>`).join('');

  /* Entrada escalonada (se llama cuando se abre el telón) */
  function iniciar(){
    const orden = ['.sorpresa','.titulo','.nombre','.deco','.fecha','.hora','.lugar','.cuenta','.llevar','.detalle','.confirmar'];
    const tiempos = [200, 1000, 1900, 3400, 3600, 3850, 4100, 4350, 4600, 4800, 5050];
    orden.forEach((sel,i)=> setTimeout(()=>document.querySelectorAll(sel).forEach(el=>el.classList.add('ver')), quieto?0:tiempos[i]));
    setTimeout(()=>{ lluvia(90); document.querySelector('.toque').classList.add('ver'); }, quieto?0:2000);
    setTimeout(()=>document.querySelector('.toque').classList.remove('ver'), 9000);
  }


  /* ---------- Intro: piñata que se rompe con 3 toques y telón que se abre ---------- */
  const telon = document.getElementById('telon');
  const cuelga = document.getElementById('pinata');
  const pista = document.getElementById('pista');
  const marcas = [...telon.querySelectorAll('.golpes i')];
  const saltarBtn = document.getElementById('saltar');
  let enIntro = true, golpes = 0, timers = [];
  const luego = (fn, ms) => timers.push(setTimeout(fn, ms));

  function abrir(){
    if (!enIntro) return; enIntro = false;
    timers.forEach(clearTimeout);
    saltarBtn.classList.add('fuera');
    telon.classList.add('abre');
    setTimeout(()=>{ telon.classList.add('fin'); }, quieto ? 0 : 1800);
    setTimeout(iniciar, quieto ? 0 : 700);
  }
  saltarBtn.addEventListener('click', e => { e.stopPropagation(); abrir(); });

  function centroPinata(){
    const r = card.getBoundingClientRect(), p = cuelga.querySelector('.pinata').getBoundingClientRect();
    return [p.left - r.left + p.width/2, p.top - r.top + p.height/2];
  }
  function zas(x, y, texto){
    const z = document.createElement('span');
    z.className = 'zas'; z.textContent = texto;
    z.style.left = x + 'px'; z.style.top = y + 'px';
    z.style.setProperty('--giro', (Math.random()*30 - 15) + 'deg');
    card.appendChild(z); setTimeout(() => z.remove(), 750);
  }
  cuelga.addEventListener('animationend', e => { if (e.animationName === 'pum') cuelga.classList.remove('pum'); });

  function golpear(){
    if (!enIntro || golpes >= 3) return;
    golpes++;
    marcas[golpes-1].classList.add('on');
    const [x, y] = centroPinata();
    zas(x, y, ['¡PUM!', '¡ZAS!', '¡ÓRALE!'][golpes-1]);
    if (golpes < 3){
      cuelga.classList.remove('pum'); void cuelga.offsetWidth; cuelga.classList.add('pum', 'g' + golpes);
      estallido(x, y, 12 + golpes*10, true);            // se le escapan unos dulces
      pista.textContent = golpes === 1 ? '¡Otra vez! Faltan 2' : '¡Una más y se rompe!';
    } else {
      cuelga.classList.add('rota');
      pista.textContent = '¡SORPRESA! 🎉';
      estallido(x, y, 180, true);
      card.classList.add('sacude'); setTimeout(() => card.classList.remove('sacude'), 400);
      setTimeout(abrir, 450);
    }
  }

  if (quieto){ abrir(); }
  else {
    // si nadie la toca en un buen rato, se rompe sola
    luego(function sola(){ golpear(); if (enIntro && golpes < 3) luego(sola, 700); }, 20000);
  }

  /* Cuenta regresiva hasta el sábado 24 de octubre, 7:00 PM (hora de RD) */
  const fiesta = new Date('2026-10-24T19:00:00-04:00');
  const cuenta = document.getElementById('cuenta');
  let previo = '';
  function tic(){
    let s = Math.floor((fiesta - new Date())/1000);
    if (s <= 0){ cuenta.textContent = s > -6*3600 ? '¡La fiesta es hoy! 🎉' : '¡Gracias por celebrar! 💖'; return; }
    const d = Math.floor(s/86400); s%=86400;
    const h = Math.floor(s/3600);  s%=3600;
    const m = Math.floor(s/60);    s%=60;
    const p = n => String(n).padStart(2,'0');
    cuenta.innerHTML = `Faltan <span class="num">${d}</span>d <span class="num">${p(h)}</span>h <span class="num">${p(m)}</span>m <span class="num">${p(s)}</span>s`;
    const nums = cuenta.querySelectorAll('.num');
    const ahora = [d,h,m].join('-');
    if (ahora !== previo && previo) nums.forEach(n=>n.classList.add('salta'));
    nums[3].classList.add('salta');
    previo = ahora;
  }
  tic(); setInterval(tic, 1000);

  /* Confeti en canvas: papelitos, banderitas de papel picado, estrellas y dulces */
  const cv = document.getElementById('confeti'), ctx = cv.getContext('2d');
  const colores = ['#e8641b','#e0197d','#6a2b8c','#f2b71b','#2fa24a','#1b8ad3'];
  let piezas = [], corriendo = false;
  function medir(){ const r = card.getBoundingClientRect(), k = devicePixelRatio||1;
    cv.width = r.width*k; cv.height = r.height*k; ctx.setTransform(k,0,0,k,0,0); }
  medir(); addEventListener('resize', medir);

  function pieza(x, y, fuerte, dulces){
    const w = card.clientWidth, a = Math.random();
    const forma = dulces ? (a < .55 ? 'dulce' : a < .75 ? 'estrella' : 'papel')
                         : (a < .5 ? 'papel' : a < .7 ? 'banderita' : a < .85 ? 'estrella' : 'dulce');
    return { x, y, vx:(Math.random()-.5)*(fuerte?9:2), vy:fuerte?-(Math.random()*8+3):Math.random()*1.5+1,
      t:Math.random()*w*.012+w*.008, r:Math.random()*6, vr:(Math.random()-.5)*.25,
      osc:Math.random()*6, c:colores[Math.random()*colores.length|0], vida:1, forma };
  }
  function lluvia(n){ if (quieto) return; const w = card.clientWidth;
    for (let i=0;i<n;i++){ const p = pieza(Math.random()*w, -Math.random()*card.clientHeight*.5, false); piezas.push(p); }
    arrancar(); }
  function estallido(x, y, n = 70, dulces = false){ if (quieto) return;
    for (let i=0;i<n;i++) piezas.push(pieza(x, y, true, dulces)); arrancar(); }
  function arrancar(){ if (!corriendo){ corriendo = true; requestAnimationFrame(cuadro); } }

  function dibujar(p){
    const t = p.t; ctx.fillStyle = p.c;
    if (p.forma === 'dulce'){              // caramelo envuelto
      const a = t*.75, b = t*.5;
      ctx.beginPath(); ctx.ellipse(0, 0, a, b, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-a*.8, 0); ctx.lineTo(-a*1.8, -b); ctx.lineTo(-a*1.8, b); ctx.closePath();
      ctx.moveTo(a*.8, 0); ctx.lineTo(a*1.8, -b); ctx.lineTo(a*1.8, b); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-a*.18, -b*.85, a*.36, b*1.7);
    } else if (p.forma === 'estrella'){
      ctx.beginPath();
      for (let i = 0; i < 10; i++){ const rad = i % 2 ? t*.38 : t*.9, ang = i*Math.PI/5 - Math.PI/2;
        ctx.lineTo(Math.cos(ang)*rad, Math.sin(ang)*rad); }
      ctx.closePath(); ctx.fill();
    } else if (p.forma === 'banderita'){   // papel picado: borde inferior en picos
      const w = t*1.3, h = t*1.1;
      ctx.scale(1, Math.abs(Math.cos(p.osc))*.6 + .4);
      ctx.beginPath(); ctx.moveTo(-w/2, -h/2); ctx.lineTo(w/2, -h/2); ctx.lineTo(w/2, h/3);
      ctx.lineTo(w/3, h/2); ctx.lineTo(w/6, h/3); ctx.lineTo(0, h/2); ctx.lineTo(-w/6, h/3); ctx.lineTo(-w/3, h/2); ctx.lineTo(-w/2, h/3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(0, -h*.08, t*.2, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.scale(1, Math.abs(Math.cos(p.osc)));
      ctx.fillRect(-t/2, -t/2, t, t*.6);
    }
  }
  function cuadro(){
    const W = card.clientWidth, H = card.clientHeight;
    ctx.clearRect(0,0,W,H);
    piezas.forEach(p=>{
      p.vy += .12; p.vy = Math.min(p.vy, 3.2); p.vx *= .985;
      p.osc += .08; p.x += p.vx + Math.sin(p.osc)*.6; p.y += p.vy; p.r += p.vr;
      if (p.y > H*.9) p.vida -= .03;
      ctx.save(); ctx.globalAlpha = Math.max(p.vida,0); ctx.translate(p.x,p.y); ctx.rotate(p.r);
      dibujar(p); ctx.restore();
    });
    piezas = piezas.filter(p=>p.vida>0 && p.y < H+40);
    if (piezas.length) requestAnimationFrame(cuadro); else { corriendo = false; ctx.clearRect(0,0,W,H); }
  }

  /* Toque o clic: estallido de confeti y un saltito del "shhh" */


  /* ---------- Música: fragmento de musica.mp3 (18:39 – 19:00) sonando en bucle ---------- */
  const Musica = (() => {
    const VOL = .8;
    const audio = new Audio('musica-bucle.mp3');
    audio.loop = true; audio.preload = 'auto'; audio.volume = 0;
    let sonando = false, rampa = null;

    // sube o baja el volumen poco a poco (en iPhone el volumen lo controla el sistema y esto no tiene efecto)
    function desvanecer(hasta, ms, fin){
      clearInterval(rampa);
      const desde = audio.volume, t0 = performance.now();
      rampa = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        audio.volume = desde + (hasta - desde) * k;
        if (k === 1){ clearInterval(rampa); fin && fin(); }
      }, 30);
    }

    return {
      get sonando(){ return sonando; },
      async play(){
        if (sonando) return;
        await audio.play();
        sonando = true;
        desvanecer(VOL, 400);
      },
      stop(){
        if (!sonando) return;
        sonando = false;
        desvanecer(0, 300, () => { if (!sonando) audio.pause(); });
      }
    };
  })();

  const btnMusica = document.getElementById('musica');
  const cartel = document.getElementById('cancion');
  let silenciadoAMano = false;
  function pintarBoton(){
    btnMusica.classList.toggle('sonando', Musica.sonando);
    btnMusica.setAttribute('aria-pressed', Musica.sonando);
    btnMusica.setAttribute('aria-label', Musica.sonando ? 'Pausar música' : 'Activar música');
  }
  async function encender(){
    try { await Musica.play(); } catch(_){ return; }
    pintarBoton();
    cartel.classList.add('ver'); setTimeout(()=> cartel.classList.remove('ver'), 3500);
  }
  btnMusica.addEventListener('click', e => {
    e.stopPropagation();
    if (Musica.sonando){ Musica.stop(); silenciadoAMano = true; pintarBoton(); }
    else { silenciadoAMano = false; encender(); }
  });
  // Los navegadores no dejan sonar audio sin un toque: la música arranca con el primer toque en la invitación
  card.addEventListener('pointerdown', e => {
    if (!silenciadoAMano && !Musica.sonando && !btnMusica.contains(e.target)) encender();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && Musica.sonando){ Musica.stop(); pintarBoton(); }
  });

  /* ---------- Ubicación: abre una ventana con mapa y botones ---------- */
  const URL_MAPA = 'https://maps.google.com/?q=19.218111,-70.523354';
  const modal = document.getElementById('mapaModal');
  const frame = document.getElementById('mapaFrame');
  const aviso = document.getElementById('mapaAviso');
  function abrirMapa(e){
    e.preventDefault(); e.stopPropagation();
    if (!frame.src) frame.src = 'https://maps.google.com/maps?q=19.218111,-70.523354&z=16&output=embed';
    aviso.textContent = '';
    modal.hidden = false;
    requestAnimationFrame(()=> modal.classList.add('abierto'));
    modal.querySelector('.mapa-cerrar').focus();
  }
  function cerrarMapa(){
    modal.classList.remove('abierto');
    setTimeout(()=> modal.hidden = true, 300);
    document.querySelector('a.lugar').focus();
  }
  document.querySelector('a.lugar').addEventListener('click', abrirMapa);
  modal.addEventListener('click', e => { e.stopPropagation(); if (e.target === modal) cerrarMapa(); });
  modal.querySelector('.mapa-cerrar').addEventListener('click', cerrarMapa);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) cerrarMapa(); });

  /* Si el navegador bloquea abrir pestañas (p. ej. dentro de una vista previa), lo intentamos de otra forma */
  function abrirEnlace(url, avisoEl){
    let w = null;
    try { w = window.open(url, '_blank'); if (w) w.opener = null; } catch(_){}
    if (!w){
      try { window.top.location.href = url; }
      catch(_){ try { location.href = url; } catch(__){ if (avisoEl) avisoEl.textContent = 'Tu navegador bloqueó el enlace. Usa "Copiar enlace".'; } }
    }
  }
  modal.querySelectorAll('a.btn-mapa').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); abrirEnlace(a.href, aviso);
  }));

  /* ---------- Confirmar asistencia por WhatsApp ---------- */
  const TEL = '18496532269';
  const rsvp = document.getElementById('rsvpModal');
  const rsvpAviso = document.getElementById('rsvpAviso');
  function abrirRsvp(e){
    e.preventDefault(); e.stopPropagation();
    rsvp.hidden = false;
    rsvpAviso.textContent = '🤫 Recuerda: ¡es sorpresa! No le digas a nadie.';
    requestAnimationFrame(()=> rsvp.classList.add('abierto'));
    rsvp.querySelector('.rsvp-btn.si').focus();
  }
  function cerrarRsvp(){
    rsvp.classList.remove('abierto');
    setTimeout(()=> rsvp.hidden = true, 300);
  }
  document.querySelector('a.confirmar').addEventListener('click', abrirRsvp);
  rsvp.addEventListener('click', e => { e.stopPropagation(); if (e.target === rsvp) cerrarRsvp(); });
  rsvp.querySelector('.mapa-cerrar').addEventListener('click', cerrarRsvp);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !rsvp.hidden) cerrarRsvp(); });

  /* "¡Ajúa!": letrero grande y tres estallidos de confeti al confirmar que sí */
  const ajua = document.getElementById('ajua');
  let festejoPendiente = false;
  function festejar(){
    const W = card.clientWidth, H = card.clientHeight;
    ajua.classList.remove('ver'); void ajua.offsetWidth; ajua.classList.add('ver');
    estallido(W/2, H*.3, 90);
    setTimeout(() => estallido(W*.2, H*.45, 60, true), 250);
    setTimeout(() => estallido(W*.8, H*.45, 60, true), 500);
    lluvia(80);
  }
  // WhatsApp tapa la invitación al abrirse: al volver se repite el festejo una vez
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && festejoPendiente){ festejoPendiente = false; setTimeout(festejar, 300); }
  });

  rsvp.querySelectorAll('.rsvp-btn').forEach(btn => btn.addEventListener('click', () => {
    const msg = btn.dataset.resp === 'si'
      ? `¡Hola! 🎉 Confirmo que *SÍ podré ir* a la Fiesta Mexicana sorpresa de Margarita 🌮🎊\n📅 Sábado 24 de octubre, 7:00 PM\n📍 Terraza Los Abuelos, Beato\n¡Allí estaré! 🤫`
      : `Hola 😢 Lamentablemente *no podré ir* a la Fiesta Mexicana sorpresa de Margarita el sábado 24 de octubre. ¡Muchas gracias por la invitación y que la pasen increíble! 💖`;
    const url = `https://api.whatsapp.com/send?phone=${TEL}&text=${encodeURIComponent(msg)}`;
    if (btn.dataset.resp === 'si'){ festejar(); festejoPendiente = true; }
    rsvpAviso.textContent = btn.dataset.resp === 'si' ? '¡Ajúa! 🎉 Nos vemos en la fiesta. Abriendo WhatsApp…' : 'Abriendo WhatsApp…';
    abrirEnlace(url, rsvpAviso);
  }));

  modal.querySelector('.copiar').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(URL_MAPA); aviso.textContent = '¡Enlace copiado! Pégalo en el navegador o en WhatsApp.'; }
    catch(_){
      const tmp = document.createElement('textarea'); tmp.value = URL_MAPA; document.body.appendChild(tmp);
      tmp.select(); let ok = false; try { ok = document.execCommand('copy'); } catch(__){}
      tmp.remove();
      aviso.textContent = ok ? '¡Enlace copiado!' : URL_MAPA;
    }
  });
  function celebrar(e){
    if (enIntro){ golpear(); return; }
    const r = card.getBoundingClientRect();
    const x = e && e.clientX ? e.clientX - r.left : r.width/2;
    const y = e && e.clientY ? e.clientY - r.top : r.height/2;
    estallido(x,y);
    const shh = document.querySelector('.sorpresa');
    shh.classList.remove('ver'); void shh.offsetWidth; shh.classList.add('ver');
  }
  card.addEventListener('click', celebrar);
  card.addEventListener('keydown', e=>{ if (e.target !== card) return; if (e.key==='Enter'||e.key===' '){ e.preventDefault(); celebrar(); } });

  /* Leve inclinación 3D al mover el ratón */
  if (!quieto && matchMedia('(hover:hover)').matches){
    card.addEventListener('mousemove', e=>{
      if (!modal.hidden || !rsvp.hidden) { card.style.transform=''; return; }
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY-r.top)/r.height-.5)*-5, ry = ((e.clientX-r.left)/r.width-.5)*5;
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', ()=> card.style.transform = '');
  }
})();
