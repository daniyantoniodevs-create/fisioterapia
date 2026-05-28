/* ===========================================================
   Portal — Datos, autenticación y almacenamiento (localStorage)
   Demo 100% estática: los datos persisten en el navegador.
   =========================================================== */
(function (global) {
  'use strict';

  var KEYS = {
    session: 'ap_session',
    videos: 'ap_videos',
    progress: 'ap_progress',
    patients: 'ap_patients',
    messages: 'ap_messages'
  };

  // Credenciales de demostración solicitadas
  var CREDENTIALS = {
    cliente: { pass: '123465', role: 'cliente', name: 'María García', label: 'Paciente · LCA rodilla derecha' },
    fisio:   { pass: '123456', role: 'fisio',   name: 'Álvaro Picazo', label: 'Fisioterapeuta' }
  };

  /* ---------- Helpers de almacenamiento ---------- */
  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------- Datos por defecto (semilla) ---------- */
  var DEFAULT_VIDEOS = [
    {
      id: 'v1', title: 'Movilidad de rodilla en flexo-extensión', phase: 1,
      category: 'Movilidad',
      desc: 'Ejercicio suave para recuperar el rango de movimiento de la rodilla en las primeras semanas.',
      type: 'youtube', src: 'I3-jUF1bele', duration: '4 min', reps: '3 series x 15 rep',
      date: '2026-05-10'
    },
    {
      id: 'v2', title: 'Activación del cuádriceps (isométricos)', phase: 1,
      category: 'Fuerza',
      desc: 'Contracciones isométricas para reactivar la musculatura del muslo sin cargar la articulación.',
      type: 'youtube', src: 'pXY-jXcK5Xk', duration: '5 min', reps: '3 series x 10 rep',
      date: '2026-05-10'
    },
    {
      id: 'v3', title: 'Elevación de pierna recta (SLR)', phase: 2,
      category: 'Fuerza',
      desc: 'Fortalecimiento del cuádriceps con la rodilla estirada. Clave para la fase de recuperación temprana.',
      type: 'youtube', src: 'dr-2-3W8nzM', duration: '6 min', reps: '4 series x 12 rep',
      date: '2026-05-14'
    },
    {
      id: 'v4', title: 'Sentadilla parcial con apoyo', phase: 2,
      category: 'Fuerza',
      desc: 'Sentadilla controlada en rango corto para ganar fuerza funcional de forma segura.',
      type: 'youtube', src: 'aclHkVaku9U', duration: '7 min', reps: '3 series x 12 rep',
      date: '2026-05-18'
    },
    {
      id: 'v5', title: 'Propiocepción en superficie inestable', phase: 3,
      category: 'Propiocepción',
      desc: 'Trabajo de equilibrio y estabilidad sobre bosu para reeducar el control neuromuscular.',
      type: 'youtube', src: 'CGqQ-3rZv3E', duration: '8 min', reps: '4 series x 30 seg',
      date: '2026-05-22'
    },
    {
      id: 'v6', title: 'Pliometría: salto y aterrizaje controlado', phase: 4,
      category: 'Pliometría',
      desc: 'Ejercicios de salto para preparar la vuelta al deporte. Solo en fases avanzadas y con el visto bueno del fisio.',
      type: 'youtube', src: 'XxuRBcGOTGw', duration: '9 min', reps: '4 series x 8 rep',
      date: '2026-05-26'
    }
  ];

  var DEFAULT_PROGRESS = {
    patient: 'María García',
    injury: 'Rotura de LCA — rodilla derecha',
    surgeryDate: '2026-04-08',
    currentPhase: 2,
    overall: 45,
    rangeOfMotion: 110,   // grados
    strength: 62,         // % respecto pierna sana
    nextSession: '2026-05-30 17:00',
    phases: [
      { n: 1, title: 'Fase preoperatoria / aguda', desc: 'Reducir inflamación y recuperar movilidad básica.', status: 'done' },
      { n: 2, title: 'Recuperación temprana', desc: 'Control del dolor, movilidad completa y activación muscular.', status: 'current' },
      { n: 3, title: 'Fortalecimiento y propiocepción', desc: 'Ganar fuerza, estabilidad y confianza.', status: 'todo' },
      { n: 4, title: 'Vuelta al deporte (RTP)', desc: 'Gestos deportivos, pliometría y tests de alta.', status: 'todo' }
    ],
    sessions: [
      { date: '2026-05-26', pain: 2, rom: 110, done: true, notes: 'Buena evolución, sin derrame.' },
      { date: '2026-05-19', pain: 3, rom: 100, done: true, notes: 'Aumentamos carga en cuádriceps.' },
      { date: '2026-05-12', pain: 4, rom: 90, done: true, notes: 'Retirada de muletas progresiva.' },
      { date: '2026-05-05', pain: 5, rom: 75, done: true, notes: 'Inicio de movilidad activa.' }
    ],
    weeklyPain: [6, 5, 4, 4, 3, 2] // últimas semanas (menos es mejor)
  };

  var DEFAULT_PATIENTS = [
    { id: 'p1', name: 'María García', injury: 'LCA rodilla dcha.', phase: 2, progress: 45, status: 'Activo', last: '2026-05-26' },
    { id: 'p2', name: 'Carlos Ruiz', injury: 'LCA rodilla izq.', phase: 4, progress: 88, status: 'Activo', last: '2026-05-25' },
    { id: 'p3', name: 'Lucía Fernández', injury: 'Menisco', phase: 3, progress: 70, status: 'Activo', last: '2026-05-24' },
    { id: 'p4', name: 'Javier Moreno', injury: 'LCA + menisco', phase: 1, progress: 15, status: 'Nuevo', last: '2026-05-27' },
    { id: 'p5', name: 'Ana Torres', injury: 'Esguince tobillo', phase: 3, progress: 65, status: 'Activo', last: '2026-05-20' }
  ];

  var DEFAULT_MESSAGES = [
    { id: 'm1', from: 'fisio', text: 'Hola María, te he añadido dos ejercicios nuevos para esta semana. ¡Buen trabajo!', date: '2026-05-26 18:20' },
    { id: 'm2', from: 'cliente', text: 'Gracias Álvaro, hoy he notado la rodilla mucho mejor 💪', date: '2026-05-26 19:05' }
  ];

  /* ---------- Inicializar semilla si no existe ---------- */
  function seed() {
    if (!localStorage.getItem(KEYS.videos)) write(KEYS.videos, DEFAULT_VIDEOS);
    if (!localStorage.getItem(KEYS.progress)) write(KEYS.progress, DEFAULT_PROGRESS);
    if (!localStorage.getItem(KEYS.patients)) write(KEYS.patients, DEFAULT_PATIENTS);
    if (!localStorage.getItem(KEYS.messages)) write(KEYS.messages, DEFAULT_MESSAGES);
  }

  /* ---------- API pública ---------- */
  var Portal = {
    keys: KEYS,

    login: function (user, pass) {
      var u = (user || '').trim().toLowerCase();
      var cred = CREDENTIALS[u];
      if (cred && cred.pass === pass) {
        var session = { role: cred.role, user: u, name: cred.name, label: cred.label, ts: Date.now() };
        write(KEYS.session, session);
        return session;
      }
      return null;
    },

    logout: function () { localStorage.removeItem(KEYS.session); },

    session: function () { return read(KEYS.session, null); },

    /** Protege una página: redirige a login si no hay sesión o el rol no coincide. */
    requireRole: function (role) {
      var s = this.session();
      if (!s) { location.href = 'portal.html'; return null; }
      if (role && s.role !== role) {
        location.href = s.role === 'fisio' ? 'admin.html' : 'paciente.html';
        return null;
      }
      return s;
    },

    /* Vídeos / ejercicios */
    getVideos: function () { return read(KEYS.videos, DEFAULT_VIDEOS); },
    saveVideos: function (list) { write(KEYS.videos, list); },
    addVideo: function (video) {
      var list = this.getVideos();
      video.id = 'v' + Date.now();
      list.unshift(video);
      write(KEYS.videos, list);
      return video;
    },
    deleteVideo: function (id) {
      var list = this.getVideos().filter(function (v) { return v.id !== id; });
      write(KEYS.videos, list);
    },

    /* Progreso */
    getProgress: function () { return read(KEYS.progress, DEFAULT_PROGRESS); },
    saveProgress: function (p) { write(KEYS.progress, p); },
    addSession: function (s) {
      var p = this.getProgress();
      p.sessions.unshift(s);
      if (typeof s.rom === 'number') p.rangeOfMotion = s.rom;
      write(KEYS.progress, p);
      return p;
    },

    /* Pacientes (admin) */
    getPatients: function () { return read(KEYS.patients, DEFAULT_PATIENTS); },

    /* Mensajes */
    getMessages: function () { return read(KEYS.messages, DEFAULT_MESSAGES); },
    addMessage: function (m) {
      var list = this.getMessages();
      m.id = 'm' + Date.now();
      list.push(m);
      write(KEYS.messages, list);
      return m;
    },

    /** Restaura los datos de demostración. */
    reset: function () {
      [KEYS.videos, KEYS.progress, KEYS.patients, KEYS.messages].forEach(function (k) { localStorage.removeItem(k); });
      seed();
    },

    /* Utilidad: incrustar vídeo según tipo */
    embedHtml: function (v, autoplay) {
      if (v.type === 'youtube') {
        var ap = autoplay ? '?autoplay=1&rel=0' : '?rel=0';
        return '<iframe src="https://www.youtube.com/embed/' + v.src + ap +
               '" title="' + (v.title || '') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      }
      if (v.type === 'file' || v.type === 'url') {
        return '<video src="' + v.src + '" controls ' + (autoplay ? 'autoplay' : '') + ' playsinline></video>';
      }
      return '';
    },
    thumbHtml: function (v) {
      if (v.type === 'youtube') {
        return '<img src="https://img.youtube.com/vi/' + v.src + '/hqdefault.jpg" alt="' + (v.title || '') + '" loading="lazy" />';
      }
      if (v.type === 'file' || v.type === 'url') {
        return '<video src="' + v.src + '" muted preload="metadata"></video>';
      }
      return '';
    }
  };

  seed();
  global.Portal = Portal;
})(window);
