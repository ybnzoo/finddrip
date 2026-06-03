// Category pills
document.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Upload zone click
const uploadZone = document.querySelector('.upload-zone');
if (uploadZone) {
  uploadZone.addEventListener('click', () => {
    uploadZone.style.borderColor = 'rgba(108,77,255,0.8)';
    uploadZone.style.background = 'rgba(108,77,255,0.1)';
    setTimeout(() => {
      uploadZone.style.borderColor = '';
      uploadZone.style.background = '';
    }, 300);
  });
}

// Toggle switch
document.querySelectorAll('.toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('toggle-on');
  });
});

// Fav remove button pulse
document.querySelectorAll('.fav-remove-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.fav-card');
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    card.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      card.style.display = 'none';
    }, 250);
  });
});

// Recent item hover press
document.querySelectorAll('.recent-item').forEach(item => {
  item.addEventListener('click', () => {
    item.style.background = 'rgba(108,77,255,0.12)';
    setTimeout(() => { item.style.background = ''; }, 200);
  });
});
