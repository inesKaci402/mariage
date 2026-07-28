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

// RSVP Interactif avec affichage de la carte de remerciement
const rsvpBtn = document.getElementById('rsvpBtn');
const rsvpSub = document.getElementById('rsvpSub');
const guestNameInput = document.getElementById('guestName');
const guestCountInput = document.getElementById('guestCount');
const thankYouCard = document.getElementById('thankYouCard');
const thankMsg = document.getElementById('thankMsg');

rsvpBtn.addEventListener('click', (e) => {
  e.preventDefault(); // Empêche le rechargement de la page si le bouton est de type submit

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

  // Désactive les champs et le bouton
  guestNameInput.disabled = true;
  guestCountInput.disabled = true;
  rsvpBtn.style.display = 'none'; // Cache le bouton de confirmation
  rsvpSub.style.display = 'none'; // Cache l'ancien texte de statut

  // Personnalise et affiche la carte de remerciement
  thankMsg.innerHTML = `Merci infiniment <strong>${name}</strong> !<br>Votre venue pour <strong>${count} personne(s)</strong> est enregistrée avec joie.`;
  thankYouCard.style.display = 'block';
});
// ICS Generator (Mis à jour au 04 septembre 2026 de 14h00 à 18h00)
document.getElementById('calLink').addEventListener('click', (e) => {
  e.preventDefault();
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'SUMMARY:Mariage de Cherif et Sonia',
    'DTSTART:20260904T140000Z',
    'DTEND:20260904T180000Z',
    'LOCATION:La Roche DOr, Ath Mansour, MChedallah, Bouira',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mariage-cherif-sonia.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
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