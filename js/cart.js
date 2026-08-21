// ── CART MANAGER ─────────────────────────────────────────────
// Persists cart across all pages via localStorage.

window.Cart = {
  _key: 'pv_cart_v2',

  get()   { try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch { return []; } },
  save(i) { localStorage.setItem(this._key, JSON.stringify(i)); this.updateBadge(); },

  add(item)   { const c = this.get(); c.push(item); this.save(c); },
  remove(id)  { this.save(this.get().filter(i => i.id !== id)); },
  update(id, patch) {
    this.save(this.get().map(i => i.id === id ? { ...i, ...patch } : i));
  },
  clear()     { localStorage.removeItem(this._key); this.updateBadge(); },
  count()     { return this.get().length; },
  subtotal()  { return this.get().reduce((s, i) => s + i.price, 0); },

  updateBadge() {
    const n = this.count();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? '' : 'none';
    });
  },
};
