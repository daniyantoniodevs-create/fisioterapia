/* ===========================================================
   Portal — Lógica de inicio de sesión
   =========================================================== */
(function () {
  'use strict';

  // Si ya hay sesión, redirige directamente al panel correspondiente
  var existing = Portal.session();
  if (existing) {
    location.href = existing.role === 'fisio' ? 'admin.html' : 'paciente.html';
    return;
  }

  var form = document.getElementById('loginForm');
  var userIn = document.getElementById('user');
  var passIn = document.getElementById('pass');
  var errorBox = document.getElementById('loginError');
  var tabs = document.getElementById('roleTabs');
  var togglePass = document.getElementById('togglePass');

  // Año en el footer del aside
  document.querySelectorAll('.yr').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  // Tabs de rol: rellenan el usuario sugerido
  tabs.querySelectorAll('button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var role = btn.getAttribute('data-role');
      userIn.value = role === 'fisio' ? 'fisio' : 'cliente';
      passIn.value = '';
      errorBox.classList.remove('show');
      passIn.focus();
    });
  });

  // Mostrar / ocultar contraseña
  togglePass.addEventListener('click', function () {
    var show = passIn.type === 'password';
    passIn.type = show ? 'text' : 'password';
    togglePass.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  // Envío del formulario
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var session = Portal.login(userIn.value, passIn.value);
    // cuenta registrada pero sin pago activo
    if (session && session.error === 'unpaid') {
      errorBox.textContent = 'Tu cuenta aún no está activada. Completa el pago para acceder.';
      errorBox.classList.add('show');
      setTimeout(function () { location.href = 'register.html'; }, 1800);
      return;
    }
    if (!session) {
      errorBox.textContent = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      errorBox.classList.add('show');
      passIn.select();
      return;
    }
    errorBox.classList.remove('show');
    // pequeña transición antes de redirigir
    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Accediendo...';
    setTimeout(function () {
      location.href = session.role === 'fisio' ? 'admin.html' : 'paciente.html';
    }, 350);
  });

  // Accesos de demostración: rellenar al pulsar
  document.querySelectorAll('.demo-fill').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var u = btn.getAttribute('data-user');
      userIn.value = u;
      passIn.value = btn.getAttribute('data-pass');
      errorBox.classList.remove('show');
      // marcar la pestaña de rol correspondiente
      tabs.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-role') === (u === 'fisio' ? 'fisio' : 'cliente'));
      });
    });
  });

  // Prefijar usuario por defecto
  userIn.value = 'cliente';
})();
