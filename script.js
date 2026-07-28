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

// RSVP Interactif avec envoi réel vers Web3Forms et affichage de la carte de remerciement
const rsvpForm = document.getElementById('rsvpForm');
const rsvpBtn = document.getElementById('rsvpBtn');
const rsvpSub = document.getElementById('rsvpSub');
const guestNameInput = document.getElementById('guestName');
const guestCountInput = document.getElementById('guestCount');
const thankYouCard = document.getElementById('thankYouCard');
const thankMsg = document.getElementById('thankMsg');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le rechargement classique de la page

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

  // Indication visuelle de chargement
  rsvpBtn.textContent = "Envoi en cours...";
  rsvpBtn.disabled = true;

  try {
    const formData = new FormData(rsvpForm);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      // Désactive les champs
      guestNameInput.disabled = true;
      guestCountInput.disabled = true;
      rsvpBtn.style.display = 'none';
      rsvpSub.style.display = 'none';

      // Personnalise et affiche la carte de remerciement
      thankMsg.innerHTML = `Merci infiniment <strong>${name}</strong> !<br>Votre venue pour <strong>${count} personne(s)</strong> est enregistrée avec joie.`;
      thankYouCard.style.display = 'block';
    } else {
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      rsvpBtn.textContent = "Confirmer ma présence";
      rsvpBtn.disabled = false;
    }
  } catch (error) {
    alert("Erreur de connexion. Vérifiez votre réseau.");
    rsvpBtn.textContent = "Confirmer ma présence";
    rsvpBtn.disabled = false;
  }
});

// Ajout direct au calendrier (Google Calendar / Web)
document.getElementById('calLink').addEventListener('click', (e) => {
  e.preventDefault();

  const title = encodeURIComponent("Mariage de Cherif & Sonia");
  const details = encodeURIComponent("Cérémonie et réception du mariage de Cherif & Sonia.");
  const location = encodeURIComponent("La Roche D'Or, Ath Mansour, M'Chedallah, Bouira");
  
  const startDate = "20260904T130000Z";
  const endDate = "20260904T170000Z";

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;

  window.open(googleUrl, '_blank');
});

document.body.style.overflow = 'hidden';