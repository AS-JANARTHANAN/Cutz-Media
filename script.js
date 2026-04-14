/* ═══════════════════════════════════════════════════════════════
   CUT X MEDIA v2.0 — SHARED JAVASCRIPT
   Works across: work.html + pricing.html
═══════════════════════════════════════════════════════════════ */

// ── THEME INITIALIZATION ──
(function initTheme() {
  const savedTheme = localStorage.getItem('cutx-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }
})();

// ── DATA ──
const categories = [
  { id:"personal-branding", label:"Personal Branding", videos:[
    {title:"Level 1 — Broll + Text",     price:1800, duration:"30–60s", badge:"Personal", src:"images/personal/1.mp4"},
    {title:"Level 2 — Motion + Captions",price:2500, duration:"30–60s", badge:"Personal", src:"images/personal/2.mp4"},
    {title:"Level 3 — Full Grade",       price:3500, duration:"60–90s", badge:"Personal", src:"images/personal/3.mp4"}
  ]},
  { id:"business-reel", label:"Business Reels", videos:[
    {title:"Style 1", price:900, duration:"15–30s", badge:"Business", src:"images/business/1.mp4"},
    {title:"Style 2", price:900, duration:"15–30s", badge:"Business", src:"images/business/2.mp4"},
    {title:"Style 3", price:900, duration:"15–30s", badge:"Business", src:"images/business/3.mp4"}
  ]},
  { id:"motion-graphics", label:"Motion Graphics", videos:[
    {title:"Store Advertisement",       price:6000,  duration:"max 10s",badge:"Motion", src:"images/motion/1.mp4"},
    {title:"Show Title Intro",          price:10000, duration:"10–15s", badge:"Motion", src:"images/motion/2.mp4"},
    {title:"Episode Title",             price:10000, duration:"5–10s",  badge:"Motion", src:"images/motion/3.mp4"},
    {title:"Movie Title + End Credits", price:8000,  duration:"15–30s", badge:"Motion", src:"images/motion/1.mp4"}
  ]},
  { id:"ai-videos", label:"AI Videos", videos:[
    {title:"Offer Advertisement", price:6000, duration:"15–30s", badge:"AI Video", src:"images/ai/1.mp4"},
    {title:"Storytelling Reel",   price:6000, duration:"30–60s", badge:"AI Video", src:"images/ai/2.mp4"}
  ]}
];

const fmt = n => '₹' + n.toLocaleString('en-IN');

// ── STATE ──
let selectedCatIdx = 0;
let selectedVarIdx = 0;
let videoCount = 5;
let addons = { fast: false, thumb: false };

// Restore selection from work page if applicable
const storedCat = sessionStorage.getItem('quoteCatIdx');
const storedVar = sessionStorage.getItem('quoteVarIdx');
if (storedCat !== null) {
  selectedCatIdx = parseInt(storedCat) || 0;
  selectedVarIdx = parseInt(storedVar) || 0;
  sessionStorage.removeItem('quoteCatIdx');
  sessionStorage.removeItem('quoteVarIdx');
}

/* ═══════════════════════════════════════════
   WORK PAGE — Category rows & Video modal
═══════════════════════════════════════════ */

function buildCategoryRows() {
  const container = document.getElementById('categoryRows');
  if (!container) return;
  container.innerHTML = '';
  categories.forEach(cat => {
    const row = document.createElement('div');
    row.className = 'category-row';
    row.dataset.cat = cat.id;
    row.innerHTML = `
      <div class="cat-row-header">
        <h3>${cat.label}</h3>
        <span onclick="location.href='pricing.html'">Customize →</span>
      </div>
      <div class="video-scroll">
        ${cat.videos.map((v, i) => `
          <div class="video-card" onclick="openModal('${cat.id}',${i})">
            <div class="card-thumb" style="position:relative; overflow:hidden;">
              <video src="${v.src}" autoplay loop muted playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;"></video>
              <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(10,10,8,0.9) 0%, rgba(10,10,8,0) 80%);z-index:1;pointer-events:none;"></div>
              
              <div style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:space-between;">
                <span class="card-badge">${v.badge}</span>
                <div class="card-play"></div>
                <div class="card-info" style="margin-top:auto;">
                  <h4>${v.title}</h4>
                  <div class="card-price">${fmt(v.price)} / video</div>
                  <div class="card-dur">${v.duration}</div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
    container.appendChild(row);
  });
}
buildCategoryRows();

// ── CATEGORY FILTER ──
const categoryTabsEl = document.getElementById('categoryTabs');
if (categoryTabsEl) {
  categoryTabsEl.addEventListener('click', e => {
    const tab = e.target.closest('.cat-tab');
    if (!tab) return;
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.category-row').forEach(r => {
      r.classList.toggle('hidden', cat !== 'all' && r.dataset.cat !== cat);
    });
  });
}

// ── VIDEO MODAL ──
let currentModalCat = null, currentModalIdx = 0;

function openModal(catId, idx) {
  const cat = categories.find(c => c.id === catId);
  if (!cat) return;
  const v = cat.videos[idx];
  currentModalCat = catId;
  currentModalIdx = idx;
  document.getElementById('modalTitle').textContent = v.title;
  document.getElementById('modalPrice').textContent = fmt(v.price) + ' / video';
  document.getElementById('modalDur').textContent = v.duration;
  
  const video = document.getElementById('modalVideo');
  const muteBtn = document.getElementById('modalMuteBtn');
  if (video && v.src) {
    video.src = v.src;
    video.muted = false; // default to sound on when modal opens
    
    if (muteBtn) {
      const muteIcon = muteBtn.querySelector('.icon-mute');
      const unmuteIcon = muteBtn.querySelector('.icon-unmute');
      if (muteIcon && unmuteIcon) {
        muteIcon.style.display = 'none';
        unmuteIcon.style.display = 'block';
      }
    }
    
    video.play().catch(e => console.log('Autoplay issue:', e));
  }

  document.getElementById('videoModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

const modalCloseEl = document.getElementById('modalClose');
if (modalCloseEl) modalCloseEl.addEventListener('click', closeModal);

const videoModalEl = document.getElementById('videoModal');
if (videoModalEl) {
  videoModalEl.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
}

const modalMuteBtn = document.getElementById('modalMuteBtn');
if (modalMuteBtn) {
  modalMuteBtn.addEventListener('click', e => {
    e.stopPropagation();
    const video = document.getElementById('modalVideo');
    if (video) {
      video.muted = !video.muted;
      const muteIcon = modalMuteBtn.querySelector('.icon-mute');
      const unmuteIcon = modalMuteBtn.querySelector('.icon-unmute');
      if (muteIcon && unmuteIcon) {
        muteIcon.style.display = video.muted ? 'block' : 'none';
        unmuteIcon.style.display = video.muted ? 'none' : 'block';
      }
    }
  });
}

function closeModal() {
  const m = document.getElementById('videoModal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
  
  const video = document.getElementById('modalVideo');
  if (video) {
    video.pause();
    video.src = '';
  }
}

const modalAddQuoteEl = document.getElementById('modalAddQuote');
if (modalAddQuoteEl) {
  modalAddQuoteEl.addEventListener('click', () => {
    const catIdx = categories.findIndex(c => c.id === currentModalCat);
    if (catIdx >= 0) {
      sessionStorage.setItem('quoteCatIdx', catIdx);
      sessionStorage.setItem('quoteVarIdx', currentModalIdx);
      closeModal();
      location.href = 'pricing.html';
    }
  });
}

/* ═══════════════════════════════════════════
   PRICING PAGE — Quote Calculator
═══════════════════════════════════════════ */

function buildStyleTags() {
  const container = document.getElementById('styleTags');
  if (!container) return;
  container.innerHTML = '';
  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'style-tag' + (i === selectedCatIdx ? ' active' : '');
    btn.textContent = cat.label;
    btn.onclick = () => { selectedCatIdx = i; selectedVarIdx = 0; updatePricingUI(); };
    container.appendChild(btn);
  });
}
buildStyleTags();

function updatePricingUI() {
  if (!document.getElementById('styleTags')) return;
  const cat = categories[selectedCatIdx];
  document.querySelectorAll('.style-tag').forEach((t, i) =>
    t.classList.toggle('active', i === selectedCatIdx)
  );
  document.getElementById('previewTitle').textContent = cat.label;
  document.getElementById('previewPrice').textContent = fmt(cat.videos[selectedVarIdx].price) + ' / video';
  
  const pVideo = document.getElementById('previewVideo');
  if (pVideo && cat.videos[selectedVarIdx].src) {
    pVideo.src = cat.videos[selectedVarIdx].src;
    pVideo.play().catch(e => console.log('Preview loop block:', e));
  }
  
  const vl = document.getElementById('variationList');
  if (!vl) return;
  vl.innerHTML = '';
  cat.videos.forEach((v, i) => {
    const div = document.createElement('div');
    div.className = 'variation-item' + (i === selectedVarIdx ? ' active' : '');
    div.innerHTML = `<div class="radio"></div><span class="var-name">${v.title}</span><span class="var-price">${fmt(v.price)}</span>`;
    div.onclick = () => { selectedVarIdx = i; updatePricingUI(); };
    vl.appendChild(div);
  });
  updateTotal();
}
updatePricingUI();

// ── SLIDER ──
const sliderEl = document.getElementById('videoSlider');
const sliderValEl = document.getElementById('sliderVal');
if (sliderEl && sliderValEl) {
  sliderEl.addEventListener('input', () => {
    videoCount = parseInt(sliderEl.value);
    sliderValEl.textContent = videoCount;
    updateTotal();
  });
}

// ── ADD-ONS ──
function toggleAddon(type) {
  addons[type] = !addons[type];
  const el = document.getElementById(type === 'fast' ? 'addonFast' : 'addonThumb');
  if (el) el.classList.toggle('active', addons[type]);
  updateTotal();
}

// ── UPDATE TOTAL ──
function updateTotal() {
  const stickyTotalEl = document.getElementById('stickyTotal');
  if (!stickyTotalEl) return;
  const base = categories[selectedCatIdx].videos[selectedVarIdx].price;
  const addonPer = (addons.fast ? 500 : 0) + (addons.thumb ? 400 : 0);
  const total = (base + addonPer) * videoCount;
  stickyTotalEl.textContent = fmt(total);
  const at = document.getElementById('addonTotal');
  if (at) {
    at.textContent = addonPer > 0
      ? `Add-ons: ${fmt(addonPer * videoCount)} (${fmt(addonPer)} × ${videoCount} videos)`
      : '';
  }
}

// ── WHATSAPP QUOTE ──
function sendWhatsApp() {
  const name = document.getElementById('userName').value.trim();
  const phone = document.getElementById('userPhone').value.replace(/\D/g, '');
  const errEl = document.getElementById('formError');
  const btn = document.getElementById('btnWhatsapp');
  if (!name || phone.length < 10) {
    errEl.classList.add('show');
    btn.classList.remove('shake');
    void btn.offsetWidth;
    btn.classList.add('shake');
    return;
  }
  errEl.classList.remove('show');
  const cat = categories[selectedCatIdx];
  const v = cat.videos[selectedVarIdx];
  const addonPer = (addons.fast ? 500 : 0) + (addons.thumb ? 400 : 0);
  const total = (v.price + addonPer) * videoCount;
  const ref = (document.getElementById('refLink') || {}).value?.trim() || '';
  const req = (document.getElementById('reqText') || {}).value?.trim() || '';
  let msg = `🎬 *CUT X MEDIA — Custom Quote Request*\n\n`;
  msg += `👤 Name: ${name}\n📱 WhatsApp: ${document.getElementById('userPhone').value.trim()}\n\n`;
  msg += `📂 Category: ${cat.label}\n🎞 Variation: ${v.title}\n💰 Base: ${fmt(v.price)} / video\n📊 Videos/month: ${videoCount}\n`;
  if (addons.fast) msg += `⚡ Fast Delivery: +₹500/video\n`;
  if (addons.thumb) msg += `🖼 Thumbnails: +₹400/video\n`;
  msg += `\n💵 *Estimated Total: ${fmt(total)}*\n`;
  if (ref) msg += `\n🔗 Reference: ${ref}`;
  if (req) msg += `\n📝 Requirements: ${req}`;
  window.open('https://wa.me/919843516221?text=' + encodeURIComponent(msg), '_blank');
}

/* ═══════════════════════════════════════════
   HOME PAGE — Before / After Tabs
═══════════════════════════════════════════ */
const baTabsEl = document.getElementById('baTabs');
if (baTabsEl) {
  baTabsEl.addEventListener('click', e => {
    const tab = e.target.closest('.ba-tab');
    if (!tab) return;
    
    // Update active tab button
    document.querySelectorAll('.ba-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show corresponding panel, hide others
    document.querySelectorAll('.ba-panel').forEach(p => p.classList.add('hidden'));
    const targetPanel = document.getElementById('baPanel-' + tab.dataset.panel);
    if (targetPanel) targetPanel.classList.remove('hidden');
  });
}

/* ═══════════════════════════════════════════
   SHARED — Scroll Reveal
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   HOME PAGE — Stat Count-Up
═══════════════════════════════════════════ */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();
      function tick(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if(t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    statObserver.unobserve(entry.target);
  });
}, {threshold: 0.3});

document.addEventListener('DOMContentLoaded', () => {
  const statsGrid = document.getElementById('statsGrid');
  if(statsGrid) statObserver.observe(statsGrid);
});

/* ═══════════════════════════════════════════
   CONTACT PAGE — WhatsApp Output
═══════════════════════════════════════════ */
function sendContactWhatsApp() {
  const name = document.getElementById('contactName')?.value.trim();
  const phone = document.getElementById('contactPhone')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const project = document.getElementById('contactProject')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();
  if(!name || !phone) { alert('Please fill in your name and WhatsApp number.'); return; }
  let msg = `🎬 *CUT X MEDIA — Project Enquiry*\n\n`;
  msg += `👤 Name: ${name}\n📱 Phone: ${phone}\n`;
  if(email) msg += `✉ Email: ${email}\n`;
  if(project) msg += `📂 Project: ${project}\n`;
  if(message) msg += `\n📝 Message: ${message}`;
  window.open('https://wa.me/919843516221?text=' + encodeURIComponent(msg), '_blank');
}

/* ═══════════════════════════════════════════
   MOBILE SWIPE DECK — JioHotstar Style
═══════════════════════════════════════════ */
function initMobileSwipeDecks() {
  const isMobile = window.innerWidth < 768;
  const targetSelectors = ['.feature-grid', '.pricing-cards', '.process-steps', '.contact-details'];
  
  targetSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(deck => {
      // ── DESKTOP CLEANUP ──
      if (!isMobile) {
        if (deck._swipeInit) {
          if (deck._dotsContainer) deck._dotsContainer.remove();
          deck.style = '';
          deck.classList.remove('swipe-deck');
          Array.from(deck.children).forEach(c => {
            // Only remove swipe-specific styles to avoid nuking base card layout
            c.style.position = '';
            c.style.transform = '';
            c.style.top = '';
            c.style.left = '';
            c.style.width = '';
            c.style.height = '';
            c.style.zIndex = '';
            c.style.opacity = '';
            c.classList.remove('no-transition', 'swipe-card');
          });
          // Replace to clear touch listeners safely
          const newDeck = deck.cloneNode(true);
          deck.parentNode.replaceChild(newDeck, deck);
        }
        return;
      }

      // ── MOBILE INIT ──
      if (deck._swipeInit) return;
      deck._swipeInit = true;

      deck.classList.add('swipe-deck');
      const cards = Array.from(deck.children).filter(c => !c.classList.contains('swipe-dots') && !c.classList.contains('contact-bg-overlay'));
      if (cards.length === 0) return;

      // Temporarily clear inline styles to measure true height
      let maxH = 0;
      cards.forEach(c => {
         c.classList.add('swipe-card');
         c.style.position = 'relative';
         c.style.transform = 'none';
         const h = c.offsetHeight;
         if (h > maxH) maxH = h;
      });
      deck.style.minHeight = (maxH + 40) + 'px';
      
      // Inject Dots
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'swipe-dots';
      let dots = [];
      cards.forEach(() => {
         const d = document.createElement('button');
         d.className = 'swipe-dot';
         dotsContainer.appendChild(d);
         dots.push(d);
      });
      deck.parentNode.insertBefore(dotsContainer, deck.nextSibling);
      deck._dotsContainer = dotsContainer;

      // Deck State
      let total = cards.length;
      let current = 0, startX = 0, startY = 0, dragX = 0;
      let isDragging = false, isHoriz = null, SNAP = 60;

      function layout(animated) {
        for (let i = 0; i < total; i++) {
          let c = cards[i];
          let diff = ((i - current) % total + total) % total;

          if (animated) c.classList.remove('no-transition');
          else c.classList.add('no-transition');

          c.style.position = 'absolute';
          c.style.top = '0'; c.style.left = '0'; c.style.width = '100%';

          if (diff === 0) {
            c.style.transform = 'translateX(0) translateY(0) scale(1)';
            c.style.opacity = '1';
            c.style.zIndex = '10';
            c.style.pointerEvents = 'auto';
          } else if (diff === 1) {
            c.style.transform = 'translateX(20px) translateY(10px) scale(0.95)';
            c.style.opacity = '1';
            c.style.zIndex = '9';
            c.style.pointerEvents = 'none';
          } else if (diff === 2) {
            c.style.transform = 'translateX(40px) translateY(20px) scale(0.90)';
            c.style.opacity = '0.7';
            c.style.zIndex = '8';
            c.style.pointerEvents = 'none';
          } else {
            c.style.transform = 'translateX(60px) translateY(30px) scale(0.85)';
            c.style.opacity = '0';
            c.style.zIndex = '0';
            c.style.pointerEvents = 'none';
          }
        }
        dots.forEach((d, i) => { d.classList.toggle('active', i === current); });
      }

      function dragFront(dx) {
        let c = cards[current];
        c.classList.add('no-transition');
        c.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx * 0.04) + 'deg) scale(1)';
        let progress = Math.min(Math.abs(dx) / 200, 1);
        
        let nextIdx = (current + 1) % total;
        let next = cards[nextIdx];
        next.classList.add('no-transition');
        next.style.transform = 'translateX(' + (20 - 20 * progress) + 'px) translateY(' + (10 - 10 * progress) + 'px) scale(' + (0.95 + 0.05 * progress) + ')';
        
        if (total > 2) {
          let next2 = cards[(current + 2) % total];
          next2.classList.add('no-transition');
          next2.style.transform = 'translateX(' + (40 - 20 * progress) + 'px) translateY(' + (20 - 10 * progress) + 'px) scale(' + (0.90 + 0.05 * progress) + ')';
          next2.style.opacity = '' + (0.7 + 0.3 * progress);
        }
      }

      function goTo(idx) {
        current = ((idx % total) + total) % total;
        layout(true);
      }

      deck.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX; startY = e.touches[0].clientY;
        isDragging = true; isHoriz = null; dragX = 0;
      }, { passive: true });

      deck.addEventListener('touchmove', e => {
        if (!isDragging) return;
        let dx = e.touches[0].clientX - startX;
        let dy = e.touches[0].clientY - startY;
        if (isHoriz === null) isHoriz = Math.abs(dx) > Math.abs(dy);
        if (!isHoriz) { isDragging = false; layout(true); return; }
        e.preventDefault(); dragX = dx; dragFront(dragX);
      }, { passive: false });

      deck.addEventListener('touchend', () => {
        if (!isDragging) return; isDragging = false;
        if (Math.abs(dragX) > SNAP) { dragX < 0 ? goTo(current + 1) : goTo(current - 1); }
        else layout(true);
        dragX = 0;
      });

      deck.addEventListener('touchcancel', () => { isDragging = false; layout(true); dragX = 0; });

      // Build out Layout
      layout(false);
    });
  });
}

// Ensure the decks trigger on load or resize perfectly
window.addEventListener('resize', () => {
  clearTimeout(window._swipeResize);
  window._swipeResize = setTimeout(initMobileSwipeDecks, 200);
});
document.addEventListener('DOMContentLoaded', initMobileSwipeDecks);

/* ═══════════════════════════════════════════
   THEME TOGGLE LOGIC
═══════════════════════════════════════════ */
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-theme');
  localStorage.setItem('cutx-theme', isLight ? 'light' : 'dark');
}
