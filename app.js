// ─────────────────────────────────────────────────────────────
// Print Vatika — Client App Engine (Fixed & Complete)
// ─────────────────────────────────────────────────────────────

// ── LOADING SCREEN ────────────────────────────────────────────
(function initLoader() {
  const bar = document.getElementById('loader-bar');
  const loader = document.getElementById('loader');
  if (!bar || !loader) return;

  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct >= 90) { pct = 90; clearInterval(tick); }
    bar.style.width = pct + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(tick);
    bar.style.width = '100%';
    setTimeout(() => loader.classList.add('hidden'), 380);
  });
})();

// ── PRODUCTS ──────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'p1', slug: 'business-cards', name: 'Business Cards',
    category: 'stationery',
    desc: 'Single or double-sided on heavyweight cardstock. Matte, gloss, or velvet lamination available.',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&auto=format&fit=crop&q=80',
    basePrice: 299, baseUnit: '/ 100 pcs',
    options: [
      { key: 'size', label: 'Size', type: 'select', choices: [
        { val: 'standard', label: '3.5″ × 2.0″ Standard', mod: 0 },
        { val: 'square',   label: '2.0″ × 2.0″ Square',   mod: 30 },
        { val: 'slim',     label: '3.5″ × 1.75″ Slim',    mod: 20 },
      ]},
      { key: 'sides', label: 'Print Sides', type: 'select', choices: [
        { val: 'single', label: 'Single-sided', mod: 0   },
        { val: 'double', label: 'Double-sided', mod: 100 },
      ]},
      { key: 'paper', label: 'Paper Stock', type: 'select', choices: [
        { val: '300gsm', label: '300 GSM Art Card',         mod: 0   },
        { val: '350gsm', label: '350 GSM Premium Card',     mod: 80  },
        { val: '400gsm', label: '400 GSM Ultra Heavy',      mod: 150 },
      ]},
      { key: 'finish', label: 'Lamination', type: 'select', choices: [
        { val: 'none',   label: 'No Lamination',    mod: 0   },
        { val: 'matte',  label: 'Matte Lamination', mod: 80  },
        { val: 'gloss',  label: 'Gloss Lamination', mod: 80  },
        { val: 'velvet', label: 'Velvet Soft Touch', mod: 200 },
      ]},
    ],
    quantities: [100, 250, 500, 1000],
    qtyDiscounts: { 250: 0.92, 500: 0.82, 1000: 0.72 },
    defaultQty: 250,
  },
  {
    id: 'p2', slug: 't-shirts', name: 'Custom T-Shirts',
    category: 'apparel',
    desc: 'Cotton t-shirts with front, back, or double-sided printing. Multiple colours and sizes.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    basePrice: 249, baseUnit: '/ piece',
    options: [
      { key: 'color', label: 'T-Shirt Colour', type: 'select', choices: [
        { val: 'white', label: 'Pure White',    mod: 0  },
        { val: 'black', label: 'Classic Black', mod: 50 },
        { val: 'navy',  label: 'Navy Blue',     mod: 50 },
        { val: 'grey',  label: 'Sports Grey',   mod: 30 },
      ]},
      { key: 'size', label: 'T-Shirt Size', type: 'select', choices: [
        { val: 'S',   label: 'Small (S)',         mod: 0  },
        { val: 'M',   label: 'Medium (M)',         mod: 0  },
        { val: 'L',   label: 'Large (L)',          mod: 0  },
        { val: 'XL',  label: 'Extra Large (XL)',   mod: 20 },
        { val: 'XXL', label: 'Double Extra (XXL)', mod: 40 },
      ]},
      { key: 'position', label: 'Print Position', type: 'select', choices: [
        { val: 'front', label: 'Front Only',   mod: 0   },
        { val: 'back',  label: 'Back Only',    mod: 10  },
        { val: 'both',  label: 'Front + Back', mod: 100 },
      ]},
    ],
    quantities: [1, 5, 10, 25, 50, 100],
    qtyDiscounts: { 25: 0.95, 50: 0.88, 100: 0.80 },
    defaultQty: 10,
  },
  {
    id: 'p3', slug: 'flex-banners', name: 'Flex Banners',
    category: 'signage',
    desc: 'Indoor/outdoor weatherproof flex banners. Enter dimensions, choose material and finishing.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80',
    basePrice: 15, baseUnit: '/ sq.ft',
    options: [
      { key: 'dimensions', label: 'Banner Size (Feet)', type: 'dimensions' },
      { key: 'material', label: 'Flex Material', type: 'select', choices: [
        { val: 'standard', label: 'Standard Star Flex',    mod: 0  },
        { val: 'heavy',    label: 'Black Back Heavy Flex', mod: 8  },
        { val: 'vinyl',    label: 'Eco-Solvent Vinyl',     mod: 20 },
      ]},
      { key: 'finishing', label: 'Edge Finishing', type: 'select', choices: [
        { val: 'none',    label: 'Cut to Size (No grommets)', mod: 0  },
        { val: 'corners', label: 'Eyelets on 4 Corners',      mod: 20 },
        { val: 'border',  label: 'Eyelets Every 2 Ft',        mod: 50 },
      ]},
    ],
    quantities: [1, 2, 5, 10],
    qtyDiscounts: {},
    defaultQty: 1,
  },
  {
    id: 'p4', slug: 'flyers', name: 'Flyers & Pamphlets',
    category: 'marketing',
    desc: 'Vibrant promotional flyers on glossy or matte art paper. A4, A5, or DL sizes.',
    image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&auto=format&fit=crop&q=80',
    basePrice: 199, baseUnit: '/ 500 pcs',
    options: [
      { key: 'size', label: 'Flyer Size', type: 'select', choices: [
        { val: 'a4', label: 'A4 — Full Page',   mod: 0   },
        { val: 'a5', label: 'A5 — Half Page',   mod: -80 },
        { val: 'dl', label: 'DL — Long Strip',  mod: -60 },
      ]},
      { key: 'sides', label: 'Print Sides', type: 'select', choices: [
        { val: 'single', label: 'Single-sided', mod: 0   },
        { val: 'double', label: 'Double-sided', mod: 120 },
      ]},
      { key: 'paper', label: 'Paper Type', type: 'select', choices: [
        { val: '130gsm', label: '130 GSM Gloss Art',    mod: 0  },
        { val: '170gsm', label: '170 GSM Heavy Gloss',  mod: 60 },
        { val: 'matte',  label: '150 GSM Matte Art',    mod: 40 },
      ]},
    ],
    quantities: [100, 500, 1000, 5000],
    qtyDiscounts: { 1000: 0.88, 5000: 0.72 },
    defaultQty: 500,
  },
  {
    id: 'p5', slug: 'posters', name: 'Posters',
    category: 'marketing',
    desc: 'Large-format HD wall posters for events, decor, or promotions. Multiple sizes.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80',
    basePrice: 49, baseUnit: '/ piece',
    options: [
      { key: 'size', label: 'Poster Size', type: 'select', choices: [
        { val: 'a3', label: 'A3 — 29.7 × 42 cm',  mod: 0   },
        { val: 'a2', label: 'A2 — 42 × 59.4 cm',  mod: 60  },
        { val: 'a1', label: 'A1 — 59.4 × 84 cm',  mod: 150 },
        { val: 'a0', label: 'A0 — 84 × 119 cm',   mod: 320 },
      ]},
      { key: 'paper', label: 'Paper Stock', type: 'select', choices: [
        { val: 'gloss', label: '200 GSM Gloss', mod: 0  },
        { val: 'matte', label: '200 GSM Matte', mod: 20 },
        { val: 'satin', label: '250 GSM Satin', mod: 40 },
      ]},
    ],
    quantities: [1, 5, 10, 50],
    qtyDiscounts: { 10: 0.90, 50: 0.78 },
    defaultQty: 5,
  },
  {
    id: 'p6', slug: 'brochures', name: 'Brochures',
    category: 'marketing',
    desc: 'Bi-fold or tri-fold brochures on premium glossy card. Great for menus, product sheets.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    basePrice: 8, baseUnit: '/ piece',
    options: [
      { key: 'fold', label: 'Fold Style', type: 'select', choices: [
        { val: 'bifold',  label: 'Bi-fold (4 panels)',  mod: 0 },
        { val: 'trifold', label: 'Tri-fold (6 panels)', mod: 2 },
        { val: 'zfold',   label: 'Z-fold (6 panels)',   mod: 2 },
      ]},
      { key: 'paper', label: 'Paper Stock', type: 'select', choices: [
        { val: '130gsm', label: '130 GSM Gloss',         mod: 0 },
        { val: '170gsm', label: '170 GSM Premium Gloss', mod: 3 },
        { val: '300gsm', label: '300 GSM Card (menus)',  mod: 8 },
      ]},
    ],
    quantities: [50, 100, 500, 1000],
    qtyDiscounts: { 500: 0.85, 1000: 0.75 },
    defaultQty: 100,
  },
  {
    id: 'p7', slug: 'stickers', name: 'Stickers & Labels',
    category: 'stationery',
    desc: 'Die-cut custom stickers on gloss, matte, or waterproof vinyl material.',
    image: 'https://images.unsplash.com/photo-1572375995501-4b0894dbe0d7?w=600&auto=format&fit=crop&q=80',
    basePrice: 199, baseUnit: '/ 100 pcs',
    options: [
      { key: 'shape', label: 'Sticker Shape', type: 'select', choices: [
        { val: 'circle',    label: 'Circle',          mod: 0  },
        { val: 'square',    label: 'Square',          mod: 0  },
        { val: 'rectangle', label: 'Rectangle',       mod: 0  },
        { val: 'custom',    label: 'Custom Die-Cut',  mod: 80 },
      ]},
      { key: 'material', label: 'Material', type: 'select', choices: [
        { val: 'paper',       label: 'Gloss Paper',           mod: 0   },
        { val: 'vinyl',       label: 'Waterproof White Vinyl', mod: 100 },
        { val: 'transparent', label: 'Transparent Vinyl',     mod: 120 },
      ]},
      { key: 'size', label: 'Sticker Size', type: 'select', choices: [
        { val: '2x2', label: '2″ × 2″', mod: 0   },
        { val: '3x3', label: '3″ × 3″', mod: 80  },
        { val: '4x4', label: '4″ × 4″', mod: 180 },
      ]},
    ],
    quantities: [50, 100, 250, 500, 1000],
    qtyDiscounts: { 250: 0.90, 500: 0.82, 1000: 0.72 },
    defaultQty: 100,
  },
  {
    id: 'p8', slug: 'custom-print', name: 'Custom Printing',
    category: 'specialty',
    desc: 'Have something unusual? Describe your requirements and we\'ll call you with a quote.',
    image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600&auto=format&fit=crop&q=80',
    basePrice: 0, baseUnit: '/ custom quote',
    options: [
      { key: 'description', label: 'Describe your requirement', type: 'textarea' },
    ],
    quantities: [1],
    qtyDiscounts: {},
    defaultQty: 1,
  },
];

// ── LOCAL DB ──────────────────────────────────────────────────
const DB = {
  _key: 'pv_orders',
  init()        { if (!localStorage.getItem(this._key)) localStorage.setItem(this._key, '[]'); },
  getAll()      { try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch { return []; } },
  save(order)   { const all = this.getAll(); all.unshift(order); localStorage.setItem(this._key, JSON.stringify(all)); },
  find(id, phone) {
    const cleanId    = (id || '').replace(/\s/g, '').toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    return this.getAll().find(o => {
      const oid = (o.id || '').replace(/\s/g, '').toLowerCase();
      const oph = (o.phone || '').replace(/\D/g, '').slice(-10);
      return (oid === cleanId || oid.includes(cleanId)) && oph === cleanPhone;
    });
  },
  updateStatus(id, status, note) {
    const all = this.getAll();
    const idx = all.findIndex(o => o.id === id);
    if (idx === -1) return null;
    all[idx].status    = status;
    all[idx].updatedAt = new Date().toISOString();
    all[idx].history.push({ status, note: note || '', at: new Date().toISOString() });
    localStorage.setItem(this._key, JSON.stringify(all));
    return all[idx];
  },
};
DB.init();

// ── APP STATE ─────────────────────────────────────────────────
let cart            = [];
let currentProduct  = null;
let selectedOptions = {};
let selectedQty     = 100;
let selectedDims    = { w: 4, h: 3 };
let uploadedFile    = null;   // { name, size }
let imageObj        = null;   // HTMLImageElement
let imageDataURL    = null;   // base64 string for cart preview
let designPos       = { x: 0, y: 0, scale: 0.5, rot: 0 };
let isDragging      = false;
let dragStart       = { x: 0, y: 0 };
let fulfillmentMode = 'pickup';
let warnAck         = false;
let canvasListened  = false;  // prevent duplicate canvas listeners

// ── PAGE ROUTER ───────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'catalog') renderCatalog();
  if (id === 'cart')    renderCart();
}

// ── CATALOG ───────────────────────────────────────────────────
let activeFilter = 'all';

function filterCatalog(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog();
}

function renderCatalog() {
  const grid = document.getElementById('catalog-products-grid');
  if (!grid) return;
  const list = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
  grid.innerHTML = list.map(productCardHTML).join('');
}

function renderHomeProducts() {
  const grid = document.getElementById('home-products-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.slice(0, 4).map(productCardHTML).join('');
}

function productCardHTML(p) {
  const price = p.basePrice === 0 ? 'Get a Quote' : '₹' + p.basePrice.toLocaleString('en-IN');
  const unit  = p.basePrice === 0 ? '' : ' <small style="font-size:0.62rem;font-weight:400;color:var(--ink-mute)">' + p.baseUnit + '</small>';
  return `<div class="product-card" onclick="launchCustomizer('${p.slug}')">
    <div class="product-img-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <span class="product-cat-tag">${p.category}</span>
    </div>
    <div class="product-body">
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-footer">
        <div class="product-price-wrap">
          <div class="product-price-from">Starting from</div>
          <div class="product-price">${price}${unit}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); launchCustomizer('${p.slug}')">Customise →</button>
      </div>
    </div>
  </div>`;
}

// ── CUSTOMISER ────────────────────────────────────────────────
function launchCustomizer(slug) {
  currentProduct  = PRODUCTS.find(p => p.slug === slug);
  if (!currentProduct) return;

  // Reset state
  selectedOptions = {};
  currentProduct.options.forEach(opt => {
    if (opt.type === 'select') selectedOptions[opt.key] = opt.choices[0].val;
  });
  selectedQty   = currentProduct.defaultQty;
  selectedDims  = { w: 4, h: 3 };
  uploadedFile  = null;
  imageObj      = null;
  imageDataURL  = null;
  designPos     = { x: 0, y: 0, scale: 0.5, rot: 0 };
  warnAck       = false;
  canvasListened = false;

  const bc = document.getElementById('customizer-breadcrumb');
  if (bc) bc.textContent = 'Catalog → ' + currentProduct.name;

  showPage('customize');
  renderSpecPanel();
  requestAnimationFrame(() => {
    initCanvas();
    drawCanvas();
  });
}

// Full spec panel render — preserves upload state correctly
function renderSpecPanel() {
  const container = document.getElementById('spec-panel-content');
  if (!container || !currentProduct) return;
  const p = currentProduct;
  let html = '';

  // Product header
  html += `<div class="spec-block">
    <div class="spec-block-header"><div class="spec-block-title">${p.name}</div></div>
    <div class="spec-block-body" style="padding:1.25rem 1.5rem;">
      <p class="body-sm">${p.desc}</p>
    </div>
  </div>`;

  // Options
  p.options.forEach(opt => {
    html += `<div class="spec-block">
      <div class="spec-block-header"><div class="spec-block-title">${opt.label}</div></div>
      <div class="spec-block-body">`;

    if (opt.type === 'select') {
      html += `<div class="option-grid">`;
      opt.choices.forEach(c => {
        const sel = selectedOptions[opt.key] === c.val;
        const mod = c.mod > 0 ? '+₹' + c.mod : c.mod < 0 ? '−₹' + Math.abs(c.mod) : 'Included';
        html += `<div class="option-pill${sel ? ' selected' : ''}" onclick="selectOption('${opt.key}','${c.val}')">
          <span class="option-pill-name">${c.label}</span>
          <span class="option-pill-sub">${mod}</span>
        </div>`;
      });
      html += `</div>`;

    } else if (opt.type === 'dimensions') {
      html += `<div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:.75rem;">
        <div class="form-field">
          <label class="form-label">Width (ft)</label>
          <input type="number" class="form-input" min="1" max="50" value="${selectedDims.w}"
            oninput="selectedDims.w=Math.max(1,+this.value||1);refreshPriceBox();drawCanvas();">
        </div>
        <div style="font-weight:900;color:var(--ink-mute);padding-bottom:.6rem;text-align:center;">×</div>
        <div class="form-field">
          <label class="form-label">Height (ft)</label>
          <input type="number" class="form-input" min="1" max="30" value="${selectedDims.h}"
            oninput="selectedDims.h=Math.max(1,+this.value||1);refreshPriceBox();drawCanvas();">
        </div>
      </div>`;

    } else if (opt.type === 'textarea') {
      html += `<textarea class="form-input" rows="4" placeholder="Describe your job in detail…"
        oninput="selectedOptions['${opt.key}']=this.value" style="resize:vertical;">${selectedOptions[opt.key] || ''}</textarea>`;
    }

    html += `</div></div>`;
  });

  // Quantity
  if (p.quantities.length > 1) {
    html += `<div class="spec-block">
      <div class="spec-block-header"><div class="spec-block-title">Quantity</div></div>
      <div class="spec-block-body"><div class="qty-row">`;
    p.quantities.forEach(q => {
      html += `<button class="qty-btn${selectedQty === q ? ' active' : ''}" onclick="setQty(${q})">${q} ${q === 1 ? 'unit' : 'units'}</button>`;
    });
    html += `</div></div></div>`;
  }

  // Upload zone — restore state if file already loaded
  if (p.slug !== 'custom-print') {
    html += `<div class="spec-block">
      <div class="spec-block-header"><div class="spec-block-title">Upload Your Design</div></div>
      <div class="spec-block-body">
        <div id="upload-area">`;
    if (uploadedFile) {
      html += `<div class="upload-success">
        <span style="color:#16A34A;font-weight:700;font-size:.85rem;">✓ ${uploadedFile.name}
          <span style="font-weight:400;color:var(--ink-mute);margin-left:.5rem;">(${(uploadedFile.size/1024/1024).toFixed(2)} MB)</span>
        </span>
        <button onclick="clearUpload()" class="btn btn-ghost btn-sm" style="flex-shrink:0;">Remove</button>
      </div>`;
    } else {
      html += `<div class="upload-zone">
        <input type="file" accept=".png,.jpg,.jpeg,.pdf" onchange="handleUpload(event)">
        <div class="upload-icon">↑</div>
        <div class="upload-text">Click or drop your design file here</div>
        <div class="upload-hint">PNG, JPG, PDF — max 20 MB</div>
      </div>`;
    }
    html += `</div><div id="upload-warning"></div></div></div>`;
  }

  // Price box
  html += `<div id="price-box"></div>`;

  // CTA row
  html += `<div style="display:flex;gap:.75rem;">
    <button onclick="showPage('catalog')" class="btn btn-ghost" style="flex:1;">Cancel</button>
    <button onclick="addToCart()" class="btn btn-primary" style="flex:2;padding:1rem;">Add to Cart →</button>
  </div>`;

  container.innerHTML = html;
  refreshPriceBox();

  // Re-show warning if one existed
  if (uploadedFile && imageObj) {
    checkResolutionWarning(imageObj);
  }
}

function selectOption(key, val) {
  selectedOptions[key] = val;
  renderSpecPanel();
  drawCanvas();
}

function setQty(q) {
  selectedQty = q;
  renderSpecPanel();
}

// ── UPLOAD HANDLING ───────────────────────────────────────────
function handleUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (file.size > 20 * 1024 * 1024) { alert('File too large. Maximum is 20 MB.'); return; }
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['png','jpg','jpeg','pdf'].includes(ext)) { alert('Unsupported format. Please use PNG, JPG, or PDF.'); return; }

  uploadedFile = { name: file.name, size: file.size };
  warnAck = false;

  const reader = new FileReader();
  reader.onload = ev => {
    imageDataURL = ev.target.result;
    const img = new Image();
    img.onload = () => {
      imageObj = img;
      designPos = { x: 0, y: 0, scale: 0.45, rot: 0 };
      const zs = document.getElementById('slider-zoom');
      if (zs) zs.value = 0.45;
      renderSpecPanel();   // re-render to show "file loaded" state
      drawCanvas();
    };
    img.src = imageDataURL;
  };
  reader.readAsDataURL(file);
}

function clearUpload() {
  uploadedFile = null;
  imageObj     = null;
  imageDataURL = null;
  warnAck      = false;
  renderSpecPanel();
  drawCanvas();
}

function checkResolutionWarning(img) {
  const warnEl = document.getElementById('upload-warning');
  if (!warnEl) return;
  let msg = '';
  if (currentProduct.slug === 'business-cards' && (img.width < 700 || img.height < 400)) {
    msg = 'Low resolution detected. Recommended minimum: 1050 × 600 px for sharp card prints.';
  } else if (currentProduct.slug === 't-shirts' && img.width < 800) {
    msg = 'Low resolution detected. Recommended minimum: 1200 × 1200 px for crisp t-shirt prints.';
  }
  if (msg) {
    warnEl.innerHTML = `<div class="warning-strip" style="margin-top:.75rem;">
      <div>⚠ ${msg}</div>
      <label style="display:flex;align-items:flex-start;gap:.5rem;cursor:pointer;">
        <input type="checkbox" ${warnAck ? 'checked' : ''} onchange="warnAck=this.checked">
        <span>I understand and want to proceed.</span>
      </label>
    </div>`;
  }
}

// ── PRICE CALCULATOR ──────────────────────────────────────────
function calcPrice() {
  const p = currentProduct;
  if (!p || p.basePrice === 0) return { unit: 0, subtotal: 0, discount: 0, discPct: 0, total: 0 };

  let optMod = 0;
  p.options.forEach(opt => {
    if (opt.type === 'select') {
      const c = opt.choices.find(ch => ch.val === selectedOptions[opt.key]);
      if (c) optMod += c.mod;
    }
  });

  const unit = p.basePrice + optMod;
  let subtotal;

  if (p.slug === 'flex-banners') {
    const sqft   = selectedDims.w * selectedDims.h;
    const matMod = (p.options.find(o => o.key === 'material')?.choices.find(c => c.val === selectedOptions.material)?.mod) || 0;
    const finMod = (p.options.find(o => o.key === 'finishing')?.choices.find(c => c.val === selectedOptions.finishing)?.mod) || 0;
    subtotal = (p.basePrice + matMod) * sqft * selectedQty + finMod;
  } else {
    subtotal = unit * selectedQty;
  }

  const discFactor = Object.entries(p.qtyDiscounts || {})
    .filter(([q]) => selectedQty >= +q)
    .sort(([a],[b]) => +b - +a)[0]?.[1] ?? 1.0;

  const discount = Math.round(subtotal * (1 - discFactor));
  const total    = Math.round(subtotal * discFactor);
  const discPct  = Math.round((1 - discFactor) * 100);

  return { unit, subtotal, discount, discPct, total };
}

function refreshPriceBox() {
  const box = document.getElementById('price-box');
  if (!box || !currentProduct) return;
  if (currentProduct.basePrice === 0) {
    box.innerHTML = `<div class="price-summary">
      <div class="price-total"><span>Pricing</span><span>Custom Quote</span></div>
    </div>`;
    return;
  }
  const { unit, subtotal, discount, discPct, total } = calcPrice();
  let rows = '';
  if (currentProduct.slug === 'flex-banners') {
    rows += `<div class="price-row"><span>Area</span><span>${selectedDims.w} × ${selectedDims.h} = ${selectedDims.w * selectedDims.h} sq.ft × ${selectedQty}</span></div>`;
  } else {
    rows += `<div class="price-row"><span>Unit price</span><span>₹${unit.toLocaleString('en-IN')}</span></div>`;
    rows += `<div class="price-row"><span>× ${selectedQty} units</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>`;
  }
  if (discount > 0) {
    rows += `<div class="price-row" style="color:#86EFAC;"><span>Bulk discount (${discPct}% off)</span><span>−₹${discount.toLocaleString('en-IN')}</span></div>`;
  }
  box.innerHTML = `<div class="price-summary">
    ${rows}
    <div class="price-total"><span>Estimated total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
  </div>`;
}

// ── CANVAS ────────────────────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('canvas-preview');
  if (!canvas || canvasListened) return;
  canvasListened = true;

  const getXY = e => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };

  canvas.addEventListener('mousedown',  e => { if (!imageObj) return; isDragging = true; const p = getXY(e); dragStart = { x: p.x - designPos.x, y: p.y - designPos.y }; });
  canvas.addEventListener('mousemove',  e => { if (!isDragging) return; const p = getXY(e); designPos.x = p.x - dragStart.x; designPos.y = p.y - dragStart.y; drawCanvas(); });
  canvas.addEventListener('mouseup',    () => isDragging = false);
  canvas.addEventListener('mouseleave', () => isDragging = false);
  canvas.addEventListener('touchstart', e => { if (!imageObj) return; isDragging = true; const p = getXY(e); dragStart = { x: p.x - designPos.x, y: p.y - designPos.y }; }, { passive: true });
  canvas.addEventListener('touchmove',  e => { if (!isDragging) return; const p = getXY(e); designPos.x = p.x - dragStart.x; designPos.y = p.y - dragStart.y; drawCanvas(); }, { passive: true });
  canvas.addEventListener('touchend',   () => isDragging = false);

  const zoomSlider = document.getElementById('slider-zoom');
  const rotSlider  = document.getElementById('slider-rotate');
  if (zoomSlider) zoomSlider.addEventListener('input', e => { designPos.scale = +e.target.value; drawCanvas(); });
  if (rotSlider)  rotSlider.addEventListener('input',  e => { designPos.rot   = +e.target.value; drawCanvas(); });
}

function resetCanvasDesign() {
  designPos = { x: 0, y: 0, scale: 0.5, rot: 0 };
  const sz = document.getElementById('slider-zoom');   if (sz) sz.value = 0.5;
  const sr = document.getElementById('slider-rotate'); if (sr) sr.value = 0;
  drawCanvas();
}

function drawCanvas() {
  const canvas = document.getElementById('canvas-preview');
  if (!canvas || !currentProduct) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Draw product silhouette
  switch (currentProduct.slug) {
    case 'business-cards': drawCardBase(ctx, W, H); break;
    case 't-shirts':       drawShirtBase(ctx, W, H); break;
    case 'flex-banners':   drawBannerBase(ctx, W, H); break;
    case 'stickers':       drawStickerBase(ctx, W, H); break;
    default:               drawGenericBase(ctx, W, H); break;
  }

  if (imageObj) {
    ctx.save();
    clipForProduct(ctx, W, H);
    ctx.translate(W / 2 + designPos.x, H / 2 + designPos.y);
    ctx.rotate(designPos.rot * Math.PI / 180);
    const dw = imageObj.width  * designPos.scale;
    const dh = imageObj.height * designPos.scale;
    ctx.drawImage(imageObj, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
    drawSafetyLines(ctx, W, H);
  } else {
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 12px Outfit,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Upload a design to preview here', W / 2, H / 2);
  }
}

function drawCardBase(ctx, W, H) {
  const cw = 300, ch = 170, rx = (W - cw) / 2, ry = (H - ch) / 2;
  ctx.fillStyle = '#F5F0E8'; ctx.fillRect(0, 0, W, H);
  ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.roundRect(rx, ry, cw, ch, 6); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#D8D4CC'; ctx.lineWidth = 1; ctx.stroke();
}

function drawShirtBase(ctx, W, H) {
  const cm = { white:'#FFFFFF', black:'#1f1f23', navy:'#1B263B', grey:'#CBD5E1' };
  const c  = cm[selectedOptions.color || 'white'] || '#FFFFFF';
  ctx.fillStyle = '#F5F0E8'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = c;
  ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
  const cx = W / 2;
  ctx.beginPath();
  ctx.moveTo(cx-40,35); ctx.quadraticCurveTo(cx,48,cx+40,35);
  ctx.lineTo(cx+90,48); ctx.lineTo(cx+115,95); ctx.lineTo(cx+78,108); ctx.lineTo(cx+68,88);
  ctx.lineTo(cx+68,H-40); ctx.lineTo(cx-68,H-40); ctx.lineTo(cx-68,88);
  ctx.lineTo(cx-78,108); ctx.lineTo(cx-115,95); ctx.lineTo(cx-90,48);
  ctx.closePath(); ctx.fill();
  ctx.shadowColor = 'transparent';
  if (c === '#FFFFFF') { ctx.strokeStyle = '#D8D4CC'; ctx.lineWidth = 1; ctx.stroke(); }
}

function drawBannerBase(ctx, W, H) {
  const pad = 30;
  const asp = selectedDims.w / selectedDims.h;
  let bw = W - pad*2, bh = bw / asp;
  if (bh > H - pad*2) { bh = H - pad*2; bw = bh * asp; }
  const bx = (W - bw) / 2, by = (H - bh) / 2;
  ctx.fillStyle = '#CBD5E1'; ctx.fillRect(0, 0, W, H);
  ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(bx, by, bw, bh);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
  [[bx+7,by+7],[bx+bw-7,by+7],[bx+7,by+bh-7],[bx+bw-7,by+bh-7]].forEach(([ex,ey]) => {
    ctx.beginPath(); ctx.arc(ex,ey,4,0,Math.PI*2);
    ctx.fillStyle='#94A3B8'; ctx.fill();
    ctx.strokeStyle='#475569'; ctx.lineWidth=1; ctx.stroke();
  });
}

function drawStickerBase(ctx, W, H) {
  const sh = selectedOptions.shape || 'circle';
  ctx.fillStyle = '#F5F0E8'; ctx.fillRect(0, 0, W, H);
  ctx.shadowColor = 'rgba(0,0,0,0.08)'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  if (sh === 'circle') { ctx.arc(W/2,H/2,110,0,Math.PI*2); }
  else { ctx.roundRect((W-220)/2,(H-220)/2,220,220,10); }
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#D8D4CC'; ctx.lineWidth = 1; ctx.stroke();
}

function drawGenericBase(ctx, W, H) {
  ctx.fillStyle = '#F5F0E8'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#D8D4CC'; ctx.lineWidth = 1.5; ctx.strokeRect(20,20,W-40,H-40);
}

function clipForProduct(ctx, W, H) {
  ctx.beginPath();
  switch (currentProduct.slug) {
    case 'business-cards': {
      const cw=300,ch=170,rx=(W-cw)/2,ry=(H-ch)/2;
      ctx.roundRect(rx,ry,cw,ch,6); break;
    }
    case 't-shirts':
      ctx.rect((W-120)/2, H/2-80, 120, 160); break;
    case 'flex-banners': {
      const pad=30, asp=selectedDims.w/selectedDims.h;
      let bw=W-pad*2, bh=bw/asp;
      if(bh>H-pad*2){bh=H-pad*2;bw=bh*asp;}
      ctx.rect((W-bw)/2,(H-bh)/2,bw,bh); break;
    }
    case 'stickers': {
      const sh=selectedOptions.shape||'circle';
      if(sh==='circle') ctx.arc(W/2,H/2,110,0,Math.PI*2);
      else ctx.roundRect((W-220)/2,(H-220)/2,220,220,10);
      break;
    }
    default: ctx.rect(20,20,W-40,H-40);
  }
  ctx.clip();
}

function drawSafetyLines(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = 'rgba(239,68,68,0.45)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3,4]);
  if (currentProduct.slug === 'business-cards') ctx.strokeRect((W-280)/2,(H-150)/2,280,150);
  if (currentProduct.slug === 'stickers') {
    const sh = selectedOptions.shape || 'circle';
    ctx.beginPath();
    if(sh==='circle') ctx.arc(W/2,H/2,98,0,Math.PI*2);
    else ctx.rect((W-200)/2,(H-200)/2,200,200);
    ctx.stroke();
  }
  ctx.restore();
}

// ── CART ──────────────────────────────────────────────────────
function addToCart() {
  if (currentProduct.slug !== 'custom-print' && !uploadedFile) {
    alert('Please upload a design file before adding to cart.');
    return;
  }

  const warnEl = document.getElementById('upload-warning');
  if (warnEl && warnEl.querySelector('input[type=checkbox]') && !warnAck) {
    alert('Please check the resolution warning acknowledgement first.');
    return;
  }

  const { total } = calcPrice();
  const canvas    = document.getElementById('canvas-preview');
  const preview   = canvas ? canvas.toDataURL('image/jpeg', 0.7) : '';

  const item = {
    id:      'item-' + Date.now(),
    product: currentProduct,
    qty:     selectedQty,
    options: { ...selectedOptions },
    dims:    currentProduct.slug === 'flex-banners' ? { ...selectedDims } : null,
    file:    uploadedFile,
    preview,
    price:   total,
  };

  cart.push(item);
  updateCartBadge();
  showPage('cart');
}

function updateCartBadge() {
  const el = document.getElementById('nav-cart-count');
  if (el) el.textContent = cart.length;
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
}

function renderCart() {
  const listEl     = document.getElementById('cart-items-list');
  const panelEl    = document.getElementById('checkout-panel');
  const summaryEl  = document.getElementById('checkout-summary-rows');
  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = `<div class="cart-empty">
      <div style="font-size:3rem;margin-bottom:1rem;">🛒</div>
      <div class="heading-md" style="margin-bottom:.5rem;">Your cart is empty</div>
      <p class="body-sm" style="margin-bottom:1.5rem;">Browse the catalog and customise a product to get started.</p>
      <button onclick="showPage('catalog')" class="btn btn-primary">Browse Products</button>
    </div>`;
    if (panelEl) panelEl.style.display = 'none';
    return;
  }

  if (panelEl) panelEl.style.display = 'block';

  listEl.innerHTML = cart.map(item => {
    const tags = Object.entries(item.options)
      .filter(([,v]) => v && v !== '')
      .map(([k,v]) => `<span class="cart-tag">${k}: ${v}</span>`).join('');
    const dimTag = item.dims ? `<span class="cart-tag">${item.dims.w}×${item.dims.h} ft</span>` : '';
    return `<div class="cart-item">
      <img class="cart-thumb" src="${item.preview || item.product.image}" alt="${item.product.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-tags">${dimTag}${tags}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-ctrl-btn" onclick="adjustQty('${item.id}',-1)">−</button>
          <div class="qty-display">${item.qty}</div>
          <button class="qty-ctrl-btn" onclick="adjustQty('${item.id}',1)">+</button>
          <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        </div>
      </div>
      <button class="cart-remove" title="Remove" onclick="removeFromCart('${item.id}')">×</button>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s,i) => s + i.price, 0);
  const delivery = fulfillmentMode === 'delivery' ? 50 : 0;
  const total    = subtotal + delivery;

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery > 0 ? '₹' + delivery : 'Free (self-pickup)'}</span></div>
      <div class="summary-total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    `;
  }
}

function adjustQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
}

// ── FULFILLMENT TOGGLE ────────────────────────────────────────
function setFulfillment(mode) {
  fulfillmentMode = mode;

  const tabP = document.getElementById('tab-pickup');
  const tabD = document.getElementById('tab-delivery');
  const infoBlock = document.getElementById('pickup-info-block');
  const delivFields = document.getElementById('delivery-fields');

  if (tabP) tabP.classList.toggle('active', mode === 'pickup');
  if (tabD) tabD.classList.toggle('active', mode === 'delivery');
  if (infoBlock)   infoBlock.style.display  = mode === 'pickup'   ? 'block' : 'none';
  if (delivFields) delivFields.style.display = mode === 'delivery' ? 'flex'  : 'none';

  renderCart();
}

// ── CHECKOUT ──────────────────────────────────────────────────
function submitCheckout(e) {
  e.preventDefault();
  const name  = (document.getElementById('inp-name')?.value  || '').trim();
  const phone = (document.getElementById('inp-phone')?.value || '').trim();
  const email = (document.getElementById('inp-email')?.value || '').trim();

  if (!name)                             { alert('Please enter your name.'); return; }
  if (phone.replace(/\D/g,'').length < 10) { alert('Please enter a valid 10-digit phone number.'); return; }
  if (!email.includes('@'))              { alert('Please enter a valid email address.'); return; }

  const subtotal = cart.reduce((s,i) => s + i.price, 0);
  const delivery = fulfillmentMode === 'delivery' ? 50 : 0;
  const total    = subtotal + delivery;
  const orderId  = 'PV-' + (1001 + DB.getAll().length);

  let address = 'Self-pickup at shop';
  if (fulfillmentMode === 'delivery') {
    const addr    = (document.getElementById('inp-address')?.value || '').trim();
    const city    = (document.getElementById('inp-city')?.value    || '').trim();
    const pincode = (document.getElementById('inp-pincode')?.value || '').trim();
    if (!addr || !city || !pincode) { alert('Please fill in your full delivery address.'); return; }
    address = `${addr}, ${city} – ${pincode}`;
  }

  const order = {
    id: orderId, name, phone, email,
    fulfillment: fulfillmentMode, address,
    notes: (document.getElementById('inp-notes')?.value || '').trim(),
    items: cart.map(i => ({
      name:    i.product.name,
      qty:     i.qty,
      options: i.options,
      dims:    i.dims,
      price:   i.price,
      preview: i.preview,
    })),
    subtotal, delivery, total,
    payment: 'PENDING',
    status:  'PAYMENT_PENDING',
    history: [{ status:'PAYMENT_PENDING', note:'Order placed by customer', at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  DB.save(order);
  openPaymentModal(order);
}

// ── UPI PAYMENT MODAL ─────────────────────────────────────────
function openPaymentModal(order) {
  const YOUR_UPI_ID = '09811427517@oksbi';  // ← Replace with your actual UPI ID
  const upiString   = `upi://pay?pa=${encodeURIComponent(YOUR_UPI_ID)}&pn=Printer+Vatika&am=${order.total}&cu=INR&tn=${encodeURIComponent('Order ' + order.id)}`;
  const qrURL       = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}&bgcolor=FAFAF8&color=1A1A1A&margin=10&format=png`;
  const isMobile    = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  document.getElementById('payment-modal-inner').innerHTML = `
    <div style="text-align:center;">
      <div class="label" style="justify-content:center;margin-bottom:.4rem;">Order ${order.id}</div>
      <h2 class="heading-lg" style="margin-bottom:0;">Pay via UPI</h2>
    </div>

    <div class="modal-amount">
      <div style="font-size:.65rem;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.35rem;">Amount Due</div>
      <div class="modal-amount-val">₹${order.total.toLocaleString('en-IN')}</div>
      <div style="font-size:.72rem;color:var(--ink-mute);margin-top:.25rem;">Order ID: ${order.id}</div>
    </div>

    ${isMobile
      ? `<a href="${upiString}" class="btn btn-cyan" style="width:100%;padding:1rem;font-size:1rem;justify-content:center;border-radius:8px;">
           Open UPI App &amp; Pay
         </a>
         <p class="body-xs" style="text-align:center;margin-top:-.5rem;">Opens Google Pay, PhonePe, Paytm, BHIM or any UPI app</p>`
      : `<div style="text-align:center;">
           <img src="${qrURL}" alt="UPI QR Code" style="border:1.5px solid var(--border);border-radius:10px;margin:0 auto;" width="220" height="220">
           <p class="body-xs" style="margin-top:.75rem;">Scan with any UPI app on your phone</p>
         </div>`
    }

    <div style="border-top:1px solid var(--border);padding-top:1rem;">
      <label class="form-label" style="margin-bottom:.4rem;display:block;">Enter UPI Reference (UTR) after paying</label>
      <input type="text" id="utr-input" class="form-input" placeholder="12-digit UTR from your UPI app" maxlength="24">
      <p class="body-xs" style="margin-top:.4rem;">Find the UTR number in your UPI app's transaction history.</p>
    </div>

    <div style="display:flex;gap:.75rem;">
      <button onclick="confirmUTR('${order.id}')" class="btn btn-primary" style="flex:2;">Confirm Payment</button>
      <button onclick="payAtShop('${order.id}')" class="btn btn-ghost" style="flex:1;">Pay at Shop</button>
    </div>
  `;
  document.getElementById('payment-modal').style.display = 'flex';
}

function confirmUTR(orderId) {
  const utr = (document.getElementById('utr-input')?.value || '').trim();
  if (!utr || utr.length < 6) { alert('Please enter a valid UTR / reference number from your UPI app.'); return; }
  DB.updateStatus(orderId, 'CONFIRMED', 'UPI payment confirmed. UTR: ' + utr);
  printWhatsAppLog(orderId, utr);
  showPaymentSuccess(orderId, 'Payment confirmed! Your job is now in the print queue.');
}

function payAtShop(orderId) {
  DB.updateStatus(orderId, 'CONFIRMED', 'Customer will pay at shop on pickup.');
  showPaymentSuccess(orderId, 'Order saved. Please bring cash or scan the UPI QR at our counter when collecting.');
}

function showPaymentSuccess(orderId, msg) {
  document.getElementById('payment-modal-inner').innerHTML = `
    <div style="text-align:center;padding:1rem 0;">
      <div style="width:56px;height:56px;background:#DCFCE7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.5rem;">✓</div>
      <h2 class="heading-lg">Order Placed!</h2>
      <p class="body-sm" style="margin-top:.75rem;max-width:320px;margin-left:auto;margin-right:auto;">${msg}</p>
      <div style="background:var(--parchment);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-top:1.5rem;font-size:.8rem;">
        <strong>Order ID: ${orderId}</strong><br>
        <span style="color:var(--ink-mute);">Save this number to track your order.</span>
      </div>
    </div>
    <button onclick="afterPayment('${orderId}')" class="btn btn-primary" style="width:100%;">Track My Order →</button>
  `;
  cart = [];
  updateCartBadge();
}

function afterPayment(orderId) {
  document.getElementById('payment-modal').style.display = 'none';
  const order = DB.getAll().find(o => o.id === orderId);
  if (order) {
    const ti = document.getElementById('track-id');
    const tp = document.getElementById('track-phone');
    if (ti) ti.value = orderId;
    if (tp) tp.value = order.phone;
  }
  showPage('track');
  doTrackOrder();
}

// WhatsApp log to console (replace with real API call)
function printWhatsAppLog(orderId, utr) {
  const order = DB.getAll().find(o => o.id === orderId);
  if (!order) return;
  const items = order.items.map(i => `  • ${i.name} × ${i.qty}  ₹${i.price}`).join('\n');
  console.log(`
════════════════════════════════════════════
📬  NEW ORDER — Print Vatika
To: 09811427517 (WhatsApp)
════════════════════════════════════════════
*Order ID:* ${order.id}
*Customer:* ${order.name}
*Phone:* ${order.phone}
*Email:* ${order.email}
*Fulfilment:* ${order.fulfillment.toUpperCase()}
*Address:* ${order.address}

*Items:*
${items}

*Subtotal:* ₹${order.subtotal}
*Delivery:* ₹${order.delivery}
*Total:* ₹${order.total}
*UPI UTR:* ${utr}

*Notes:* ${order.notes || 'None'}
════════════════════════════════════════════`);
}

// ── ORDER TRACKER ─────────────────────────────────────────────
function doTrackOrder() {
  const id     = (document.getElementById('track-id')?.value    || '').trim();
  const phone  = (document.getElementById('track-phone')?.value || '').trim();
  const result = document.getElementById('track-result');
  if (!result) return;

  if (!id || !phone) {
    result.innerHTML = `<div class="warning-strip" style="margin-top:1.5rem;">Please enter your order number and registered phone number.</div>`;
    return;
  }

  const order = DB.find(id, phone);
  if (!order) {
    result.innerHTML = `<div class="warning-strip" style="margin-top:1.5rem;">
      Order not found. Check the order ID (e.g. PV-1001) and the phone number you used at checkout.
    </div>`;
    return;
  }

  const STEPS = [
    { status:'PAYMENT_PENDING', label:'Order Placed',    sub:'Awaiting payment' },
    { status:'CONFIRMED',       label:'Confirmed',        sub:'Job accepted, preparing plates' },
    { status:'PRINTING',        label:'On Press',         sub:'Currently being printed' },
    { status:'READY',           label: order.fulfillment === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup', sub:'Job sealed and completed' },
    { status:'DELIVERED',       label: order.fulfillment === 'delivery' ? 'Delivered'         : 'Collected',        sub:'Fulfilment confirmed' },
  ];
  const hierarchy = STEPS.map(s => s.status);
  const curIdx    = Math.max(0, hierarchy.indexOf(order.status));

  const stepsHtml = STEPS.map((step, i) => {
    const cls = i < curIdx ? 'done' : i === curIdx ? 'active' : 'pending';
    return `<div class="tl-step ${cls}">
      <div class="tl-dot"></div>
      <div><div class="tl-label">${step.label}</div><div class="tl-sub">${step.sub}</div></div>
    </div>`;
  }).join('');

  const itemsHtml = order.items.map(item => {
    const dimText = item.dims ? ` (${item.dims.w}×${item.dims.h} ft)` : '';
    return `<div style="display:flex;gap:.75rem;align-items:center;padding:.75rem 0;border-bottom:1px solid var(--border);">
      <img src="${item.preview || ''}" style="width:52px;height:52px;border-radius:6px;border:1px solid var(--border);object-fit:cover;flex-shrink:0;background:var(--parchment);">
      <div style="flex-grow:1;">
        <div style="font-size:.875rem;font-weight:700;">${item.name}${dimText}</div>
        <div class="body-xs">Qty: ${item.qty}</div>
      </div>
      <div style="font-weight:800;font-family:var(--font-serif);">₹${item.price.toLocaleString('en-IN')}</div>
    </div>`;
  }).join('');

  result.innerHTML = `
    <div class="timeline">
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:1rem;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div>
          <div class="label" style="margin:0 0 .15rem;">Order ${order.id}</div>
          <div class="heading-md">${order.name}</div>
          <div class="body-xs" style="margin-top:.15rem;">${order.fulfillment === 'delivery' ? '📦 Delivery to: ' + order.address : '🏪 Self-pickup at shop'}</div>
        </div>
        <div style="background:var(--ink);color:white;font-size:.65rem;font-weight:800;padding:4px 10px;border-radius:4px;text-transform:uppercase;white-space:nowrap;">${order.status.replace(/_/g,' ')}</div>
      </div>
      <div class="timeline-steps">${stepsHtml}</div>
    </div>

    <div class="section-box" style="margin-top:1.5rem;">
      <div class="section-box-header">Job Details</div>
      <div style="padding:0 1.5rem;">${itemsHtml}</div>
      <div style="padding:1rem 1.5rem 1.5rem;display:flex;justify-content:space-between;font-weight:900;font-family:var(--font-serif);font-size:1.05rem;">
        <span>Total</span><span>₹${order.total.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div style="text-align:center;margin-top:1.5rem;">
      <a href="https://wa.me/919811427517?text=Hi%2C+my+order+is+${order.id}+and+I+have+a+question." target="_blank" class="whatsapp-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.112 1.524 5.84L0 24l6.318-1.524A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.373l-.36-.214-3.73.978.994-3.638-.234-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>
        WhatsApp Us About This Order
      </a>
    </div>
  `;
}

// ── BOOT ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderHomeProducts();
  showPage('home');
});
