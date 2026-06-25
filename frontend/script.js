const API_BASE = '/api';

// ---------- MENU ----------
async function loadMenu(category = '') {
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = '<p class="loading">Loading menu...</p>';
  try {
    const url = category ? `${API_BASE}/menu?category=${encodeURIComponent(category)}` : `${API_BASE}/menu`;
    const res = await fetch(url);
    const items = await res.json();

    if (!items.length) {
      menuList.innerHTML = '<p class="loading">No items found.</p>';
      return;
    }

    menuList.innerHTML = items.map(item => `
      <div class="menu-item">
        <span class="price">$${item.price.toFixed(2)}</span>
        <h3>${item.name}</h3>
        <p class="desc">${item.description || ''}</p>
        <span class="category-tag">${item.category}</span>
      </div>
    `).join('');
  } catch (err) {
    menuList.innerHTML = '<p class="loading">Could not load menu. Please try again later.</p>';
  }
}

document.querySelectorAll('.menu-filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadMenu(btn.dataset.category);
  });
});

loadMenu();

// ---------- RESERVATION ----------
const reservationForm = document.getElementById('reservation-form');
const reservationMessage = document.getElementById('reservation-message');

reservationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(reservationForm);
  const data = Object.fromEntries(formData.entries());
  data.guests = Number(data.guests);

  reservationMessage.textContent = 'Submitting...';
  reservationMessage.style.color = '#e8b13c';

  try {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (res.ok) {
      reservationMessage.textContent = result.message || 'Reservation submitted!';
      reservationMessage.style.color = '#4caf50';
      reservationForm.reset();
    } else {
      reservationMessage.textContent = result.error || 'Something went wrong.';
      reservationMessage.style.color = '#f44336';
    }
  } catch (err) {
    reservationMessage.textContent = 'Network error. Please try again.';
    reservationMessage.style.color = '#f44336';
  }
});

// ---------- CONTACT ----------
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  contactMessage.textContent = 'Sending...';
  contactMessage.style.color = '#e8b13c';

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (res.ok) {
      contactMessage.textContent = result.message || 'Message sent!';
      contactMessage.style.color = '#4caf50';
      contactForm.reset();
    } else {
      contactMessage.textContent = result.error || 'Something went wrong.';
      contactMessage.style.color = '#f44336';
    }
  } catch (err) {
    contactMessage.textContent = 'Network error. Please try again.';
    contactMessage.style.color = '#f44336';
  }
});
