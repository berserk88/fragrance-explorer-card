/**
 * Fragrance Explorer Custom Lovelace Card
 * Version 5.0: Unified Database Schemas, Advanced History State Capturing, and Context Matrix Cross-Navigation
 */

import { fragranceCombinations } from '/local/community/fragrance-explorer-card/fragrance_combinations.js?v=5.0';
import { individualFragrances } from '/local/community/fragrance-explorer-card/individual_fragrances.js?v=5.0';

const ICONS = {
  'Spring': '🌸', 'Summer': '☀️', 'Autumn': '🍂', 'Winter': '❄️', 'All Seasons': '🌍',
  'Day': '🌅', 'Night': '🌃', 'All': '🌗',
  'Casual': '👕', 'Office': '💼', 'Evening': '🍸', 'Formal': '👔',
  'Blend': '🧪', 'Fragrance': '🧴'
};

class FragranceExplorerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Core Navigation Stack State
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.exitTimer = null;
    this.backPressedOnce = false;

    // Search and Filtering State Engine
    this.searchTerm = '';
    this.ratingFilter = { type: '', min: '' };
    this.activeFilters = {
      type: new Set(),
      note: new Set(),
      season: new Set(),
      time_of_day: new Set(),
      occasion: new Set()
    };
    
    // Bind event handlers securely
    this._handlePopState = this._handlePopState.bind(this);
    
    // Ingest databases and normalize records dynamically
    this.initData();
  }

  connectedCallback() {
    // Intercept physical browser and mobile hardware back navigation
    window.addEventListener('popstate', this._handlePopState);
    
    // Push an initial anchor state to prevent instant dashboard exits
    if (!window.history.state || !window.history.state.fragranceExplorer) {
      window.history.pushState({ fragranceExplorer: true, depth: this.currentDepth }, '');
    }
    
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._handlePopState);
    if (this.exitTimer) clearTimeout(this.exitTimer);
  }

  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 3;
  }

  initData() {
    const normalizedFragrances = (Array.isArray(individualFragrances) ? individualFragrances : []).map(item => ({
      ...item,
      type: 'Fragrance',
      seasons: Array.isArray(item.seasons) ? item.seasons : [],
      time_of_day: Array.isArray(item.time_of_day) ? item.time_of_day : [],
      occasion: Array.isArray(item.occasion) ? item.occasion : [],
      dominant_notes: Array.isArray(item.dominant_notes) ? item.dominant_notes : [],
      rating: parseFloat(item.rating) || 0,
      projection: parseFloat(item.projection) || 0,
      longevity: parseFloat(item.longevity) || 0,
      compliment_factor: parseFloat(item.compliment_factor) || 0,
      best_temperature: item.best_temperature || 'N/A'
    }));

    const normalizedCombos = (Array.isArray(fragranceCombinations) ? fragranceCombinations : []).map(item => ({
      ...item,
      type: 'Blend',
      seasons: Array.isArray(item.seasons) ? item.seasons : [],
      time_of_day: Array.isArray(item.time_of_day) ? item.time_of_day : [],
      occasion: Array.isArray(item.occasion) ? item.occasion : [],
      dominant_notes: Array.isArray(item.dominant_notes) ? item.dominant_notes : [],
      rating: parseFloat(item.rating) || 0,
      projection: parseFloat(item.projection) || 0,
      longevity: parseFloat(item.longevity) || 0,
      compliment_factor: parseFloat(item.compliment_factor) || 0,
      best_temperature: item.best_temperature || 'N/A'
    }));

    this.masterIndex = [...normalizedFragrances, ...normalizedCombos];
    
    // Synthesize unique global notes for active cross-filtering panel
    this.allUniqueNotes = Array.from(
      new Set(this.masterIndex.flatMap(item => item.dominant_notes))
    ).sort();
  }

  _handlePopState(event) {
    // Check if back action is meant for internal card history navigation layers
    if (this.navStack.length > 1) {
      this.navStack.pop();
      this.currentDepth--;
      this.render();
      // Keep state tracking locked within the application shell frame
      window.history.pushState({ fragranceExplorer: true, depth: this.currentDepth }, '');
    } else {
      // Top Level Home View: Implement Double-Tap Defensive Exit Logic
      if (this.backPressedOnce) {
        this.backPressedOnce = false;
        if (this.exitTimer) clearTimeout(this.exitTimer);
        // Authorize absolute system termination or exit from current dashboard path
        window.history.back();
      } else {
        this.backPressedOnce = true;
        this.showToast('Press Back once more to exit Fragrance Explorer');
        this.exitTimer = setTimeout(() => {
          this.backPressedOnce = false;
        }, 2000);
        // Force state locking anchor back on the tab context tree
        window.history.pushState({ fragranceExplorer: true, depth: this.currentDepth }, '');
      }
    }
  }

  navigateInternal(view, value) {
    this.navStack.push({ view, value });
    this.currentDepth++;
    window.history.pushState({ fragranceExplorer: true, depth: this.currentDepth }, '');
    this.render();
  }

  handleBackAction() {
    // Intercept manual UI hardware panel clicks to channel core interceptors uniformly
    if (this.navStack.length > 1) {
      this.navStack.pop();
      this.currentDepth--;
      this.render();
    } else {
      if (this.backPressedOnce) {
        this.backPressedOnce = false;
        if (this.exitTimer) clearTimeout(this.exitTimer);
        // Exit panel gracefully to external Home Assistant root
        const event = new CustomEvent('hass-navigate', {
          detail: { path: '/lovelace/home' },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
      } else {
        this.backPressedOnce = true;
        this.showToast('Press Back once more to exit Fragrance Explorer');
        this.exitTimer = setTimeout(() => {
          this.backPressedOnce = false;
        }, 2000);
      }
    }
  }

  showToast(message) {
    const container = this.shadowRoot.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    // Animate view layout
    setTimeout(() => { toast.classList.add('visible'); }, 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => { toast.remove(); }, 300);
    }, 2200);
  }

  toggleFilter(category, value) {
    if (this.activeFilters[category].has(value)) {
      this.activeFilters[category].delete(value);
    } else {
      this.activeFilters[category].add(value);
    }
    this.render();
  }

  clearAllFilters() {
    this.searchTerm = '';
    Object.keys(this.activeFilters).forEach(key => this.activeFilters[key].clear());
    this.ratingFilter = { type: '', min: '' };
    this.render();
  }

  handleMatrixBadgeClick(category, value) {
    // Normalize target filter mappings to array matching configurations
    let mappedCategory = category;
    if (category === 'seasons') mappedCategory = 'season';
    
    if (this.activeFilters[mappedCategory]) {
      this.activeFilters[mappedCategory].clear();
      this.activeFilters[mappedCategory].add(value);
    }
    
    // Jump cleanly to filtered catalog explorer frame
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.render();
  }

  getFilteredItems() {
    return this.masterIndex.filter(item => {
      // 1. Text Search Filter Matching
      if (this.searchTerm) {
        const query = this.searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesNotes = item.dominant_notes.some(note => note.toLowerCase().includes(query));
        const matchesDesc = item.description && item.description.toLowerCase().includes(query);
        const matchesProfile = item.profile && item.profile.toLowerCase().includes(query);
        
        if (!matchesName && !matchesNotes && !matchesDesc && !matchesProfile) return false;
      }

      // 2. Type Filter Selection Matching
      if (this.activeFilters.type.size > 0 && !this.activeFilters.type.has(item.type)) return false;

      // 3. Matrix context checking operations (Supports uniform database schemas)
      if (this.activeFilters.season.size > 0) {
        const matchesSeason = item.seasons.some(s => this.activeFilters.season.has(s));
        if (!matchesSeason) return false;
      }

      if (this.activeFilters.time_of_day.size > 0) {
        const matchesTime = item.time_of_day.some(t => this.activeFilters.time_of_day.has(t));
        if (!matchesTime) return false;
      }

      if (this.activeFilters.occasion.size > 0) {
        const matchesOccasion = item.occasion.some(o => this.activeFilters.occasion.has(o));
        if (!matchesOccasion) return false;
      }

      // 4. Notes Array Filtering Matching
      if (this.activeFilters.note.size > 0) {
        const matchesNotesArray = item.dominant_notes.some(n => this.activeFilters.note.has(n));
        if (!matchesNotesArray) return false;
      }

      // 5. Explicit Rating Bound Calculations
      if (this.ratingFilter.min) {
        const minRating = parseFloat(this.ratingFilter.min);
        if (item.rating < minRating) return false;
      }

      return true;
    });
  }

  render() {
    const currentViewObj = this.navStack[this.navStack.length - 1];
    
    let inlineContent = '';
    if (currentViewObj.view === 'browser') {
      inlineContent = this.renderBrowserView();
    } else if (currentViewObj.view === 'details') {
      inlineContent = this.renderDetailsView(currentViewObj.value);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --primary-accent: var(--accent-color, #0076ff);
          --card-background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
          --primary-text: var(--primary-text-color, #ffffff);
          --secondary-text: var(--secondary-text-color, #aeaeeb);
          --border-radius: 12px;
          font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
        }
        
        .main-shell {
          background: var(--card-background);
          color: var(--primary-text);
          border-radius: var(--border-radius);
          padding: 16px;
          box-shadow: var(--ha-card-box-shadow, 0 4px 16px rgba(0,0,0,0.15));
          position: relative;
          overflow: hidden;
        }

        /* Header Navigation Styles */
        .app-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 12px;
        }
        .header-title-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header-title-container h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .ui-nav-btn {
          background: rgba(255,255,255,0.06);
          border: none;
          color: var(--primary-text);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ui-nav-btn:hover { background: rgba(255,255,255,0.12); }
        .ui-nav-btn:active { transform: scale(0.97); }

        /* Filtration Layout Systems */
        .search-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .search-input {
          flex: 1;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }
        .search-input:focus { border-color: var(--primary-accent); }
        
        .filter-scroller-track {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 12px;
          scrollbar-width: none;
        }
        .filter-scroller-track::-webkit-scrollbar { display: none; }
        
        .chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 6px 10px;
          border-radius: 16px;
          font-size: 12px;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--secondary-text);
        }
        .chip.active {
          background: var(--primary-accent);
          border-color: var(--primary-accent);
          color: #fff;
          font-weight: 600;
        }

        /* Data Grid Matrix Layouts */
        .item-catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .catalog-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .catalog-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .card-meta-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .card-title {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
          word-break: break-word;
        }
        .card-metrics-summary {
          font-size: 11px;
          color: var(--secondary-text);
          margin-top: 6px;
        }
        
        /* Details View Typography and Metric Layouts */
        .details-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .meta-pill-box {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          background: rgba(0,0,0,0.15);
          padding: 10px;
          border-radius: 8px;
        }
        .info-label-block {
          font-size: 12px;
          color: var(--secondary-text);
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 45%;
        }
        .info-label-block span {
          color: var(--primary-text);
          font-weight: 600;
        }
        
        .metrics-panel-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 12px;
        }
        .stat-metric-row {
          margin-bottom: 8px;
        }
        .stat-metric-row:last-child { margin-bottom: 0; }
        .stat-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 3px;
        }
        .stat-bar-outer {
          background: rgba(255,255,255,0.1);
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
        }
        .stat-bar-inner {
          background: linear-gradient(90deg, var(--primary-accent), #5ac8fa);
          height: 100%;
          border-radius: 3px;
        }
        
        /* Unified Matrix Context Block Configurations */
        .context-matrix-section {
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          padding: 10px 12px;
          border-left: 3px solid var(--primary-accent);
        }
        .matrix-title {
          font-size: 12px;
          text-transform: uppercase;
          color: var(--secondary-text);
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: 0.5px;
        }
        .matrix-badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        /* Interactive Cross-Nav Badges */
        .interactive-badge {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--primary-text);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .interactive-badge:hover {
          background: rgba(0, 118, 255, 0.15);
          border-color: var(--primary-accent);
          transform: translateY(-1px);
        }
        .interactive-badge:active { transform: scale(0.96); }

        .block-text-paragraph {
          font-size: 12px;
          line-height: 1.5;
          color: var(--secondary-text);
          margin: 0;
          white-space: pre-wrap;
        }
        
        /* Toast Alerts */
        #toast-container {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 6px;
          pointer-events: none;
        }
        .toast {
          background: #323232;
          color: #fff;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        .toast.visible {
          opacity: 1;
          transform: translateY(0);
        }
      </style>
      
      <div class="main-shell">
        <div class="app-bar">
          <div class="header-title-container">
            <span>${currentViewObj.view === 'details' ? ICONS[this.masterIndex.find(x => x.name === currentViewObj.value)?.type] || '🧴' : '🧪'}</span>
            <h3>${currentViewObj.view === 'details' ? 'Details View' : (this._config?.title || 'Fragrance Explorer')}</h3>
          </div>
          <button class="ui-nav-btn" id="global-back-trigger">
            ${currentViewObj.view === 'details' ? '◀ Catalog' : '◀ Exit Card'}
          </button>
        </div>
        
        <div id="view-mount-point">
          ${inlineContent}
        </div>
        
        <div id="toast-container"></div>
      </div>
    `;

    this.attachInternalEventBindings();
  }

  attachInternalEventBindings() {
    // Top App Bar Navigation Interceptor
    this.shadowRoot.getElementById('global-back-trigger').addEventListener('click', () => {
      this.handleBackAction();
    });

    const currentView = this.navStack[this.navStack.length - 1].view;

    if (currentView === 'browser') {
      // Input filtration listeners
      const searchBox = this.shadowRoot.getElementById('search-box');
      if (searchBox) {
        searchBox.addEventListener('input', (e) => {
          this.searchTerm = e.target.value;
          // Re-evaluate without re-rendering entire structure shell to keep keyboard context
          this.rebuildGridDynamically();
        });
      }

      // Filter chips selectors
      this.shadowRoot.querySelectorAll('.chip[data-category]').forEach(chip => {
        chip.addEventListener('click', () => {
          const cat = chip.getAttribute('data-category');
          const val = chip.getAttribute('data-value');
          this.toggleFilter(cat, val);
        });
      });

      // Clear layout elements
      const clearBtn = this.shadowRoot.getElementById('clear-filters-trigger');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearAllFilters());
      }

      // Card entry listeners
      this.shadowRoot.querySelectorAll('.catalog-card').forEach(card => {
        card.addEventListener('click', () => {
          const targetName = card.getAttribute('data-name');
          this.navigateInternal('details', targetName);
        });
      });

    } else if (currentView === 'details') {
      // Dynamic internal cross matrix navigational filters
      this.shadowRoot.querySelectorAll('.interactive-badge[data-matrix-cat]').forEach(badge => {
        badge.addEventListener('click', () => {
          const category = badge.getAttribute('data-matrix-cat');
          const value = badge.getAttribute('data-matrix-val');
          this.handleMatrixBadgeClick(category, value);
        });
      });

      // Direct Related/Alternative Cross-Linking jumps
      this.shadowRoot.querySelectorAll('.interactive-badge[data-jump-target]').forEach(badge => {
        badge.addEventListener('click', () => {
          const dest = badge.getAttribute('data-jump-target');
          this.navigateInternal('details', dest);
        });
      });
    }
  }

  rebuildGridDynamically() {
    const mountPoint = this.shadowRoot.getElementById('grid-wrapper-mount');
    if (!mountPoint) return;
    
    const filtered = this.getFilteredItems();
    if (filtered.length === 0) {
      mountPoint.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--secondary-text); padding: 32px; font-size: 13px;">No vault items matched parameters.</div>`;
      return;
    }

    mountPoint.innerHTML = filtered.map(item => `
      <div class="catalog-card" data-name="${item.name}">
        <div class="card-meta-header">
          <h4 class="card-title">${item.name}</h4>
          <span>${ICONS[item.type]}</span>
        </div>
        <div class="card-metrics-summary">
          ⭐ ${item.rating.toFixed(1)} | 🌡️ ${item.best_temperature}
        </div>
      </div>
    `).join('');

    // Rebind direct event clicks on newly rendered cards
    mountPoint.querySelectorAll('.catalog-card').forEach(card => {
      card.addEventListener('click', () => {
        const targetName = card.getAttribute('data-name');
        this.navigateInternal('details', targetName);
      });
    });
  }

  renderBrowserView() {
    const filteredItems = this.getFilteredItems();
    
    return `
      <div class="search-row">
        <input type="text" class="search-input" id="search-box" placeholder="Search collections, notes, descriptions..." value="${this.searchTerm}">
        <button class="ui-nav-btn" id="clear-filters-trigger" style="padding: 8px 12px;">Clear</button>
      </div>

      <div class="filter-scroller-track">
        <span class="chip ${this.activeFilters.type.has('Fragrance') ? 'active' : ''}" data-category="type" data-value="Fragrance">🧴 Fragrances</span>
        <span class="chip ${this.activeFilters.type.has('Blend') ? 'active' : ''}" data-category="type" data-value="Blend">🧪 Blends</span>
      </div>

      <div class="filter-scroller-track">
        ${['Spring', 'Summer', 'Autumn', 'Winter'].map(season => `
          <span class="chip ${this.activeFilters.season.has(season) ? 'active' : ''}" data-category="season" data-value="${season}">
            ${ICONS[season]} ${season}
          </span>
        `).join('')}
      </div>

      <div class="filter-scroller-track">
        ${['Day', 'Night'].map(tod => `
          <span class="chip ${this.activeFilters.time_of_day.has(tod) ? 'active' : ''}" data-category="time_of_day" data-value="${tod}">
            ${ICONS[tod]} ${tod}
          </span>
        `).join('')}
      </div>

      <div class="filter-scroller-track" style="margin-bottom: 16px;">
        ${['Casual', 'Office', 'Evening', 'Formal'].map(occ => `
          <span class="chip ${this.activeFilters.occasion.has(occ) ? 'active' : ''}" data-category="occasion" data-value="${occ}">
            ${ICONS[occ]} ${occ}
          </span>
        `).join('')}
      </div>

      <div class="item-catalog-grid" id="grid-wrapper-mount">
        ${filteredItems.length === 0 ? `
          <div style="grid-column: 1/-1; text-align: center; color: var(--secondary-text); padding: 32px; font-size: 13px;">No vault items matched parameters.</div>
        ` : filteredItems.map(item => `
          <div class="catalog-card" data-name="${item.name}">
            <div class="card-meta-header">
              <h4 class="card-title">${item.name}</h4>
              <span>${ICONS[item.type]}</span>
            </div>
            <div class="card-metrics-summary">
              ⭐ ${item.rating.toFixed(1)} | 🌡️ ${item.best_temperature}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderDetailsView(itemName) {
    const item = this.masterIndex.find(x => x.name === itemName);
    if (!item) {
      return `<div style="text-align:center; padding: 20px; color: var(--secondary-text);">Entity Error: Vault context reference broken.</div>`;
    }

    const isBlend = item.type === 'Blend';

    return `
      <div class="details-wrapper">
        <div class="meta-pill-box">
          <div class="info-label-block">Family / Class: <span>${item.fragrance_family || (isBlend ? 'Custom Synthesis' : 'Unknown')}</span></div>
          <div class="info-label-block">Inspiration Source: <span>${item.inspiration || 'Original Record'}</span></div>
          <div class="info-label-block">Type Model: <span>${item.clone_type || (isBlend ? 'Layered Combo' : 'N/A')}</span></div>
          <div class="info-label-block">Target Temp Range: <span style="color:#5ac8fa;">${item.best_temperature}</span></div>
        </div>

        <div class="metrics-panel-box">
          <h5 class="matrix-title" style="margin-bottom:10px;">Performance Profiles</h5>
          
          <div class="stat-metric-row">
            <div class="stat-labels"><span>Database Rating</span><span>${item.rating.toFixed(1)} / 5.0</span></div>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${(item.rating / 5) * 100}%;"></div></div>
          </div>
          
          <div class="stat-metric-row">
            <div class="stat-labels"><span>Sillage / Projection</span><span>${item.projection.toFixed(1)} / 5.0</span></div>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${(item.projection / 5) * 100}%;"></div></div>
          </div>
          
          <div class="stat-metric-row">
            <div class="stat-labels"><span>Longevity Factor</span><span>${item.longevity.toFixed(1)} / 5.0</span></div>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${(item.longevity / 5) * 100}%;"></div></div>
          </div>
          
          <div class="stat-metric-row">
            <div class="stat-labels"><span>Compliment Return</span><span>${item.compliment_factor.toFixed(1)} / 5.0</span></div>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${(item.compliment_factor / 5) * 100}%;"></div></div>
          </div>
          
          <div class="stat-metric-row">
            <div class="stat-labels"><span>${isBlend ? 'Complexity Core' : 'Versatility Matrix'}</span><span>${(isBlend ? item.complexity : item.versatility || 0).toFixed(1)} / 5.0</span></div>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${((isBlend ? item.complexity : item.versatility || 0) / 5) * 100}%;"></div></div>
          </div>
        </div>

        <div class="context-matrix-section">
          <h5 class="matrix-title">Optimal Wear Seasons</h5>
          <div class="matrix-badge-row">
            ${item.seasons.length > 0 ? item.seasons.map(season => `
              <span class="interactive-badge" data-matrix-cat="season" data-matrix-val="${season}">
                ${ICONS[season] || '🌍'} ${season}
              </span>
            `).join('') : '<span class="block-text-paragraph">All Weather Compliant</span>'}
          </div>
        </div>

        <div class="context-matrix-section" style="border-left-color: #5ac8fa;">
          <h5 class="matrix-title">Optimal Time Matrix</h5>
          <div class="matrix-badge-row">
            ${item.time_of_day.length > 0 ? item.time_of_day.map(tod => `
              <span class="interactive-badge" data-matrix-cat="time_of_day" data-matrix-val="${tod}">
                ${ICONS[tod] || '🌗'} ${tod}
              </span>
            `).join('') : '<span class="block-text-paragraph">Universal Timeline</span>'}
          </div>
        </div>

        <div class="context-matrix-section" style="border-left-color: #4cd964;">
          <h5 class="matrix-title">Optimal Occasion Frame</h5>
          <div class="matrix-badge-row">
            ${item.occasion.length > 0 ? item.occasion.map(occ => `
              <span class="interactive-badge" data-matrix-cat="occasion" data-matrix-val="${occ}">
                ${ICONS[occ] || '👕'} ${occ}
              </span>
            `).join('') : '<span class="block-text-paragraph">Any Event Fit</span>'}
          </div>
        </div>

        <div class="context-matrix-section" style="border-left-color: #ff9500;">
          <h5 class="matrix-title">Dominant Structural Notes</h5>
          <div class="matrix-badge-row">
            ${item.dominant_notes.map(note => `
              <span class="interactive-badge" data-matrix-cat="note" data-matrix-val="${note}">🧪 ${note}</span>
            `).join('')}
          </div>
        </div>

        ${isBlend ? `
          <div class="context-matrix-section" style="border-left-color: #ffcc00; background: rgba(255,204,0,0.03);">
            <h5 class="matrix-title">Application Layering Blueprint</h5>
            <p class="block-text-paragraph" style="font-family: monospace; font-size:11px; color:#fff;">${item.steps || 'No specialized application layering blueprint provided.'}</p>
          </div>
          <div class="context-matrix-section" style="border-left-color: #0076ff;">
            <h5 class="matrix-title">Synergy Mechanism Analysis</h5>
            <p class="block-text-paragraph">${item.synergy || 'No synergy analytics tracked.'}</p>
          </div>
        ` : `
          <div class="context-matrix-section" style="border-left-color: #5ac8fa;">
            <h5 class="matrix-title">Olfactory Character Description</h5>
            <p class="block-text-paragraph">${item.description || 'No database descriptive logs added.'}</p>
          </div>
        `}

        <div>
          <h5 class="matrix-title" style="margin-left:2px; margin-bottom:6px;">${isBlend ? 'Alternative Options Owned' : 'Related Collection Links'}</h5>
          <div class="matrix-badge-row">
            ${((isBlend ? item.alternatives : item.related_fragrances) || []).map(name => {
              const match = this.masterIndex.find(x => x.name === name);
              if (match) {
                return `<span class="interactive-badge" data-jump-target="${name}" style="border-color: var(--primary-accent); font-weight:700;">${name}</span>`;
              }
              return `<span class="interactive-badge" style="opacity:0.5; cursor:not-allowed;">${name}</span>`;
            }).join('') || '<span class="block-text-paragraph" style="padding-left:2px;">None mapped</span>'}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('fragrance-explorer-card', FragranceExplorerCard);