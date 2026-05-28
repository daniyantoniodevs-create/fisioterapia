/* ===========================================================
   Portal — Registro de paciente + pago simulado
   =========================================================== */
(function () {
  'use strict';

  document.querySelectorAll('.yr').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  // Plan dinámico
  document.getElementById('planName').textContent = Portal.plan.name;
  document.getElementById('planPrice').textContent = Portal.plan.price;
  document.getElementById('payBtn').textContent = 'Pagar ' + Portal.plan.price + '€ y activar';

  var current = 1;
  var createdUser = null;
  var errorBox = document.getElementById('regError');

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('show');
    setTimeout(function () { errorBox.classList.remove('show'); }, 4000);
  }

  function goStep(n) {
    current = n;
    document.querySelectorAll('.wstep').forEach(function (s) { s.classList.remove('active'); });
    var el = document.getElementById('wstep-' + n);
    if (el) el.classList.add('active');
    // indicadores (solo 1-3)
    document.querySelectorAll('.steps .step').forEach(function (st) {
      var s = parseInt(st.getAttribute('data-step'), 10);
      st.classList.toggle('active', s === n);
      st.classList.toggle('done', s < n);
    });
    document.getElementById('loginLink').style.display = n >= 3 ? 'none' : '';
    document.getElementById('steps').style.display = n > 3 ? 'none' : '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Validaciones por paso */
  function validateStep1() {
    var name = document.getElementById('rName').value.trim();
    var email = document.getElementById('rEmail').value.trim();
    var p1 = document.getElementById('rPass').value;
    var p2 = document.getElementById('rPass2').value;
    if (name.length < 3) return showError('Introduce tu nombre completo.'), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Introduce un email válido.'), false;
    if (p1.length < 4) return showError('La contraseña debe tener al menos 4 caracteres.'), false;
    if (p1 !== p2) return showError('Las contraseñas no coinciden.'), false;
    if (Portal.emailExists(email)) return showError('Ya existe una cuenta con ese email. Inicia sesión.'), false;
    return true;
  }
  function validateStep2() {
    if (!document.getElementById('rInjury').value) return showError('Selecciona tu lesión o motivo.'), false;
    return true;
  }

  /* Navegación */
  document.querySelectorAll('[data-next]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = parseInt(b.getAttribute('data-next'), 10);
      if (current === 1 && !validateStep1()) return;
      if (current === 2 && !validateStep2()) return;
      // tarjeta: reflejar nombre
      document.getElementById('cvName').textContent = (document.getElementById('rName').value.trim() || 'NOMBRE APELLIDOS').toUpperCase();
      goStep(next);
    });
  });
  document.querySelectorAll('[data-prev]').forEach(function (b) {
    b.addEventListener('click', function () { goStep(parseInt(b.getAttribute('data-prev'), 10)); });
  });

  /* Formateo de tarjeta */
  var cardNum = document.getElementById('cardNum');
  cardNum.addEventListener('input', function () {
    var v = cardNum.value.replace(/\D/g, '').slice(0, 16);
    cardNum.value = v.replace(/(.{4})/g, '$1 ').trim();
    document.getElementById('cvNum').textContent = (cardNum.value || '•••• •••• •••• ••••').padEnd(19, '•');
  });
  var cardExp = document.getElementById('cardExp');
  cardExp.addEventListener('input', function () {
    var v = cardExp.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    cardExp.value = v;
    document.getElementById('cvExp').textContent = v || 'MM/AA';
  });

  /* Pago */
  document.getElementById('payBtn').addEventListener('click', function () {
    var num = cardNum.value.replace(/\s/g, '');
    var exp = cardExp.value;
    var cvc = document.getElementById('cardCvc').value;
    if (num.length < 13) return showError('Introduce un número de tarjeta válido.');
    if (!/^\d{2}\/\d{2}$/.test(exp)) return showError('Caducidad no válida (MM/AA).');
    if (cvc.length < 3) return showError('CVC no válido.');

    // crear usuario si no existe aún
    if (!createdUser) {
      var res = Portal.register({
        name: document.getElementById('rName').value,
        email: document.getElementById('rEmail').value,
        pass: document.getElementById('rPass').value,
        injury: document.getElementById('rInjury').value,
        goal: document.getElementById('rGoal').value,
        notes: document.getElementById('rNotes').value
      });
      if (res.error === 'exists') return showError('Ya existe una cuenta con ese email.');
      createdUser = res.user;
    }

    // simular procesamiento
    var btn = this;
    var original = btn.innerHTML;
    btn.innerHTML = '<span class="processing"></span> Procesando pago...';
    btn.disabled = true;
    setTimeout(function () {
      Portal.pay(createdUser.id, { number: num });
      btn.innerHTML = original;
      btn.disabled = false;
      goStep(4);
    }, 1600);
  });

  /* Entrar al portal tras el éxito */
  document.getElementById('goPortal').addEventListener('click', function () {
    Portal.login(createdUser.email, document.getElementById('rPass').value);
    location.href = 'paciente.html';
  });
})();
