const envelopeContainer = document.getElementById('envelopeContainer');
const envelopeOverlay = document.getElementById('envelope-overlay');
const seal = document.getElementById('seal');

envelopeContainer.addEventListener('click', () => {
  if (envelopeContainer.classList.contains('open')) return;
  seal.classList.add('break');
  envelopeContainer.classList.add('open');
  setTimeout(() => envelopeOverlay.classList.add('opened'), 3000);
  document.body.style.overflow = 'auto';
});

// Countdown (Mis à jour au 4 septembre 2026 à 14:00:00)
const targetDate = new Date('2026-09-04T14:00:00');
function updateCountdown() {
  const now = new Date();
  let diff = Math.max(0, targetDate - now);
  document.getElementById('cd-days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ================= RSVP AVEC ENVOI DISCRET ET STYLE DU SITE =================
const rsvpForm = document.getElementById('rsvpForm');
const guestNameInput = document.getElementById('guestName');
const guestCountInput = document.getElementById('guestCount');
const rsvpBtn = document.getElementById('rsvpBtn');
const rsvpSub = document.getElementById('rsvpSub');

// Vérifier si l'invité a déjà confirmé
const savedName = localStorage.getItem('wedding_guest_name');
const savedCount = localStorage.getItem('wedding_guest_count');

if (savedName) {
  guestNameInput.value = savedName;
  guestNameInput.disabled = true; // Bloque le nom pour qu'il ne puisse pas le changer
  if (savedCount) {
    guestCountInput.value = savedCount;
  }
  rsvpBtn.textContent = 'Mettre à jour ma présence';
  rsvpSub.textContent = `Heureux de vous revoir, ${savedName} ! Vous pouvez modifier le nombre de personnes si besoin.`;
}

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le changement de page vers Web3Forms

  const name = guestNameInput.value.trim();
  const count = guestCountInput.value;

  if (name === '') {
    alert('Veuillez entrer votre nom et prénom.');
    guestNameInput.focus();
    return;
  }

  if (count <= 0 || count === '') {
    alert('Veuillez entrer un nombre valide de personnes.');
    guestCountInput.focus();
    return;
  }

  // Changement du texte du bouton pendant l'envoi
  rsvpBtn.textContent = 'Envoi en cours...';
  rsvpBtn.disabled = true;

  const formData = new FormData(rsvpForm);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      // Sauvegarde locale sur l'appareil
      localStorage.setItem('wedding_guest_name', name);
      localStorage.setItem('wedding_guest_count', count);

      // Verrouille le nom et met à jour l'interface avec le design du site
      guestNameInput.disabled = true;
      rsvpBtn.classList.add('confirmed');
      rsvpBtn.textContent = 'Présence confirmée ✓';
      rsvpSub.style.color = 'var(--pink-accent)';
      rsvpSub.style.fontWeight = '600';
      rsvpSub.textContent = `Merci ${name} ! Votre venue pour ${count} personne(s) a bien été enregistrée.`;
    } else {
      alert('Une erreur est survenue. Veuillez réessayer.');
      rsvpBtn.textContent = 'Confirmer ma présence';
      rsvpBtn.disabled = false;
    }
  } catch (error) {
    alert('Erreur de connexion. Vérifiez votre internet.');
    rsvpBtn.textContent = 'Confirmer ma présence';
    rsvpBtn.disabled = false;
  }
});

document.body.style.overflow = 'hidden';

// Ajout direct au calendrier (Google Calendar / Web)
document.getElementById('calLink').addEventListener('click', (e) => {
  e.preventDefault();

  // Informations de l'événement (Date : 4 septembre 2026 de 14:00 à 18:00)
  const title = encodeURIComponent("Mariage de Cherif & Sonia");
  const details = encodeURIComponent("Cérémonie et réception du mariage de Cherif & Sonia.");
  const location = encodeURIComponent("La Roche D'Or, Ath Mansour, M'Chedallah, Bouira");
  
  // Format des dates UTC (20260904T130000Z pour 14h heure locale en Algérie UTC+1)
  const startDate = "20260904T130000Z";
  const endDate = "20260904T170000Z";

  // Lien direct vers Google Calendar
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;

  // Ouvre le calendrier dans un nouvel onglet
  window.open(googleUrl, '_blank');
});