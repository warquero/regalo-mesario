/* Registro del Service Worker (funciona solo en http/https o localhost) */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // Silenciar error al abrir por file:// (doble clic en el archivo)
    });
  });
}

const STATE = {
  heartTaps: 0
};

const heart = document.getElementById('heart');
const progressBar = document.getElementById('progress-bar');
const heartTapText = document.getElementById('heart-tap-text');
const heartComplete = document.getElementById('heart-complete');
const tapMessage = document.getElementById('tap-message');

// Mensajes que aparecen debajo de la barra en cada porcentaje de toque
const TAP_MESSAGES = {
  0: 'Toca el Corazón',
  17: 'Otra vez',
  33: 'Algo se está encendiendo',
  50: 'Sigue, que esto se calienta',
  67: 'Un poquito mas',
  83: 'No pares ahora'
};

heart.addEventListener('click', () => {
  if (STATE.heartTaps >= 6) return;
  STATE.heartTaps++;

  heart.classList.add('tapped');
  setTimeout(() => heart.classList.remove('tapped'), 300);

  const pct = Math.round((STATE.heartTaps / 6) * 100);
  progressBar.style.width = `${pct}%`;
  heartTapText.textContent = `${pct}%`;
  tapMessage.textContent = TAP_MESSAGES[pct] || '';

  if (STATE.heartTaps === 6) {
    heartComplete.classList.remove('hidden');

    // Pasar automáticamente a la segunda página al completar la carga
    setTimeout(() => {
      window.location.href = 'pagina2.html';
    }, 1200);
  }
});