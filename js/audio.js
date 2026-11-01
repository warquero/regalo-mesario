/* Música de fondo "Atado a tu amor" — reproduce desde el inicio.
   Los navegadores móviles bloquean el autoplay con sonido, así que:
   1) se intenta automáticamente al cargar,
   2) arranca en el primer toque/clic (el toque del corazón ❤️),
   3) no se corta al pasar a la otra página (reanuda posición),
   4) el estado de silencio persiste entre páginas. */
(function () {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  const KEY_POS = 'mesario-musica-pos';
  const KEY_MUTE = 'mesario-musica-mudo';

  // Silencio persistente entre páginas
  if (sessionStorage.getItem(KEY_MUTE) === '1') audio.muted = true;

  // Continuar donde quedó la canción al cambiar de página
  const guardada = parseFloat(sessionStorage.getItem(KEY_POS) || '0');
  function reanudar() {
    if (guardada > 0.5 && guardada < audio.duration - 0.5) {
      try { audio.currentTime = guardada; } catch (e) {}
    }
  }
  if (audio.readyState >= 1) {
    reanudar(); // la metadata ya estaba cargada (no esperar un evento que ya pasó)
  } else {
    audio.addEventListener('loadedmetadata', reanudar, { once: true });
  }

  function intentar() {
    try {
      const p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) {}
  }

  // 1) Intento inmediato (algunos navegadores lo permiten)
  intentar();

  // 2) Al primer gesto del usuario (política de autoplay en móviles)
  ['touchstart', 'click', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, intentar, true);
  });

  // Guardar posición para la otra página
  function guardar() {
    try { sessionStorage.setItem(KEY_POS, String(audio.currentTime)); } catch (e) {}
  }
  audio.addEventListener('timeupdate', function () {
    if (Math.floor(audio.currentTime) % 4 === 0) guardar();
  });
  window.addEventListener('pagehide', guardar);

  // Botón de silencio / sonido
  const btn = document.getElementById('btn-mute');
  if (btn) {
    const pintar = function () { btn.textContent = audio.muted ? '🔇' : '🔊'; };
    btn.addEventListener('click', function () {
      audio.muted = !audio.muted;
      try { sessionStorage.setItem(KEY_MUTE, audio.muted ? '1' : '0'); } catch (e) {}
      if (!audio.muted) intentar();
      pintar();
    });
    pintar();
  }
})();
