const STATE = {
  currentPhoto: 0,
  totalPhotos: 7,
  letterOpened: false,
  toastAnimated: false,
  saved: false
};

const carouselTrack = document.getElementById('carousel-track');
const dots = document.querySelectorAll('.dot');

const envelope = document.getElementById('envelope');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const letter = document.getElementById('letter');
const btnCloseLetter = document.getElementById('btn-close-letter');

const glassLeft = document.querySelector('.glass.left');
const glassRight = document.querySelector('.glass.right');
const clink = document.getElementById('clink-effect');

const rotatingMessage = document.getElementById('rotating-message');

const btnSave = document.getElementById('btn-save');
const saveConfirmation = document.getElementById('save-confirmation');

const messages = ['Hecho con amor', 'Por muchos mesarios juntos', 'Siempre tú y yo', 'Feliz mesario ❤️'];
let msgIndex = 0;

/* --- Carrusel con deslizamiento --- */
let touchStartX = 0;
let touchEndX = 0;

carouselTrack.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselTrack.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) < 40) return;

  if (diff > 0) {
    STATE.currentPhoto = (STATE.currentPhoto + 1) % STATE.totalPhotos;
  } else {
    STATE.currentPhoto = (STATE.currentPhoto - 1 + STATE.totalPhotos) % STATE.totalPhotos;
  }
  updateCarousel();
}

function updateCarousel() {
  carouselTrack.style.transform = `translateX(-${STATE.currentPhoto * (100 / STATE.totalPhotos)}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === STATE.currentPhoto));
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    STATE.currentPhoto = parseInt(dot.dataset.index, 10);
    updateCarousel();
  });
});

/* --- Sobre y carta --- */
envelope.addEventListener('click', () => {
  if (STATE.letterOpened) return;
  STATE.letterOpened = true; // bloquea toques dobles durante la animación
  envelope.classList.add('opened'); // el lacre se rompe y la solapa se abre
  setTimeout(() => {
    envelopeWrapper.classList.add('letter-open'); // el sobre se oculta
    letter.classList.add('visible'); // la carta se despliega y empuja el contenido
    letter.style.maxHeight = letter.scrollHeight + 'px';
    letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 650);
});

btnCloseLetter.addEventListener('click', () => {
  letter.style.maxHeight = '0px'; // la carta se pliega y el contenido vuelve a subir
  letter.classList.remove('visible');
  setTimeout(() => {
    envelopeWrapper.classList.remove('letter-open'); // el sobre vuelve a aparecer
    envelope.classList.remove('opened'); // la solapa se cierra y el lacre regresa
    STATE.letterOpened = false;
  }, 500);
});

/* --- Brindis y mensajes rotativos --- */
function animateToast() {
  // se añaden una sola vez y las animaciones CSS se repiten en bucle infinito
  glassLeft.classList.add('brindis-left');
  glassRight.classList.add('brindis-right');
  clink.classList.add('active');
}

// Animar brindis cuando el usuario haga scroll hasta la sección (nunca se detiene)
const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !STATE.toastAnimated) {
      animateToast();
      STATE.toastAnimated = true;
    }
  });
}, observerOptions);

const toastSection = document.querySelector('.toast-section');
if (toastSection) observer.observe(toastSection);

setInterval(() => {
  const rect = document.querySelector('.toast-section')?.getBoundingClientRect();
  const isVisible = rect && rect.top < window.innerHeight && rect.bottom >= 0;
  if (isVisible) {
    msgIndex = (msgIndex + 1) % messages.length;
    rotatingMessage.style.opacity = 0;
    setTimeout(() => {
      rotatingMessage.textContent = messages[msgIndex];
      rotatingMessage.style.opacity = 1;
    }, 400);
  }
}, 4000);

/* --- Guardar momento --- */
btnSave.addEventListener('click', () => {
  STATE.saved = true;
  localStorage.setItem('mesario_guardado', 'true');
  btnSave.classList.add('hidden');
  saveConfirmation.classList.remove('hidden');
});